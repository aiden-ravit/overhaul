-- Overhaul Admin System Database Schema
-- 전체 데이터베이스 구조 정의
-- 주의: 이 파일은 기존 테이블을 DROP 합니다!

-- 기존 테이블 삭제 (외래키 순서 고려)
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS roles;

-- 등급 테이블
CREATE TABLE roles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    is_active BOOLEAN NOT NULL DEFAULT 1,
    created_at DATETIME NOT NULL DEFAULT (datetime('now', 'utc')),
    updated_at DATETIME NOT NULL DEFAULT (datetime('now', 'utc'))
);

-- 사용자 테이블  
CREATE TABLE users (
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

-- 인덱스 생성
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_role_name ON users(role_name);
CREATE INDEX idx_users_is_active ON users(is_active);
CREATE INDEX idx_roles_name ON roles(name);
CREATE INDEX idx_roles_is_active ON roles(is_active);

-- 트리거 생성 (updated_at 자동 업데이트)
CREATE TRIGGER update_roles_updated_at 
    AFTER UPDATE ON roles
    FOR EACH ROW
    BEGIN
        UPDATE roles SET updated_at = datetime('now', 'utc') WHERE id = NEW.id;
    END;

CREATE TRIGGER update_users_updated_at 
    AFTER UPDATE ON users
    FOR EACH ROW
    BEGIN
        UPDATE users SET updated_at = datetime('now', 'utc') WHERE id = NEW.id;
    END;
