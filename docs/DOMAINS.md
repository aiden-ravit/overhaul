# 도메인 관리 가이드

## 📍 **중앙화된 도메인 설정**

모든 환경별 도메인 설정은 `config/environments.ts` 파일에서 중앙 관리됩니다.

### **설정 파일 위치**
```
config/environments.ts  - 모든 환경별 도메인 설정
```

### **환경별 도메인**

#### **Local (로컬 개발)**
```typescript
local: {
  WORKER_DOMAIN: 'localhost:8787',
  PAGES_DOMAIN: 'localhost:3000', 
  API_BASE_URL: 'http://localhost:8787',
  FRONTEND_URL: 'http://localhost:3000',
}
```

#### **Development (개발 환경)**
```typescript
development: {
  WORKER_DOMAIN: 'overhaul-as-system-dev.ravit-cloud.workers.dev',
  PAGES_DOMAIN: 'overhaul-frontend-dev.pages.dev',
  API_BASE_URL: 'https://overhaul-as-system-dev.ravit-cloud.workers.dev',
  FRONTEND_URL: 'https://overhaul-frontend-dev.pages.dev',
}
```

#### **Production (운영 환경)**
```typescript
production: {
  WORKER_DOMAIN: 'overhaul-as-system-prod.ravit-cloud.workers.dev', 
  PAGES_DOMAIN: 'overhaul-frontend-prod.pages.dev',
  API_BASE_URL: 'https://overhaul-as-system-prod.ravit-cloud.workers.dev',
  FRONTEND_URL: 'https://overhaul-frontend-prod.pages.dev',
}
```

## 🔧 **도메인 변경 방법**

### **1단계: 중앙 설정 파일 수정**
`config/environments.ts`에서 해당 환경의 도메인을 수정합니다.

```typescript
// 예시: Development API 도메인 변경
development: {
  WORKER_DOMAIN: 'new-api-dev.example.com',  // ← 여기 수정
  API_BASE_URL: 'https://new-api-dev.example.com',  // ← 여기 수정
  // ... 기타 설정
}
```

### **2단계: GitHub Actions 환경변수 업데이트**
`.github/workflows/deploy.yml`에서 해당하는 환경변수를 수정합니다.

```yaml
env:
  API_BASE_URL: https://new-api-dev.example.com  # ← 여기 수정
```

### **3단계: Cloudflare 리소스 이름 변경**
- Worker 이름 변경: `wrangler.toml`의 `name` 속성
- Pages 프로젝트 이름 변경: GitHub Actions의 `--project-name` 옵션

## 🌍 **환경 감지 로직**

시스템은 다음 우선순위로 환경을 감지합니다:

1. **환경변수**: `ENVIRONMENT` → `NODE_ENV`
2. **기본값**: `development`

```typescript
// 현재 환경 확인
import { getCurrentEnvironment, getEnvironmentConfig } from './config/environments';

const currentEnv = getCurrentEnvironment();
const config = getEnvironmentConfig();
console.log(config.API_BASE_URL);
```

## 🔗 **환경변수 우선순위**

1. **GitHub Actions**: 빌드 시 환경변수 주입 (최우선)
2. **로컬 스크립트**: `npm run dev` 시 환경변수 설정
3. **환경 설정 파일**: `config/environments.ts`의 기본값

## 📝 **로컬 개발 설정**

로컬 개발 시 환경변수가 자동으로 설정됩니다:

```bash
# package.json 스크립트가 자동으로 환경변수 설정
npm run dev  # ENVIRONMENT=local API_BASE_URL=http://localhost:8787
```

## 🚀 **배포 시 자동 설정**

GitHub Actions에서 브랜치에 따라 자동으로 올바른 도메인이 설정됩니다:

- `dev` 브랜치 → Development 도메인
- `main` 브랜치 → Production 도메인

## ⚠️ **주의사항**

1. **도메인 변경 시 반드시 양쪽 모두 업데이트**:
   - `config/environments.ts` (코드에서 사용)
   - `.github/workflows/deploy.yml` (빌드 시 사용)

2. **Cloudflare 리소스 이름과 도메인 일치 확인**:
   - Worker 이름과 도메인이 일치해야 함
   - Pages 프로젝트 이름과 도메인이 일치해야 함

3. **CORS 설정 업데이트**:
   - Worker에서 Frontend 도메인 허용 설정 확인

## 🛠️ **문제 해결**

### **도메인이 반영되지 않을 때**
1. 빌드 캐시 삭제: `rm -rf .next`
2. 재빌드: `npm run build`
3. 환경변수 확인: `console.log(process.env.API_BASE_URL)`

### **CORS 오류가 발생할 때**
Worker의 CORS 설정에서 새로운 Frontend 도메인을 허용하도록 업데이트하세요.
