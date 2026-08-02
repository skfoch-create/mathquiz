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
    <div className="game-container notranslate">
      <div className="game-header-card phantom-card">
        <div>
          <span className="mode-badge badge-a">⚡ 25초 타임어택</span>
        </div>
        <h2>⚡ 스피드탭</h2>
        <p>25초 동안 수치와 똑같은 정답 카드를 번개처럼 빠르게 탭하세요!</p>

        {!isPlaying && !isGameOver && (
          <div style={{ marginTop: '12px' }}>
            <button className="btn-start-game" onClick={startGame}>
              🚀 게임 시작하기 (25초)
            </button>
          </div>
        )}
      </div>

      {isPlaying && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="game-status-bar phantom-card">
            <div className="timer-box">
              <Timer size={22} />
              <span>{timeLeft}초 남음</span>
            </div>
            <div className="combo-box">
              <Zap size={22} />
              <span>콤보: <b>{combo}</b></span>
            </div>
            <div className="score-box">
              <span>맞춘 개수: <b>{score}개</b></span>
            </div>
          </div>

          {currentQuestion && (
            <div className="quiz-card phantom-card">
              <div>
                <span className="prompt-label">다음 수치와 같은 것은?</span>
                <h1 className="prompt-text">{currentQuestion.promptText}</h1>
              </div>

              <div className="options-grid">
                {currentQuestion.options.map((opt, idx) => (
                  <button
                    key={idx}
                    className="option-btn"
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
        <div className="phantom-card" style={{ padding: '44px 36px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '32px', fontWeight: '900', color: '#1e1b4b' }}>🎉 게임 종료!</h2>
          <p style={{ color: '#64748b', fontSize: '16px', margin: '8px 0 24px' }}>25초 동안 알차게 퀴즈를 풀었습니다!</p>
          <div style={{ display: 'flex', gap: '16px', margin: '24px 0' }}>
            <div style={{ flex: 1, padding: '20px', background: '#f8fafc', borderRadius: '20px' }}>
              <span style={{ fontSize: '14px', color: '#64748b', display: 'block' }}>정답 개수</span>
              <span style={{ fontSize: '28px', fontWeight: '900', color: '#0f172a' }}>{score} 개</span>
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
