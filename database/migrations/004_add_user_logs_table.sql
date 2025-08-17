-- Migration: 004_add_user_logs_table
-- Description: 사용자 활동 로그 테이블 추가
-- Created: 2025-08-17

-- 사용자 로그 테이블 생성
CREATE TABLE IF NOT EXISTS user_logs (
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
CREATE INDEX IF NOT EXISTS idx_user_logs_user_id ON user_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_user_logs_action ON user_logs(action);
CREATE INDEX IF NOT EXISTS idx_user_logs_created_at ON user_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_user_logs_resource ON user_logs(resource, resource_id);

-- 샘플 로그 데이터 삽입 (테스트용)
INSERT OR IGNORE INTO user_logs (user_id, action, resource, details, ip_address, user_agent) VALUES 
    (1, 'login', 'auth', '{"success": true, "method": "password"}', '127.0.0.1', 'Mozilla/5.0 (Test Browser)'),
    (1, 'view', 'users', '{"total_count": 1}', '127.0.0.1', 'Mozilla/5.0 (Test Browser)'),
    (1, 'system', 'migration', '{"migration": "004_add_user_logs_table", "status": "applied"}', '127.0.0.1', 'System');
