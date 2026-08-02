import React, { useState } from 'react';
import { User, LogIn, Sparkles } from 'lucide-react';
import { isFirebaseConfigured, auth, googleProvider, signInWithPopup, signInAnonymously } from '../firebase';
import { getOrCreateUser } from '../services/dataService';
import type { UserProfile } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [nickname, setNickname] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'anonymous' | 'google'>('anonymous');

  if (!isOpen) return null;

  // 1. 간편 익명 접속 (닉네임만 입력)
  const handleAnonymousSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim()) return;

    setLoading(true);
    try {
      let uid = 'anon_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
      if (isFirebaseConfigured && auth) {
        const cred = await signInAnonymously(auth);
        uid = cred.user.uid;
      }
      const user = await getOrCreateUser(uid, nickname.trim(), 'anonymous');
      onLoginSuccess(user);
      onClose();
    } catch (err) {
      console.error(err);
      alert('접속 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 2. Google 계정 로그인
  const handleGoogleLogin = async () => {
    if (!isFirebaseConfigured || !auth) {
      // Firebase Env 설정이 없으면 테스트용 모의 구글 로그인 처리
      const dummyUid = 'google_user_' + Date.now();
      const user = await getOrCreateUser(dummyUid, '구글 탐험가', 'google');
      onLoginSuccess(user);
      onClose();
      return;
    }

    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = await getOrCreateUser(result.user.uid, result.user.displayName || '구글 학생', 'google');
      onLoginSuccess(user);
      onClose();
    } catch (err) {
      console.error(err);
      alert('Google 로그인에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content glass-card animate-pop">
        <div className="modal-header">
          <div className="badge-icon">
            <Sparkles className="text-yellow" size={28} />
          </div>
          <h2>탐험가 프로필 설정</h2>
          <p className="subtitle">원하는 접속 방식을 선택하세요!</p>
        </div>

        <div className="tab-buttons">
          <button
            className={`tab-btn ${mode === 'anonymous' ? 'active' : ''}`}
            onClick={() => setMode('anonymous')}
          >
            ⚡ 간편 닉네임 접속
          </button>
          <button
            className={`tab-btn ${mode === 'google' ? 'active' : ''}`}
            onClick={() => setMode('google')}
          >
            🌐 Google 계정 로그인
          </button>
        </div>

        {mode === 'anonymous' ? (
          <form onSubmit={handleAnonymousSubmit} className="auth-form">
            <div className="input-group">
              <label>학생 닉네임 / 이름</label>
              <div className="input-wrapper">
                <User size={20} className="input-icon" />
                <input
                  type="text"
                  placeholder="예: 3학년1반김길이"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  maxLength={12}
                  required
                />
              </div>
              <span className="hint">별도의 비밀번호 없이 이름만으로 빠르게 탐험을 시작합니다.</span>
            </div>

            <button type="submit" className="btn-primary full-width shadow-btn" disabled={loading}>
              {loading ? '접속 중...' : '🎮 게임 시작하기'}
            </button>
          </form>
        ) : (
          <div className="google-auth-box">
            <p className="desc">
              Google 계정으로 로그인하면 기기가 바뀌어도 <br />
              <b>모은 골드, 클리어 기록, 보스전 성장 그래프</b>가 연동됩니다!
            </p>
            <button
              onClick={handleGoogleLogin}
              className="btn-google full-width shadow-btn"
              disabled={loading}
            >
              <LogIn size={20} />
              {loading ? '구글 로그인 중...' : 'Google 계정으로 계속하기'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
