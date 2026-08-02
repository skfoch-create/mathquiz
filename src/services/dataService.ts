import type { UserProfile, BossRecord, LeaderboardEntry, AuthProviderType } from '../types';
import { isFirebaseConfigured, db, doc, setDoc, getDoc, collection, addDoc, getDocs } from '../firebase';

const LOCAL_USER_KEY = 'math_game_user_profile';
const SHARED_LEADERBOARD_KEY = 'math_game_shared_leaderboard';

export function getLocalUser(): UserProfile | null {
  const data = localStorage.getItem(LOCAL_USER_KEY);
  return data ? JSON.parse(data) : null;
}

export function saveLocalUser(user: UserProfile) {
  localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(user));
  registerToSharedPool(user);
}

// 공유 도전자 풀 등록 (로컬 스토리지 & 세션 네트워크 공유)
function registerToSharedPool(user: UserProfile) {
  try {
    const data = localStorage.getItem(SHARED_LEADERBOARD_KEY);
    const list: LeaderboardEntry[] = data ? JSON.parse(data) : [];
    const idx = list.findIndex(e => e.uid === user.uid);
    const entry: LeaderboardEntry = {
      uid: user.uid,
      displayName: user.displayName,
      gold: user.gold,
      totalMiniGameClears: user.totalMiniGameClears,
      bossVictories: user.bossVictories,
      authProvider: user.authProvider,
    };

    if (idx >= 0) {
      list[idx] = entry;
    } else {
      list.push(entry);
    }
    localStorage.setItem(SHARED_LEADERBOARD_KEY, JSON.stringify(list));
  } catch (e) {
    console.warn('Failed to update local shared pool', e);
  }
}

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
      console.warn('Firestore User Sync Notice (Checking security rules):', e);
    }
  }

  let localUser = getLocalUser();
  if (!localUser || localUser.uid !== uid) {
    localUser = initialUser;
    saveLocalUser(localUser);
  }
  return localUser;
}

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
      console.warn('Firestore user update notice:', e);
    }
  }

  return updatedUser;
}

export async function recordBossAttempt(user: UserProfile, correctCount: number, isVictory: boolean): Promise<BossRecord> {
  const newRecord: BossRecord = {
    id: 'boss_' + Date.now() + '_' + Math.random().toString(36).substring(2, 5),
    uid: user.uid,
    displayName: user.displayName,
    attemptNumber: 1,
    correctCount,
    isVictory,
    timestamp: Date.now(),
  };

  if (isFirebaseConfigured && db) {
    try {
      await addDoc(collection(db, 'boss_records'), newRecord);
    } catch (e) {
      console.warn('Firestore boss record notice:', e);
    }
  }

  return newRecord;
}

// 4. 명예의 전당 (온라인 DB + 공유 릴레이 풀 실시간 수집)
export async function getLeaderboard(): Promise<{ topGold: LeaderboardEntry[]; topClears: LeaderboardEntry[] }> {
  const entryMap = new Map<string, LeaderboardEntry>();

  // 1. 온라인 Firestore 실시간 다중 참여자 수집
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
      console.warn('Firestore leaderboard permissions check notice:', e);
    }
  }

  // 2. 브라우저 본인 정보 릴레이 합체
  const localUser = getLocalUser();
  if (localUser) {
    entryMap.set(localUser.uid, {
      uid: localUser.uid,
      displayName: localUser.displayName,
      gold: localUser.gold,
      totalMiniGameClears: localUser.totalMiniGameClears,
      bossVictories: localUser.bossVictories,
      authProvider: localUser.authProvider,
    });
  }

  const entries = Array.from(entryMap.values());

  const topGold = [...entries].sort((a, b) => b.gold - a.gold).slice(0, 10);
  const topClears = [...entries].sort((a, b) => b.totalMiniGameClears - a.totalMiniGameClears).slice(0, 10);

  return { topGold, topClears };
}
