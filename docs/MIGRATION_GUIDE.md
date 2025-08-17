# 마이그레이션 시스템 가이드

## 🗄️ **스마트 D1 마이그레이션 시스템**

Overhaul 시스템은 Django 스타일의 자동화된 마이그레이션 시스템을 제공합니다.

### **핵심 특징**
- ✅ **중복 실행 방지**: 이미 적용된 마이그레이션은 건너뜀
- ✅ **자동 추적**: `schema_migrations` 테이블로 이력 관리
- ✅ **환경별 분리**: dev/prod 환경별 독립 실행
- ✅ **CI/CD 통합**: GitHub Actions와 완벽 연동
- ✅ **로컬/원격 지원**: `--remote` 플래그로 환경 선택

## 🚀 **사용법**

### **기본 명령어**
```bash
# 개발 환경 (로컬)
npm run db:migrate:dev

# 개발 환경 (원격)
npm run db:migrate:dev:remote

# 운영 환경 (원격)
npm run db:migrate:prod

# DB 초기 설정 (로컬)
npm run db:setup

# DB 완전 초기화
npm run db:reset
```

### **직접 실행**
```bash
# 스크립트 직접 실행
node scripts/migrate.js dev              # 로컬 개발
node scripts/migrate.js dev --remote     # 원격 개발
node scripts/migrate.js prod --remote    # 원격 운영
```

## 📁 **마이그레이션 파일 구조**

### **파일 위치**
```
database/
├── migrations/                    # 마이그레이션 파일들
│   ├── 000_create_migrations_table.sql
│   ├── 001_create_initial_tables.sql
│   ├── 002_insert_initial_data.sql
│   ├── 003_migrate_to_schema_migrations.sql
│   └── 004_add_user_logs_table.sql
├── schema.sql                     # 전체 스키마 (초기화용)
└── seed.sql                       # 초기 데이터 (초기화용)
```

### **파일 명명 규칙**
```bash
# 형식: [순번]_[설명].sql
000_create_migrations_table.sql
001_create_initial_tables.sql
002_insert_initial_data.sql
```

## 🔧 **마이그레이션 파일 작성법**

### **기본 템플릿**
```sql
-- Migration: [순번]_[설명]
-- Description: [상세 설명]
-- Created: [날짜]

-- SQL 명령어들...
CREATE TABLE new_table (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT (datetime('now', 'utc'))
);

-- 인덱스 추가 (성능 최적화)
CREATE INDEX idx_new_table_name ON new_table(name);
```

### **실제 예시**
```sql
-- Migration: 004_add_user_logs_table
-- Description: 사용자 활동 로그 테이블 추가
-- Created: 2025-08-17

CREATE TABLE user_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    action TEXT NOT NULL,
    resource TEXT,
    details TEXT,
    ip_address TEXT,
    user_agent TEXT,
    created_at DATETIME NOT NULL DEFAULT (datetime('now', 'utc')),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 성능 최적화 인덱스
CREATE INDEX idx_user_logs_user_id ON user_logs(user_id);
CREATE INDEX idx_user_logs_action ON user_logs(action);
CREATE INDEX idx_user_logs_created_at ON user_logs(created_at);
```

## 🔄 **마이그레이션 실행 프로세스**

### **1단계: 추적 테이블 초기화**
```sql
-- schema_migrations 테이블 생성 (없는 경우)
CREATE TABLE IF NOT EXISTS schema_migrations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    app VARCHAR(255) NOT NULL DEFAULT 'overhaul',
    name VARCHAR(255) NOT NULL,
    applied DATETIME NOT NULL DEFAULT (datetime('now', 'utc'))
);

-- 중복 방지 인덱스
CREATE UNIQUE INDEX IF NOT EXISTS idx_schema_migrations_app_name 
ON schema_migrations(app, name);
```

### **2단계: 적용된 마이그레이션 확인**
```sql
-- 이미 실행된 마이그레이션 조회
SELECT name FROM schema_migrations WHERE app = 'overhaul';
```

### **3단계: 대기 중인 마이그레이션 필터링**
```javascript
// scripts/migrate.js에서
const pendingMigrations = migrationFiles.filter(
  file => !appliedMigrations.includes(file.replace('.sql', ''))
);
```

### **4단계: 순차적 실행**
```bash
# 각 마이그레이션 파일을 순서대로 실행
for (const file of pendingMigrations) {
  // SQL 파일 실행
  execSync(`wrangler d1 execute ${databaseName} --file="${filePath}"`);
  
  // 실행 기록 저장
  recordMigration(migrationName);
}
```

## 🌍 **환경별 실행**

### **로컬 개발 환경**
```bash
npm run db:setup
# → npm run db:migrate:dev 실행
# → 로컬 D1 데이터베이스에 마이그레이션 적용
```

### **원격 개발 환경**
```bash
git push origin dev
# → GitHub Actions 트리거
# → npm run db:migrate:dev:remote 실행
# → overhaul-as-system-dev DB에 마이그레이션 적용
```

### **원격 운영 환경**
```bash
git push origin main
# → GitHub Actions 트리거  
# → npm run db:migrate:prod 실행
# → overhaul-as-system-prod DB에 마이그레이션 적용
```

## 📊 **마이그레이션 상태 확인**

### **현재 상태 조회**
```bash
# 로컬 개발 DB
npx wrangler d1 execute overhaul-as-system-dev \
  --command="SELECT * FROM schema_migrations ORDER BY applied;"

# 원격 개발 DB
npx wrangler d1 execute overhaul-as-system-dev --remote \
  --command="SELECT * FROM schema_migrations ORDER BY applied;"

# 원격 운영 DB
npx wrangler d1 execute overhaul-as-system-prod --remote --env production \
  --command="SELECT * FROM schema_migrations ORDER BY applied;"
```

### **예시 출력**
```
┌────┬──────────┬──────────────────────────────────┬─────────────────────┐
│ id │ app      │ name                             │ applied             │
├────┼──────────┼──────────────────────────────────┼─────────────────────┤
│ 1  │ overhaul │ 000_create_migrations_table      │ 2025-08-17 01:41:49 │
│ 2  │ overhaul │ 001_create_initial_tables        │ 2025-08-17 01:41:51 │
│ 3  │ overhaul │ 002_insert_initial_data          │ 2025-08-17 01:41:53 │
│ 4  │ overhaul │ 003_migrate_to_schema_migrations │ 2025-08-17 01:41:56 │
│ 5  │ overhaul │ 004_add_user_logs_table          │ 2025-08-17 01:50:13 │
└────┴──────────┴──────────────────────────────────┴─────────────────────┘
```

## 🚨 **주의사항**

### **마이그레이션 파일 수정 금지**
- ✅ **새 파일 추가**: 새로운 기능을 위한 마이그레이션
- ❌ **기존 파일 수정**: 이미 적용된 마이그레이션은 절대 수정하지 마세요
- ❌ **순서 변경**: 파일 순서를 변경하면 안 됩니다

### **롤백 방법**
```bash
# 특정 마이그레이션 롤백이 필요한 경우
# 1. 새로운 롤백 마이그레이션 파일 생성
# 2. 기존 테이블/데이터를 되돌리는 SQL 작성
# 3. 마이그레이션 실행

-- 예시: 005_rollback_user_logs.sql
DROP TABLE IF EXISTS user_logs;
```

## 🎯 **모범 사례**

### **마이그레이션 작성 시**
1. **명확한 설명**: Description에 상세한 내용 작성
2. **순서 고려**: 의존성이 있는 테이블은 순서 고려
3. **인덱스 추가**: 성능을 위한 인덱스 포함
4. **외래키 제약**: 데이터 무결성 보장
5. **테스트 데이터**: 개발용 샘플 데이터 포함

### **배포 시**
1. **dev 먼저**: 개발 환경에서 먼저 테스트
2. **영어 커밋**: UTF-8 오류 방지
3. **순차 배포**: dev → main 순서로 진행
4. **상태 확인**: 각 단계에서 마이그레이션 상태 확인

---

**이 시스템으로 데이터베이스 스키마를 안전하고 자동화된 방식으로 관리할 수 있습니다!** 🎉
