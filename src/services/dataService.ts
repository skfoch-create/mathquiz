import type { UserProfile, BossRecord, LeaderboardEntry, AuthProviderType } from '../types';
import { isFirebaseConfigured, db, doc, setDoc, getDoc, collection, addDoc, getDocs } from '../firebase';

const LOCAL_USER_KEY = 'math_game_user_profile';
const LOCAL_BOSS_RECORDS_KEY = 'math_game_boss_records';

// 로컬 스토리지 유저 관리
export function getLocalUser(): UserProfile | null {
  const data = localStorage.getItem(LOCAL_USER_KEY);
  return data ? JSON.parse(data) : null;
}

export function saveLocalUser(user: UserProfile) {
  localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(user));
}

// 1. 유저 생성 및 동기화 (전국 도전자 공유)
export async function getOrCreateUser(uid: string, displayName: string, authProvider: AuthProviderType): Promise<UserProfile> {
  const initialUser: UserProfile = {
    uid,
    displayName: displayName || (authProvider === 'anonymous' ? '새싹 탐험가' : '수학 영웅'),
    authProvider,
    gold: 50,
    totalMiniGameClears: 0,
    bossVictories: 0,
    createdAt: Date.now(),
  };

  if (isFirebaseConfigured && db) {
    try {
      const userRef = doc(db, 'users', uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const existing = userSnap.data() as UserProfile;
        saveLocalUser(existing);
        return existing;
      } else {
        await setDoc(userRef, initialUser);
        saveLocalUser(initialUser);
        return initialUser;
      }
    } catch (e) {
      console.warn('Firebase user sync warning:', e);
    }
  }

  let localUser = getLocalUser();
  if (!localUser || localUser.uid !== uid) {
    localUser = initialUser;
    saveLocalUser(localUser);
  }
  return localUser;
}

// 2. 유저 실시간 통계 업데이트 (골드, 클리어 수, 보스 승리 수)
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

// 3. 보스전 결과 기록
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

function getLocalBossRecords(): BossRecord[] {
  const data = localStorage.getItem(LOCAL_BOSS_RECORDS_KEY);
  return data ? JSON.parse(data) : [];
}

export async function getBossRecords(uid: string): Promise<BossRecord[]> {
  if (isFirebaseConfigured && db) {
    try {
      const querySnap = await getDocs(collection(db, 'boss_records'));
      const records: BossRecord[] = [];
      querySnap.forEach((docSnap) => {
        const data = docSnap.data() as BossRecord;
        if (data.uid === uid) {
          records.push(data);
        }
      });
      if (records.length > 0) return records.sort((a, b) => a.attemptNumber - b.attemptNumber);
    } catch (e) {
      console.warn('Firestore boss records query failed, fallback to local', e);
    }
  }

  const all = getLocalBossRecords();
  return all.filter((r) => r.uid === uid).sort((a, b) => a.attemptNumber - b.attemptNumber);
}

// 4. 명예의 전당 (실시간 다중 참여자 통합 랭킹)
export async function getLeaderboard(): Promise<{ topGold: LeaderboardEntry[]; topClears: LeaderboardEntry[] }> {
  const entryMap = new Map<string, LeaderboardEntry>();

  // Firestore 온라인 참여자 통합
  if (isFirebaseConfigured && db) {
    try {
      const querySnap = await getDocs(collection(db, 'users'));
      querySnap.forEach((docSnap) => {
        const u = docSnap.data() as UserProfile;
        if (u && u.uid) {
          entryMap.set(u.uid, {
            uid: u.uid,
            displayName: u.displayName || '도전자',
            gold: u.gold || 0,
            totalMiniGameClears: u.totalMiniGameClears || 0,
            bossVictories: u.bossVictories || 0,
            authProvider: u.authProvider || 'anonymous',
          });
        }
      });
    } catch (e) {
      console.warn('Leaderboard Firestore query warning:', e);
    }
  }

  // 현재 브라우저 도전자 본인 데이터 합체
  const localUser = getLocalUser();
  if (localUser) {
    entryMap.set(localUser.uid, {
      uid: localUser.uid,
      displayName: localUser.displayName || '나',
      gold: localUser.gold || 0,
      totalMiniGameClears: localUser.totalMiniGameClears || 0,
      bossVictories: localUser.bossVictories || 0,
      authProvider: localUser.authProvider || 'anonymous',
    });
  }

  const entries = Array.from(entryMap.values());

  const topGold = [...entries].sort((a, b) => b.gold - a.gold).slice(0, 10);
  const topClears = [...entries].sort((a, b) => b.totalMiniGameClears - a.totalMiniGameClears).slice(0, 10);

  return { topGold, topClears };
}
