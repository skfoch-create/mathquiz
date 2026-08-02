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
  const GAME_DURATION = 25;
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<SpeedTouchQuestion | null>(null);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [earnedGold, setEarnedGold] = useState(0);

  const startGame = () => {
    setTimeLeft(GAME_DURATION);
    setScore(0);
    setCombo(0);
    setEarnedGold(0);
    setIsGameOver(false);
    setIsPlaying(true);
    setCurrentQuestion(generateSpeedTouchQuestion());
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
    const gold = Math.max(10, score * 5);
    setEarnedGold(gold);

    if (user) {
      const updated = await updateUserStats(user, gold, 1, 0);
      onUpdateUser(updated);
    }
  };

  const handleSelectOption = (option: string) => {
    if (!currentQuestion || !isPlaying) return;

    if (option === currentQuestion.correctAnswer) {
      setScore((prev) => prev + 1);
      setCombo((prev) => prev + 1);
    } else {
      setCombo(0);
    }

    setCurrentQuestion(generateSpeedTouchQuestion());
  };

  return (
    <div style={{ maxWidth: '820px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }} className="notranslate">
      {/* 게임 타이틀 카드 */}
      <div style={{ padding: '28px 36px', background: '#ffffff', borderRadius: '28px', border: '3px solid #c7d2fe', boxShadow: '0 15px 35px -10px rgba(99, 102, 241, 0.15)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div>
          <span style={{ background: '#e0e7ff', color: '#4338ca', padding: '6px 16px', borderRadius: '20px', fontSize: '14px', fontWeight: '900' }}>⚡ 25초 타임어택</span>
        </div>
        <h2 style={{ fontSize: '28px', fontWeight: '900', color: '#1e1b4b', margin: 0 }}>⚡ 스피드탭</h2>
        <p style={{ fontSize: '16px', color: '#64748b', margin: 0, fontWeight: '800' }}>25초 동안 제시된 수치와 똑같은 정답 카드를 누구보다 빠르게 탭하세요!</p>

        {!isPlaying && !isGameOver && (
          <div style={{ marginTop: '12px' }}>
            <button onClick={startGame} style={{ padding: '14px 32px', background: 'linear-gradient(135deg, #10b981, #059669)', color: '#ffffff', border: 'none', borderRadius: '18px', fontSize: '18px', fontWeight: '900', cursor: 'pointer', boxShadow: '0 8px 24px rgba(16, 185, 129, 0.4)', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              🚀 게임 시작하기 (25초)
            </button>
          </div>
        )}
      </div>

      {/* 인게임 진행 화면 */}
      {isPlaying && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* 상태 바 (타이머 / 콤보 / 점수) */}
          <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', background: '#ffffff', padding: '18px 28px', borderRadius: '24px', border: '3px solid #c7d2fe', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#b45309', background: '#fef3c7', padding: '8px 20px', borderRadius: '20px', fontWeight: '900', fontSize: '18px' }}>
              <Timer size={22} />
              <span>{timeLeft}초 남음</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#c2410c', background: '#ffedd5', padding: '8px 20px', borderRadius: '20px', fontWeight: '900', fontSize: '18px' }}>
              <Zap size={22} />
              <span>콤보: <b>{combo}</b></span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#4338ca', background: '#e0e7ff', padding: '8px 20px', borderRadius: '20px', fontWeight: '900', fontSize: '18px' }}>
              <span>맞춘 개수: <b>{score}개</b></span>
            </div>
          </div>

          {/* 퀴즈 메인 3D 카드 */}
          {currentQuestion && (
            <div style={{ padding: '44px 32px', textAlign: 'center', background: '#ffffff', border: '3px solid #c7d2fe', borderRadius: '32px', boxShadow: '0 20px 40px rgba(99, 102, 241, 0.15)' }}>
              <div>
                <span style={{ color: '#64748b', fontSize: '17px', fontWeight: '800' }}>다음 수치와 같은 것은?</span>
                <h1 style={{ fontSize: '52px', fontWeight: '900', color: '#1e1b4b', margin: '18px 0 32px', letterSpacing: '1px' }}>{currentQuestion.promptText}</h1>
              </div>

              {/* 2x2 정답 선택지 버튼 (보장형 직발 2열 2행) */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', width: '100%' }}>
                {currentQuestion.options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(opt)}
                    style={{
                      padding: '26px 20px',
                      fontSize: '26px',
                      fontWeight: '900',
                      background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                      border: '3px solid #94a3b8',
                      borderRadius: '24px',
                      color: '#0f172a',
                      cursor: 'pointer',
                      boxShadow: '0 8px 20px rgba(0, 0, 0, 0.08)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 게임 결과 모달 */}
      {isGameOver && (
        <div style={{ padding: '44px 36px', textAlign: 'center', background: '#ffffff', borderRadius: '32px', border: '3px solid #c7d2fe', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontSize: '32px', fontWeight: '900', color: '#1e1b4b' }}>🎉 게임 종료!</h2>
          <p style={{ color: '#64748b', fontSize: '17px', margin: '8px 0 24px', fontWeight: '800' }}>25초 동안 알차게 퀴즈를 풀었습니다!</p>
          <div style={{ display: 'flex', gap: '16px', margin: '24px 0' }}>
            <div style={{ flex: 1, padding: '20px', background: '#f8fafc', borderRadius: '20px', border: '2px solid #e2e8f0' }}>
              <span style={{ fontSize: '14px', color: '#64748b', display: 'block', fontWeight: '800' }}>정답 개수</span>
              <span style={{ fontSize: '28px', fontWeight: '900', color: '#0f172a' }}>{score} 개</span>
            </div>
            <div style={{ flex: 1, padding: '20px', background: '#fef3c7', borderRadius: '20px', border: '2px solid #fde047' }}>
              <span style={{ fontSize: '14px', color: '#b45309', display: 'block', fontWeight: '800' }}>획득한 골드</span>
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
