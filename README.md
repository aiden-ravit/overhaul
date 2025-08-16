# Overhaul Admin System

**완전한 Dev/Prod 환경 분리** - Cloudflare Worker (API) + Cloudflare Pages (Frontend) 기반 어드민 시스템

## 🚀 특징

- ✅ **완전한 환경 분리** - Development/Production 독립 운영
- ✅ **브랜치별 자동 배포** - dev/main 브랜치 푸시 시 자동 배포
- ✅ **분리형 아키텍처** - Worker (API) + Pages (Frontend) 독립 배포
- ✅ Next.js 14 (App Router) + TypeScript
- ✅ shadcn/ui + Pretendard 웹폰트
- ✅ Tailwind CSS 스타일링
- ✅ D1 Database + KV Storage 연동
- ✅ JWT 인증 시스템

## 🌿 환경 구조

### **Git 브랜치**
```
├── main (Production)
└── dev (Development)
```

### **Worker API**
| 환경 | 브랜치 | API URL |
|------|--------|---------|
| **Production** | `main` | `overhaul-as-system-prod.ravit-cloud.workers.dev` |
| **Development** | `dev` | `overhaul-as-system.ravit-cloud.workers.dev` |

### **Pages Frontend**
| 환경 | 브랜치 | Frontend URL |
|------|--------|--------------|
| **Production** | `main` | `overhaul-frontend.pages.dev` |
| **Development** | `dev` | `overhaul-frontend-dev.pages.dev` |

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

## 🚀 배포 워크플로우

### **Development 배포**
```bash
git checkout dev
git add .
git commit -m "개발 변경사항"
git push origin dev
```
→ **Dev Worker** + **Dev Pages** 자동 배포

### **Production 배포**
```bash
git checkout main
git merge dev  # 또는 직접 main에서 작업
git push origin main
```
→ **Prod Worker** + **Prod Pages** 자동 배포

### **수동 배포**
```bash
# Worker API 배포 (환경별)
npx wrangler deploy                    # Development
npx wrangler deploy --env production   # Production

# Pages 프론트엔드 배포
npm run pages:deploy  # 현재 브랜치에 따라 자동 선택
```

## 📁 아키텍처

```
🌿 Git Branches
├── main → Production Environment
└── dev  → Development Environment
            ↓
🔧 Cloudflare Worker (API)      🌐 Cloudflare Pages (Frontend)
├── 🔌 RESTful API             ├── 🎨 Next.js Static Site
├── 🗄️ D1 Database             ├── 🎨 shadcn/ui Components  
├── 💾 KV Storage              ├── 🔤 Pretendard 웹폰트
├── 🔐 JWT 인증                ├── 💅 Tailwind CSS
├── 🛡️ CORS 설정              └── 📱 Responsive Design
└── 🌍 Environment 분리
```

## 📝 페이지 구조

- `/` - 메인 페이지 (Pretendard 폰트 적용)
- `/login` - 로그인 페이지 (실제 API 연동 완료)

## 🔧 API 엔드포인트

### **인증 API**
- `POST /api/auth/login` - 로그인
- `GET /api/auth/me` - 현재 사용자 정보

### **사용자 API**
- `GET /api/users` - 사용자 목록 (인증 필요)

### **시스템 API**
- `GET /api/health` - 서버 상태 확인

## 🧪 테스트 계정

```
이메일: admin@example.com
비밀번호: password
```

## 🔧 기술 스택

- **Runtime**: Cloudflare Worker (Edge)
- **Frontend**: Next.js 14, React 18, TypeScript
- **UI**: shadcn/ui, Tailwind CSS, Lucide React
- **Font**: Pretendard Variable 웹폰트
- **Database**: Cloudflare D1 + KV Storage
- **Auth**: JWT + Session Management
- **CI/CD**: GitHub Actions (브랜치별 자동 배포)
- **Package Manager**: npm

## ⚙️ 환경 설정

### **GitHub Secrets 설정**
리포지토리 Settings → Secrets에 다음 값들을 설정해주세요:
```
CLOUDFLARE_API_TOKEN: [Cloudflare API 토큰]
CLOUDFLARE_ACCOUNT_ID: [Cloudflare 계정 ID]
```

### **로컬 개발 환경**
```bash
# 1. 리포지토리 클론
git clone https://github.com/aiden-ravit/overhaul.git
cd overhaul

# 2. 개발 브랜치로 체크아웃
git checkout dev

# 3. 의존성 설치
npm install

# 4. 개발 서버 실행
npm run dev        # Frontend (http://localhost:3000)
npm run dev:worker # API (http://localhost:8787)
```

## 🔐 보안

- ✅ JWT 인증 토큰 시스템
- ✅ KV Storage 세션 관리 (24시간 만료)
- ✅ CORS 설정 완료
- ✅ 환경별 설정 분리 (development/production)
- ✅ API 인증 미들웨어
- ✅ TypeScript 타입 안전성

## 🚀 다음 단계

1. **대시보드 페이지** 추가
2. **사용자 관리** 기능 구현
3. **D1 데이터베이스 스키마** 설계
4. **실제 JWT 라이브러리** 적용
5. **로그 시스템** 구축
