# Overhaul Admin System

**완전한 Dev/Prod 환경 분리** - Cloudflare Worker (API) + Cloudflare Pages (Frontend) 기반 어드민 시스템

## 🚀 특징

- ✅ **완전한 환경 분리** - Development/Production 독립 운영 
- ✅ **일관된 네이밍 컨벤션** - 모든 리소스 `-dev`/`-prod` 접미사 적용
- ✅ **브랜치별 자동 배포** - dev/main 브랜치 푸시 시 자동 배포
- ✅ **분리형 아키텍처** - Worker (API) + Pages (Frontend) 독립 배포
- ✅ **자동 환경 설정** - API URL 브랜치별 자동 주입
- ✅ Next.js 14 (App Router) + TypeScript
- ✅ shadcn/ui + Pretendard 웹폰트
- ✅ Tailwind CSS 스타일링
- ✅ D1 Database + KV Storage 연동
- ✅ JWT 인증 시스템

## 🌿 완전한 환경 분리

### **Git 브랜치 전략**
```
├── main → Production Environment (-prod)
└── dev  → Development Environment (-dev)
```

### **Cloudflare 리소스 매핑**

| 리소스 유형 | Development (`dev` 브랜치) | Production (`main` 브랜치) |
|-------------|---------------------------|---------------------------|
| **Worker** | `overhaul-as-system-dev` | `overhaul-as-system-prod` |
| **Pages** | `overhaul-frontend-dev` | `overhaul-frontend-prod` |
| **D1 Database** | `overhaul-as-system-dev` | `overhaul-as-system-prod` |
| **KV Namespace** | `overhaul-as-system-dev` | `overhaul-as-system-prod` |

### **API & Frontend URLs**

| 환경 | API URL | Frontend URL |
|------|---------|--------------|
| **Development** | [`overhaul-as-system-dev.ravit-cloud.workers.dev`](https://overhaul-as-system-dev.ravit-cloud.workers.dev) | [`overhaul-frontend-dev.pages.dev`](https://overhaul-frontend-dev.pages.dev) |
| **Production** | [`overhaul-as-system-prod.ravit-cloud.workers.dev`](https://overhaul-as-system-prod.ravit-cloud.workers.dev) | [`overhaul-frontend-prod.pages.dev`](https://overhaul-frontend-prod.pages.dev) |

## 🛠 개발 환경

```bash
# 의존성 설치
npm install

# Next.js 개발 서버 (프론트엔드)
npm run dev

# Worker 개발 서버 (API)
npm run dev:worker
```

- **Frontend 개발**: http://localhost:3000
- **API 개발**: http://localhost:8787

## 🚀 자동 배포 워크플로우

### **Development 배포**
```bash
git checkout dev
git add .
git commit -m "개발 변경사항"
git push origin dev
```
→ **자동 배포**: `overhaul-as-system-dev` + `overhaul-frontend-dev`

### **Production 배포**
```bash
git checkout main
git merge dev
git push origin main
```
→ **자동 배포**: `overhaul-as-system-prod` + `overhaul-frontend-prod`

### **수동 배포**
```bash
# Worker API 배포 (환경별)
npx wrangler deploy                    # Development
npx wrangler deploy --env production   # Production

# Pages 프론트엔드 배포
npm run pages:deploy  # 현재 브랜치에 따라 자동 선택
```

## 📁 시스템 아키텍처

```
🌿 Git Branches
├── main → Production Environment (-prod suffix)
└── dev  → Development Environment (-dev suffix)
            ↓
🔧 Cloudflare Worker (API)       🌐 Cloudflare Pages (Frontend)
├── 🔌 RESTful API              ├── 🎨 Next.js Static Site
├── 🗄️ D1 Database (분리)        ├── 🎨 shadcn/ui Components  
├── 💾 KV Storage (분리)         ├── 🔤 Pretendard 웹폰트
├── 🔐 JWT 인증                  ├── 💅 Tailwind CSS
├── 🛡️ CORS 설정               ├── 🌐 자동 API URL 설정
├── 🌍 Environment 완전 분리     └── 📱 Responsive Design
└── 📊 Health Check API
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

## 🗄️ 데이터베이스 구조

### **D1 SQLite 스키마**
```sql
-- 등급 테이블
CREATE TABLE roles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,        -- 등급명
    is_active BOOLEAN NOT NULL DEFAULT 1,
    created_at DATETIME NOT NULL DEFAULT (datetime('now', 'utc'))
);

-- 사용자 테이블  
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,    -- 로그인 아이디
    password_hash TEXT NOT NULL,      -- SHA-256 해시된 비밀번호
    name TEXT NOT NULL,               -- 이름
    role_name TEXT NOT NULL,          -- 등급 (roles 테이블 참조)
    is_active BOOLEAN NOT NULL DEFAULT 1,
    created_at DATETIME NOT NULL DEFAULT (datetime('now', 'utc')),
    FOREIGN KEY (role_name) REFERENCES roles(name)
);
```

### **마이그레이션 시스템**
```bash
# 개발 환경 마이그레이션
npm run db:migrate:dev

# 운영 환경 마이그레이션  
npm run db:migrate:prod

# 스키마 직접 실행 (개발용)
npm run db:schema

# 시드 데이터 직접 실행 (개발용)
npm run db:seed
```

## 🧪 테스트 계정

```
아이디: admin
비밀번호: qwe123!
등급: 관리자
```

## 🔧 기술 스택

- **Runtime**: Cloudflare Worker (Edge)
- **Frontend**: Next.js 14, React 18, TypeScript
- **UI**: shadcn/ui, Tailwind CSS, Lucide React
- **Font**: Pretendard Variable 웹폰트
- **Database**: Cloudflare D1 (환경별 분리)
- **Storage**: Cloudflare KV (환경별 분리)
- **Auth**: JWT + Session Management
- **CI/CD**: GitHub Actions (브랜치별 자동 배포)
- **Package Manager**: npm

## ⚙️ 환경 설정

### **중앙화된 도메인 관리** 🔗
모든 환경별 도메인은 `config/environments.ts`에서 중앙 관리됩니다:

```typescript
// config/environments.ts
export const environments = {
  local: { API_BASE_URL: 'http://localhost:8787' },
  development: { API_BASE_URL: 'https://overhaul-as-system-dev.ravit-cloud.workers.dev' },
  production: { API_BASE_URL: 'https://overhaul-as-system-prod.ravit-cloud.workers.dev' },
};
```

📖 **상세 가이드**: [`docs/DOMAINS.md`](./docs/DOMAINS.md)

### **커밋 메시지 가이드라인** ⚠️
**중요**: Cloudflare Pages UTF-8 오류 방지를 위해 **영어만** 사용하세요!

```bash
# ✅ Good
git commit -m "feat: Add user activity logging system"

# ❌ Bad (causes deployment failure)
git commit -m "feat: 사용자 로그 시스템 추가"
```

📖 **상세 가이드**: [`docs/COMMIT_GUIDELINES.md`](./docs/COMMIT_GUIDELINES.md)

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

## 🗄️ 리소스 현황

### **Cloudflare Workers**
- Development: `overhaul-as-system-dev.ravit-cloud.workers.dev`
- Production: `overhaul-as-system-prod.ravit-cloud.workers.dev`

### **Cloudflare Pages**  
- Development: `overhaul-frontend-dev.pages.dev`
- Production: `overhaul-frontend-prod.pages.dev`

### **D1 Databases**
- Development: `overhaul-as-system-dev` (b5551a70-a4b2-42cb-884e-5974ae02dfa0)
- Production: `overhaul-as-system-prod` (dc5ffafb-7ccb-468d-8385-aae677ff7ef3)

### **KV Namespaces**
- Development: `overhaul-as-system-dev` (22bca6b540fc46269d3a3da5896fb1a2)
- Production: `overhaul-as-system-prod` (3dd5ac59f76e45c6a8982cf77d9c2328)

## 🔐 보안

- ✅ **실제 데이터베이스 인증**: D1 SQLite 기반 사용자 관리
- ✅ **비밀번호 해싱**: SHA-256 + 솔트를 통한 안전한 비밀번호 저장
- ✅ **JWT 인증 토큰 시스템**: 세션 기반 인증
- ✅ **KV Storage 세션 관리**: 24시간 자동 만료
- ✅ **역할 기반 접근 제어**: 등급별 권한 관리
- ✅ **CORS 설정 완료**: 안전한 도메인 간 요청
- ✅ **환경별 설정 완전 분리**: development/production
- ✅ **API 인증 미들웨어**: 토큰 검증 및 권한 확인
- ✅ **TypeScript 타입 안전성**: 컴파일 타임 오류 방지
- ✅ **환경별 독립적인 데이터베이스**: dev/prod 완전 격리

## 🛡️ 환경 격리 보장

### **완전한 리소스 분리**
- ✅ **Worker**: dev/prod 독립 배포
- ✅ **Pages**: dev/prod 독립 배포  
- ✅ **D1**: dev/prod 독립 데이터베이스
- ✅ **KV**: dev/prod 독립 스토리지
- ✅ **환경변수**: 브랜치별 자동 주입
- ✅ **네이밍 컨벤션**: 일관된 `-dev`/`-prod` 접미사

### **자동화된 배포**
- ✅ **브랜치 기반**: `dev` → Development, `main` → Production
- ✅ **GitHub Actions**: 푸시 시 자동 배포 트리거
- ✅ **환경별 설정**: API URL 자동 주입
- ✅ **배포 안전성**: 환경 간 격리로 안전한 테스트

## 🚀 다음 단계

1. **대시보드 페이지** 추가
2. **사용자 관리 UI** 구현 (생성, 수정, 삭제, 등급 변경)
3. **권한 관리 시스템** 고도화 (페이지별 접근 제어)
4. **실제 JWT 라이브러리** 적용 (현재 간단한 토큰 시스템)
5. **비밀번호 정책** 강화 (bcrypt, 복잡도 검증)
6. **감사 로그 시스템** 구축 (사용자 행동 추적)
7. **API 문서화** (Swagger/OpenAPI)
8. **모니터링 및 알림** 시스템
9. **데이터 백업 및 복구** 시스템
10. **성능 최적화** (쿼리 최적화, 캐싱)

---

**엔터프라이즈급 환경 분리와 자동화된 배포 시스템을 갖춘 현대적 어드민 시스템입니다.**