import type { UserProfile, BossRecord, LeaderboardEntry, AuthProviderType } from '../types';
import { isFirebaseConfigured, db, doc, setDoc, getDoc, collection, addDoc, getDocs, query, orderBy, limit } from '../firebase';

const LOCAL_USER_KEY = 'math_game_user_profile';
const LOCAL_BOSS_RECORDS_KEY = 'math_game_boss_records';

// 초기 모의 리더보드 데이터 (새로 접속 시 명예의 전당이 풍성해 보이도록)
const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { uid: 'm1', displayName: '길이의왕자', gold: 1250, totalMiniGameClears: 35, bossVictories: 8, authProvider: 'google' },
  { uid: 'm2', displayName: 'mm마스터', gold: 980, totalMiniGameClears: 28, bossVictories: 6, authProvider: 'anonymous' },
  { uid: 'm3', displayName: 'cm수호자', gold: 850, totalMiniGameClears: 24, bossVictories: 5, authProvider: 'google' },
  { uid: 'm4', displayName: 'km탐험가', gold: 720, totalMiniGameClears: 19, bossVictories: 4, authProvider: 'anonymous' },
  { uid: 'm5', displayName: '단위천재', gold: 640, totalMiniGameClears: 16, bossVictories: 3, authProvider: 'google' },
  { uid: 'm6', displayName: '용감한어린이', gold: 510, totalMiniGameClears: 14, bossVictories: 2, authProvider: 'anonymous' },
  { uid: 'm7', displayName: '수학대장', gold: 430, totalMiniGameClears: 11, bossVictories: 2, authProvider: 'google' },
  { uid: 'm8', displayName: '번개단위', gold: 380, totalMiniGameClears: 9, bossVictories: 1, authProvider: 'anonymous' },
  { uid: 'm9', displayName: '초등수학왕', gold: 310, totalMiniGameClears: 7, bossVictories: 1, authProvider: 'google' },
  { uid: 'm10', displayName: '자랑스러운학생', gold: 250, totalMiniGameClears: 5, bossVictories: 0, authProvider: 'anonymous' },
];

// 로컬 스토리지 데이터 가져오기/저장
export function getLocalUser(): UserProfile | null {
  const data = localStorage.getItem(LOCAL_USER_KEY);
  return data ? JSON.parse(data) : null;
}

export function saveLocalUser(user: UserProfile) {
  localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(user));
}

// 1. 유저 생성 또는 불러오기
export async function getOrCreateUser(uid: string, displayName: string, authProvider: AuthProviderType): Promise<UserProfile> {
  if (isFirebaseConfigured && db) {
    try {
      const userRef = doc(db, 'users', uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        return userSnap.data() as UserProfile;
      } else {
        const newUser: UserProfile = {
          uid,
          displayName: displayName || (authProvider === 'anonymous' ? '새싹 탐험가' : '수학 영웅'),
          authProvider,
          gold: 50, // 초기 선물 골드
          totalMiniGameClears: 0,
          bossVictories: 0,
          createdAt: Date.now(),
        };
        await setDoc(userRef, newUser);
        return newUser;
      }
    } catch (e) {
      console.warn('Firebase error, fallback to LocalStorage', e);
    }
  }

  // Fallback to LocalStorage
  let localUser = getLocalUser();
  if (!localUser || localUser.uid !== uid) {
    localUser = {
      uid,
      displayName: displayName || (authProvider === 'anonymous' ? '익명 탐험가' : '수학 영웅'),
      authProvider,
      gold: 50,
      totalMiniGameClears: 0,
      bossVictories: 0,
      createdAt: Date.now(),
    };
    saveLocalUser(localUser);
  }
  return localUser;
}

// 2. 유저 데이터 업데이트 (골드, 미니게임 클리어 수, 보스 승리 수)
export async function updateUserStats(user: UserProfile, goldDelta: number, clearDelta: number = 0, bossVictoryDelta: number = 0): Promise<UserProfile> {
  const updatedUser: UserProfile = {
    ...user,
    gold: Math.max(0, user.gold + goldDelta),
    totalMiniGameClears: user.totalMiniGameClears + clearDelta,
    bossVictories: user.bossVictories + bossVictoryDelta,
  };

  saveLocalUser(updatedUser);

  if (isFirebaseConfigured && db) {
    try {
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, updatedUser, { merge: true });
    } catch (e) {
      console.warn('Failed to update Firestore user', e);
    }
  }

  return updatedUser;
}

// 3. 보스전 결과 기록 (회차별 0~5개 정답 및 승패)
export async function recordBossAttempt(user: UserProfile, correctCount: number, isVictory: boolean): Promise<BossRecord> {
  const existingRecords = await getBossRecords(user.uid);
  const attemptNumber = existingRecords.length + 1;

  const newRecord: BossRecord = {
    id: 'boss_' + Date.now() + '_' + Math.random().toString(36).substring(2, 5),
    uid: user.uid,
    displayName: user.displayName,
    attemptNumber,
    correctCount,
    isVictory,
    timestamp: Date.now(),
  };

  // LocalStorage 저장
  const allRecords = getLocalBossRecords();
  allRecords.push(newRecord);
  localStorage.setItem(LOCAL_BOSS_RECORDS_KEY, JSON.stringify(allRecords));

  if (isFirebaseConfigured && db) {
    try {
      await addDoc(collection(db, 'boss_records'), newRecord);
    } catch (e) {
      console.warn('Failed to record boss attempt to Firestore', e);
    }
  }

  return newRecord;
}

// 4. 특정 유저의 보스전 회차 기록 조회 (개인 성장 그래프용)
function getLocalBossRecords(): BossRecord[] {
  const data = localStorage.getItem(LOCAL_BOSS_RECORDS_KEY);
  return data ? JSON.parse(data) : [];
}

export async function getBossRecords(uid: string): Promise<BossRecord[]> {
  if (isFirebaseConfigured && db) {
    try {
      const q = query(collection(db, 'boss_records'), orderBy('timestamp', 'asc'));
      const querySnap = await getDocs(q);
      const records: BossRecord[] = [];
      querySnap.forEach((docSnap) => {
        const data = docSnap.data() as BossRecord;
        if (data.uid === uid) {
          records.push(data);
        }
      });
      if (records.length > 0) return records;
    } catch (e) {
      console.warn('Firestore boss records query failed, fallback to local', e);
    }
  }

  const all = getLocalBossRecords();
  return all.filter((r) => r.uid === uid).sort((a, b) => a.attemptNumber - b.attemptNumber);
}

// 5. 명예의 전당 (골드 왕 TOP 10, 클리어 왕 TOP 10)
export async function getLeaderboard(): Promise<{ topGold: LeaderboardEntry[]; topClears: LeaderboardEntry[] }> {
  let entries: LeaderboardEntry[] = [...MOCK_LEADERBOARD];

  // 현재 로컬 유저도 명예의 전당 목록에 추가/갱신
  const localUser = getLocalUser();
  if (localUser) {
    const existingIndex = entries.findIndex(e => e.uid === localUser.uid);
    const userEntry: LeaderboardEntry = {
      uid: localUser.uid,
      displayName: localUser.displayName,
      gold: localUser.gold,
      totalMiniGameClears: localUser.totalMiniGameClears,
      bossVictories: localUser.bossVictories,
      authProvider: localUser.authProvider,
    };
    if (existingIndex >= 0) {
      entries[existingIndex] = userEntry;
    } else {
      entries.push(userEntry);
    }
  }

  if (isFirebaseConfigured && db) {
    try {
      const q = query(collection(db, 'users'), limit(50));
      const querySnap = await getDocs(q);
      const fsEntries: LeaderboardEntry[] = [];
      querySnap.forEach((docSnap) => {
        const u = docSnap.data() as UserProfile;
        fsEntries.push({
          uid: u.uid,
          displayName: u.displayName,
          gold: u.gold,
          totalMiniGameClears: u.totalMiniGameClears,
          bossVictories: u.bossVictories,
          authProvider: u.authProvider,
        });
      });
      if (fsEntries.length > 0) {
        entries = fsEntries;
      }
    } catch (e) {
      console.warn('Firestore leaderboard query failed', e);
    }
  }

  const topGold = [...entries].sort((a, b) => b.gold - a.gold).slice(0, 10);
  const topClears = [...entries].sort((a, b) => b.totalMiniGameClears - a.totalMiniGameClears).slice(0, 10);

  return { topGold, topClears };
}
