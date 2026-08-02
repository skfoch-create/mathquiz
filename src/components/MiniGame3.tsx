import React, { useState, useEffect } from 'react';
import { Timer, Target, Coins, ArrowRight, RotateCcw, CheckCircle2 } from 'lucide-react';
import { generateTargetGaugeQuestion } from '../utils/mathGenerator';
import type { TargetGaugeQuestion, UserProfile } from '../types';
import { updateUserStats } from '../services/dataService';

interface MiniGame3Props {
  user: UserProfile | null;
  onUpdateUser: (user: UserProfile) => void;
  onBackToLobby: () => void;
}

export const MiniGame3: React.FC<MiniGame3Props> = ({ user, onUpdateUser, onBackToLobby }) => {
  const GAME_DURATION = 30;
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<TargetGaugeQuestion | null>(null);
  const [selectedBlockIds, setSelectedBlockIds] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [earnedGold, setEarnedGold] = useState(0);

  const startGame = () => {
    setTimeLeft(GAME_DURATION);
    setScore(0);
    setEarnedGold(0);
    setIsGameOver(false);
    setIsPlaying(true);
    setSelectedBlockIds([]);
    setCurrentQuestion(generateTargetGaugeQuestion());
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
    const gold = Math.max(15, score * 12);
    setEarnedGold(gold);

    if (user) {
      const updated = await updateUserStats(user, gold, 1, 0);
      onUpdateUser(updated);
    }
  };

  const toggleBlock = (blockId: string) => {
    if (!currentQuestion || !isPlaying) return;

    let newSelected: string[];
    if (selectedBlockIds.includes(blockId)) {
      newSelected = selectedBlockIds.filter((id) => id !== blockId);
    } else {
      newSelected = [...selectedBlockIds, blockId];
    }
    setSelectedBlockIds(newSelected);

    const currentSum = newSelected.reduce((acc, id) => {
      const block = currentQuestion.availableBlocks.find((b) => b.id === id);
      return acc + (block ? block.valueInMm : 0);
    }, 0);

    if (currentSum === currentQuestion.targetValueInMm) {
      setScore((prev) => prev + 1);
      setTimeout(() => {
        setSelectedBlockIds([]);
        setCurrentQuestion(generateTargetGaugeQuestion());
      }, 300);
    }
  };

  const currentSumInMm = currentQuestion
    ? selectedBlockIds.reduce((acc, id) => {
        const block = currentQuestion.availableBlocks.find((b) => b.id === id);
        return acc + (block ? block.valueInMm : 0);
      }, 0)
    : 0;

  const targetMm = currentQuestion?.targetValueInMm || 1;
  const progressPercent = Math.min(100, Math.round((currentSumInMm / targetMm) * 100));
  const isOver = currentSumInMm > targetMm;

  return (
    <div className="game-container animate-fade-in notranslate" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="game-header-card glass-card" style={{ padding: '24px 32px', background: '#ffffff', borderRadius: '24px', border: '2px solid #e0e7ff', marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div className="badge-wrapper">
          <span className="mode-badge badge-c" style={{ background: '#dcfce7', color: '#15803d', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: '800' }}>🎯 30초 조준</span>
        </div>
        <h2 style={{ fontSize: '26px', fontWeight: '900', color: '#1e1b4b', margin: 0 }}>🎯 조각합체전</h2>
        <p style={{ fontSize: '15px', color: '#64748b', margin: 0 }}>수치 조각들을 모아서 100% 목표 게이지에 딱 맞추세요!</p>

        {!isPlaying && !isGameOver && (
          <div className="start-btn-wrapper" style={{ marginTop: '12px' }}>
            <button className="btn-start-game" onClick={startGame} style={{ padding: '12px 28px', background: 'linear-gradient(135deg, #10b981, #059669)', color: '#ffffff', border: 'none', borderRadius: '16px', fontSize: '17px', fontWeight: '900', cursor: 'pointer', boxShadow: '0 6px 18px rgba(16, 185, 129, 0.35)', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              🚀 게임 시작 (30초)
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
              <span style={{ fontSize: '18px' }}>완성된 목표: <b>{score}개</b></span>
            </div>
          </div>

          <div className="target-card glass-card" style={{ padding: '28px', textAlign: 'center', background: '#ffffff', border: '2px solid #e0e7ff', borderRadius: '28px' }}>
            <div className="target-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
              <Target size={24} className="text-yellow" />
              <h2 style={{ fontSize: '24px', fontWeight: '900', color: '#1e1b4b' }}>목표: <span className="text-highlight" style={{ color: '#4f46e5' }}>{currentQuestion.targetText}</span></h2>
            </div>

            <div className="gauge-container" style={{ width: '100%', height: '38px', background: '#f1f5f9', borderRadius: '20px', marginTop: '16px', overflow: 'hidden', border: '2px solid #cbd5e1' }}>
              <div
                className={`gauge-fill ${isOver ? 'over' : ''}`}
                style={{ height: '100%', width: `${progressPercent}%`, background: isOver ? '#ef4444' : 'linear-gradient(90deg, #10b981, #059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', color: '#ffffff', fontSize: '16px', transition: 'width 0.3s ease' }}
              >
                <span className="gauge-text">{progressPercent}%</span>
              </div>
            </div>
            {isOver && <p className="over-warning" style={{ color: '#ef4444', fontWeight: '800', marginTop: '8px' }}>⚠️ 목표치를 초과했습니다! 블록을 다시 클릭하여 취소하세요.</p>}
          </div>

          <div className="blocks-grid" style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center', marginTop: '20px' }}>
            {currentQuestion.availableBlocks.map((block) => {
              const isSelected = selectedBlockIds.includes(block.id);
              return (
                <button
                  key={block.id}
                  className={`block-btn glass-btn ${isSelected ? 'selected' : ''}`}
                  onClick={() => toggleBlock(block.id)}
                  style={{ padding: '20px 28px', fontSize: '22px', fontWeight: '900', background: isSelected ? '#4f46e5' : '#ffffff', color: isSelected ? '#ffffff' : '#0f172a', border: isSelected ? '3px solid #4f46e5' : '3px solid #cbd5e1', borderRadius: '20px', boxShadow: '0 6px 16px rgba(0,0,0,0.05)', cursor: 'pointer' }}
                >
                  {block.text}
                  {isSelected && <CheckCircle2 size={18} className="check-icon" style={{ marginLeft: '6px' }} />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {isGameOver && (
        <div className="result-modal glass-card animate-pop" style={{ padding: '40px', textAlign: 'center', background: '#ffffff', borderRadius: '28px', border: '2px solid #e0e7ff' }}>
          <h2 style={{ fontSize: '28px', fontWeight: '900', color: '#1e1b4b' }}>🎉 게이지 완성 달성!</h2>
          <p className="result-desc" style={{ color: '#64748b', fontSize: '16px', margin: '8px 0 24px' }}>단위 조합 감각이 대단합니다!</p>
          <div className="stats-grid" style={{ display: 'flex', gap: '16px', margin: '24px 0' }}>
            <div className="stat-card" style={{ flex: 1, padding: '20px', background: '#f8fafc', borderRadius: '16px' }}>
              <span className="stat-label" style={{ fontSize: '13px', color: '#64748b', display: 'block' }}>완성한 목표</span>
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
