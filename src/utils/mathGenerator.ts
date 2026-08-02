import type { SpeedTouchQuestion, SizeCompareQuestion, TargetGaugeQuestion, BossQuizQuestion } from '../types';

// 무작위 정수 생성
function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 배열 셔플
function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// 1. 미니게임 1: 스피드 터치 문제 생성
export function generateSpeedTouchQuestion(): SpeedTouchQuestion {
  const type = getRandomInt(1, 4);
  let promptText = '';
  let correctAnswer = '';
  let wrongAnswers: string[] = [];

  if (type === 1) {
    // mm -> cm (예: 50 mm = ? cm)
    const cm = getRandomInt(1, 20);
    const mm = cm * 10;
    promptText = `${mm} mm = ? cm`;
    correctAnswer = `${cm} cm`;
    wrongAnswers = [`${cm * 10} cm`, `${cm * 100} cm`, `${Math.max(1, cm - 1)} cm`].filter(a => a !== correctAnswer);
  } else if (type === 2) {
    // cm -> m (예: 400 cm = ? m)
    const m = getRandomInt(1, 15);
    const cm = m * 100;
    promptText = `${cm.toLocaleString()} cm = ? m`;
    correctAnswer = `${m} m`;
    wrongAnswers = [`${m * 10} m`, `${m * 100} m`, `${Math.max(1, m + 2)} m`].filter(a => a !== correctAnswer);
  } else if (type === 3) {
    // m -> km (예: 3,000 m = ? km)
    const km = getRandomInt(1, 9);
    const m = km * 1000;
    promptText = `${m.toLocaleString()} m = ? km`;
    correctAnswer = `${km} km`;
    wrongAnswers = [`${km * 10} km`, `${km * 100} km`, `${Math.max(1, km + 1)} km`].filter(a => a !== correctAnswer);
  } else {
    // 복합 (예: 2 m 30 cm = ? cm)
    const m = getRandomInt(1, 5);
    const cm = getRandomInt(5, 95);
    const totalCm = m * 100 + cm;
    promptText = `${m} m ${cm} cm = ? cm`;
    correctAnswer = `${totalCm} cm`;
    wrongAnswers = [`${m * 10 + cm} cm`, `${totalCm + 100} cm`, `${m * 1000 + cm} cm`].filter(a => a !== correctAnswer);
  }

  const uniqueWrongs = Array.from(new Set(wrongAnswers)).slice(0, 3);
  while (uniqueWrongs.length < 3) {
    uniqueWrongs.push(`${getRandomInt(10, 990)} cm`);
  }

  const options = shuffle([correctAnswer, ...uniqueWrongs]);

  return {
    id: Math.random().toString(36).substring(2, 9),
    promptText,
    correctAnswer,
    options,
  };
}

// 2. 미니게임 2: 크기 대결 문제 생성
export function generateSizeCompareQuestion(): SizeCompareQuestion {
  const targetType: 'longer' | 'shorter' = Math.random() > 0.5 ? 'longer' : 'shorter';
  const category = getRandomInt(1, 3);
  let leftText = '';
  let leftValueInMm = 0;
  let rightText = '';
  let rightValueInMm = 0;

  if (category === 1) {
    const cm1 = getRandomInt(10, 50);
    const mm2 = getRandomInt(80, 550);
    leftText = `${cm1} cm`;
    leftValueInMm = cm1 * 10;
    rightText = `${mm2} mm`;
    rightValueInMm = mm2;
  } else if (category === 2) {
    const m = getRandomInt(1, 4);
    const cm = getRandomInt(10, 90);
    leftText = `${m} m ${cm} cm`;
    leftValueInMm = (m * 100 + cm) * 10;

    const rightMm = getRandomInt((m * 100) * 10 - 500, (m * 100 + 100) * 10 + 500);
    rightText = `${rightMm.toLocaleString()} mm`;
    rightValueInMm = rightMm;
  } else {
    const km = getRandomInt(1, 3);
    const m1 = km * 1000 + getRandomInt(-200, 300);
    leftText = `${m1.toLocaleString()} m`;
    leftValueInMm = m1 * 1000;

    const km2 = getRandomInt(1, 4);
    const m2 = getRandomInt(50, 800);
    rightText = `${km2} km ${m2} m`;
    rightValueInMm = (km2 * 1000 + m2) * 1000;
  }

  if (leftValueInMm === rightValueInMm) {
    rightValueInMm += 100;
    rightText += ' 10cm';
  }

  return {
    id: Math.random().toString(36).substring(2, 9),
    leftText,
    leftValueInMm,
    rightText,
    rightValueInMm,
    targetType,
  };
}

// 3. 미니게임 3: 타겟 게이지 조합 문제 생성
export function generateTargetGaugeQuestion(): TargetGaugeQuestion {
  const targetKm = getRandomInt(1, 3);
  const targetM = targetKm * 1000 + getRandomInt(2, 8) * 100;
  const targetValueInMm = targetM * 1000;

  const part1M = getRandomInt(3, Math.floor(targetM / 100 - 2)) * 100;
  const part2M = targetM - part1M;

  const validBlocks = [
    { id: 'b1', text: `${part1M} m`, valueInMm: part1M * 1000 },
    { id: 'b2', text: `${part2M} m`, valueInMm: part2M * 1000 },
  ];

  const dummy1 = Math.max(100, part1M + 200);
  const dummy2 = Math.max(100, part2M - 100);
  const dummy3 = Math.max(100, Math.floor(targetM / 2));

  const dummyBlocks = [
    { id: 'd1', text: `${dummy1} m`, valueInMm: dummy1 * 1000 },
    { id: 'd2', text: `${dummy2} m`, valueInMm: dummy2 * 1000 },
    { id: 'd3', text: `${dummy3} m`, valueInMm: dummy3 * 1000 },
  ];

  const availableBlocks = shuffle([...validBlocks, ...dummyBlocks]);

  return {
    id: Math.random().toString(36).substring(2, 9),
    targetText: `${targetM.toLocaleString()} m 만들기`,
    targetValueInMm,
    availableBlocks,
  };
}

// 4. 보스전 5문항 4지선다 퀴즈 생성
export function generateBossQuiz(): BossQuizQuestion[] {
  const questions: BossQuizQuestion[] = [
    (() => {
      const cm = getRandomInt(12, 45);
      const mm = cm * 10;
      const options = shuffle([
        `${cm} cm`,
        `${cm * 10} cm`,
        `${cm / 10} cm`,
        `${cm + 10} cm`,
      ]);
      return {
        id: 1,
        questionText: `1번 문제: ${mm} mm는 몇 cm 일까요?`,
        options,
        correctAnswerIndex: options.indexOf(`${cm} cm`),
        explanation: `1 cm = 10 mm 이므로 ${mm} mm = ${cm} cm 입니다.`,
      };
    })(),
    
    (() => {
      const m = getRandomInt(3, 9);
      const cmVal = getRandomInt(10, 90);
      const totalCm = m * 100 + cmVal;
      const options = shuffle([
        `${totalCm} cm`,
        `${m * 10 + cmVal} cm`,
        `${totalCm * 10} cm`,
        `${totalCm - 50} cm`,
      ]);
      return {
        id: 2,
        questionText: `2번 문제: ${m} m ${cmVal} cm를 cm 단위로만 나타내면 얼마일까요?`,
        options,
        correctAnswerIndex: options.indexOf(`${totalCm} cm`),
        explanation: `1 m = 100 cm 이므로 ${m} m = ${m * 100} cm 입니다. 거기에 ${cmVal} cm를 더하면 ${totalCm} cm가 됩니다.`,
      };
    })(),

    (() => {
      const km = getRandomInt(2, 7);
      const m = getRandomInt(150, 850);
      const totalM = km * 1000 + m;
      const options = shuffle([
        `${totalM.toLocaleString()} m`,
        `${(km * 100 + m).toLocaleString()} m`,
        `${(totalM * 10).toLocaleString()} m`,
        `${(km * 1000).toLocaleString()} m`,
      ]);
      return {
        id: 3,
        questionText: `3번 문제: ${km} km ${m} m를 m 단위로 바꾸어 적으면 몇 m 일까요?`,
        options,
        correctAnswerIndex: options.indexOf(`${totalM.toLocaleString()} m`),
        explanation: `1 km = 1,000 m 이므로 ${km} km = ${km * 1000} m 입니다. 따라서 ${km * 1000} m + ${m} m = ${totalM.toLocaleString()} m 입니다.`,
      };
    })(),

    (() => {
      const m1 = getRandomInt(2, 5);
      const cm1 = 40;
      const m2 = getRandomInt(1, 3);
      const cm2 = 80;
      const totalCm = (m1 + m2) * 100 + (cm1 + cm2);
      const resM = Math.floor(totalCm / 100);
      const resCm = totalCm % 100;
      const correctStr = `${resM} m ${resCm} cm`;
      const options = shuffle([
        correctStr,
        `${m1 + m2} m ${cm1 + cm2} cm`,
        `${resM + 1} m ${resCm} cm`,
        `${resM} m ${resCm + 20} cm`,
      ]);
      return {
        id: 4,
        questionText: `4번 문제: (${m1} m ${cm1} cm) + (${m2} m ${cm2} cm) 계산 결과는 얼마일까요?`,
        options,
        correctAnswerIndex: options.indexOf(correctStr),
        explanation: `cm끼리 더하면 ${cm1} + ${cm2} = 120 cm (1 m 20 cm)가 됩니다. m끼리 더한 ${m1 + m2} m에 1 m 20 cm를 합치면 ${correctStr}가 됩니다.`,
      };
    })(),

    (() => {
      const optA = `4,500 mm`;
      const optB = `4 m 80 cm`;
      const optC = `500 cm`;
      const optD = `4 m`;
      const options = shuffle([optA, optB, optC, optD]);
      return {
        id: 5,
        questionText: `5번 문제: 보기 중 가장 긴 길이는 무엇일까요? (4,500mm / 4m 80cm / 500cm / 4m)`,
        options,
        correctAnswerIndex: options.indexOf(optC),
        explanation: `mm, cm, m를 모두 cm로 통일하면: 4,500mm = 450cm / 4m 80cm = 480cm / 500cm = 500cm / 4m = 400cm 입니다. 따라서 500cm가 가장 깁니다!`,
      };
    })(),
  ];

  return questions;
}

export const generateBossQuestions = generateBossQuiz;
