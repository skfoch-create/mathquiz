import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { AuthModal } from './components/AuthModal';
import { LobbyView } from './components/LobbyView';
import { MiniGame1 } from './components/MiniGame1';
import { MiniGame2 } from './components/MiniGame2';
import { MiniGame3 } from './components/MiniGame3';
import { BossRaidView } from './components/BossRaidView';
import { LeaderboardView } from './components/LeaderboardView';
import { getLocalUser, getOrCreateUser } from './services/dataService';
import type { UserProfile } from './types';

export const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [currentTab, setCurrentTab] = useState<string>('lobby');
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);

  useEffect(() => {
    const local = getLocalUser();
    if (local) {
      setUser(local);
    } else {
      const defaultUid = 'guest_' + Math.floor(Math.random() * 10000);
      getOrCreateUser(defaultUid, '수학 탐험가', 'anonymous').then((newUser) => {
        setUser(newUser);
      });
    }
  }, []);

  const handleUpdateUser = (updatedUser: UserProfile) => {
    setUser(updatedUser);
  };

  return (
    <div className="app-layout">
      {/* 상단 헤더 */}
      <Header
        user={user}
        currentTab={currentTab}
        onSelectTab={(tab) => setCurrentTab(tab)}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      {/* 메인 콘텐츠 영역 */}
      <main className="main-content">
        {currentTab === 'lobby' && (
          <LobbyView
            user={user}
            onSelectTab={(tab) => setCurrentTab(tab)}
            onOpenAuth={() => setIsAuthOpen(true)}
          />
        )}

        {currentTab === 'game1' && (
          <MiniGame1
            user={user}
            onUpdateUser={handleUpdateUser}
            onBackToLobby={() => setCurrentTab('lobby')}
          />
        )}

        {currentTab === 'game2' && (
          <MiniGame2
            user={user}
            onUpdateUser={handleUpdateUser}
            onBackToLobby={() => setCurrentTab('lobby')}
          />
        )}

        {currentTab === 'game3' && (
          <MiniGame3
            user={user}
            onUpdateUser={handleUpdateUser}
            onBackToLobby={() => setCurrentTab('lobby')}
          />
        )}

        {currentTab === 'boss' && (
          <BossRaidView
            user={user}
            onUpdateUser={handleUpdateUser}
            onBackToLobby={() => setCurrentTab('lobby')}
            onOpenAuth={() => setIsAuthOpen(true)}
          />
        )}

        {currentTab === 'leaderboard' && <LeaderboardView />}
      </main>

      {/* 접속 모드 선택 모달 */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={(newProfile) => setUser(newProfile)}
      />

      {/* 푸터 */}
      <footer className="main-footer">
        <p>© 2026 초등 수학 길이 단위(mm, cm, m, km) 변환 학습 게이미피케이션 앱</p>
      </footer>
    </div>
  );
};

export default App;
