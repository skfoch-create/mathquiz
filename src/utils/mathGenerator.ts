import type { SpeedTouchQuestion, SizeCompareQuestion, TargetGaugeQuestion, BossQuestion } from '../types';

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// 1. 미니게임 1: 스피드 터치 문제
export function generateSpeedTouchQuestion(): SpeedTouchQuestion {
  const type = getRandomInt(1, 4);
  let promptText = '';
  let correctAnswer = '';
  let wrongAnswers: string[] = [];

  if (type === 1) {
    const cm = getRandomInt(2, 30);
    const mm = cm * 10;
    promptText = `${mm} mm = ? cm`;
    correctAnswer = `${cm} cm`;
    wrongAnswers = [`${cm * 10} cm`, `${cm * 100} cm`, `${cm + 5} cm`].filter(a => a !== correctAnswer);
  } else if (type === 2) {
    const m = getRandomInt(2, 25);
    const cm = m * 100;
    promptText = `${cm.toLocaleString()} cm = ? m`;
    correctAnswer = `${m} m`;
    wrongAnswers = [`${m * 10} m`, `${m * 100} m`, `${m + 3} m`].filter(a => a !== correctAnswer);
  } else if (type === 3) {
    const km = getRandomInt(2, 12);
    const m = km * 1000;
    promptText = `${m.toLocaleString()} m = ? km`;
    correctAnswer = `${km} km`;
    wrongAnswers = [`${km * 10} km`, `${km * 100} km`, `${km + 2} km`].filter(a => a !== correctAnswer);
  } else {
    const m = getRandomInt(1, 8);
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

// 2. 미니게임 2: 크기 대결 문제
export function generateSizeCompareQuestion(): SizeCompareQuestion {
  const targetType: 'longer' | 'shorter' = Math.random() > 0.5 ? 'longer' : 'shorter';
  const category = getRandomInt(1, 3);
  let leftText = '';
  let leftValueInMm = 0;
  let rightText = '';
  let rightValueInMm = 0;

  if (category === 1) {
    const cm1 = getRandomInt(10, 80);
    const mm2 = getRandomInt(80, 850);
    leftText = `${cm1} cm`;
    leftValueInMm = cm1 * 10;
    rightText = `${mm2} mm`;
    rightValueInMm = mm2;
  } else if (category === 2) {
    const m = getRandomInt(1, 6);
    const cm = getRandomInt(10, 90);
    leftText = `${m} m ${cm} cm`;
    leftValueInMm = (m * 100 + cm) * 10;

    const rightMm = getRandomInt((m * 100) * 10 - 400, (m * 100 + 100) * 10 + 400);
    rightText = `${rightMm.toLocaleString()} mm`;
    rightValueInMm = rightMm;
  } else {
    const km = getRandomInt(1, 5);
    const m1 = km * 1000 + getRandomInt(-300, 400);
    leftText = `${m1.toLocaleString()} m`;
    leftValueInMm = m1 * 1000;

    const km2 = getRandomInt(1, 5);
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

// 3. 미니게임 3: 타겟 게이지 문제
export function generateTargetGaugeQuestion(): TargetGaugeQuestion {
  const targetKm = getRandomInt(1, 4);
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

// 4. 보스전 5문항 100% 무한 무작위 난수 동적 문제 생성기 (매 도전마다 새로운 수치/단위)
export function generateBossQuestions(): BossQuestion[] {
  const questions: BossQuestion[] = [];

  // Q1: mm <-> cm 무작위 변환
  const cm1 = getRandomInt(15, 95);
  const mm1 = cm1 * 10;
  const q1Correct = `${cm1} cm`;
  const q1Wrongs = [`${cm1 * 10} cm`, `${cm1 + 5} cm`, `${Math.max(1, cm1 - 5)} cm`].filter(s => s !== q1Correct);
  const q1Opts = shuffle([q1Correct, ...q1Wrongs]);
  questions.push({
    id: 1,
    questionText: `1번 관문: ${mm1} mm는 몇 cm 일까요?`,
    options: q1Opts,
    correctAnswerIndex: q1Opts.indexOf(q1Correct),
    explanation: `1 cm = 10 mm 이므로 ${mm1} mm = ${cm1} cm 입니다.`,
  });

  // Q2: m cm <-> cm 무작위 변환
  const m2 = getRandomInt(2, 9);
  const cm2 = getRandomInt(15, 85);
  const totalCm2 = m2 * 100 + cm2;
  const q2Correct = `${totalCm2} cm`;
  const q2Wrongs = [`${m2 * 10 + cm2} cm`, `${totalCm2 + 100} cm`, `${totalCm2 - 50} cm`].filter(s => s !== q2Correct);
  const q2Opts = shuffle([q2Correct, ...q2Wrongs]);
  questions.push({
    id: 2,
    questionText: `2번 관문: ${m2} m ${cm2} cm를 cm 단위로만 바꾸면 얼마일까요?`,
    options: q2Opts,
    correctAnswerIndex: q2Opts.indexOf(q2Correct),
    explanation: `1 m = 100 cm 이므로 ${m2} m = ${m2 * 100} cm 입니다. 거기에 ${cm2} cm를 더하면 ${totalCm2} cm입니다.`,
  });

  // Q3: km m <-> m 무작위 변환
  const km3 = getRandomInt(2, 8);
  const m3 = getRandomInt(120, 880);
  const totalM3 = km3 * 1000 + m3;
  const q3Correct = `${totalM3.toLocaleString()} m`;
  const q3Wrongs = [`${(km3 * 100 + m3).toLocaleString()} m`, `${(totalM3 + 1000).toLocaleString()} m`, `${(km3 * 1000).toLocaleString()} m`].filter(s => s !== q3Correct);
  const q3Opts = shuffle([q3Correct, ...q3Wrongs]);
  questions.push({
    id: 3,
    questionText: `3번 관문: ${km3} km ${m3} m를 m 단위로 변환하면 얼마일까요?`,
    options: q3Opts,
    correctAnswerIndex: q3Opts.indexOf(q3Correct),
    explanation: `1 km = 1,000 m 이므로 ${km3} km = ${km3 * 1000} m 입니다. 따라서 ${totalM3.toLocaleString()} m입니다.`,
  });

  // Q4: 길이 무작위 덧셈 계산
  const m4a = getRandomInt(1, 4);
  const cm4a = getRandomInt(30, 70);
  const m4b = getRandomInt(1, 3);
  const cm4b = getRandomInt(40, 80);
  const totalCm4 = (m4a + m4b) * 100 + (cm4a + cm4b);
  const resM4 = Math.floor(totalCm4 / 100);
  const resCm4 = totalCm4 % 100;
  const q4Correct = `${resM4} m ${resCm4} cm`;
  const q4Wrongs = [`${m4a + m4b} m ${cm4a + cm4b} cm`, `${resM4 + 1} m ${resCm4} cm`, `${resM4} m ${resCm4 + 10} cm`].filter(s => s !== q4Correct);
  const q4Opts = shuffle([q4Correct, ...q4Wrongs]);
  questions.push({
    id: 4,
    questionText: `4번 관문: (${m4a} m ${cm4a} cm) + (${m2} m ${cm4b} cm) 계산 결과는 얼마일까요?`,
    options: q4Opts,
    correctAnswerIndex: q4Opts.indexOf(q4Correct),
    explanation: `cm끼리 더하면 ${cm4a + cm4b} cm (${Math.floor((cm4a + cm4b) / 100)}m ${ (cm4a + cm4b) % 100 }cm)가 됩니다. m 합산 결과 ${q4Correct}가 됩니다.`,
  });

  // Q5: 가장 긴 수치 고르기 무작위 조합
  const baseCm = getRandomInt(400, 700);
  const valA_mm = (baseCm - 40) * 10;
  const valB_cm = baseCm + 80; // 정답!
  const valC_m = Math.floor((baseCm - 20) / 100);
  const valD_mm = (baseCm - 100) * 10;

  const strA = `${valA_mm.toLocaleString()} mm`;
  const strB = `${valB_cm} cm`;
  const strC = `${valC_m} m`;
  const strD = `${valD_mm.toLocaleString()} mm`;
  const q5Opts = shuffle([strA, strB, strC, strD]);
  questions.push({
    id: 5,
    questionText: `5번 관문 (최종): 보기 중 가장 긴 수치는 무엇일까요? (${strA} / ${strB} / ${strC} / ${strD})`,
    options: q5Opts,
    correctAnswerIndex: q5Opts.indexOf(strB),
    explanation: `단위를 모두 cm로 통일하여 비교해보면 ${strB}가 가장 긴 길이입니다!`,
  });

  return questions;
}
