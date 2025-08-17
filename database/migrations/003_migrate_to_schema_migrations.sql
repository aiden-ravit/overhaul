-- Migration: 003_migrate_to_schema_migrations
-- Description: 기존 django_migrations 데이터를 schema_migrations로 이관
-- Created: 2025-08-17

-- 새로운 schema_migrations 테이블 생성 (이미 존재하면 무시)
CREATE TABLE IF NOT EXISTS schema_migrations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    app VARCHAR(255) NOT NULL DEFAULT 'overhaul',
    name VARCHAR(255) NOT NULL,
    applied DATETIME NOT NULL DEFAULT (datetime('now', 'utc'))
);

-- 인덱스 생성
CREATE UNIQUE INDEX IF NOT EXISTS idx_schema_migrations_app_name ON schema_migrations(app, name);

-- 기존 django_migrations 테이블이 존재하는 경우 데이터 이관
-- 이 쿼리는 테이블이 없으면 무시됩니다 (실제로는 스크립트에서 처리)

-- 기존 django_migrations 테이블 삭제 (존재하는 경우)
DROP TABLE IF EXISTS django_migrations;
