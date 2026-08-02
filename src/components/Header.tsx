import React from 'react';
import { Trophy, ShieldAlert, Home, UserCheck, Gamepad2 } from 'lucide-react';
import type { UserProfile } from '../types';

interface HeaderProps {
  user: UserProfile | null;
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onOpenAuth: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, currentTab, onSelectTab, onOpenAuth }) => {
  return (
    <header className="main-header glass-nav">
      <div className="header-container">
        {/* 로고 */}
        <div className="logo-section" onClick={() => onSelectTab('lobby')}>
          <span className="logo-title">📏 길이 단위 대탐험</span>
        </div>

        {/* 통일된 탭 네이밍 */}
        <nav className="nav-menu">
          <button
            className={`nav-item ${currentTab === 'lobby' ? 'active' : ''}`}
            onClick={() => onSelectTab('lobby')}
          >
            <Home size={16} /> 로비
          </button>
          <button
            className={`nav-item ${currentTab === 'game1' ? 'active' : ''}`}
            onClick={() => onSelectTab('game1')}
          >
            ⚡ 스피드탭
          </button>
          <button
            className={`nav-item ${currentTab === 'game2' ? 'active' : ''}`}
            onClick={() => onSelectTab('game2')}
          >
            ⚖️ 길이비교
          </button>
          <button
            className={`nav-item ${currentTab === 'game3' ? 'active' : ''}`}
            onClick={() => onSelectTab('game3')}
          >
            🎯 조각합체전
          </button>
          <button
            className={`nav-item boss-nav ${currentTab === 'boss' ? 'active' : ''}`}
            onClick={() => onSelectTab('boss')}
          >
            <ShieldAlert size={16} /> 보스전
          </button>
          <button
            className={`nav-item ${currentTab === 'leaderboard' ? 'active' : ''}`}
            onClick={() => onSelectTab('leaderboard')}
          >
            <Trophy size={16} /> 명예의 전당
          </button>
        </nav>

        {/* 유저 상태 바 */}
        <div className="user-profile-bar">
          {user ? (
            <div className="user-info-chip">
              <div className="gold-badge">
                💰 {user.gold.toLocaleString()} 골드
              </div>
              <div className="user-name-tag" onClick={onOpenAuth} title="프로필 변경">
                <UserCheck size={15} />
                <span>{user.displayName}</span>
              </div>
            </div>
          ) : (
            <button className="btn-primary" onClick={onOpenAuth}>
              <Gamepad2 size={16} /> 접속하기
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
