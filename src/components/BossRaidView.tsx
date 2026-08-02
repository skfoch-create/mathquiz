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
  const [correctCount, setCorrectCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ text: string; isCorrect: boolean } | null>(null);

  const handleStartRaid = async () => {
    if (!user || user.gold < BOSS_FEE) {
      alert(`보스전에 도전하려면 최소 ${BOSS_FEE} 골드가 필요합니다! 미니게임에서 골드를 모아보세요.`);
      return;
    }

    const updated = await updateUserStats(user, -BOSS_FEE, 0, 0);
    onUpdateUser(updated);

    const generated = generateBossQuestions();
    setQuestions(generated);
    setCurrentIdx(0);
    setCorrectCount(0);
    setTimeLeft(GAME_DURATION);
    setIsGameOver(false);
    setIsSuccess(false);
    setFeedbackMsg(null);
    setIsPlaying(true);
  };

  // 60초 타이머 (게임 중일 때만 동작)
  useEffect(() => {
    if (!isPlaying || isGameOver) return;
    
    if (timeLeft <= 0) {
      finishRaid(correctCount, true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying, isGameOver, timeLeft]);

  // 보스전 종료 및 승리/패배 최종 처리
  const finishRaid = async (finalCount: number, isTimeOut: boolean) => {
    setIsPlaying(false);
    setIsGameOver(true);

    const victory = !isTimeOut && finalCount === 5;
    setIsSuccess(victory);

    if (victory && user) {
      const updated = await updateUserStats(user, 300, 0, 1);
      onUpdateUser(updated);
    }
  };

  const handleAnswerSelect = (selectedOptionIdx: number) => {
    if (!isPlaying || isGameOver || !questions[currentIdx]) return;

    const currentQ = questions[currentIdx];
    const isCorrect = selectedOptionIdx === currentQ.correctAnswerIndex;
    const nextCount = isCorrect ? correctCount + 1 : correctCount;

    if (isCorrect) {
      setCorrectCount(nextCount);
      setFeedbackMsg({ text: '⭕ 정답입니다!', isCorrect: true });
    } else {
      setFeedbackMsg({ text: `❌ 아쉬워요! 정답: ${currentQ.options[currentQ.correctAnswerIndex]}`, isCorrect: false });
    }

    setTimeout(() => {
      setFeedbackMsg(null);
      if (currentIdx + 1 < questions.length) {
        setCurrentIdx((prev) => prev + 1);
      } else {
        finishRaid(nextCount, false);
      }
    }, 500);
  };

  const currentQ = questions[currentIdx];

  return (
    <div className="boss-raid-container notranslate" style={{ maxWidth: '840px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {!isPlaying && !isGameOver && (
        <div style={{ padding: '36px 28px', textAlign: 'center', background: '#ffffff', borderRadius: '32px', border: '3px solid #fecdd3', boxShadow: '0 15px 35px rgba(244, 63, 94, 0.12)' }}>
          <div style={{ fontSize: '72px', marginBottom: '12px' }}>👹</div>
          <h1 style={{ fontSize: '32px', fontWeight: '900', color: '#881337', marginBottom: '8px' }}>최종 대결! 대마왕 길이마왕 보스전</h1>
          <p style={{ color: '#64748b', fontSize: '16px', margin: '8px 0 24px', fontWeight: '800' }}>
            mm, cm, m, km 단위 변환 퀴즈 <b>5문항</b>이 출제됩니다.<br />
            <b>60초 내에 5문제를 모두 맞추어야만 (5/5 완벽 승리)</b> 보스를 물리칠 수 있습니다!
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', margin: '24px 0' }}>
            <div style={{ padding: '18px', background: '#fff1f2', borderRadius: '20px', border: '2px solid #fecdd3' }}>
              <Shield size={24} style={{ color: '#e11d48' }} />
              <span style={{ fontSize: '13px', color: '#9f1239', display: 'block', marginTop: '6px', fontWeight: '800' }}>도전 비용</span>
              <span style={{ fontSize: '20px', fontWeight: '900', color: '#881337' }}>100 골드</span>
            </div>
            <div style={{ padding: '18px', background: '#fef3c7', borderRadius: '20px', border: '2px solid #fde047' }}>
              <Timer size={24} style={{ color: '#d97706' }} />
              <span style={{ fontSize: '13px', color: '#b45309', display: 'block', marginTop: '6px', fontWeight: '800' }}>제한 시간</span>
              <span style={{ fontSize: '20px', fontWeight: '900', color: '#d97706' }}>60초</span>
            </div>
            <div style={{ padding: '18px', background: '#e0e7ff', borderRadius: '20px', border: '2px solid #c7d2fe' }}>
              <Trophy size={24} style={{ color: '#4f46e5' }} />
              <span style={{ fontSize: '13px', color: '#4338ca', display: 'block', marginTop: '6px', fontWeight: '800' }}>승리 보상</span>
              <span style={{ fontSize: '20px', fontWeight: '900', color: '#3730a3' }}>+300 골드 & 승리 1회</span>
            </div>
          </div>

          <button onClick={handleStartRaid} style={{ padding: '16px 36px', background: 'linear-gradient(135deg, #f43f5e, #e11d48)', color: '#ffffff', border: 'none', borderRadius: '20px', fontSize: '20px', fontWeight: '900', cursor: 'pointer', boxShadow: '0 8px 24px rgba(244, 63, 94, 0.4)', display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
            <Swords size={24} /> 보스전 도전하기 (100 골드)
          </button>
        </div>
      )}

      {isPlaying && currentQ && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#ffffff', padding: '18px 28px', borderRadius: '24px', border: '3px solid #fecdd3', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}>
            <div style={{ fontSize: '20px', fontWeight: '900', color: '#9f1239' }}>
              <span>👾 관문 ({currentIdx + 1} / 5) | 맞춘 정답: <b>{correctCount} / 5</b></span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#d97706', background: '#fef3c7', padding: '8px 20px', borderRadius: '20px', fontWeight: '900', fontSize: '18px' }}>
              <Timer size={22} />
              <span>{timeLeft}초 남음</span>
            </div>
          </div>

          <div style={{ padding: '44px 32px', textAlign: 'center', background: '#ffffff', border: '3px solid #e0e7ff', borderRadius: '32px', boxShadow: '0 20px 40px rgba(99, 102, 241, 0.12)', position: 'relative' }}>
            <span style={{ background: '#ffe4e6', color: '#e11d48', padding: '6px 18px', borderRadius: '20px', fontSize: '15px', fontWeight: '900' }}>관문 {currentIdx + 1} 문제</span>
            <h1 style={{ fontSize: '42px', fontWeight: '900', color: '#1e1b4b', margin: '24px 0 36px' }}>{currentQ.questionText}</h1>

            {feedbackMsg && (
              <div style={{ padding: '12px 24px', borderRadius: '16px', background: feedbackMsg.isCorrect ? '#dcfce7' : '#ffe4e6', color: feedbackMsg.isCorrect ? '#15803d' : '#e11d48', fontWeight: '900', fontSize: '20px', marginBottom: '20px' }}>
                {feedbackMsg.text}
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              {currentQ.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswerSelect(idx)}
                  style={{
                    padding: '24px 20px',
                    fontSize: '24px',
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
        </div>
      )}

      {isGameOver && (
        <div style={{ padding: '44px 36px', textAlign: 'center', background: '#ffffff', borderRadius: '32px', border: '3px solid #e0e7ff', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
          {isSuccess ? (
            <div>
              <div style={{ fontSize: '72px', marginBottom: '12px' }}>🏆</div>
              <h1 style={{ fontSize: '34px', fontWeight: '900', color: '#15803d' }}>VICTORY! 대마왕을 물리쳤습니다!</h1>
              <p style={{ color: '#64748b', fontSize: '18px', margin: '12px 0 28px', fontWeight: '800' }}>
                축하합니다! 5문제를 모두(5/5) 완벽하게 풀어 <b>+300 골드</b> 보상을 획득했습니다!
              </p>
            </div>
          ) : (
            <div>
              <div style={{ fontSize: '72px', marginBottom: '12px' }}>💀</div>
              <h1 style={{ fontSize: '32px', fontWeight: '900', color: '#b91c1c' }}>GAME OVER... 보스 공략 실패!</h1>
              <p style={{ color: '#64748b', fontSize: '18px', margin: '12px 0 28px', fontWeight: '800' }}>
                5문제 중 <b>{correctCount}문제</b>를 맞추셨습니다.<br />
                보스를 무찌르려면 5문제를 모두(5/5) 맞추어야 합니다. 미니게임에서 연습 후 다시 도전해 보세요!
              </p>
            </div>
          )}

          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', marginTop: '24px' }}>
            <button onClick={handleStartRaid} style={{ padding: '16px 28px', background: '#f1f5f9', color: '#1e293b', border: 'none', borderRadius: '18px', fontWeight: '900', fontSize: '17px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <RotateCcw size={18} /> 재도전하기 (100 골드)
            </button>
            <button onClick={onBackToLobby} style={{ padding: '16px 28px', background: '#4f46e5', color: '#ffffff', border: 'none', borderRadius: '18px', fontWeight: '900', fontSize: '17px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
              로비로 돌아가기 <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
