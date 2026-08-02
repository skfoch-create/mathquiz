# 📏 초등 길이 단위(mm, cm, m, km) 변환 학습 게이미피케이션 앱

초등학교 3~4학년 수학 '길이와 시간 / 단위' 단원에서 배우는 **mm, cm, m, km** 단위 변환을 재미있는 20~30초 미니게임과 대마왕 레이드로 반복 학습하고, 명예의 전당 및 개인 성장 리포트로 학습 동기를 극대화하는 게이미피케이션 교수·학습 웹 애플리케이션입니다.

---

## 🎮 주요 기능

### 1. 👤 참여자 접속 방식 선택 (DUAL Mode)
* **간편 닉네임 접속 (익명)**: 별도의 회원가입 없이 이름/닉네임만 입력하여 빠르게 접속 (LocalStorage 기반).
* **Google 계정 로그인**: Firebase Google Auth로 로그인하여 기기가 바뀌어도 내 골드, 클리어 기록, 보스전 성과 그래프 연동.

### 2. 🕹️ 3가지 미니게임 (각 20~30초 제한)
* ⚡ **미니게임 1: 단위 변환 스피드 터치 (A타입 - 25초)**: 제시된 수치(예: `3,000 mm = ? m`)에 부합하는 정답 카드(`3 m`)를 빠르게 선택.
* ⚖️ **미니게임 2: 길이 비교 크기 대결 (B타입 - 25초)**: 지시어(더 긴 쪽 / 더 짧은 쪽)에 따라 좌우 수치(예: `2 m 50 cm` vs `2,400 mm`)를 순간적으로 비교하여 터치.
* 🎯 **미니게임 3: 단위 조합 타겟 게이지 (C타입 - 30초)**: 목표 길이(예: `1,500 m`)에 맞춰 길이 조각(`800 m`, `700 m`)을 선택하여 게이지 100% 채우기.

### 3. 👾 대마왕 길이마왕 보스 레이드 (Boss Raid)
* **입장 비용**: 100 Gold (미니게임 1~2회 클리어 시 획득 가능)
* **제한 시간**: 60초
* **출제 방식**: mm, cm, m, km 단위 변환 4지선다 객관식 5문항
* **승리 조건**: **5문항 완벽 승리 (5/5 정답)** 시 보스 퇴치 성공 및 +300 Gold & Confetti 폭죽 이펙트!

### 4. 🏆 명예의 전당 (Hall of Fame)
* **골드 다마스 TOP 10**: 최고 골드 보유자 10위 실시간 순위
* **미니게임 클리어 왕 TOP 10**: 미니게임 완수 횟수 상위 10위 실시간 순위

### 5. 📈 개인 성장 리포트 (Personal Analytics)
* **회차별 보스전 도전 히스토리 그래프**: 도전 회차(1회차, 2회차...)별 **정답 개수(0~5개)** 및 **완벽 승리/패배 상태**를 시각적 차트로 확인하며 실력 향상 파악.

---

## 🛠️ 기술 스택 (Tech Stack)

* **Frontend**: React, TypeScript, Vite, Modern CSS (Glassmorphism & Gamified Vibrant Animations)
* **Icons & Effects**: Lucide React Icons, Canvas Confetti
* **Backend & DB**: Firebase Auth (Google & Anonymous Auth) + Cloud Firestore
* **Deployment**: GitHub Repository + Vercel Ready

---

## 🚀 로컬 실행 방법

```bash
# 1. 패키지 설치
npm install

# 2. 로컬 개발 서버 실행
npm run dev

# 3. 프로덕션 빌드 테스트
npm run build
```

---

## 🌐 Firebase 연동 및 환경 변수 설정

프로젝트 루트에 `.env` 파일 생성 후 아래 항목을 본인의 Firebase 프로젝트 정보로 입력합니다:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

> 💡 **참고**: Firebase 환경 변수가 없어도 **하이브리드 로컬 스토리지 Fallback** 기능이 내장되어 있어 기본 플레이, 랭킹, 개인 차트가 100% 정상 작동합니다.

---

## 📤 GitHub 업로드 및 Vercel 배포 방법

### 1) GitHub 업로드
```bash
git init
git add .
git commit -m "feat: 초등 길이 단위 변환 게이미피케이션 학습 앱 완성"
git branch -M main
git remote add origin https://github.com/사용자이름/저장소이름.git
git push -u origin main
```

### 2) Vercel 배포
1. [Vercel Dashboard](https://vercel.com)에 로그인합니다.
2. **Add New Project** ➡️ Push한 GitHub 저장소를 선택합니다.
3. **Environment Variables** 항목에 위의 Firebase 환경 변수들을 등록합니다.
4. **Deploy** 버튼을 클릭하면 수초 내에 온라인에 자동 배포됩니다!
