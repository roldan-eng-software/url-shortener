-- =====================================================
-- ESQUEMA NEON - URLEncurta.com.br
-- Modelo Freemium: Gratuito + Premium R$29/mês
-- =====================================================

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    is_premium BOOLEAN DEFAULT false,
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT,
    premium_expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de links dos usuários (Premium)
CREATE TABLE IF NOT EXISTS user_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    original_url TEXT NOT NULL,
    short_code VARCHAR(10) NOT NULL UNIQUE,
    custom_alias VARCHAR(50),
    clicks_total INTEGER DEFAULT 0,
    clicks_geo JSONB DEFAULT '{}'::jsonb,
    clicks_device JSONB DEFAULT '{}'::jsonb,
    clicks_referrers JSONB DEFAULT '{}'::jsonb,
    qr_code TEXT,
    is_premium BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de links anônimos (Free)
CREATE TABLE IF NOT EXISTS anon_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    original_url TEXT NOT NULL,
    short_code VARCHAR(10) NOT NULL UNIQUE,
    clicks_total INTEGER DEFAULT 0,
    clicks_geo JSONB DEFAULT '{}'::jsonb,
    clicks_device JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes para performance
CREATE INDEX IF NOT EXISTS idx_user_links_user ON user_links(user_id);
CREATE INDEX IF NOT EXISTS idx_user_links_short_code ON user_links(short_code);
CREATE INDEX IF NOT EXISTS idx_anon_links_short_code ON anon_links(short_code);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- =====================================================
-- MIGRATION: Adicionar campos à tabela urls existente
-- =====================================================
-- ALTER TABLE urls ADD COLUMN IF NOT EXISTS user_id UUID;
-- ALTER TABLE urls ADD COLUMN IF NOT EXISTS is_premium BOOLEAN DEFAULT false;
-- ALTER TABLE urls ADD COLUMN IF NOT EXISTS clicks_geo JSONB DEFAULT '{}'::jsonb;
-- ALTER TABLE urls ADD COLUMN IF NOT EXISTS clicks_device JSONB DEFAULT '{}'::jsonb;
-- ALTER TABLE urls ADD COLUMN IF NOT EXISTS clicks_referrers JSONB DEFAULT '{}'::jsonb;

-- =====================================================
-- VIEW: Histórico unificado (free + premium)
-- =====================================================
CREATE OR REPLACE VIEW link_stats AS
SELECT 
    'anon' as link_type,
    id,
    original_url,
    short_code,
    NULL as user_id,
    NULL as custom_alias,
    clicks_total,
    clicks_geo,
    clicks_device,
    clicks_referrers,
    created_at
FROM anon_links
UNION ALL
SELECT 
    'user' as link_type,
    id,
    original_url,
    short_code,
    user_id,
    custom_alias,
    clicks_total,
    clicks_geo,
    clicks_device,
    clicks_referrers,
    created_at
FROM user_links;
