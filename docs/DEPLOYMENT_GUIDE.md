# 배포 프로세스 가이드

## 🚀 **완전 자동화된 배포 시스템**

Overhaul 시스템은 GitHub Actions를 통한 완전 자동화된 배포 시스템을 제공합니다.

### **핵심 특징**
- ✅ **자동 PR 생성**: dev 푸시 시 main으로 자동 PR 생성
- ✅ **자동 배포**: dev → Development, PR 머지 → Production
- ✅ **환경별 리소스 분리**: 완전히 독립된 dev/prod 환경
- ✅ **자동 마이그레이션**: DB 스키마 자동 업데이트
- ✅ **순차적 배포**: Worker → DB → Pages 순서로 진행
- ✅ **상태 모니터링**: GitHub Actions에서 실시간 진행 상황 확인
- ✅ **수동 승인**: 운영 배포 전 PR 검토 및 승인 단계

## 🌍 **환경별 배포 구조**

### **Development Environment (dev 브랜치)**
```yaml
# .github/workflows/deploy.yml + auto-pr.yml
on:
  push:
    branches: [dev]

jobs:
  deploy-worker:
    # overhaul-as-system-dev Worker 배포
    - name: Deploy Worker (Development)
      run: npx wrangler deploy
      
  deploy-pages:
    # overhaul-frontend-dev Pages 배포  
    - name: Deploy Pages (Development)
      run: npx wrangler pages deploy --project-name=overhaul-frontend-dev
      
  create-pr:
    # main으로 자동 PR 생성
    - name: Create Pull Request
      uses: peter-evans/create-pull-request@v5
```

### **Production Environment (PR 머지 시)**
```yaml
# .github/workflows/deploy.yml
on:
  push:
    branches: [main]  # PR 머지 후 main 푸시 시

jobs:
  deploy-worker:
    # overhaul-as-system-prod Worker 배포
    - name: Deploy Worker (Production)
      run: npx wrangler deploy --env production
      
  deploy-pages:
    # overhaul-frontend-prod Pages 배포
    - name: Deploy Pages (Production)
      run: npx wrangler pages deploy --project-name=overhaul-frontend-prod
```

## 🔄 **새로운 자동화 워크플로우**

### **자동 PR 생성 (auto-pr.yml)**
```yaml
# dev 브랜치 푸시 시 자동 실행
on:
  push:
    branches: [dev]

jobs:
  create-pr:
    # main으로 자동 PR 생성
    - name: Create Pull Request
      uses: peter-evans/create-pull-request@v5
      with:
        title: "🚀 Dev to Main: [커밋 메시지]"
        body: |
          ## 🔄 자동 생성된 Pull Request
          - 개발 환경에서 테스트 완료
          - 자동 배포 및 마이그레이션 성공
          - 운영 환경 배포 준비 완료
        labels: auto-generated, dev-to-main, deployment-ready
        assignees: [리포지토리 소유자]
```

## 🔄 **배포 워크플로우 상세**

### **1단계: Worker API 배포**
```bash
# Development
npx wrangler deploy
# → overhaul-as-system-dev.ravit-cloud.workers.dev

# Production  
npx wrangler deploy --env production
# → overhaul-as-system-prod.ravit-cloud.workers.dev
```

### **2단계: 데이터베이스 마이그레이션**
```bash
# Development
npm run db:migrate:dev:remote
# → overhaul-as-system-dev DB에 마이그레이션 적용

# Production
npm run db:migrate:prod
# → overhaul-as-system-prod DB에 마이그레이션 적용
```

### **3단계: Frontend Pages 배포**
```bash
# Development
npx wrangler pages deploy out --project-name=overhaul-frontend-dev
# → https://overhaul-frontend-dev.pages.dev

# Production
npx wrangler pages deploy out --project-name=overhaul-frontend-prod
# → https://overhaul-frontend-prod.pages.dev
```

## 📊 **배포 상태 확인**

### **GitHub Actions 모니터링**
```bash
# 1. GitHub 리포지토리 접속
# 2. Actions 탭 클릭
# 3. 최근 워크플로우 실행 상태 확인

# 성공 시: ✅ 초록색 체크마크
# 실패 시: ❌ 빨간색 X 표시
```

### **환경별 상태 확인**
```bash
# Development 환경
curl https://overhaul-as-system-dev.ravit-cloud.workers.dev/api/health
# → {"status": "ok", "environment": "development"}

# Production 환경
curl https://overhaul-as-system-prod.ravit-cloud.workers.dev/api/health
# → {"status": "ok", "environment": "production"}
```

### **Frontend 접속 확인**
```bash
# Development
https://overhaul-frontend-dev.pages.dev
# → 개발 환경 프론트엔드

# Production
https://overhaul-frontend-prod.pages.dev
# → 운영 환경 프론트엔드
```

## 🛠 **수동 배포 방법**

### **Worker 수동 배포**
```bash
# Development
npx wrangler deploy

# Production
npx wrangler deploy --env production
```

### **Pages 수동 배포**
```bash
# 1. 빌드
npm run build:pages

# 2. 배포
# Development
npx wrangler pages deploy out --project-name=overhaul-frontend-dev

# Production
npx wrangler pages deploy out --project-name=overhaul-frontend-prod
```

### **데이터베이스 수동 마이그레이션**
```bash
# Development (로컬)
npm run db:migrate:dev

# Development (원격)
npm run db:migrate:dev:remote

# Production (원격)
npm run db:migrate:prod
```

## 🔧 **환경별 설정**

### **Development 환경**
```toml
# wrangler.toml
name = "overhaul-as-system-dev"

[env.development]
name = "overhaul-as-system-dev"

[[env.development.kv_namespaces]]
binding = "USERS"
id = "22bca6b540fc46269d3a3da5896fb1a2"

[[env.development.d1_databases]]
binding = "DB"
database_name = "overhaul-as-system-dev"
database_id = "b5551a70-a4b2-42cb-884e-5974ae02dfa0"
```

### **Production 환경**
```toml
# wrangler.toml
[env.production]
name = "overhaul-as-system-prod"

[[env.production.kv_namespaces]]
binding = "USERS"
id = "3dd5ac59f76e45c6a8982cf77d9c2328"

[[env.production.d1_databases]]
binding = "DB"
database_name = "overhaul-as-system-prod"
database_id = "dc5ffafb-7ccb-468d-8385-aae677ff7ef3"
```

## 🚨 **배포 시 주의사항**

### **브랜치별 배포 규칙**
```bash
# ✅ 올바른 순서
1. dev 브랜치에 푸시 → Development 환경 배포
2. 테스트 완료 후 main에 머지 → Production 환경 배포

# ❌ 잘못된 순서
1. main에 직접 푸시 → Production에 바로 배포 (위험!)
2. dev 테스트 없이 main 머지 → 문제가 운영에 바로 반영
```

### **환경변수 설정**
```bash
# GitHub Actions에서 자동 설정
API_BASE_URL: https://overhaul-as-system-dev.ravit-cloud.workers.dev  # dev
API_BASE_URL: https://overhaul-as-system-prod.ravit-cloud.workers.dev # main

ENVIRONMENT: development  # dev
ENVIRONMENT: production   # main
```

### **리소스 이름 일치**
```bash
# Worker 이름과 wrangler.toml의 name이 일치해야 함
overhaul-as-system-dev.ravit-cloud.workers.dev  ← overhaul-as-system-dev
overhaul-as-system-prod.ravit-cloud.workers.dev ← overhaul-as-system-prod

# Pages 프로젝트 이름과 배포 명령어가 일치해야 함
--project-name=overhaul-frontend-dev   ← overhaul-frontend-dev
--project-name=overhaul-frontend-prod  ← overhaul-frontend-prod
```

## 📈 **배포 성능 최적화**

### **빌드 최적화**
```bash
# Next.js 빌드 최적화
next.config.js:
- output: 'export'           # 정적 사이트 생성
- trailingSlash: true        # Cloudflare Pages 호환성
- images: { unoptimized: true } # 이미지 최적화 비활성화
```

### **배포 속도 개선**
```bash
# GitHub Actions 캐싱
- actions/setup-node@v4 with cache: 'npm'
- 의존성 설치 시간 단축

# 병렬 배포
- deploy-worker와 deploy-pages를 needs로 연결
- Worker 배포 완료 후 Pages 배포 시작
```

## 🔍 **문제 해결**

### **배포 실패 시**
```bash
# 1. GitHub Actions 로그 확인
# → Actions 탭 → 실패한 워크플로우 → 로그 확인

# 2. 환경변수 확인
# → Secrets 설정 확인 (CLOUDFLARE_API_TOKEN, CLOUDFLARE_ACCOUNT_ID)

# 3. 리소스 이름 확인
# → wrangler.toml의 name과 실제 Cloudflare 리소스 이름 일치 확인

# 4. 권한 확인
# → Cloudflare API 토큰에 필요한 권한이 있는지 확인
```

### **일반적인 오류**
```bash
# Authentication error [code: 10000]
# → CLOUDFLARE_API_TOKEN 확인

# The project you specified does not exist
# → Pages 프로젝트 이름 확인

# Invalid commit message, it must be a valid UTF-8 string
# → 커밋 메시지에서 한글/이모지 제거
```

---

**이 가이드로 안전하고 효율적인 배포를 진행할 수 있습니다!** 🎉
