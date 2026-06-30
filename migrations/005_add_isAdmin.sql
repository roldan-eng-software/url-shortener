-- Migration 005: Add isAdmin field to users table
-- Date: 2026-06-30
-- Feature: Admin Dashboard (004-admin-dashboard)

-- Adicionar coluna isAdmin à tabela users
ALTER TABLE users ADD COLUMN is_admin BOOLEAN DEFAULT FALSE;

-- Criar índice para queries de admin
CREATE INDEX idx_users_is_admin ON users(is_admin);

-- Comentário na coluna
COMMENT ON COLUMN users.is_admin IS 'Flag indicando se o usuário é administrador do sistema';
