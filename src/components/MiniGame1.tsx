import React, { useState, useEffect } from 'react';
import { Timer, Zap, Coins, ArrowRight, RotateCcw } from 'lucide-react';
import { generateSpeedTouchQuestion } from '../utils/mathGenerator';
import type { SpeedTouchQuestion, UserProfile } from '../types';
import { updateUserStats } from '../services/dataService';

interface MiniGame1Props {
  user: UserProfile | null;
  onUpdateUser: (user: UserProfile) => void;
  onBackToLobby: () => void;
}

export const MiniGame1: React.FC<MiniGame1Props> = ({ user, onUpdateUser, onBackToLobby }) => {
  const GAME_DURATION = 25; // 25초 제한시간
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<SpeedTouchQuestion | null>(null);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [earnedGold, setEarnedGold] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  // 게임 시작
  const startGame = () => {
    setTimeLeft(GAME_DURATION);
    setScore(0);
    setCombo(0);
    setEarnedGold(0);
    setIsGameOver(false);
    setIsPlaying(true);
    setCurrentQuestion(generateSpeedTouchQuestion());
  };

  // 타이머 카운트다운
  useEffect(() => {
    if (!isPlaying || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isPlaying, timeLeft]);

  // 게임 종료 처리
  const endGame = async () => {
    setIsPlaying(false);
    setIsGameOver(true);

    // 맞춘 개수 * 5Gold + 콤보 보너스
    const gold = Math.max(10, score * 5);
    setEarnedGold(gold);

    if (user) {
      const updated = await updateUserStats(user, gold, 1, 0);
      onUpdateUser(updated);
    }
  };

  // 정답 제출
  const handleSelectOption = (option: string) => {
    if (!currentQuestion || !isPlaying) return;

    if (option === currentQuestion.correctAnswer) {
      setScore((prev) => prev + 1);
      setCombo((prev) => prev + 1);
      setFeedback('correct');
    } else {
      setCombo(0);
      setFeedback('wrong');
    }

    setTimeout(() => {
      setFeedback(null);
      setCurrentQuestion(generateSpeedTouchQuestion());
    }, 250);
  };

  return (
    <div className="game-container animate-fade-in">
      <div className="game-header-card glass-card">
        <div className="game-title-group">
          <span className="game-badge badge-a">25초 타임어택</span>
          <h2>⚡ 번개 손가락! 단위 팡팡</h2>
          <p>25초 동안 수치와 똑같은 정답 카드를 번개처럼 빠르게 팡팡 터치하세요!</p>
        </div>

        {!isPlaying && !isGameOver && (
          <button className="btn-start-game shadow-btn" onClick={startGame}>
            🚀 게임 시작 (25초 제한)
          </button>
        )}
      </div>

      {isPlaying && (
        <div className="game-play-area">
          <div className="game-status-bar">
            <div className="timer-box">
              <Timer size={22} className="text-yellow animate-spin-slow" />
              <span className="time-value">{timeLeft}초</span>
            </div>
            <div className="combo-box">
              <Zap size={22} className="text-orange" />
              <span>콤보: <b>{combo}</b></span>
            </div>
            <div className="score-box">
              <span>점수: <b>{score}개</b></span>
            </div>
          </div>

          {currentQuestion && (
            <div className={`quiz-card glass-card ${feedback ? feedback : ''}`}>
              <div className="prompt-display">
                <span className="prompt-label">다음 수치와 같은 것은?</span>
                <h1 className="prompt-text">{currentQuestion.promptText}</h1>
              </div>

              <div className="options-grid">
                {currentQuestion.options.map((opt, idx) => (
                  <button
                    key={idx}
                    className="option-btn glass-btn"
                    onClick={() => handleSelectOption(opt)}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {isGameOver && (
        <div className="result-modal glass-card animate-pop">
          <h2>🎉 게임 종료!</h2>
          <p className="result-desc">25초 동안 알차게 퀴즈를 풀었습니다!</p>
          <div className="stats-grid">
            <div className="stat-card">
              <span className="stat-label">정답 개수</span>
              <span className="stat-val">{score} 개</span>
            </div>
            <div className="stat-card highlight">
              <span className="stat-label">획득한 골드</span>
              <span className="stat-val text-yellow">
                <Coins size={20} /> +{earnedGold} G
              </span>
            </div>
          </div>

          <div className="action-row">
            <button className="btn-secondary" onClick={startGame}>
              <RotateCcw size={18} /> 다시 하기
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
