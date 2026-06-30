-- Migration 005b: Set first admin user
-- Date: 2026-06-30
-- Feature: Admin Dashboard (004-admin-dashboard)
-- WARNING: Replace 'admin@urlencurta.com.br' with your actual admin email

-- Definir primeiro admin (substituir pelo email real)
-- Descomente a linha abaixo e substitua o email:
-- UPDATE users SET is_admin = TRUE WHERE email = 'admin@urlencurta.com.br';

-- Verificar se há usuários admin
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM users WHERE is_admin = TRUE) THEN
    RAISE NOTICE 'Nenhum admin encontrado. Execute: UPDATE users SET is_admin = TRUE WHERE email = ''seu-email@exemplo.com'';';
  ELSE
    RAISE NOTICE 'Admin(s) encontrado(s): %', (SELECT COUNT(*) FROM users WHERE is_admin = TRUE);
  END IF;
END $$;
