import React, { useState, useEffect } from 'react';
import { Swords, Timer, Shield, Trophy, RotateCcw, ArrowRight } from 'lucide-react';
import { generateBossQuestions } from '../utils/mathGenerator';
import type { BossQuestion, UserProfile } from '../types';
import { updateUserStats } from '../services/dataService';

interface BossRaidViewProps {
  user: UserProfile | null;
  onUpdateUser: (user: UserProfile) => void;
  onBackToLobby: () => void;
}

export const BossRaidView: React.FC<BossRaidViewProps> = ({ user, onUpdateUser, onBackToLobby }) => {
  const BOSS_FEE = 100;
  const GAME_DURATION = 60;

  const [isPlaying, setIsPlaying] = useState(false);
  const [questions, setQuestions] = useState<BossQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleStartRaid = async () => {
    if (!user || user.gold < BOSS_FEE) {
      alert(`보스전에 도전하려면 최소 ${BOSS_FEE} 골드가 필요합니다! 미니게임에서 골드를 모아보세요.`);
      return;
    }

    const updated = await updateUserStats(user, -BOSS_FEE, 0, 0);
    onUpdateUser(updated);

    setQuestions(generateBossQuestions());
    setCurrentIdx(0);
    setUserAnswers([]);
    setTimeLeft(GAME_DURATION);
    setIsGameOver(false);
    setIsSuccess(false);
    setIsPlaying(true);
  };

  useEffect(() => {
    if (!isPlaying || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          evaluateResult(userAnswers, true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isPlaying, timeLeft, userAnswers]);

  const handleAnswerSelect = (optionIdx: number) => {
    const nextAnswers = [...userAnswers, optionIdx];
    setUserAnswers(nextAnswers);

    if (currentIdx + 1 < questions.length) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      evaluateResult(nextAnswers, false);
    }
  };

  const evaluateResult = async (finalAnswers: number[], isTimeOut: boolean) => {
    setIsPlaying(false);
    setIsGameOver(true);

    if (isTimeOut) {
      setIsSuccess(false);
      return;
    }

    let correctCount = 0;
    questions.forEach((q, idx) => {
      if (finalAnswers[idx] === q.correctAnswerIdx) {
        correctCount++;
      }
    });

    if (correctCount === 5) {
      setIsSuccess(true);
      if (user) {
        const updated = await updateUserStats(user, 300, 0, 1);
        onUpdateUser(updated);
      }
    } else {
      setIsSuccess(false);
    }
  };

  const currentQ = questions[currentIdx];

  return (
    <div className="boss-raid-container animate-fade-in notranslate" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {!isPlaying && !isGameOver && (
        <div className="boss-intro-card glass-card" style={{ padding: '36px', textAlign: 'center', background: '#ffffff', borderRadius: '28px', border: '2px solid #fecdd3' }}>
          <div className="boss-avatar" style={{ fontSize: '72px', marginBottom: '12px' }}>👹</div>
          <h1 style={{ fontSize: '32px', fontWeight: '900', color: '#881337' }}>최종 대결! 대마왕 길이마왕 보스전</h1>
          <p className="desc" style={{ color: '#64748b', fontSize: '16px', margin: '8px 0 24px' }}>
            mm, cm, m, km 단위 변환 퀴즈 <b>5문항</b>이 출제됩니다.<br />
            <b>60초 내에 5문제를 모두 맞추어야만 (5/5 완벽 승리)</b> 보스를 물리칠 수 있습니다!
          </p>

          <div className="boss-rules-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', margin: '24px 0' }}>
            <div className="rule-card" style={{ padding: '16px', background: '#fff1f2', borderRadius: '16px' }}>
              <Shield size={22} className="text-red" />
              <span className="rule-title" style={{ fontSize: '13px', color: '#9f1239', display: 'block', marginTop: '4px' }}>도전 비용</span>
              <span className="rule-val" style={{ fontSize: '18px', fontWeight: '900', color: '#881337' }}>100 골드</span>
            </div>
            <div className="rule-card" style={{ padding: '16px', background: '#fef3c7', borderRadius: '16px' }}>
              <Timer size={22} className="text-yellow" />
              <span className="rule-title" style={{ fontSize: '13px', color: '#b45309', display: 'block', marginTop: '4px' }}>제한 시간</span>
              <span className="rule-val" style={{ fontSize: '18px', fontWeight: '900', color: '#d97706' }}>60초</span>
            </div>
            <div className="rule-card" style={{ padding: '16px', background: '#e0e7ff', borderRadius: '16px' }}>
              <Trophy size={22} className="text-purple" />
              <span className="rule-title" style={{ fontSize: '13px', color: '#4338ca', display: 'block', marginTop: '4px' }}>완벽 승리 보상</span>
              <span className="rule-val" style={{ fontSize: '18px', fontWeight: '900', color: '#3730a3' }}>+300 골드 & 명예</span>
            </div>
          </div>

          <button className="btn-boss-challenge shadow-btn" onClick={handleStartRaid} style={{ padding: '16px 36px', background: 'linear-gradient(135deg, #f43f5e, #e11d48)', color: '#ffffff', border: 'none', borderRadius: '20px', fontSize: '20px', fontWeight: '900', cursor: 'pointer', boxShadow: '0 8px 24px rgba(244, 63, 94, 0.4)', display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
            <Swords size={24} /> 보스전 도전하기 (100 골드)
          </button>
        </div>
      )}

      {isPlaying && currentQ && (
        <div className="boss-play-area" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="boss-status-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#ffffff', padding: '16px 28px', borderRadius: '20px', border: '2px solid #fecdd3' }}>
            <div className="boss-hp-box" style={{ fontSize: '20px', fontWeight: '900', color: '#9f1239' }}>
              <span>👾 대마왕 체력: 관문 ({currentIdx + 1} / 5)</span>
            </div>
            <div className="timer-box" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#d97706', background: '#fef3c7', padding: '6px 16px', borderRadius: '20px', fontWeight: '800' }}>
              <Timer size={20} />
              <span className="time-val" style={{ fontSize: '18px' }}>{timeLeft}초 남음</span>
            </div>
          </div>

          <div className="boss-quiz-card glass-card" style={{ padding: '40px 32px', textAlign: 'center', background: '#ffffff', border: '2px solid #e0e7ff', borderRadius: '28px' }}>
            <span className="q-badge" style={{ background: '#ffe4e6', color: '#e11d48', padding: '6px 16px', borderRadius: '20px', fontSize: '14px', fontWeight: '800' }}>관문 {currentIdx + 1} 문제</span>
            <h1 className="q-text" style={{ fontSize: '42px', fontWeight: '900', color: '#1e1b4b', margin: '20px 0 32px' }}>{currentQ.questionText}</h1>

            <div className="boss-options-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
              {currentQ.options.map((opt, idx) => (
                <button
                  key={idx}
                  className="boss-opt-btn glass-btn"
                  onClick={() => handleAnswerSelect(idx)}
                  style={{ padding: '24px 20px', fontSize: '24px', fontWeight: '900', background: '#ffffff', border: '3px solid #cbd5e1', borderRadius: '24px', color: '#0f172a', cursor: 'pointer' }}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {isGameOver && (
        <div className="boss-result-card glass-card animate-pop" style={{ padding: '40px', textAlign: 'center', background: '#ffffff', borderRadius: '28px', border: '2px solid #e0e7ff' }}>
          {isSuccess ? (
            <div>
              <div className="win-emoji" style={{ fontSize: '72px', marginBottom: '12px' }}>🏆</div>
              <h1 className="win-title" style={{ fontSize: '32px', fontWeight: '900', color: '#15803d' }}>VICTORY! 대마왕을 격파했습니다!</h1>
              <p className="win-desc" style={{ color: '#64748b', fontSize: '16px', margin: '8px 0 24px' }}>5문제를 완벽하게 풀어 상금 300 골드와 명예를 획득했습니다.</p>
            </div>
          ) : (
            <div>
              <div className="lose-emoji" style={{ fontSize: '72px', marginBottom: '12px' }}>💀</div>
              <h1 className="lose-title" style={{ fontSize: '32px', fontWeight: '900', color: '#b91c1c' }}>GAME OVER... 보스 공략 실패!</h1>
              <p className="lose-desc" style={{ color: '#64748b', fontSize: '16px', margin: '8px 0 24px' }}>
                5문제를 모두(5/5) 맞추어야 보스를 격파할 수 있습니다.<br />
                미니게임에서 연습하고 다시 도전해 보세요!
              </p>
            </div>
          )}

          <div className="action-row" style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '24px' }}>
            <button className="btn-secondary" onClick={handleStartRaid} style={{ padding: '14px 28px', background: '#f1f5f9', color: '#1e293b', border: 'none', borderRadius: '16px', fontWeight: '800', fontSize: '16px', cursor: 'pointer' }}>
              <RotateCcw size={18} /> 재도전하기 (100 골드)
            </button>
            <button className="btn-primary" onClick={onBackToLobby} style={{ padding: '14px 28px', background: '#4f46e5', color: '#ffffff', border: 'none', borderRadius: '16px', fontWeight: '800', fontSize: '16px', cursor: 'pointer' }}>
              로비로 돌아가기 <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
