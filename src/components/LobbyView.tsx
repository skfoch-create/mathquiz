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
    <div className="clean-lobby animate-fade-in">
      {/* 서두 환영 배너 */}
      <div className="lobby-welcome phantom-card">
        <h1>📏 초등 길이 단위 대탐험</h1>
        <p>신나는 미니게임에서 골드를 차곡차곡 모으고, 최종 대마왕 보스전에 도전해 보세요!</p>
      </div>

      {/* 미니게임 3종 카드 */}
      <div className="lobby-section">
        <h2 className="section-title">🎮 미니게임 3종 선택하기</h2>
        <div className="minigame-3grid">
          {/* Game 1 */}
          <div className="mode-card phantom-card phantom-card-hover" onClick={() => onSelectTab('game1')}>
            <div className="card-top">
              <span className="mode-badge badge-a">25초 퀴즈</span>
              <div className="icon-circle icon-a">
                <Zap size={28} />
              </div>
            </div>
            <h3>⚡ 스피드탭</h3>
            <p>제시된 수치와 똑같은 정답 카드를 순발력 있게 번개처럼 탭하세요!</p>
            <div className="mode-footer">
              <span>게임 시작하기</span>
              <ArrowRight size={18} />
            </div>
          </div>

          {/* Game 2 */}
          <div className="mode-card phantom-card phantom-card-hover" onClick={() => onSelectTab('game2')}>
            <div className="card-top">
              <span className="mode-badge badge-b">25초 대결</span>
              <div className="icon-circle icon-b">
                <Scale size={28} />
              </div>
            </div>
            <h3>⚖️ 길이비교</h3>
            <p>더 긴 수치나 더 짧은 수치를 수치 감각으로 빠르게 비교하여 선택하세요!</p>
            <div className="mode-footer">
              <span>게임 시작하기</span>
              <ArrowRight size={18} />
            </div>
          </div>

          {/* Game 3 */}
          <div className="mode-card phantom-card phantom-card-hover" onClick={() => onSelectTab('game3')}>
            <div className="card-top">
              <span className="mode-badge badge-c">30초 조준</span>
              <div className="icon-circle icon-c">
                <Target size={28} />
              </div>
            </div>
            <h3>🎯 조각합체전</h3>
            <p>수치 조각들을 모아서 목표 게이지 100%를 딱 맞추어 완성하세요!</p>
            <div className="mode-footer">
              <span>게임 시작하기</span>
              <ArrowRight size={18} />
            </div>
          </div>
        </div>
      </div>

      {/* 보스전 도전 카드 */}
      <div className="boss-entry-wrapper">
        <div className="boss-card phantom-card phantom-card-hover" onClick={() => onSelectTab('boss')}>
          <div className="boss-card-left">
            <div className="boss-emoji">👹</div>
            <div>
              <span className="boss-tag">
                <Sparkles size={14} /> 100 골드로 도전
              </span>
              <h2>👾 최종 대결! 대마왕 길이마왕 보스전</h2>
              <p>60초 동안 4지선다 5문제를 모두 맞추어야 승리하는 최고 관문!</p>
            </div>
          </div>

          <button className="btn-boss-entry">
            <Swords size={20} /> 보스전 도전하기
          </button>
        </div>
      </div>

      {/* 명예의 전당 배너 */}
      <div className="hall-banner phantom-card phantom-card-hover" onClick={() => onSelectTab('leaderboard')}>
        <div>
          <h2>🏆 명예의 전당 (골드 왕 & 클리어 왕 TOP 10)</h2>
          <p>전국의 단위 변환 마스터 도전자들의 랭킹을 실시간으로 확인해 보세요!</p>
        </div>
        <Trophy size={32} className="text-yellow" style={{ color: '#f59e0b' }} />
      </div>
    </div>
  );
};
