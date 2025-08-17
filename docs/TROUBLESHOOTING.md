# 문제 해결 가이드

## 🚨 **일반적인 오류 및 해결 방법**

Overhaul 시스템에서 발생할 수 있는 주요 문제들과 해결 방법을 정리했습니다.

## 🔐 **인증 관련 오류**

### **Authentication error [code: 10000]**
```bash
# 오류 메시지
❌ ERROR] In a non-interactive environment, it's necessary to set a CLOUDFLARE_API_TOKEN environment variable

# 원인
- Cloudflare API 토큰이 설정되지 않음
- GitHub Secrets에 토큰이 없음
- 토큰 권한이 부족함

# 해결 방법
1. Cloudflare Dashboard → My Profile → API Tokens
2. "Create Token" 클릭
3. "Custom token" 선택
4. 권한 설정:
   - Account: Cloudflare Workers:Edit
   - Account: Cloudflare Pages:Edit
   - Zone: Cloudflare Workers:Edit
5. 토큰 생성 후 GitHub Secrets에 설정
   - CLOUDFLARE_API_TOKEN: [생성된 토큰]
   - CLOUDFLARE_ACCOUNT_ID: [계정 ID]
```

### **The project you specified does not exist**
```bash
# 오류 메시지
❌ The project you specified does not exist: "overhaul-frontend". Would you like to create it?

# 원인
- Cloudflare Pages 프로젝트가 존재하지 않음
- 프로젝트 이름이 잘못됨

# 해결 방법
1. wrangler pages deploy 실행 시 프로젝트 생성 확인
2. 프로젝트 이름 확인:
   - Development: overhaul-frontend-dev
   - Production: overhaul-frontend-prod
3. .github/workflows/deploy.yml에서 프로젝트 이름 확인
```

## 📝 **커밋 메시지 오류**

### **Invalid commit message, it must be a valid UTF-8 string**
```bash
# 오류 메시지
❌ A request to the Cloudflare API failed. Invalid commit message, it must be a valid UTF-8 string. [code: 8000111]

# 원인
- 커밋 메시지에 한글이 포함됨
- 이모지나 특수문자가 포함됨

# 해결 방법
1. 커밋 메시지 수정:
   git commit --amend -m "feat: Add user management system"

2. 강제 푸시:
   git push --force origin main
   git push --force origin dev

3. 앞으로 영어만 사용:
   # ✅ Good
   git commit -m "feat: Add new feature"
   
   # ❌ Bad
   git commit -m "feat: 새 기능 추가"
   git commit -m "feat: ✨ Add feature 🎉"
```

## 🗄️ **데이터베이스 관련 오류**

### **no such table: schema_migrations**
```bash
# 오류 메시지
❌ no such table: schema_migrations: SQLITE_ERROR

# 원인
- 마이그레이션 추적 테이블이 생성되지 않음
- 초기 마이그레이션이 실행되지 않음

# 해결 방법
1. 마이그레이션 테이블 초기화:
   npm run db:setup

2. 수동으로 테이블 생성:
   npx wrangler d1 execute overhaul-as-system-dev \
     --command="CREATE TABLE IF NOT EXISTS schema_migrations (id INTEGER PRIMARY KEY AUTOINCREMENT, app VARCHAR(255) NOT NULL DEFAULT 'overhaul', name VARCHAR(255) NOT NULL, applied DATETIME NOT NULL DEFAULT (datetime('now', 'utc')));"

3. 마이그레이션 재실행:
   npm run db:migrate:dev
```

### **마이그레이션 중복 실행 오류**
```bash
# 오류 메시지
❌ UNIQUE constraint failed: idx_schema_migrations_app_name

# 원인
- 동일한 마이그레이션이 이미 적용됨
- schema_migrations 테이블에 중복 레코드

# 해결 방법
1. 현재 마이그레이션 상태 확인:
   npx wrangler d1 execute overhaul-as-system-dev \
     --command="SELECT * FROM schema_migrations ORDER BY applied;"

2. 중복 레코드 삭제:
   npx wrangler d1 execute overhaul-as-system-dev \
     --command="DELETE FROM schema_migrations WHERE name = 'duplicate_migration_name';"

3. 마이그레이션 재실행:
   npm run db:migrate:dev
```

## 🚀 **배포 관련 오류**

### **Worker 배포 실패**
```bash
# 오류 메시지
❌ Error: Failed to deploy to Cloudflare Workers

# 원인
- wrangler.toml 설정 오류
- 환경변수 누락
- 권한 부족

# 해결 방법
1. wrangler.toml 확인:
   - name 속성 확인
   - env 설정 확인
   - KV/D1 바인딩 확인

2. 환경변수 확인:
   - CLOUDFLARE_API_TOKEN
   - CLOUDFLARE_ACCOUNT_ID

3. 수동 배포 시도:
   npx wrangler deploy --env development
   npx wrangler deploy --env production
```

### **Pages 배포 실패**
```bash
# 오류 메시지
❌ Error: Failed to deploy to Cloudflare Pages

# 원인
- 빌드 실패
- 프로젝트 이름 불일치
- 권한 부족

# 해결 방법
1. 빌드 확인:
   npm run build:pages

2. 프로젝트 이름 확인:
   - Development: overhaul-frontend-dev
   - Production: overhaul-frontend-prod

3. 수동 배포 시도:
   npx wrangler pages deploy out --project-name=overhaul-frontend-dev
   npx wrangler pages deploy out --project-name=overhaul-frontend-prod
```

## 🌐 **API 연결 오류**

### **CORS 오류**
```bash
# 오류 메시지
❌ Access to fetch at '...' from origin '...' has been blocked by CORS policy

# 원인
- Worker의 CORS 설정이 Frontend 도메인을 허용하지 않음
- 환경별 도메인 설정 불일치

# 해결 방법
1. Worker CORS 설정 확인:
   src/worker/index.ts에서 CORS 헤더 확인

2. 환경별 도메인 확인:
   config/environments.ts에서 도메인 설정 확인

3. CORS 헤더 업데이트:
   'Access-Control-Allow-Origin': 'https://overhaul-frontend-dev.pages.dev'
   'Access-Control-Allow-Origin': 'https://overhaul-frontend-prod.pages.dev'
```

### **API 응답 오류**
```bash
# 오류 메시지
❌ Failed to fetch: 500 Internal Server Error

# 원인
- Worker 코드 오류
- 데이터베이스 연결 실패
- 환경변수 누락

# 해결 방법
1. Worker 로그 확인:
   Cloudflare Dashboard → Workers → 로그 확인

2. 로컬 테스트:
   npm run dev:worker
   curl http://localhost:8787/api/health

3. 환경변수 확인:
   wrangler.toml의 vars 섹션 확인
```

## 🔧 **로컬 개발 환경 오류**

### **포트 충돌**
```bash
# 오류 메시지
❌ Port 3000 is already in use
❌ Port 8787 is already in use

# 원인
- 다른 프로세스가 해당 포트 사용 중
- 이전 개발 서버가 종료되지 않음

# 해결 방법
1. 포트 사용 중인 프로세스 확인:
   lsof -i :3000
   lsof -i :8787

2. 프로세스 종료:
   kill -9 [PID]

3. 또는 다른 포트 사용:
   npm run dev -- -p 3001
   wrangler dev --port 8788
```

### **의존성 설치 오류**
```bash
# 오류 메시지
❌ npm ERR! code ENOENT
❌ npm ERR! syscall open

# 원인
- package-lock.json 손상
- node_modules 불완전
- npm 캐시 문제

# 해결 방법
1. 캐시 정리:
   npm cache clean --force

2. 의존성 재설치:
   rm -rf node_modules package-lock.json
   npm install

3. npm 업데이트:
   npm install -g npm@latest
```

## 📱 **프론트엔드 관련 오류**

### **빌드 실패**
```bash
# 오류 메시지
❌ Error: Build failed
❌ SyntaxError: Unexpected token

# 원인
- TypeScript 오류
- 컴포넌트 import 오류
- 환경변수 누락

# 해결 방법
1. TypeScript 오류 확인:
   npm run lint

2. 빌드 로그 확인:
   npm run build

3. 환경변수 확인:
   .env.local 파일 확인
   next.config.js 설정 확인
```

### **런타임 오류**
```bash
# 오류 메시지
❌ TypeError: Cannot read properties of undefined
❌ ReferenceError: apiClient is not defined

# 원인
- 컴포넌트 초기화 순서 문제
- API 클라이언트 설정 오류
- 상태 관리 문제

# 해결 방법
1. 브라우저 콘솔 확인:
   - JavaScript 오류 메시지 확인
   - 네트워크 요청 상태 확인

2. 컴포넌트 구조 확인:
   - useEffect 의존성 배열 확인
   - 상태 초기화 순서 확인

3. API 클라이언트 확인:
   src/lib/api.ts 설정 확인
   환경변수 주입 확인
```

## 🚨 **긴급 상황 대처**

### **운영 환경 문제 발생 시**
```bash
# 1. 즉시 배포 중단
# → GitHub Actions 실행 중인 경우 취소

# 2. 이전 버전으로 롤백
git checkout [이전_커밋_해시]
git push --force origin main

# 3. 문제 분석
# → 로그 확인, 코드 검토

# 4. 수정 후 재배포
git checkout dev
# → 수정 작업
git push origin dev
# → 테스트 완료 후
git checkout main
git merge dev
git push origin main
```

### **데이터베이스 손상 시**
```bash
# 1. 백업 확인
# → Cloudflare D1 백업 기능 확인

# 2. 마이그레이션 재실행
npm run db:migrate:prod

# 3. 데이터 복구
# → seed.sql 재실행 또는 수동 데이터 복구

# 4. 상태 확인
npx wrangler d1 execute overhaul-as-system-prod --remote --env production \
  --command="SELECT * FROM schema_migrations ORDER BY applied;"
```

---

**이 가이드로 대부분의 문제를 해결할 수 있습니다. 추가 도움이 필요하면 GitHub Issues에 등록해주세요!** 🛠️
