import React, { useState, useEffect } from 'react';
import { Timer, Swords, Trophy, Coins, ArrowRight, RotateCcw, Check, X } from 'lucide-react';
import confetti from 'canvas-confetti';
import { generateBossQuiz } from '../utils/mathGenerator';
import type { BossQuizQuestion, UserProfile } from '../types';
import { updateUserStats, recordBossAttempt } from '../services/dataService';

interface BossRaidViewProps {
  user: UserProfile | null;
  onUpdateUser: (user: UserProfile) => void;
  onBackToLobby: () => void;
  onOpenAuth: () => void;
}

export const BossRaidView: React.FC<BossRaidViewProps> = ({ user, onUpdateUser, onBackToLobby, onOpenAuth }) => {
  const BOSS_FEE = 100;
  const BOSS_TIME = 60;

  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState(BOSS_TIME);
  const [quizList, setQuizList] = useState<BossQuizQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>([null, null, null, null, null]);
  const [bossHp, setBossHp] = useState(100);
  const [isVictory, setIsVictory] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);

  const handleStartRaid = async () => {
    if (!user) {
      onOpenAuth();
      return;
    }
    if (user.gold < BOSS_FEE) {
      alert(`보스에 도전하려면 ${BOSS_FEE} Gold가 필요합니다! 미니게임을 통해 골드를 더 모아 오세요.`);
      return;
    }

    const updatedUser = await updateUserStats(user, -BOSS_FEE, 0, 0);
    onUpdateUser(updatedUser);

    setQuizList(generateBossQuiz());
    setCurrentIdx(0);
    setUserAnswers([null, null, null, null, null]);
    setBossHp(100);
    setTimeLeft(BOSS_TIME);
    setIsGameOver(false);
    setIsVictory(false);
    setIsPlaying(true);
  };

  useEffect(() => {
    if (!isPlaying || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          finishBossRaid([ ...userAnswers ]);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isPlaying, timeLeft, userAnswers]);

  const handleAnswerSelect = (optionIdx: number) => {
    if (!isPlaying) return;

    const newAnswers = [...userAnswers];
    newAnswers[currentIdx] = optionIdx;
    setUserAnswers(newAnswers);

    if (optionIdx === quizList[currentIdx].correctAnswerIndex) {
      setBossHp((prev) => Math.max(0, prev - 20));
    }

    if (currentIdx < 4) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      finishBossRaid(newAnswers);
    }
  };

  const finishBossRaid = async (finalAnswers: (number | null)[]) => {
    setIsPlaying(false);
    setIsGameOver(true);

    let correct = 0;
    quizList.forEach((q, idx) => {
      if (finalAnswers[idx] === q.correctAnswerIndex) {
        correct++;
      }
    });
    setCorrectCount(correct);

    const victory = correct === 5;
    setIsVictory(victory);

    if (victory) {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
      });
    }

    if (user) {
      const goldReward = victory ? 300 : 0;
      const updated = await updateUserStats(user, goldReward, 0, victory ? 1 : 0);
      onUpdateUser(updated);
      await recordBossAttempt(user, correct, victory);
    }
  };

  return (
    <div className="boss-container animate-fade-in">
      {!isPlaying && !isGameOver && (
        <div className="boss-intro-card glass-card">
          <div className="boss-avatar animate-pulse">
            👹
          </div>
          <h1 className="boss-title">👾 최종 대결! 대마왕 길이마왕 보스전</h1>
          <p className="boss-desc">
            mm, cm, m, km 단위 변환 퀴즈 <b>5문항</b>이 출제됩니다.<br />
            <b>60초 내에 5문제를 모두 맞추어야만 (5/5 완벽 승리)</b> 보스를 물리칠 수 있습니다!
          </p>

          <div className="raid-info-box">
            <div className="info-item">
              <Coins size={20} className="text-yellow" />
              <span>도전 비용: <b>100 Gold</b></span>
            </div>
            <div className="info-item">
              <Timer size={20} className="text-orange" />
              <span>제한 시간: <b>60초</b></span>
            </div>
            <div className="info-item">
              <Trophy size={20} className="text-green" />
              <span>완벽 승리 보상: <b>+300 Gold & 명예 기록</b></span>
            </div>
          </div>

          <button className="btn-boss-challenge shadow-btn" onClick={handleStartRaid}>
            <Swords size={22} /> 보스전 도전하기 (100 골드)
          </button>
        </div>
      )}

      {isPlaying && quizList.length > 0 && (
        <div className="boss-play-view">
          <div className="boss-status-card glass-card">
            <div className="boss-hp-header">
              <div className="boss-name">
                <span>👹 대마왕 길이마왕</span>
                <span className="hp-text">HP {bossHp}%</span>
              </div>
              <div className="timer-pill">
                <Timer size={18} className="text-yellow animate-spin-slow" />
                <span>{timeLeft}초 남음</span>
              </div>
            </div>
            <div className="hp-bar-bg">
              <div className="hp-bar-fill" style={{ width: `${bossHp}%` }}></div>
            </div>
          </div>

          <div className="boss-quiz-card glass-card">
            <div className="quiz-progress-bar">
              {quizList.map((_, idx) => (
                <div
                  key={idx}
                  className={`progress-step ${idx === currentIdx ? 'current' : idx < currentIdx ? 'done' : ''}`}
                >
                  {idx + 1}
                </div>
              ))}
            </div>

            <h2 className="quiz-question-text">{quizList[currentIdx].questionText}</h2>

            <div className="quiz-options-4grid">
              {quizList[currentIdx].options.map((optText, optIdx) => (
                <button
                  key={optIdx}
                  className="boss-opt-btn glass-btn"
                  onClick={() => handleAnswerSelect(optIdx)}
                >
                  <span className="opt-number">{optIdx + 1}</span>
                  <span className="opt-text">{optText}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {isGameOver && (
        <div className="boss-result-modal glass-card animate-pop">
          {isVictory ? (
            <div className="result-header victory">
              <div className="trophy-icon">🏆</div>
              <h2>🎉 보스 퇴치 완벽 승리!</h2>
              <p className="subtitle">5문제를 완벽하게 풀고 대마왕 길이마왕을 무찔렀습니다!</p>
            </div>
          ) : (
            <div className="result-header defeat">
              <div className="skull-icon">💀</div>
              <h2>아쉬운 도전자...</h2>
              <p className="subtitle">완벽 승리(5/5) 조건을 달성하지 못했습니다. (정답: {correctCount}/5)</p>
            </div>
          )}

          <div className="review-list">
            <h3>📝 도전 문제 복습하기</h3>
            {quizList.map((q, idx) => {
              const isCorrect = userAnswers[idx] === q.correctAnswerIndex;
              return (
                <div key={idx} className={`review-item ${isCorrect ? 'correct' : 'wrong'}`}>
                  <div className="item-header">
                    <span className="item-title">{q.questionText}</span>
                    <span className="item-status">
                      {isCorrect ? <Check size={18} className="text-green" /> : <X size={18} className="text-red" />}
                    </span>
                  </div>
                  <p className="item-exp">💡 해설: {q.explanation}</p>
                </div>
              );
            })}
          </div>

          <div className="action-row">
            <button className="btn-secondary" onClick={handleStartRaid}>
              <RotateCcw size={18} /> 다시 도전하기 (100 G)
            </button>
            <button className="btn-primary" onClick={onBackToLobby}>
              로비로 돌아가기 <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
