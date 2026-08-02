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
      {/* 심플한 환영 제목 */}
      <div className="lobby-welcome glass-card">
        <h1>📏 초등 길이 단위 대탐험</h1>
        <p>미니게임에서 골드를 신나게 모으고, 최종 대마왕 보스를 무찔러 보세요!</p>
      </div>

      {/* 1. 미니게임 3개 가로로 나란히 배열 (3열) */}
      <div className="lobby-section">
        <h2 className="section-title">🎮 20~30초 미니게임 3종</h2>
        <div className="minigame-3grid">
          {/* Game 1 */}
          <div className="mode-card glass-card hover-card" onClick={() => onSelectTab('game1')}>
            <div className="card-top">
              <span className="mode-badge badge-a">25초 퀴즈</span>
              <div className="icon-circle icon-a">
                <Zap size={28} />
              </div>
            </div>
            <h3>⚡ 번개 손가락! 단위 팡팡</h3>
            <p>제시된 길이 수치와 똑같은 정답 카드를 빠르게 터치하세요!</p>
            <div className="mode-footer">
              <span>게임 시작</span>
              <ArrowRight size={16} />
            </div>
          </div>

          {/* Game 2 */}
          <div className="mode-card glass-card hover-card" onClick={() => onSelectTab('game2')}>
            <div className="card-top">
              <span className="mode-badge badge-b">25초 대결</span>
              <div className="icon-circle icon-b">
                <Scale size={28} />
              </div>
            </div>
            <h3>⚖️ 누가 더 길까? 길이 쿵쿵</h3>
            <p>더 긴 길이 수치나 더 짧은 수치를 순발력 있게 고르세요!</p>
            <div className="mode-footer">
              <span>게임 시작</span>
              <ArrowRight size={16} />
            </div>
          </div>

          {/* Game 3 */}
          <div className="mode-card glass-card hover-card" onClick={() => onSelectTab('game3')}>
            <div className="card-top">
              <span className="mode-badge badge-c">30초 조준</span>
              <div className="icon-circle icon-c">
                <Target size={28} />
              </div>
            </div>
            <h3>🎯 딱 맞춰라! 조각 합체</h3>
            <p>수치 조각들을 착착 모아서 목표 게이지 100%를 만드세요!</p>
            <div className="mode-footer">
              <span>게임 시작</span>
              <ArrowRight size={16} />
            </div>
          </div>
        </div>
      </div>

      {/* 2. 미니게임 나란히 3개 바로 아래 배열된 큼직한 보스전 카운터 카드 */}
      <div className="boss-entry-wrapper">
        <div className="boss-card glass-card hover-card" onClick={() => onSelectTab('boss')}>
          <div className="boss-card-left">
            <div className="boss-emoji">👹</div>
            <div>
              <span className="boss-tag">
                <Sparkles size={14} /> 100 Gold로 도전
              </span>
              <h2>👾 최종 대결! 대마왕 길이마왕 보스전</h2>
              <p>60초 동안 4지선다 5문제를 모두 맞추어야 승리하는 퀴즈 보스 관문!</p>
            </div>
          </div>

          <button className="btn-boss-entry shadow-btn">
            <Swords size={20} /> 보스에게 도전하기
          </button>
        </div>
      </div>

      {/* 3. 하단 명예의 전당 배너 */}
      <div className="hall-banner glass-card" onClick={() => onSelectTab('leaderboard')}>
        <div>
          <h2>🏆 명예의 전당 (골드 왕 & 클리어 왕 TOP 10)</h2>
          <p>전국의 단위 변환 마스터 랭킹을 실시간으로 확인해 보세요!</p>
        </div>
        <Trophy size={28} className="text-yellow" />
      </div>
    </div>
  );
};
