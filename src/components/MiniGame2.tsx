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
    <div className="game-container notranslate">
      <div className="game-header-card phantom-card">
        <div>
          <span className="mode-badge badge-b">⚖️ 25초 순발력</span>
        </div>
        <h2>⚖️ 길이비교</h2>
        <p>지시어(더 긴 길이 / 더 짧은 길이)에 맞는 카드를 순발력 있게 고르세요!</p>

        {!isPlaying && !isGameOver && (
          <div style={{ marginTop: '12px' }}>
            <button className="btn-start-game" onClick={startGame}>
              🚀 게임 시작하기 (25초)
            </button>
          </div>
        )}
      </div>

      {isPlaying && currentQuestion && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="game-status-bar phantom-card">
            <div className="timer-box">
              <Timer size={22} />
              <span>{timeLeft}초 남음</span>
            </div>
            <div className="score-box">
              <span>맞춘 횟수: <b>{score}개</b></span>
            </div>
          </div>

          <div className="phantom-card" style={{ textAlign: 'center', padding: '24px' }}>
            <h2 style={{ fontSize: '26px', fontWeight: '900' }}>
              {currentQuestion.targetType === 'longer' ? (
                <span style={{ color: '#e11d48' }}>🔥 더 긴 길이를 고르세요!</span>
              ) : (
                <span style={{ color: '#0284c7' }}>❄️ 더 짧은 길이를 고르세요!</span>
              )}
            </h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <button
              className="phantom-card phantom-card-hover"
              onClick={() => handleSelectSide('left')}
              style={{ flex: 1, padding: '48px 24px', textAlign: 'center', cursor: 'pointer' }}
            >
              <div style={{ fontSize: '15px', color: '#64748b', fontWeight: '800', marginBottom: '8px' }}>LEFT</div>
              <div style={{ fontSize: '36px', fontWeight: '900', color: '#1e1b4b' }}>{currentQuestion.leftText}</div>
            </button>

            <div style={{ fontSize: '28px', fontWeight: '900', color: '#d97706', background: '#fef3c7', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 18px rgba(245, 158, 11, 0.25)' }}>VS</div>

            <button
              className="phantom-card phantom-card-hover"
              onClick={() => handleSelectSide('right')}
              style={{ flex: 1, padding: '48px 24px', textAlign: 'center', cursor: 'pointer' }}
            >
              <div style={{ fontSize: '15px', color: '#64748b', fontWeight: '800', marginBottom: '8px' }}>RIGHT</div>
              <div style={{ fontSize: '36px', fontWeight: '900', color: '#1e1b4b' }}>{currentQuestion.rightText}</div>
            </button>
          </div>
        </div>
      )}

      {isGameOver && (
        <div className="phantom-card" style={{ padding: '44px 36px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '32px', fontWeight: '900', color: '#1e1b4b' }}>🎉 대결 완료!</h2>
          <p style={{ color: '#64748b', fontSize: '16px', margin: '8px 0 24px' }}>단위 비교 능력이 쑥쑥 상승했습니다!</p>
          <div style={{ display: 'flex', gap: '16px', margin: '24px 0' }}>
            <div style={{ flex: 1, padding: '20px', background: '#f8fafc', borderRadius: '20px' }}>
              <span style={{ fontSize: '14px', color: '#64748b', display: 'block' }}>성공 횟수</span>
              <span style={{ fontSize: '28px', fontWeight: '900', color: '#0f172a' }}>{score} 회</span>
            </div>
            <div style={{ flex: 1, padding: '20px', background: '#fef3c7', borderRadius: '20px' }}>
              <span style={{ fontSize: '14px', color: '#b45309', display: 'block' }}>획득한 골드</span>
              <span style={{ fontSize: '28px', fontWeight: '900', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                <Coins size={24} /> +{earnedGold} 골드
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '14px', marginTop: '24px' }}>
            <button onClick={startGame} style={{ flex: 1, padding: '16px', background: '#f1f5f9', color: '#1e293b', border: 'none', borderRadius: '18px', fontWeight: '900', fontSize: '17px', cursor: 'pointer' }}>
              <RotateCcw size={18} /> 다시 하기
            </button>
            <button onClick={onBackToLobby} style={{ flex: 1, padding: '16px', background: '#4f46e5', color: '#ffffff', border: 'none', borderRadius: '18px', fontWeight: '900', fontSize: '17px', cursor: 'pointer' }}>
              로비로 돌아가기 <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
