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
    <header className="main-header">
      <div className="header-container">
        <div className="logo-section" onClick={() => onSelectTab('lobby')}>
          <div className="logo-icon-badge">
            <Sparkles size={22} className="text-indigo" style={{ color: '#4f46e5' }} />
          </div>
          <span className="logo-title">길이 단위 대탐험</span>
        </div>

        <nav className="nav-menu">
          <button
            className={`nav-item ${currentTab === 'lobby' ? 'active' : ''}`}
            onClick={() => onSelectTab('lobby')}
          >
            <Home size={17} /> 로비
          </button>
          <button
            className={`nav-item ${currentTab === 'game1' ? 'active' : ''}`}
            onClick={() => onSelectTab('game1')}
          >
            <Zap size={17} /> 스피드탭
          </button>
          <button
            className={`nav-item ${currentTab === 'game2' ? 'active' : ''}`}
            onClick={() => onSelectTab('game2')}
          >
            <Scale size={17} /> 길이비교
          </button>
          <button
            className={`nav-item ${currentTab === 'game3' ? 'active' : ''}`}
            onClick={() => onSelectTab('game3')}
          >
            <Target size={17} /> 조각합체전
          </button>
          <button
            className={`nav-item boss-nav ${currentTab === 'boss' ? 'active' : ''}`}
            onClick={() => onSelectTab('boss')}
          >
            <Swords size={17} /> 보스전
          </button>
          <button
            className={`nav-item ${currentTab === 'leaderboard' ? 'active' : ''}`}
            onClick={() => onSelectTab('leaderboard')}
          >
            <Trophy size={17} /> 명예의 전당
          </button>
        </nav>

        <div className="user-profile-bar">
          {user ? (
            <div className="user-info-chip">
              <div className="gold-badge">
                💰 {user.gold.toLocaleString()} 골드
              </div>
              <div className="user-name-tag" onClick={onOpenAuth} title="프로필 변경">
                <UserCheck size={16} /> {user.displayName}
              </div>
            </div>
          ) : (
            <button className="nav-item active" onClick={onOpenAuth}>
              로그인 / 등록
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
