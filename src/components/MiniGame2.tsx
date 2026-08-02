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
  const [seesawTilt, setSeesawTilt] = useState<'left' | 'right' | 'center'>('center');

  const startGame = () => {
    setTimeLeft(GAME_DURATION);
    setScore(0);
    setEarnedGold(0);
    setIsGameOver(false);
    setSeesawTilt('center');
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

    // 시소 쿵 기울어짐 모션 시각화
    setSeesawTilt(side);

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

    // 충분한 800ms 모션 관람 후 다음 문제 전환
    setTimeout(() => {
      setSeesawTilt('center');
      setCurrentQuestion(generateSizeCompareQuestion());
    }, 700);
  };

  const getSeesawRotate = () => {
    if (seesawTilt === 'left') return 'rotate(-24deg)';
    if (seesawTilt === 'right') return 'rotate(24deg)';
    return 'rotate(0deg)';
  };

  return (
    <div className="game-container notranslate" style={{ maxWidth: '840px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ padding: '28px 36px', background: '#ffffff', borderRadius: '28px', border: '3px solid #fecdd3', boxShadow: '0 15px 35px -10px rgba(244, 63, 94, 0.15)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div>
          <span style={{ background: '#ffe4e6', color: '#e11d48', padding: '6px 16px', borderRadius: '20px', fontSize: '14px', fontWeight: '900' }}>⚖️ 25초 순발력</span>
        </div>
        <h2 style={{ fontSize: '28px', fontWeight: '900', color: '#881337', margin: 0 }}>⚖️ 길이비교</h2>
        <p style={{ fontSize: '16px', color: '#64748b', margin: 0, fontWeight: '800' }}>지시어(더 긴 길이 / 더 짧은 길이)에 맞는 카드를 시소를 보며 순발력 있게 고르세요!</p>

        {!isPlaying && !isGameOver && (
          <div style={{ marginTop: '12px' }}>
            <button onClick={startGame} style={{ padding: '14px 32px', background: 'linear-gradient(135deg, #10b981, #059669)', color: '#ffffff', border: 'none', borderRadius: '18px', fontSize: '18px', fontWeight: '900', cursor: 'pointer', boxShadow: '0 8px 24px rgba(16, 185, 129, 0.4)', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              🚀 대결 시작하기 (25초)
            </button>
          </div>
        )}
      </div>

      {isPlaying && currentQuestion && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', background: '#ffffff', padding: '18px 28px', borderRadius: '24px', border: '3px solid #fecdd3', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#b45309', background: '#fef3c7', padding: '8px 20px', borderRadius: '20px', fontWeight: '900', fontSize: '18px' }}>
              <Timer size={22} />
              <span>{timeLeft}초 남음</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#4338ca', background: '#e0e7ff', padding: '8px 20px', borderRadius: '20px', fontWeight: '900', fontSize: '18px' }}>
              <span>맞춘 횟수: <b>{score}개</b></span>
            </div>
          </div>

          <div style={{ textAlign: 'center', padding: '24px', background: '#ffffff', borderRadius: '28px', border: '3px solid #fecdd3', boxShadow: '0 15px 35px rgba(244, 63, 94, 0.1)' }}>
            <h2 style={{ fontSize: '28px', fontWeight: '900' }}>
              {currentQuestion.targetType === 'longer' ? (
                <span style={{ color: '#e11d48' }}>🔥 더 긴 길이를 고르세요!</span>
              ) : (
                <span style={{ color: '#0284c7' }}>❄️ 더 짧은 길이를 고르세요!</span>
              )}
            </h2>
          </div>

          {/* 3D 역동적 시소 대결 공간 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', position: 'relative' }}>
            {/* 왼쪽 카드 */}
            <button
              onClick={() => handleSelectSide('left')}
              style={{
                flex: 1,
                padding: '48px 24px',
                textAlign: 'center',
                background: '#ffffff',
                border: seesawTilt === 'left' ? '4px solid #e11d48' : '3px solid #cbd5e1',
                borderRadius: '28px',
                boxShadow: '0 12px 28px rgba(0,0,0,0.08)',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                transform: seesawTilt === 'left' ? 'translateY(24px) scale(1.03)' : 'translateY(0)'
              }}
            >
              <div style={{ fontSize: '15px', color: '#64748b', fontWeight: '900', marginBottom: '8px' }}>LEFT CARD</div>
              <div style={{ fontSize: '38px', fontWeight: '900', color: '#1e1b4b' }}>{currentQuestion.leftText}</div>
            </button>

            {/* 시소 판자 & 받침대 3D 비주얼 센터 */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minWidth: '120px' }}>
              <div
                style={{
                  transform: getSeesawRotate(),
                  transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
                  padding: '12px 20px',
                  borderRadius: '24px',
                  border: '3px solid #f59e0b',
                  boxShadow: '0 10px 25px rgba(245, 158, 11, 0.3)'
                }}
              >
                <Scale size={32} style={{ color: '#d97706' }} />
                <span style={{ fontSize: '20px', fontWeight: '900', color: '#92400e', whiteSpace: 'nowrap' }}>시소 쿵!</span>
              </div>
              <div style={{ width: '0', height: '0', borderLeft: '16px solid transparent', borderRight: '16px solid transparent', borderBottom: '24px solid #d97706', marginTop: '6px' }} />
            </div>

            {/* 오른쪽 카드 */}
            <button
              onClick={() => handleSelectSide('right')}
              style={{
                flex: 1,
                padding: '48px 24px',
                textAlign: 'center',
                background: '#ffffff',
                border: seesawTilt === 'right' ? '4px solid #e11d48' : '3px solid #cbd5e1',
                borderRadius: '28px',
                boxShadow: '0 12px 28px rgba(0,0,0,0.08)',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                transform: seesawTilt === 'right' ? 'translateY(24px) scale(1.03)' : 'translateY(0)'
              }}
            >
              <div style={{ fontSize: '15px', color: '#64748b', fontWeight: '900', marginBottom: '8px' }}>RIGHT CARD</div>
              <div style={{ fontSize: '38px', fontWeight: '900', color: '#1e1b4b' }}>{currentQuestion.rightText}</div>
            </button>
          </div>
        </div>
      )}

      {isGameOver && (
        <div style={{ padding: '44px 36px', textAlign: 'center', background: '#ffffff', borderRadius: '32px', border: '3px solid #fecdd3', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontSize: '32px', fontWeight: '900', color: '#1e1b4b' }}>🎉 대결 완료!</h2>
          <p style={{ color: '#64748b', fontSize: '17px', margin: '8px 0 24px', fontWeight: '800' }}>단위 비교 감각이 쑥쑥 상승했습니다!</p>
          <div style={{ display: 'flex', gap: '16px', margin: '24px 0' }}>
            <div style={{ flex: 1, padding: '20px', background: '#f8fafc', borderRadius: '20px', border: '2px solid #e2e8f0' }}>
              <span style={{ fontSize: '14px', color: '#64748b', display: 'block', fontWeight: '800' }}>성공 횟수</span>
              <span style={{ fontSize: '28px', fontWeight: '900', color: '#0f172a' }}>{score} 회</span>
            </div>
            <div style={{ flex: 1, padding: '20px', background: '#fef3c7', borderRadius: '20px', border: '2px solid #fde047' }}>
              <span style={{ fontSize: '14px', color: '#b45309', display: 'block', fontWeight: '800' }}>획득한 골드</span>
              <span style={{ fontSize: '28px', fontWeight: '900', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                <Coins size={24} /> +{earnedGold} 골드
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '14px', marginTop: '24px' }}>
            <button onClick={startGame} style={{ flex: 1, padding: '16px', background: '#f1f5f9', color: '#1e293b', border: 'none', borderRadius: '18px', fontWeight: '900', fontSize: '17px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <RotateCcw size={18} /> 다시 하기
            </button>
            <button onClick={onBackToLobby} style={{ flex: 1, padding: '16px', background: '#4f46e5', color: '#ffffff', border: 'none', borderRadius: '18px', fontWeight: '900', fontSize: '17px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              로비로 돌아가기 <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
