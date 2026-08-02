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
    <div className="game-container animate-fade-in notranslate" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="game-header-card glass-card" style={{ padding: '24px 32px', background: '#ffffff', borderRadius: '24px', border: '2px solid #e0e7ff', marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div className="badge-wrapper">
          <span className="mode-badge badge-b" style={{ background: '#ffe4e6', color: '#e11d48', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: '800' }}>⚖️ 25초 순발력</span>
        </div>
        <h2 style={{ fontSize: '26px', fontWeight: '900', color: '#1e1b4b', margin: 0 }}>⚖️ 길이비교</h2>
        <p style={{ fontSize: '15px', color: '#64748b', margin: 0 }}>지시어(더 긴 길이 / 더 짧은 길이)에 맞는 카드를 순발력 있게 고르세요!</p>

        {!isPlaying && !isGameOver && (
          <div className="start-btn-wrapper" style={{ marginTop: '12px' }}>
            <button className="btn-start-game" onClick={startGame} style={{ padding: '12px 28px', background: 'linear-gradient(135deg, #10b981, #059669)', color: '#ffffff', border: 'none', borderRadius: '16px', fontSize: '17px', fontWeight: '900', cursor: 'pointer', boxShadow: '0 6px 18px rgba(16, 185, 129, 0.35)', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              🚀 게임 시작 (25초)
            </button>
          </div>
        )}
      </div>

      {isPlaying && currentQuestion && (
        <div className="game-play-area" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="game-status-bar" style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', background: '#ffffff', padding: '16px 24px', borderRadius: '20px', border: '2px solid #e0e7ff', boxShadow: '0 8px 20px rgba(0,0,0,0.04)' }}>
            <div className="timer-box" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#d97706', background: '#fef3c7', padding: '6px 16px', borderRadius: '20px', fontWeight: '800' }}>
              <Timer size={20} className="text-yellow" />
              <span className="time-value" style={{ fontSize: '18px' }}>{timeLeft}초 남음</span>
            </div>
            <div className="score-box" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#4338ca', background: '#e0e7ff', padding: '6px 16px', borderRadius: '20px', fontWeight: '800' }}>
              <span style={{ fontSize: '18px' }}>맞춘 횟수: <b>{score}개</b></span>
            </div>
          </div>

          <div className="instruction-banner glass-card" style={{ textAlign: 'center', padding: '20px', background: '#ffffff', borderRadius: '24px', fontSize: '24px', fontWeight: '900', border: '2px solid #e0e7ff' }}>
            <h2>
              {currentQuestion.targetType === 'longer' ? (
                <span className="text-red" style={{ color: '#e11d48' }}>🔥 더 긴 길이를 고르세요!</span>
              ) : (
                <span className="text-blue" style={{ color: '#0284c7' }}>❄️ 더 짧은 길이를 고르세요!</span>
              )}
            </h2>
          </div>

          <div className="compare-grid" style={{ display: 'flex', alignItems: 'center', gap: '20px', width: '100%' }}>
            <button
              className="compare-card glass-btn left-card"
              onClick={() => handleSelectSide('left')}
              style={{ flex: 1, padding: '44px 24px', textAlign: 'center', background: '#ffffff', border: '3px solid #cbd5e1', borderRadius: '28px', boxShadow: '0 10px 24px rgba(0,0,0,0.06)', cursor: 'pointer' }}
            >
              <div className="side-label" style={{ fontSize: '14px', color: '#64748b', fontWeight: '800', marginBottom: '8px' }}>LEFT</div>
              <div className="compare-value" style={{ fontSize: '34px', fontWeight: '900', color: '#1e1b4b' }}>{currentQuestion.leftText}</div>
            </button>

            <div className="vs-badge" style={{ fontSize: '28px', fontWeight: '900', color: '#d97706', background: '#fef3c7', width: '56px', height: '56px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>VS</div>

            <button
              className="compare-card glass-btn right-card"
              onClick={() => handleSelectSide('right')}
              style={{ flex: 1, padding: '44px 24px', textAlign: 'center', background: '#ffffff', border: '3px solid #cbd5e1', borderRadius: '28px', boxShadow: '0 10px 24px rgba(0,0,0,0.06)', cursor: 'pointer' }}
            >
              <div className="side-label" style={{ fontSize: '14px', color: '#64748b', fontWeight: '800', marginBottom: '8px' }}>RIGHT</div>
              <div className="compare-value" style={{ fontSize: '34px', fontWeight: '900', color: '#1e1b4b' }}>{currentQuestion.rightText}</div>
            </button>
          </div>
        </div>
      )}

      {isGameOver && (
        <div className="result-modal glass-card animate-pop" style={{ padding: '40px', textAlign: 'center', background: '#ffffff', borderRadius: '28px', border: '2px solid #e0e7ff' }}>
          <h2 style={{ fontSize: '28px', fontWeight: '900', color: '#1e1b4b' }}>🎉 대결 완료!</h2>
          <p className="result-desc" style={{ color: '#64748b', fontSize: '16px', margin: '8px 0 24px' }}>단위 비교 능력이 쑥쑥 상승했습니다!</p>
          <div className="stats-grid" style={{ display: 'flex', gap: '16px', margin: '24px 0' }}>
            <div className="stat-card" style={{ flex: 1, padding: '20px', background: '#f8fafc', borderRadius: '16px' }}>
              <span className="stat-label" style={{ fontSize: '13px', color: '#64748b', display: 'block' }}>성공 횟수</span>
              <span className="stat-val" style={{ fontSize: '26px', fontWeight: '900', color: '#0f172a' }}>{score} 회</span>
            </div>
            <div className="stat-card highlight" style={{ flex: 1, padding: '20px', background: '#fef3c7', borderRadius: '16px' }}>
              <span className="stat-label" style={{ fontSize: '13px', color: '#b45309', display: 'block' }}>획득한 골드</span>
              <span className="stat-val text-yellow" style={{ fontSize: '26px', fontWeight: '900', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                <Coins size={22} /> +{earnedGold} 골드
              </span>
            </div>
          </div>

          <div className="action-row" style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
            <button className="btn-secondary" onClick={startGame} style={{ flex: 1, padding: '14px 24px', background: '#f1f5f9', color: '#1e293b', border: 'none', borderRadius: '16px', fontWeight: '800', fontSize: '16px', cursor: 'pointer' }}>
              <RotateCcw size={18} /> 다시 하기
            </button>
            <button className="btn-primary" onClick={onBackToLobby} style={{ flex: 1, padding: '14px 24px', background: '#4f46e5', color: '#ffffff', border: 'none', borderRadius: '16px', fontWeight: '800', fontSize: '16px', cursor: 'pointer' }}>
              로비로 돌아가기 <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
