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
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

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
    <div className="game-container animate-fade-in notranslate" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="game-header-card glass-card" style={{ padding: '24px 32px', background: '#ffffff', borderRadius: '24px', border: '2px solid #e0e7ff', marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div className="badge-wrapper">
          <span className="mode-badge badge-a" style={{ background: '#e0e7ff', color: '#4338ca', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: '800' }}>⚡ 25초 타임어택</span>
        </div>
        <h2 style={{ fontSize: '26px', fontWeight: '900', color: '#1e1b4b', margin: 0 }}>⚡ 스피드탭</h2>
        <p style={{ fontSize: '15px', color: '#64748b', margin: 0 }}>25초 동안 수치와 똑같은 정답 카드를 번개처럼 빠르게 탭하세요!</p>

        {!isPlaying && !isGameOver && (
          <div className="start-btn-wrapper" style={{ marginTop: '12px' }}>
            <button className="btn-start-game" onClick={startGame} style={{ padding: '12px 28px', background: 'linear-gradient(135deg, #10b981, #059669)', color: '#ffffff', border: 'none', borderRadius: '16px', fontSize: '17px', fontWeight: '900', cursor: 'pointer', boxShadow: '0 6px 18px rgba(16, 185, 129, 0.35)', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              🚀 게임 시작 (25초)
            </button>
          </div>
        )}
      </div>

      {isPlaying && (
        <div className="game-play-area" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="game-status-bar" style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', background: '#ffffff', padding: '16px 24px', borderRadius: '20px', border: '2px solid #e0e7ff', boxShadow: '0 8px 20px rgba(0,0,0,0.04)' }}>
            <div className="timer-box" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#d97706', background: '#fef3c7', padding: '6px 16px', borderRadius: '20px', fontWeight: '800' }}>
              <Timer size={20} className="text-yellow" />
              <span className="time-value" style={{ fontSize: '18px' }}>{timeLeft}초 남음</span>
            </div>
            <div className="combo-box" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ea580c', background: '#ffedd5', padding: '6px 16px', borderRadius: '20px', fontWeight: '800' }}>
              <Zap size={20} className="text-orange" />
              <span style={{ fontSize: '18px' }}>콤보: <b>{combo}</b></span>
            </div>
            <div className="score-box" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#4338ca', background: '#e0e7ff', padding: '6px 16px', borderRadius: '20px', fontWeight: '800' }}>
              <span style={{ fontSize: '18px' }}>맞춘 개수: <b>{score}개</b></span>
            </div>
          </div>

          {currentQuestion && (
            <div className={`quiz-card glass-card ${feedback ? feedback : ''}`} style={{ padding: '40px 32px', textAlign: 'center', background: '#ffffff', border: '2px solid #e0e7ff', borderRadius: '28px', boxShadow: '0 15px 35px rgba(99, 102, 241, 0.12)' }}>
              <div className="prompt-display">
                <span className="prompt-label" style={{ color: '#64748b', fontSize: '16px', fontWeight: '800' }}>다음 수치와 같은 것은?</span>
                <h1 className="prompt-text" style={{ fontSize: '48px', fontWeight: '900', color: '#1e1b4b', margin: '16px 0 28px', letterSpacing: '1px' }}>{currentQuestion.promptText}</h1>
              </div>

              <div className="options-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', width: '100%' }}>
                {currentQuestion.options.map((opt, idx) => (
                  <button
                    key={idx}
                    className="option-btn glass-btn"
                    onClick={() => handleSelectOption(opt)}
                    style={{ padding: '24px 20px', fontSize: '26px', fontWeight: '900', background: '#ffffff', border: '3px solid #cbd5e1', borderRadius: '24px', color: '#0f172a', cursor: 'pointer', boxShadow: '0 8px 18px rgba(0, 0, 0, 0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
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
        <div className="result-modal glass-card animate-pop" style={{ padding: '40px', textAlign: 'center', background: '#ffffff', borderRadius: '28px', border: '2px solid #e0e7ff' }}>
          <h2 style={{ fontSize: '28px', fontWeight: '900', color: '#1e1b4b' }}>🎉 게임 종료!</h2>
          <p className="result-desc" style={{ color: '#64748b', fontSize: '16px', margin: '8px 0 24px' }}>25초 동안 알차게 퀴즈를 풀었습니다!</p>
          <div className="stats-grid" style={{ display: 'flex', gap: '16px', margin: '24px 0' }}>
            <div className="stat-card" style={{ flex: 1, padding: '20px', background: '#f8fafc', borderRadius: '16px' }}>
              <span className="stat-label" style={{ fontSize: '13px', color: '#64748b', display: 'block' }}>정답 개수</span>
              <span className="stat-val" style={{ fontSize: '26px', fontWeight: '900', color: '#0f172a' }}>{score} 개</span>
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
