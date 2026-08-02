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
  promptText: string;
  correctAnswer: string;
  options: string[];
}

// 미니게임 2 문제 (크기 대결)
export interface SizeCompareQuestion {
  id: string;
  leftText: string;
  leftValueInMm: number;
  rightText: string;
  rightValueInMm: number;
  targetType: 'longer' | 'shorter';
}

// 미니게임 3 문제 (조합 타겟 게이지)
export interface TargetGaugeQuestion {
  id: string;
  targetText: string;
  targetValueInMm: number;
  availableBlocks: { id: string; text: string; valueInMm: number }[];
}

// 보스전 퀴즈 문제 (4지선다 5문항) - BossQuestion 통일
export interface BossQuestion {
  id: number;
  questionText: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface BossRecord {
  id: string;
  uid: string;
  displayName: string;
  attemptNumber: number;
  correctCount: number;
  isVictory: boolean;
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
