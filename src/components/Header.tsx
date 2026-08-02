import React from 'react';
import { Sparkles, Zap, Scale, Target, Swords, Trophy, UserCheck, Home } from 'lucide-react';
import type { UserProfile } from '../types';

interface HeaderProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  user: UserProfile | null;
  onOpenAuth: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentTab, onSelectTab, user, onOpenAuth }) => {
  return (
    <header style={{ position: 'sticky', top: '12px', zIndex: 100, maxWidth: '1040px', width: 'calc(100% - 32px)', margin: '0 auto 24px', borderRadius: '24px', padding: '12px 24px', background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(16px)', border: '2px solid #e0e7ff', boxShadow: '0 12px 30px -10px rgba(79, 70, 229, 0.15)' }} className="notranslate">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => onSelectTab('lobby')}>
          <div style={{ width: '40px', height: '40px', borderRadius: '14px', background: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Sparkles size={20} style={{ color: '#4f46e5' }} />
          </div>
          <span style={{ fontWeight: 900, fontSize: '20px', color: '#1e1b4b' }}>길이 단위 대탐험</span>
        </div>

        <nav style={{ display: 'flex', gap: '6px', background: '#f1f5f9', padding: '5px', borderRadius: '18px' }}>
          <button
            onClick={() => onSelectTab('lobby')}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', border: 'none', background: currentTab === 'lobby' ? '#4f46e5' : 'transparent', color: currentTab === 'lobby' ? '#ffffff' : '#64748b', fontWeight: 800, fontSize: '14px', borderRadius: '14px', cursor: 'pointer' }}
          >
            <Home size={16} /> 로비
          </button>
          <button
            onClick={() => onSelectTab('game1')}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', border: 'none', background: currentTab === 'game1' ? '#4f46e5' : 'transparent', color: currentTab === 'game1' ? '#ffffff' : '#64748b', fontWeight: 800, fontSize: '14px', borderRadius: '14px', cursor: 'pointer' }}
          >
            <Zap size={16} /> 스피드탭
          </button>
          <button
            onClick={() => onSelectTab('game2')}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', border: 'none', background: currentTab === 'game2' ? '#4f46e5' : 'transparent', color: currentTab === 'game2' ? '#ffffff' : '#64748b', fontWeight: 800, fontSize: '14px', borderRadius: '14px', cursor: 'pointer' }}
          >
            <Scale size={16} /> 길이비교
          </button>
          <button
            onClick={() => onSelectTab('game3')}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', border: 'none', background: currentTab === 'game3' ? '#4f46e5' : 'transparent', color: currentTab === 'game3' ? '#ffffff' : '#64748b', fontWeight: 800, fontSize: '14px', borderRadius: '14px', cursor: 'pointer' }}
          >
            <Target size={16} /> 조각합체전
          </button>
          <button
            onClick={() => onSelectTab('boss')}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', border: 'none', background: currentTab === 'boss' ? 'linear-gradient(135deg, #f43f5e, #e11d48)' : 'transparent', color: currentTab === 'boss' ? '#ffffff' : '#64748b', fontWeight: 800, fontSize: '14px', borderRadius: '14px', cursor: 'pointer' }}
          >
            <Swords size={16} /> 보스전
          </button>
          <button
            onClick={() => onSelectTab('leaderboard')}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', border: 'none', background: currentTab === 'leaderboard' ? '#4f46e5' : 'transparent', color: currentTab === 'leaderboard' ? '#ffffff' : '#64748b', fontWeight: 800, fontSize: '14px', borderRadius: '14px', cursor: 'pointer' }}
          >
            <Trophy size={16} /> 명예의 전당
          </button>
        </nav>

        <div>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '6px 16px', borderRadius: '30px', background: '#ffffff', border: '2px solid #e0e7ff' }}>
              <div style={{ fontWeight: 900, fontSize: '15px', color: '#d97706', background: '#fef3c7', padding: '4px 10px', borderRadius: '14px' }}>
                💰 {user.gold.toLocaleString()} 골드
              </div>
              <div style={{ fontWeight: 800, fontSize: '14px', color: '#0f172a', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }} onClick={onOpenAuth}>
                <UserCheck size={15} /> {user.displayName}
              </div>
            </div>
          ) : (
            <button onClick={onOpenAuth} style={{ padding: '10px 18px', background: '#4f46e5', color: '#ffffff', border: 'none', borderRadius: '16px', fontWeight: 800, fontSize: '14px', cursor: 'pointer' }}>
              로그인 / 등록
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
