export type AuthProviderType = 'anonymous' | 'google';

export interface UserProfile {
  uid: string;
  displayName: string;
  authProvider: AuthProviderType;
  gold: number;
  totalMiniGameClears: number;
  bossVictories: number;
  createdAt: number;
}

export type UnitType = 'mm' | 'cm' | 'm' | 'km';

export interface LengthValue {
  value: number;
  unit: UnitType;
}

// 미니게임 1 문제 (스피드 터치)
export interface SpeedTouchQuestion {
  id: string;
  promptText: string; // 예: "3,000 mm = ? m"
  correctAnswer: string; // "3 m"
  options: string[]; // ["3 m", "30 m", "300 m", "0.3 m"]
}

// 미니게임 2 문제 (크기 대결)
export interface SizeCompareQuestion {
  id: string;
  leftText: string; // "2 m 50 cm"
  leftValueInMm: number;
  rightText: string; // "2,400 mm"
  rightValueInMm: number;
  targetType: 'longer' | 'shorter'; // 더 긴 쪽 / 더 짧은 쪽
}

// 미니게임 3 문제 (조합 타겟 게이지)
export interface TargetGaugeQuestion {
  id: string;
  targetText: string; // "1.5 km (1500 m)"
  targetValueInMm: number;
  availableBlocks: { id: string; text: string; valueInMm: number }[];
}

// 보스전 퀴즈 문제 (4지선다 5문항)
export interface BossQuizQuestion {
  id: number;
  questionText: string; // 예: "3 km 500 m를 m 단위로 바꾸면 얼마일까요?"
  options: string[]; // ["3,500 m", "350 m", "35,000 m", "3.5 m"]
  correctAnswerIndex: number;
  explanation: string; // "1 km = 1,000 m 이므로 3 km = 3,000 m 입니다. 따라서 3,000 m + 500 m = 3,500 m 입니다."
}

export type BossQuestion = BossQuizQuestion;

export interface BossRecord {
  id: string;
  uid: string;
  displayName: string;
  attemptNumber: number; // 회차 (1회차, 2회차...)
  correctCount: number; // 0 ~ 5
  isVictory: boolean; // 5/5 여부
  timestamp: number;
}

export interface LeaderboardEntry {
  uid: string;
  displayName: string;
  gold: number;
  totalMiniGameClears: number;
  bossVictories: number;
  authProvider: AuthProviderType;
}
