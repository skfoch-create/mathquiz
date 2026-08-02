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

  // 블록 선택/해제
  const toggleBlock = (blockId: string) => {
    if (!currentQuestion || !isPlaying) return;

    let newSelected: string[];
    if (selectedBlockIds.includes(blockId)) {
      newSelected = selectedBlockIds.filter((id) => id !== blockId);
    } else {
      newSelected = [...selectedBlockIds, blockId];
    }
    setSelectedBlockIds(newSelected);

    // 현재 합계 계산
    const currentSum = newSelected.reduce((acc, id) => {
      const block = currentQuestion.availableBlocks.find((b) => b.id === id);
      return acc + (block ? block.valueInMm : 0);
    }, 0);

    // 목표치 도달 검사
    if (currentSum === currentQuestion.targetValueInMm) {
      setScore((prev) => prev + 1);
      setTimeout(() => {
        setSelectedBlockIds([]);
        setCurrentQuestion(generateTargetGaugeQuestion());
      }, 300);
    }
  };

  // 현재 게이지 비율 (0~100%)
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
    <div className="game-container animate-fade-in">
      <div className="game-header-card glass-card">
        <div className="game-title-group">
          <span className="game-badge badge-c">30초 조준</span>
          <h2>🎯 조각합체전</h2>
          <p>수치 조각들을 모아서 100% 목표 게이지에 딱 맞추세요!</p>
        </div>

        {!isPlaying && !isGameOver && (
          <button className="btn-start-game shadow-btn" onClick={startGame}>
            🚀 게임 시작 (30초 제한)
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
              <span>완성된 목표: <b>{score}개</b></span>
            </div>
          </div>

          <div className="target-card glass-card">
            <div className="target-header">
              <Target size={26} className="text-yellow animate-bounce" />
              <h2>목표: <span className="text-highlight">{currentQuestion.targetText}</span></h2>
            </div>

            {/* 게이지 바 */}
            <div className="gauge-container">
              <div
                className={`gauge-fill ${isOver ? 'over' : ''}`}
                style={{ width: `${progressPercent}%` }}
              >
                <span className="gauge-text">{progressPercent}%</span>
              </div>
            </div>
            {isOver && <p className="over-warning">⚠️ 목표치를 초과했습니다! 블록을 다시 클릭하여 취소하세요.</p>}
          </div>

          {/* 선택 가능한 수치 조각들 */}
          <div className="blocks-grid">
            {currentQuestion.availableBlocks.map((block) => {
              const isSelected = selectedBlockIds.includes(block.id);
              return (
                <button
                  key={block.id}
                  className={`block-btn glass-btn ${isSelected ? 'selected' : ''}`}
                  onClick={() => toggleBlock(block.id)}
                >
                  {block.text}
                  {isSelected && <CheckCircle2 size={18} className="check-icon" />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {isGameOver && (
        <div className="result-modal glass-card animate-pop">
          <h2>🎉 게이지 완성 달성!</h2>
          <p className="result-desc">단위 조합 감각이 대단합니다!</p>
          <div className="stats-grid">
            <div className="stat-card">
              <span className="stat-label">완성한 목표</span>
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
