-- Migration: 001_create_initial_tables
-- Description: 초기 roles, users 테이블 생성
-- Created: 2025-08-17

-- 등급 테이블 생성 (이미 존재하면 무시)
CREATE TABLE IF NOT EXISTS roles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    is_active BOOLEAN NOT NULL DEFAULT 1,
    created_at DATETIME NOT NULL DEFAULT (datetime('now', 'utc')),
    updated_at DATETIME NOT NULL DEFAULT (datetime('now', 'utc'))
);

-- 사용자 테이블 생성 (이미 존재하면 무시)
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    role_name TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT 1,
    created_at DATETIME NOT NULL DEFAULT (datetime('now', 'utc')),
    updated_at DATETIME NOT NULL DEFAULT (datetime('now', 'utc')),
    FOREIGN KEY (role_name) REFERENCES roles(name)
);

-- 인덱스 생성 (이미 존재하면 무시)
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_role_name ON users(role_name);
CREATE INDEX IF NOT EXISTS idx_users_is_active ON users(is_active);
CREATE INDEX IF NOT EXISTS idx_roles_name ON roles(name);
CREATE INDEX IF NOT EXISTS idx_roles_is_active ON roles(is_active);

-- 트리거 생성 (중복 생성 방지를 위해 DROP 후 CREATE)
DROP TRIGGER IF EXISTS update_roles_updated_at;
CREATE TRIGGER update_roles_updated_at 
    AFTER UPDATE ON roles
    FOR EACH ROW
    BEGIN
        UPDATE roles SET updated_at = datetime('now', 'utc') WHERE id = NEW.id;
    END;

DROP TRIGGER IF EXISTS update_users_updated_at;
CREATE TRIGGER update_users_updated_at 
    AFTER UPDATE ON users
    FOR EACH ROW
    BEGIN
        UPDATE users SET updated_at = datetime('now', 'utc') WHERE id = NEW.id;
    END;
