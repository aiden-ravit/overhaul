# Overhaul Admin System

**분리형 아키텍처** - Cloudflare Worker (API) + Cloudflare Pages (Frontend) 기반 어드민 시스템

## 🚀 특징

- ✅ **분리형 배포** - Worker (API) + Pages (Frontend) 별도 배포
- ✅ **GitHub 자동 배포** - main 브랜치에 푸시하면 자동 배포
- ✅ Next.js 14 (App Router) + TypeScript
- ✅ shadcn/ui 컴포넌트 시스템
- ✅ Tailwind CSS 스타일링
- ✅ D1 Database + KV Storage 연동
- ✅ JWT 인증 시스템

## 🛠 개발 환경

```bash
# 의존성 설치
npm install

# Next.js 개발 서버 (프론트엔드)
npm run dev

# Worker 개발 서버 (API)
npm run dev:worker
```

- Frontend 개발: http://localhost:3000
- API 개발: http://localhost:8787

## 🚀 배포

### 자동 배포 (권장)
1. GitHub에 푸시하면 자동으로 배포됩니다
2. GitHub Actions가 Worker와 Pages를 순차적으로 배포

### 수동 배포
```bash
# Worker API 배포
npm run worker:deploy

# Pages 프론트엔드 배포
npm run pages:deploy
```

## 📁 아키텍처

```
Cloudflare Worker (API)          Cloudflare Pages (Frontend)
├── 🔌 API Routes (/api/*)      ├── 🌐 Next.js Static Site
├── 🗄️ D1 Database              ├── 🎨 shadcn/ui Components
├── 💾 KV Storage               ├── 💅 Tailwind CSS
├── 🔐 JWT 인증                 └── 📱 Responsive Design
└── 🛡️ CORS 설정
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
