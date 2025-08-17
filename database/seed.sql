-- Overhaul Admin System Seed Data
-- 기본 데이터 삽입

-- 등급 데이터 삽입
INSERT INTO roles (name, is_active) VALUES 
    ('관리자', 1),
    ('일반', 1);

-- 기본 관리자 계정 생성
-- 비밀번호: qwe123! (해시화됨)
INSERT INTO users (username, password_hash, name, role_name, is_active) VALUES 
    ('admin', 'a2524317b80bba64098e1bd282b19b676cdb7b0997b28b84bc27f85df00af786', '관리자', '관리자', 1);

-- 추가 테스트 계정 (선택사항)
-- INSERT INTO users (username, password_hash, name, role_name, is_active) VALUES 
--     ('user1', 'test_hash_here', '일반사용자1', '일반', 1),
--     ('user2', 'test_hash_here', '일반사용자2', '일반', 1);
