import React from 'react';
import { ArrowRight, Trophy, Swords, Zap, Scale, Target, Sparkles } from 'lucide-react';
import type { UserProfile } from '../types';

interface LobbyViewProps {
  user: UserProfile | null;
  onSelectTab: (tab: string) => void;
  onOpenAuth: () => void;
}

export const LobbyView: React.FC<LobbyViewProps> = ({ onSelectTab }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }} className="notranslate">
      {/* 서두 환영 배너 */}
      <div style={{ padding: '32px 24px', background: '#ffffff', borderRadius: '28px', border: '2px solid #e0e7ff', textAlign: 'center', boxShadow: '0 15px 35px -10px rgba(99, 102, 241, 0.12)' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '900', color: '#1e1b4b', marginBottom: '8px' }}>📏 초등 길이 단위 대탐험</h1>
        <p style={{ color: '#64748b', fontSize: '16px', fontWeight: '800' }}>신나는 미니게임에서 골드를 차곡차곡 모으고, 최종 대마왕 보스전에 도전해 보세요!</p>
      </div>

      {/* 미니게임 3종 카드 */}
      <div>
        <h2 style={{ fontSize: '20px', fontWeight: '900', color: '#334155', marginBottom: '14px' }}>🎮 미니게임 3종 선택하기</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '18px' }}>
          {/* Game 1 */}
          <div
            onClick={() => onSelectTab('game1')}
            style={{ padding: '24px', background: '#ffffff', borderRadius: '24px', border: '2px solid #e0e7ff', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '230px', cursor: 'pointer' }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <span style={{ background: '#e0e7ff', color: '#4338ca', padding: '5px 12px', borderRadius: '16px', fontSize: '13px', fontWeight: '800' }}>25초 퀴즈</span>
                <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: '#e0e7ff', color: '#4338ca', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Zap size={26} />
                </div>
              </div>
              <h3 style={{ fontSize: '22px', fontWeight: '900', color: '#0f172a', marginBottom: '6px' }}>⚡ 스피드탭</h3>
              <p style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.5' }}>제시된 수치와 똑같은 정답 카드를 순발력 있게 번개처럼 탭하세요!</p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '15px', fontWeight: '900', color: '#4f46e5', marginTop: '16px' }}>
              <span>게임 시작하기</span>
              <ArrowRight size={18} />
            </div>
          </div>

          {/* Game 2 */}
          <div
            onClick={() => onSelectTab('game2')}
            style={{ padding: '24px', background: '#ffffff', borderRadius: '24px', border: '2px solid #e0e7ff', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '230px', cursor: 'pointer' }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <span style={{ background: '#ffe4e6', color: '#e11d48', padding: '5px 12px', borderRadius: '16px', fontSize: '13px', fontWeight: '800' }}>25초 대결</span>
                <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: '#ffe4e6', color: '#e11d48', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Scale size={26} />
                </div>
              </div>
              <h3 style={{ fontSize: '22px', fontWeight: '900', color: '#0f172a', marginBottom: '6px' }}>⚖️ 길이비교</h3>
              <p style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.5' }}>더 긴 수치나 더 짧은 수치를 수치 감각으로 빠르게 비교하여 선택하세요!</p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '15px', fontWeight: '900', color: '#4f46e5', marginTop: '16px' }}>
              <span>게임 시작하기</span>
              <ArrowRight size={18} />
            </div>
          </div>

          {/* Game 3 */}
          <div
            onClick={() => onSelectTab('game3')}
            style={{ padding: '24px', background: '#ffffff', borderRadius: '24px', border: '2px solid #e0e7ff', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '230px', cursor: 'pointer' }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <span style={{ background: '#dcfce7', color: '#15803d', padding: '5px 12px', borderRadius: '16px', fontSize: '13px', fontWeight: '800' }}>30초 조준</span>
                <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: '#dcfce7', color: '#15803d', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Target size={26} />
                </div>
              </div>
              <h3 style={{ fontSize: '22px', fontWeight: '900', color: '#0f172a', marginBottom: '6px' }}>🎯 조각합체전</h3>
              <p style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.5' }}>수치 조각들을 모아서 목표 게이지 100%를 딱 맞추어 완성하세요!</p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '15px', fontWeight: '900', color: '#4f46e5', marginTop: '16px' }}>
              <span>게임 시작하기</span>
              <ArrowRight size={18} />
            </div>
          </div>
        </div>
      </div>

      {/* 보스전 도전 카드 */}
      <div
        onClick={() => onSelectTab('boss')}
        style={{ padding: '28px 36px', background: 'linear-gradient(135deg, #ffffff 0%, #fff1f2 100%)', border: '2px solid #fecdd3', borderRadius: '28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', boxShadow: '0 12px 30px -8px rgba(244, 63, 94, 0.15)', cursor: 'pointer' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ fontSize: '56px' }}>👹</div>
          <div>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '13px', fontWeight: '900', color: '#9f1239', background: '#ffe4e6', padding: '4px 12px', borderRadius: '14px', marginBottom: '6px' }}>
              <Sparkles size={14} /> 100 골드로 도전
            </span>
            <h2 style={{ fontSize: '24px', fontWeight: '900', color: '#881337', marginBottom: '4px' }}>👾 최종 대결! 대마왕 길이마왕 보스전</h2>
            <p style={{ fontSize: '14px', color: '#64748b' }}>60초 동안 4지선다 5문제를 모두 맞추어야 승리하는 최고 관문!</p>
          </div>
        </div>

        <button style={{ padding: '14px 28px', background: 'linear-gradient(135deg, #f43f5e, #e11d48)', color: '#ffffff', border: 'none', borderRadius: '18px', fontSize: '17px', fontWeight: '900', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 6px 18px rgba(244, 63, 94, 0.35)', whiteSpace: 'nowrap' }}>
          <Swords size={20} /> 보스전 도전하기
        </button>
      </div>

      {/* 명예의 전당 배너 */}
      <div
        onClick={() => onSelectTab('leaderboard')}
        style={{ padding: '24px 32px', background: '#ffffff', borderRadius: '24px', border: '2px solid #e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)', cursor: 'pointer' }}
      >
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '900', color: '#312e81' }}>🏆 명예의 전당 (골드 왕 & 클리어 왕 TOP 10)</h2>
          <p style={{ fontSize: '14px', color: '#64748b' }}>전국의 단위 변환 마스터 도전자들의 랭킹을 실시간으로 확인해 보세요!</p>
        </div>
        <Trophy size={32} style={{ color: '#f59e0b' }} />
      </div>
    </div>
  );
};
