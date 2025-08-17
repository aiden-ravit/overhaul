-- Overhaul Admin System Database Schema
-- 전체 데이터베이스 구조 정의
-- 주의: 이 파일은 기존 테이블을 DROP 합니다!

-- 기존 테이블 삭제 (외래키 순서 고려)
DROP TABLE IF EXISTS user_logs;
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

-- 사용자 활동 로그 테이블
CREATE TABLE user_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    action VARCHAR(100) NOT NULL,           -- 활동 유형 (login, logout, view, edit, delete 등)
    resource VARCHAR(255),                  -- 대상 리소스 (users, roles 등)
    resource_id INTEGER,                    -- 대상 리소스 ID
    details TEXT,                           -- 추가 세부사항 (JSON 형태)
    ip_address VARCHAR(45),                 -- IP 주소 (IPv6 지원)
    user_agent TEXT,                        -- User Agent
    created_at DATETIME NOT NULL DEFAULT (datetime('now', 'utc')),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 인덱스 생성 (성능 최적화)
CREATE INDEX idx_user_logs_user_id ON user_logs(user_id);
CREATE INDEX idx_user_logs_action ON user_logs(action);
CREATE INDEX idx_user_logs_created_at ON user_logs(created_at);
CREATE INDEX idx_user_logs_resource ON user_logs(resource, resource_id);

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
