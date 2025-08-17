-- Migration: 000_create_migrations_table
-- Description: 마이그레이션 추적 테이블 생성
-- Created: 2025-08-17

-- 마이그레이션 추적 테이블 생성 (이미 존재하면 무시)
CREATE TABLE IF NOT EXISTS schema_migrations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    app VARCHAR(255) NOT NULL DEFAULT 'overhaul',
    name VARCHAR(255) NOT NULL,
    applied DATETIME NOT NULL DEFAULT (datetime('now', 'utc'))
);

-- 인덱스 생성
CREATE UNIQUE INDEX IF NOT EXISTS idx_schema_migrations_app_name ON schema_migrations(app, name);
