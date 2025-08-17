-- Migration: 002_insert_initial_data  
-- Description: 초기 등급 및 관리자 계정 데이터 삽입
-- Created: 2025-08-17

-- 등급 데이터 삽입 (중복 방지)
INSERT OR IGNORE INTO roles (name, is_active) VALUES 
    ('관리자', 1),
    ('일반', 1);

-- 기본 관리자 계정 생성 (중복 방지)
-- 비밀번호: qwe123! (해시화됨)
INSERT OR IGNORE INTO users (username, password_hash, name, role_name, is_active) VALUES 
    ('admin', 'a2524317b80bba64098e1bd282b19b676cdb7b0997b28b84bc27f85df00af786', '관리자', '관리자', 1);
