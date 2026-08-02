import React, { useState, useEffect } from 'react';
import { Trophy, Coins, Award, Crown, RefreshCw } from 'lucide-react';
import { getLeaderboard } from '../services/dataService';
import type { LeaderboardEntry } from '../types';

export const LeaderboardView: React.FC = () => {
  const [tab, setTab] = useState<'gold' | 'clears'>('gold');
  const [topGold, setTopGold] = useState<LeaderboardEntry[]>([]);
  const [topClears, setTopClears] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRankings = async () => {
    setLoading(true);
    try {
      const data = await getLeaderboard();
      setTopGold(data.topGold);
      setTopClears(data.topClears);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRankings();
  }, []);

  const currentList = tab === 'gold' ? topGold : topClears;

  return (
    <div className="leaderboard-container animate-fade-in notranslate">
      <div className="leaderboard-header glass-card">
        <div className="header-title-box">
          <div className="trophy-badge animate-pulse">
            <Trophy size={32} className="text-yellow" />
          </div>
          <div>
            <h2>🏆 명예의 전당</h2>
            <p>단위 변환 마스터 도전자 TOP 10 순위입니다!</p>
          </div>
        </div>

        <button className="btn-refresh cute-btn" onClick={fetchRankings} disabled={loading}>
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          {loading ? '갱신 중...' : '순위 새로고침'}
        </button>
      </div>

      {/* 탭 분리 */}
      <div className="rank-tabs">
        <button
          className={`rank-tab-btn ${tab === 'gold' ? 'active' : ''}`}
          onClick={() => setTab('gold')}
        >
          <Coins size={18} className="text-yellow" />
          💰 골드 랭킹 TOP 10
        </button>
        <button
          className={`rank-tab-btn ${tab === 'clears' ? 'active' : ''}`}
          onClick={() => setTab('clears')}
        >
          <Award size={18} className="text-orange" />
          ⚡ 클리어 랭킹 TOP 10
        </button>
      </div>

      {/* 랭킹 목록 */}
      <div className="rank-list glass-card">
        {currentList.length === 0 ? (
          <div className="empty-rank">
            <p>아직 등록된 도전자가 없습니다. 제일 먼저 도전해 보세요!</p>
          </div>
        ) : (
          currentList.map((entry, index) => {
            const rank = index + 1;
            return (
              <div key={entry.uid || index} className={`rank-card rank-${rank <= 3 ? rank : 'normal'}`}>
                <div className="rank-left">
                  <div className="rank-number">
                    {rank === 1 && <Crown size={22} className="crown-gold" />}
                    {rank === 2 && <Crown size={20} className="crown-silver" />}
                    {rank === 3 && <Crown size={20} className="crown-bronze" />}
                    <span>{rank}위</span>
                  </div>

                  <div className="user-details">
                    <span className="user-name">{entry.displayName}</span>
                  </div>
                </div>

                <div className="rank-right">
                  {tab === 'gold' ? (
                    <div className="score-chip text-yellow">
                      <Coins size={16} />
                      <span>{entry.gold.toLocaleString()} 골드</span>
                    </div>
                  ) : (
                    <div className="score-chip text-green">
                      <span>{entry.totalMiniGameClears}회 클리어</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
