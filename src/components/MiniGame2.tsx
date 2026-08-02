import React, { useState, useEffect } from 'react';
import { Timer, Scale, Coins, ArrowRight, RotateCcw } from 'lucide-react';
import { generateSizeCompareQuestion } from '../utils/mathGenerator';
import type { SizeCompareQuestion, UserProfile } from '../types';
import { updateUserStats } from '../services/dataService';

interface MiniGame2Props {
  user: UserProfile | null;
  onUpdateUser: (user: UserProfile) => void;
  onBackToLobby: () => void;
}

export const MiniGame2: React.FC<MiniGame2Props> = ({ user, onUpdateUser, onBackToLobby }) => {
  const GAME_DURATION = 25;
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<SizeCompareQuestion | null>(null);
  const [score, setScore] = useState(0);
  const [earnedGold, setEarnedGold] = useState(0);

  const startGame = () => {
    setTimeLeft(GAME_DURATION);
    setScore(0);
    setEarnedGold(0);
    setIsGameOver(false);
    setIsPlaying(true);
    setCurrentQuestion(generateSizeCompareQuestion());
  };

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

  const endGame = async () => {
    setIsPlaying(false);
    setIsGameOver(true);
    const gold = Math.max(10, score * 6);
    setEarnedGold(gold);

    if (user) {
      const updated = await updateUserStats(user, gold, 1, 0);
      onUpdateUser(updated);
    }
  };

  const handleSelectSide = (side: 'left' | 'right') => {
    if (!currentQuestion || !isPlaying) return;

    const isLeftLonger = currentQuestion.leftValueInMm > currentQuestion.rightValueInMm;
    const isTargetLonger = currentQuestion.targetType === 'longer';

    let isCorrect = false;
    if (isTargetLonger) {
      isCorrect = side === 'left' ? isLeftLonger : !isLeftLonger;
    } else {
      isCorrect = side === 'left' ? !isLeftLonger : isLeftLonger;
    }

    if (isCorrect) {
      setScore((prev) => prev + 1);
    }

    setCurrentQuestion(generateSizeCompareQuestion());
  };

  return (
    <div className="game-container animate-fade-in">
      <div className="game-header-card glass-card">
        <div className="game-title-group">
          <span className="game-badge badge-b">25초 순발력</span>
          <h2>⚖️ 누가 더 길까? 길이 쿵쿵</h2>
          <p>지시어(더 긴 길이 / 더 짧은 길이)에 맞는 카드를 순발력있게 고르세요!</p>
        </div>

        {!isPlaying && !isGameOver && (
          <button className="btn-start-game shadow-btn" onClick={startGame}>
            🚀 게임 시작 (25초 제한)
          </button>
        )}
      </div>

      {isPlaying && currentQuestion && (
        <div className="game-play-area">
          <div className="game-status-bar">
            <div className="timer-box">
              <Timer size={22} className="text-yellow" />
              <span className="time-value">{timeLeft}초</span>
            </div>
            <div className="score-box">
              <span>맞춘 횟수: <b>{score}개</b></span>
            </div>
          </div>

          <div className="instruction-banner">
            <Scale size={24} className="text-yellow" />
            <h2>
              {currentQuestion.targetType === 'longer' ? (
                <span className="text-red">🔥 더 긴 길이를 고르세요!</span>
              ) : (
                <span className="text-blue">❄️ 더 짧은 길이를 고르세요!</span>
              )}
            </h2>
          </div>

          <div className="compare-grid">
            <button
              className="compare-card glass-btn left-card"
              onClick={() => handleSelectSide('left')}
            >
              <div className="side-label">LEFT</div>
              <div className="compare-value">{currentQuestion.leftText}</div>
            </button>

            <div className="vs-badge">VS</div>

            <button
              className="compare-card glass-btn right-card"
              onClick={() => handleSelectSide('right')}
            >
              <div className="side-label">RIGHT</div>
              <div className="compare-value">{currentQuestion.rightText}</div>
            </button>
          </div>
        </div>
      )}

      {isGameOver && (
        <div className="result-modal glass-card animate-pop">
          <h2>🎉 대결 완료!</h2>
          <p className="result-desc">단위 비교 능력이 쑥쑥 상승했습니다!</p>
          <div className="stats-grid">
            <div className="stat-card">
              <span className="stat-label">성공 횟수</span>
              <span className="stat-val">{score} 회</span>
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
