import React, { useState, useEffect } from 'react';
import { Trophy, Zap, Coins, RefreshCw, Flame } from 'lucide-react';
import { getLeaderboard } from '../services/dataService';
import type { LeaderboardEntry } from '../types';

export const LeaderboardView: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'gold' | 'clears' | 'speed'>('speed');
  const [leaderboardData, setLeaderboardData] = useState<{
    topGold: LeaderboardEntry[];
    topClears: LeaderboardEntry[];
    topBossSpeed: LeaderboardEntry[];
  }>({ topGold: [], topClears: [], topBossSpeed: [] });
  const [loading, setLoading] = useState(true);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const res = await getLeaderboard();
      setLeaderboardData(res);
    } catch (e) {
      console.warn('Failed to load leaderboard', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const getRankBadge = (rank: number) => {
    if (rank === 1) return <span style={{ fontSize: '24px' }}>🥇 1위</span>;
    if (rank === 2) return <span style={{ fontSize: '24px' }}>🥈 2위</span>;
    if (rank === 3) return <span style={{ fontSize: '24px' }}>🥉 3위</span>;
    return <span style={{ fontWeight: '900', color: '#64748b', fontSize: '18px' }}>{rank}위</span>;
  };

  const getActiveList = () => {
    if (activeCategory === 'speed') return leaderboardData.topBossSpeed;
    if (activeCategory === 'gold') return leaderboardData.topGold;
    return leaderboardData.topClears;
  };

  const currentList = getActiveList();

  return (
    <div className="leaderboard-container notranslate" style={{ maxWidth: '840px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ padding: '32px 36px', background: '#ffffff', borderRadius: '32px', border: '3px solid #e0e7ff', boxShadow: '0 15px 35px rgba(99, 102, 241, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <span style={{ background: '#e0e7ff', color: '#4338ca', padding: '6px 16px', borderRadius: '20px', fontSize: '14px', fontWeight: '900' }}>🏆 실시간 영예</span>
          <h2 style={{ fontSize: '32px', fontWeight: '900', color: '#1e1b4b', margin: '8px 0 4px' }}>전국 수학 탐험가 명예의 전당</h2>
          <p style={{ fontSize: '15px', color: '#64748b', margin: 0, fontWeight: '800' }}>최단 보스 격파 스피드, 획득한 골드, 미니게임 클리어 수 3대 랭킹!</p>
        </div>
        <button onClick={fetchLeaderboard} style={{ padding: '12px 20px', background: '#f1f5f9', color: '#1e293b', border: 'none', borderRadius: '16px', fontWeight: '800', fontSize: '15px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <RefreshCw size={16} /> 순위 새로고침
        </button>
      </div>

      {/* 3대 랭킹 카테고리 탭 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
        <button
          onClick={() => setActiveCategory('speed')}
          style={{
            padding: '16px',
            borderRadius: '20px',
            border: activeCategory === 'speed' ? '3px solid #f43f5e' : '2px solid #e2e8f0',
            background: activeCategory === 'speed' ? 'linear-gradient(135deg, #fff1f2, #ffe4e6)' : '#ffffff',
            color: activeCategory === 'speed' ? '#881337' : '#64748b',
            fontWeight: '900',
            fontSize: '16px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          <Flame size={20} style={{ color: '#f43f5e' }} /> ⚡ 보스 최단 클리어
        </button>

        <button
          onClick={() => setActiveCategory('gold')}
          style={{
            padding: '16px',
            borderRadius: '20px',
            border: activeCategory === 'gold' ? '3px solid #f59e0b' : '2px solid #e2e8f0',
            background: activeCategory === 'gold' ? '#fef3c7' : '#ffffff',
            color: activeCategory === 'gold' ? '#92400e' : '#64748b',
            fontWeight: '900',
            fontSize: '16px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          <Coins size={20} style={{ color: '#d97706' }} /> 💰 골드 부자 랭킹
        </button>

        <button
          onClick={() => setActiveCategory('clears')}
          style={{
            padding: '16px',
            borderRadius: '20px',
            border: activeCategory === 'clears' ? '3px solid #6366f1' : '2px solid #e2e8f0',
            background: activeCategory === 'clears' ? '#e0e7ff' : '#ffffff',
            color: activeCategory === 'clears' ? '#3730a3' : '#64748b',
            fontWeight: '900',
            fontSize: '16px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          <Zap size={20} style={{ color: '#4f46e5' }} /> 🎮 게임왕 랭킹
        </button>
      </div>

      {/* 랭킹 리스트 */}
      <div style={{ background: '#ffffff', borderRadius: '32px', border: '3px solid #e0e7ff', padding: '24px', boxShadow: '0 15px 35px rgba(0,0,0,0.05)' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '48px', color: '#64748b', fontWeight: '800', fontSize: '18px' }}>⚡ 순위를 실시간 불러오는 중...</div>
        ) : currentList.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px', color: '#64748b', fontWeight: '800', fontSize: '18px' }}>
            {activeCategory === 'speed' ? '⚡ 보스를 최단 시간 안에 격파하고 1위 전당에 이름을 올리세요!' : '아직 랭킹에 등록된 도전자가 없습니다. 첫 번째 영웅이 되어보세요!'}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {currentList.map((entry, idx) => (
              <div
                key={entry.uid || idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '18px 24px',
                  borderRadius: '20px',
                  background: idx === 0 ? 'linear-gradient(135deg, #fef3c7, #fde68a)' : idx === 1 ? '#f1f5f9' : idx === 2 ? '#fff7ed' : '#ffffff',
                  border: idx === 0 ? '2px solid #f59e0b' : '2px solid #e2e8f0',
                  boxShadow: idx === 0 ? '0 8px 20px rgba(245, 158, 11, 0.2)' : 'none'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <div style={{ minWidth: '70px' }}>{getRankBadge(idx + 1)}</div>
                  <div>
                    <div style={{ fontSize: '18px', fontWeight: '900', color: '#0f172a' }}>{entry.displayName}</div>
                    <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '800', marginTop: '2px' }}>
                      보스 승리: <b>{entry.bossVictories}회</b> | 게임 클리어: <b>{entry.totalMiniGameClears}회</b>
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  {activeCategory === 'speed' ? (
                    <div style={{ fontSize: '22px', fontWeight: '900', color: '#e11d48', background: '#ffe4e6', padding: '6px 16px', borderRadius: '16px' }}>
                      ⚡ {entry.fastestBossClearTime} 초 만에 클리어!
                    </div>
                  ) : activeCategory === 'gold' ? (
                    <div style={{ fontSize: '22px', fontWeight: '900', color: '#d97706' }}>
                      💰 {entry.gold.toLocaleString()} 골드
                    </div>
                  ) : (
                    <div style={{ fontSize: '22px', fontWeight: '900', color: '#4f46e5' }}>
                      🎮 {entry.totalMiniGameClears} 회
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
