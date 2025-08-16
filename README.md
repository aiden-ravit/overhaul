# Overhaul Admin System

**단일 Cloudflare Worker**에서 실행되는 Next.js + shadcn/ui 기반 어드민 시스템

## 🚀 특징

- ✅ **단일 Worker 배포** - 모든 것이 하나의 Cloudflare Worker에서 실행
- ✅ **GitHub 자동 배포** - main 브랜치에 푸시하면 자동 배포
- ✅ Next.js 14 (App Router) + TypeScript
- ✅ shadcn/ui 컴포넌트 시스템
- ✅ Tailwind CSS 스타일링
- ✅ D1 Database + KV Storage 연동 준비
- ✅ JWT 인증 환경 설정

## 🛠 개발 환경

```bash
# 의존성 설치
npm install

# Next.js 개발 서버
npm run dev

# Worker 로컬 미리보기
npm run worker:dev
```

- Next.js 개발: http://localhost:3000
- Worker 미리보기: http://localhost:8787

## 🚀 배포

### 자동 배포 (권장)
1. GitHub에 푸시하면 자동으로 배포됩니다
2. GitHub Actions가 빌드하고 Cloudflare Worker에 배포

### 수동 배포
```bash
# Worker용 빌드
npm run build:worker

# Worker 배포
npm run worker:deploy
```

## 📁 아키텍처

```
단일 Cloudflare Worker
├── 🌐 Frontend (Next.js SSR/SSG)
├── 🔌 API Routes (/api/*)
├── 🗄️ D1 Database
├── 💾 KV Storage
└── 🔐 JWT 인증
```

## 📝 페이지 구조

- `/` - 메인 페이지
- `/login` - 로그인 페이지 (완성)
- `/api/*` - API 라우트 (추가 가능)

## 🔧 기술 스택

- **Runtime**: Cloudflare Worker (Edge)
- **Frontend**: Next.js 14, React 18, TypeScript
- **UI**: shadcn/ui, Tailwind CSS, Lucide React
- **Database**: Cloudflare D1 + KV Storage
- **Auth**: JWT
- **CI/CD**: GitHub Actions
- **Package Manager**: npm

## ⚙️ 환경 설정

GitHub Secrets에 다음 값들을 설정해주세요:
- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

## 🔐 보안

- JWT 인증 토큰 설정 완료
- CORS 설정 완료
- 환경별 설정 분리 (dev/staging/prod)
