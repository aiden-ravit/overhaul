#!/usr/bin/env node

/**
 * 스마트 D1 데이터베이스 마이그레이션 스크립트
 * 사용법: node scripts/migrate.js [dev|prod] [--remote]
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 환경 인수 확인
const args = process.argv.slice(2);
const environment = args[0];
const isRemote = args.includes('--remote');

if (!environment || !['dev', 'prod'].includes(environment)) {
  console.error('사용법: node scripts/migrate.js [dev|prod] [--remote]');
  console.error('예시: node scripts/migrate.js dev');
  console.error('예시: node scripts/migrate.js prod --remote');
  process.exit(1);
}

const databaseName = environment === 'dev' 
  ? 'overhaul-as-system-dev'
  : 'overhaul-as-system-prod';

const envFlag = environment === 'prod' ? '--env production' : '';
const remoteFlag = isRemote ? '--remote' : '';

console.log(`\n🗄️  스마트 마이그레이션 시작: ${databaseName}`);
console.log(`환경: ${environment.toUpperCase()}`);
console.log(`모드: ${isRemote ? 'REMOTE' : 'LOCAL'}`);

// 마이그레이션 추적 테이블 초기화
function initMigrationsTable() {
  try {
    const initCommand = `npx wrangler d1 execute ${databaseName} --command="CREATE TABLE IF NOT EXISTS schema_migrations (id INTEGER PRIMARY KEY AUTOINCREMENT, app VARCHAR(255) NOT NULL DEFAULT 'overhaul', name VARCHAR(255) NOT NULL, applied DATETIME NOT NULL DEFAULT (datetime('now', 'utc'))); CREATE UNIQUE INDEX IF NOT EXISTS idx_schema_migrations_app_name ON schema_migrations(app, name);" ${envFlag} ${remoteFlag}`;
    execSync(initCommand, { stdio: 'pipe' });
    console.log('✅ 마이그레이션 추적 테이블 초기화 완료');
  } catch (error) {
    console.error('❌ 마이그레이션 추적 테이블 초기화 실패:', error.message);
    process.exit(1);
  }
}

// 실행된 마이그레이션 조회
function getAppliedMigrations() {
  try {
    const queryCommand = `npx wrangler d1 execute ${databaseName} --command="SELECT name FROM schema_migrations WHERE app = 'overhaul';" ${envFlag} ${remoteFlag}`;
    const result = execSync(queryCommand, { encoding: 'utf8', stdio: 'pipe' });
    
    // JSON 형태의 출력에서 name 값들 추출
    const appliedMigrations = [];
    
    try {
      // JSON 파싱 시도
      const jsonMatch = result.match(/\[\s*\{[\s\S]*\}\s*\]/);
      if (jsonMatch) {
        const jsonData = JSON.parse(jsonMatch[0]);
        if (jsonData[0] && jsonData[0].results) {
          jsonData[0].results.forEach(row => {
            if (row.name) {
              appliedMigrations.push(row.name);
            }
          });
        }
      }
    } catch (parseError) {
      // JSON 파싱 실패 시 테이블 형태 파싱 시도
      const lines = result.split('\n');
      let inDataSection = false;
      
      for (const line of lines) {
        const trimmed = line.trim();
        
        // 테이블 데이터 섹션 시작 감지
        if (trimmed.includes('│') && trimmed.includes('overhaul')) {
          const parts = trimmed.split('│').map(p => p.trim());
          if (parts.length >= 3) {
            const migrationName = parts[2]; // name 컬럼
            if (migrationName && migrationName !== 'name') {
              appliedMigrations.push(migrationName);
            }
          }
        }
      }
    }
    
    return appliedMigrations;
  } catch (error) {
    // 테이블이 없는 경우 빈 배열 반환
    return [];
  }
}

// 마이그레이션 적용 기록
function recordMigration(migrationName) {
  try {
    const recordCommand = `npx wrangler d1 execute ${databaseName} --command="INSERT INTO schema_migrations (name, applied) VALUES ('${migrationName}', datetime('now', 'utc'));" ${envFlag} ${remoteFlag}`;
    execSync(recordCommand, { stdio: 'pipe' });
  } catch (error) {
    console.error(`⚠️  마이그레이션 기록 실패: ${migrationName}`);
  }
}

// 마이그레이션 추적 테이블 초기화
initMigrationsTable();

// 이미 적용된 마이그레이션 조회
console.log('\n📋 이미 적용된 마이그레이션 확인 중...');
const appliedMigrations = getAppliedMigrations();
console.log(`✅ 적용된 마이그레이션: ${appliedMigrations.length}개`);
if (appliedMigrations.length > 0) {
  appliedMigrations.forEach(migration => {
    console.log(`   - ${migration}`);
  });
}

// 마이그레이션 파일 목록 가져오기
const migrationsDir = path.join(__dirname, '..', 'database', 'migrations');
const migrationFiles = fs.readdirSync(migrationsDir)
  .filter(file => file.endsWith('.sql'))
  .sort(); // 파일명 순서대로 정렬

if (migrationFiles.length === 0) {
  console.log('⚠️  마이그레이션 파일이 없습니다.');
  process.exit(0);
}

// 실행해야 할 마이그레이션 필터링
const pendingMigrations = migrationFiles.filter(file => {
  const migrationName = file.replace('.sql', '');
  return !appliedMigrations.includes(migrationName);
});

if (pendingMigrations.length === 0) {
  console.log('✅ 실행할 마이그레이션이 없습니다. 모든 마이그레이션이 최신 상태입니다.');
  process.exit(0);
}

console.log(`\n🚀 실행할 마이그레이션 (${pendingMigrations.length}개):`);
pendingMigrations.forEach((file, index) => {
  console.log(`   ${index + 1}. ${file}`);
});

console.log('\n📦 마이그레이션 실행 중...\n');

// 각 마이그레이션 파일 실행
pendingMigrations.forEach((file, index) => {
  const filePath = path.join(migrationsDir, file);
  const migrationName = file.replace('.sql', '');
  
  try {
    console.log(`[${index + 1}/${pendingMigrations.length}] ${file} 실행 중...`);
    
    // 003_migrate_to_schema_migrations.sql 특별 처리
    if (migrationName === '003_migrate_to_schema_migrations') {
      // 기존 django_migrations 데이터 이관 시도
      try {
        const migrateDataCommand = `npx wrangler d1 execute ${databaseName} --command="INSERT OR IGNORE INTO schema_migrations (app, name, applied) SELECT app, name, applied FROM django_migrations WHERE name != '';" ${envFlag} ${remoteFlag}`;
        execSync(migrateDataCommand, { stdio: 'pipe' });
        console.log('   📦 기존 django_migrations 데이터 이관 완료');
      } catch (migrateError) {
        console.log('   ⚠️  django_migrations 테이블이 존재하지 않음 (새로운 환경)');
      }
      
      // django_migrations 테이블 삭제
      try {
        const dropCommand = `npx wrangler d1 execute ${databaseName} --command="DROP TABLE IF EXISTS django_migrations;" ${envFlag} ${remoteFlag}`;
        execSync(dropCommand, { stdio: 'pipe' });
      } catch (dropError) {
        // 삭제 실패는 무시
      }
    } else {
      // 일반 마이그레이션 파일 실행
      const command = `npx wrangler d1 execute ${databaseName} --file="${filePath}" ${envFlag} ${remoteFlag}`;
      execSync(command, { stdio: 'pipe' });
    }
    
    // 마이그레이션 적용 기록
    recordMigration(migrationName);
    
    console.log(`✅ ${file} 완료`);
  } catch (error) {
    console.error(`❌ ${file} 실패:`);
    console.error(error.message);
    console.error('\n🛑 마이그레이션 중단');
    process.exit(1);
  }
});

console.log('\n🎉 모든 마이그레이션이 성공적으로 완료되었습니다!');
console.log(`📍 데이터베이스: ${databaseName}`);
console.log(`🌍 환경: ${environment.toUpperCase()}`);
console.log(`📦 새로 적용된 마이그레이션: ${pendingMigrations.length}개`);

// 마이그레이션 후 테이블 확인
console.log('\n📊 최종 테이블 확인 중...');
try {
  const checkCommand = `npx wrangler d1 execute ${databaseName} --command="SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;" ${envFlag} ${remoteFlag}`;
  const result = execSync(checkCommand, { encoding: 'utf8' });
  console.log('✅ 현재 테이블들:');
  console.log(result);
} catch (error) {
  console.log('⚠️  테이블 확인 중 오류 발생 (마이그레이션은 완료됨)');
}
