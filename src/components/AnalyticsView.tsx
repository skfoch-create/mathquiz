import React, { useState, useEffect } from 'react';
import { LineChart, Calendar, CheckCircle2, XCircle, UserCheck } from 'lucide-react';
import { getBossRecords } from '../services/dataService';
import type { BossRecord, UserProfile } from '../types';

interface AnalyticsViewProps {
  user: UserProfile | null;
  onOpenAuth: () => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ user, onOpenAuth }) => {
  const [records, setRecords] = useState<BossRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setLoading(true);
      getBossRecords(user.uid).then((res) => {
        setRecords(res);
        setLoading(false);
      });
    }
  }, [user]);

  if (!user) {
    return (
      <div className="analytics-empty glass-card animate-fade-in">
        <LineChart size={48} className="text-yellow" />
        <h2>개인 도전 성장 리포트</h2>
        <p>로그인 후 보스 레이드에 도전하면 **회차별 정답 변화 곡선**을 확인하실 수 있습니다.</p>
        <button className="btn-primary shadow-btn" onClick={onOpenAuth}>
          <UserCheck size={18} /> 탐험가 로그인 / 접속하기
        </button>
      </div>
    );
  }

  const totalAttempts = records.length;
  const victoryCount = records.filter((r) => r.isVictory).length;
  const victoryRate = totalAttempts > 0 ? Math.round((victoryCount / totalAttempts) * 100) : 0;

  return (
    <div className="analytics-container animate-fade-in">
      <div className="analytics-header glass-card">
        <div className="title-box">
          <div className="chart-badge animate-pulse">
            <LineChart size={30} className="text-green" />
          </div>
          <div>
            <h2>📈 {user.displayName} 님의 보스전 성장 리포트</h2>
            <p>보스 레이드 도전 회차별 정답 개수(0~5개)와 완벽 승리 변화 과정입니다.</p>
          </div>
        </div>

        {/* 요약 통계 */}
        <div className="summary-stats">
          <div className="summary-card">
            <span className="label">총 보스 도전</span>
            <span className="value">{totalAttempts} 회</span>
          </div>
          <div className="summary-card highlight">
            <span className="label">완벽 승리(5/5)</span>
            <span className="value text-yellow">{victoryCount} 회</span>
          </div>
          <div className="summary-card">
            <span className="label">도전 성공률</span>
            <span className="value text-green">{victoryRate}%</span>
          </div>
        </div>
      </div>

      {/* 시각화 차트 (Canvas기반 반응형 회차 그래프) */}
      <div className="chart-card glass-card">
        <h3>📊 회차별 보스전 정답 개수 (0 ~ 5개) 변화 곡선</h3>

        {loading ? (
          <p className="loading-text">기록을 불러오는 중입니다...</p>
        ) : records.length === 0 ? (
          <div className="no-records">
            <p>아직 보스전 도전 기록이 없습니다!</p>
            <p className="sub">미니게임으로 골드를 모아 보스전 레이드에 도전해 보세요.</p>
          </div>
        ) : (
          <div className="custom-graph-area">
            {/* 시각적 바 차트 & 라인 그래프 트렌드 */}
            <div className="graph-bars">
              {records.map((r, idx) => {
                const heightPercent = (r.correctCount / 5) * 100;
                return (
                  <div key={r.id || idx} className="graph-bar-column">
                    <div className="bar-val-label">{r.correctCount} / 5</div>
                    <div className="bar-track">
                      <div
                        className={`bar-fill ${r.isVictory ? 'victory' : ''}`}
                        style={{ height: `${Math.max(10, heightPercent)}%` }}
                      >
                        {r.isVictory ? '👑' : ''}
                      </div>
                    </div>
                    <div className="bar-x-label">{r.attemptNumber}회차</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 회차별 상세 리스트 */}
      {records.length > 0 && (
        <div className="history-table-card glass-card">
          <h3>📋 도전 히스토리 상세</h3>
          <div className="history-list">
            {records.map((r) => (
              <div key={r.id} className="history-item">
                <div className="history-left">
                  <span className="attempt-badge">{r.attemptNumber}회차 도전</span>
                  <span className="date-text">
                    <Calendar size={14} /> {new Date(r.timestamp).toLocaleDateString()}
                  </span>
                </div>
                <div className="history-right">
                  <span className="correct-score">{r.correctCount} / 5 문항 정답</span>
                  {r.isVictory ? (
                    <span className="victory-badge text-yellow">
                      <CheckCircle2 size={16} /> 완벽 승리 (300 G)
                    </span>
                  ) : (
                    <span className="defeat-badge text-red">
                      <XCircle size={16} /> 도전 실패
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
