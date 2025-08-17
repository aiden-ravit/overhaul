#!/usr/bin/env node

/**
 * D1 데이터베이스 마이그레이션 스크립트
 * 사용법: node scripts/migrate.js [dev|prod]
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 환경 인수 확인
const environment = process.argv[2];
if (!environment || !['dev', 'prod'].includes(environment)) {
  console.error('사용법: node scripts/migrate.js [dev|prod]');
  console.error('예시: node scripts/migrate.js dev');
  process.exit(1);
}

const databaseName = environment === 'dev' 
  ? 'overhaul-as-system-dev'
  : 'overhaul-as-system-prod';

const envFlag = environment === 'prod' ? '--env production' : '';

console.log(`\n🗄️  D1 마이그레이션 시작: ${databaseName}`);
console.log(`환경: ${environment.toUpperCase()}`);

// 마이그레이션 파일 목록 가져오기
const migrationsDir = path.join(__dirname, '..', 'database', 'migrations');
const migrationFiles = fs.readdirSync(migrationsDir)
  .filter(file => file.endsWith('.sql'))
  .sort(); // 파일명 순서대로 정렬

if (migrationFiles.length === 0) {
  console.log('⚠️  실행할 마이그레이션이 없습니다.');
  process.exit(0);
}

console.log(`\n📋 실행할 마이그레이션 (${migrationFiles.length}개):`);
migrationFiles.forEach((file, index) => {
  console.log(`   ${index + 1}. ${file}`);
});

console.log('\n🚀 마이그레이션 실행 중...\n');

// 각 마이그레이션 파일 실행
migrationFiles.forEach((file, index) => {
  const filePath = path.join(migrationsDir, file);
  
  try {
    console.log(`[${index + 1}/${migrationFiles.length}] ${file} 실행 중...`);
    
    // wrangler d1 execute 명령 실행
    const command = `npx wrangler d1 execute ${databaseName} --file="${filePath}" ${envFlag}`;
    execSync(command, { stdio: 'pipe' });
    
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

// 마이그레이션 후 테이블 확인
console.log('\n📊 테이블 확인 중...');
try {
  const checkCommand = `npx wrangler d1 execute ${databaseName} --command="SELECT name FROM sqlite_master WHERE type='table';" ${envFlag}`;
  const result = execSync(checkCommand, { encoding: 'utf8' });
  console.log('✅ 생성된 테이블들:');
  console.log(result);
} catch (error) {
  console.log('⚠️  테이블 확인 중 오류 발생 (마이그레이션은 완료됨)');
}
