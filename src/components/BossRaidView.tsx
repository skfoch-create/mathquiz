import React, { useState, useEffect } from 'react';
import { Swords, Timer, Shield, Trophy, RotateCcw, ArrowRight, Heart } from 'lucide-react';
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
  const MAX_BOSS_HP = 5;

  const [isPlaying, setIsPlaying] = useState(false);
  const [questions, setQuestions] = useState<BossQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [bossHp, setBossHp] = useState(MAX_BOSS_HP);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [bossHitEffect, setBossHitEffect] = useState(false);
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
    setBossHp(MAX_BOSS_HP);
    setTimeLeft(GAME_DURATION);
    setIsGameOver(false);
    setIsSuccess(false);
    setBossHitEffect(false);
    setFeedbackMsg(null);
    setIsPlaying(true);
  };

  // 60초 타이머
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

  // 보스전 최종 완료 처리
  const finishRaid = async (finalCount: number, isTimeOut: boolean) => {
    setIsPlaying(false);
    setIsGameOver(true);

    const victory = !isTimeOut && finalCount === MAX_BOSS_HP;
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

    if (isCorrect) {
      const nextCount = correctCount + 1;
      const newBossHp = Math.max(0, bossHp - 1);
      
      setCorrectCount(nextCount);
      setBossHp(newBossHp);
      setBossHitEffect(true);
      setFeedbackMsg({ text: '💥 크리티컬 히트! 정답입니다! (보스 HP -1)', isCorrect: true });

      setTimeout(() => setBossHitEffect(false), 400);

      setTimeout(() => {
        setFeedbackMsg(null);
        if (currentIdx + 1 < questions.length) {
          setCurrentIdx((prev) => prev + 1);
        } else {
          finishRaid(nextCount, false);
        }
      }, 700);
    } else {
      setFeedbackMsg({ text: `❌ 방어 성공한 보스! 정답: ${currentQ.options[currentQ.correctAnswerIndex]}`, isCorrect: false });

      setTimeout(() => {
        setFeedbackMsg(null);
        if (currentIdx + 1 < questions.length) {
          setCurrentIdx((prev) => prev + 1);
        } else {
          finishRaid(correctCount, false);
        }
      }, 700);
    }
  };

  const currentQ = questions[currentIdx];
  const hpPercentage = (bossHp / MAX_BOSS_HP) * 100;

  return (
    <div className="boss-raid-container notranslate" style={{ maxWidth: '860px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {!isPlaying && !isGameOver && (
        <div style={{ padding: '36px 28px', textAlign: 'center', background: '#ffffff', borderRadius: '32px', border: '3px solid #fecdd3', boxShadow: '0 15px 35px rgba(244, 63, 94, 0.12)' }}>
          <div style={{ fontSize: '80px', marginBottom: '12px' }}>👹</div>
          <h1 style={{ fontSize: '32px', fontWeight: '900', color: '#881337', marginBottom: '8px' }}>최종 대결! 귀여운 대마왕 '길이마왕 킹슬라임'</h1>
          <p style={{ color: '#64748b', fontSize: '16px', margin: '8px 0 24px', fontWeight: '800' }}>
            퀴즈 <b>5문항</b>을 풀어 <b>보스의 HP(5/5)를 0으로 깎아 격파</b>하세요!<br />
            정답을 맞출 때마다 보스가 타격을 입고 HP가 깎여 나갑니다!
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', margin: '24px 0' }}>
            <div style={{ padding: '18px', background: '#fff1f2', borderRadius: '20px', border: '2px solid #fecdd3' }}>
              <Shield size={24} style={{ color: '#e11d48' }} />
              <span style={{ fontSize: '13px', color: '#9f1239', display: 'block', marginTop: '6px', fontWeight: '800' }}>도전 입장료</span>
              <span style={{ fontSize: '20px', fontWeight: '900', color: '#881337' }}>100 골드</span>
            </div>
            <div style={{ padding: '18px', background: '#fef3c7', borderRadius: '20px', border: '2px solid #fde047' }}>
              <Timer size={24} style={{ color: '#d97706' }} />
              <span style={{ fontSize: '13px', color: '#b45309', display: 'block', marginTop: '6px', fontWeight: '800' }}>공략 제한시간</span>
              <span style={{ fontSize: '20px', fontWeight: '900', color: '#d97706' }}>60초</span>
            </div>
            <div style={{ padding: '18px', background: '#e0e7ff', borderRadius: '20px', border: '2px solid #c7d2fe' }}>
              <Trophy size={24} style={{ color: '#4f46e5' }} />
              <span style={{ fontSize: '13px', color: '#4338ca', display: 'block', marginTop: '6px', fontWeight: '800' }}>격파 승리 보상</span>
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
          {/* 상단 타이머 및 관문 상태 */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#ffffff', padding: '16px 28px', borderRadius: '24px', border: '3px solid #fecdd3', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}>
            <div style={{ fontSize: '18px', fontWeight: '900', color: '#9f1239' }}>
              <span>👾 관문 ({currentIdx + 1} / 5)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#d97706', background: '#fef3c7', padding: '8px 20px', borderRadius: '20px', fontWeight: '900', fontSize: '18px' }}>
              <Timer size={22} />
              <span>{timeLeft}초 남음</span>
            </div>
          </div>

          {/* 👹 귀여운 보스 캐릭터 & 실시간 HP 체력바 스테이지 */}
          <div style={{ padding: '24px 32px', background: 'linear-gradient(135deg, #fff1f2 0%, #ffe4e6 100%)', borderRadius: '32px', border: '3px solid #fda4af', boxShadow: '0 15px 35px rgba(244, 63, 94, 0.15)', textAlign: 'center', position: 'relative' }}>
            {/* 귀여운 보스 캐릭터 (피격 시 쿵 이펙트) */}
            <div
              style={{
                fontSize: '88px',
                margin: '0 auto 8px',
                transition: 'transform 0.15s ease, filter 0.15s ease',
                transform: bossHitEffect ? 'scale(1.25) rotate(12deg)' : 'scale(1)',
                filter: bossHitEffect ? 'drop-shadow(0 0 25px #ef4444) brightness(1.2)' : 'drop-shadow(0 10px 20px rgba(0,0,0,0.15))'
              }}
            >
              {bossHp > 0 ? (bossHitEffect ? '😵' : '👾') : '💀'}
            </div>
            <h3 style={{ fontSize: '24px', fontWeight: '900', color: '#881337', margin: '0 0 12px' }}>대마왕 길이마왕 킹슬라임</h3>

            {/* 실시간 HP 체력바 */}
            <div style={{ maxWidth: '420px', margin: '0 auto', background: '#ffffff', padding: '6px', borderRadius: '20px', border: '2px solid #fecdd3', boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.1)' }}>
              <div style={{ height: '22px', background: 'linear-gradient(90deg, #ef4444, #f43f5e)', width: `${hpPercentage}%`, borderRadius: '16px', transition: 'width 0.4s ease-in-out', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', fontSize: '13px', fontWeight: '900' }}>
                {bossHp} / {MAX_BOSS_HP} HP
              </div>
            </div>
          </div>

          {/* 퀴즈 지문 및 4지선다 카드 */}
          <div style={{ padding: '36px 32px', textAlign: 'center', background: '#ffffff', border: '3px solid #e0e7ff', borderRadius: '32px', boxShadow: '0 20px 40px rgba(99, 102, 241, 0.12)' }}>
            <span style={{ background: '#ffe4e6', color: '#e11d48', padding: '6px 18px', borderRadius: '20px', fontSize: '15px', fontWeight: '900' }}>관문 {currentIdx + 1} 퀴즈 공격</span>
            <h1 style={{ fontSize: '38px', fontWeight: '900', color: '#1e1b4b', margin: '20px 0 28px' }}>{currentQ.questionText}</h1>

            {feedbackMsg && (
              <div style={{ padding: '12px 24px', borderRadius: '16px', background: feedbackMsg.isCorrect ? '#dcfce7' : '#ffe4e6', color: feedbackMsg.isCorrect ? '#15803d' : '#e11d48', fontWeight: '900', fontSize: '19px', marginBottom: '20px' }}>
                {feedbackMsg.text}
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
              {currentQ.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswerSelect(idx)}
                  style={{
                    padding: '22px 20px',
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
              <div style={{ fontSize: '80px', marginBottom: '12px' }}>🏆</div>
              <h1 style={{ fontSize: '34px', fontWeight: '900', color: '#15803d' }}>VICTORY! 보스 격파 성공!</h1>
              <p style={{ color: '#64748b', fontSize: '18px', margin: '12px 0 28px', fontWeight: '800' }}>
                축하합니다! 보스의 HP를 모두(5/5) 깎아 격파하여 <b>+300 골드</b> 상금과 승리 업적을 획득했습니다!
              </p>
            </div>
          ) : (
            <div>
              <div style={{ fontSize: '80px', marginBottom: '12px' }}>💀</div>
              <h1 style={{ fontSize: '32px', fontWeight: '900', color: '#b91c1c' }}>GAME OVER... 보스 공략 실패!</h1>
              <p style={{ color: '#64748b', fontSize: '18px', margin: '12px 0 28px', fontWeight: '800' }}>
                보스에게 <b>{correctCount}번의 타격</b>을 주었습니다. (남은 보스 HP: {bossHp})<br />
                보스를 무찌르려면 5문제를 모두 맞춰 HP를 0으로 깎아야 합니다. 미니게임에서 연습 후 다시 도전해 보세요!
              </p>
            </div>
          )}

          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', marginTop: '24px' }}>
            <button onClick={handleStartRaid} style={{ padding: '16px 28px', background: '#f1f5f9', color: '#1e293b', border: 'none', borderRadius: '18px', fontWeight: '900', fontSize: '17px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <RotateCcw size={18} /> 재도전하기 (100 골드)
            </button>
            <button onClick={onBackToLobby} style={{ padding: '16px 28px', background: '#4f46e5', color: '#ffffff', border: 'none', borderRadius: '18px', fontWeight: '900', fontSize: '17px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
              홈으로 돌아가기 <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
