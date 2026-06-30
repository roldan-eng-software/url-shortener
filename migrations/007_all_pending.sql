-- =====================================================
-- MIGRATION CONSOLIDADA - Todas as migrations pendentes
-- Execute este script no Neon Dashboard para criar
-- todas as tabelas que ainda não existem no banco.
-- =====================================================

-- Verificar se a tabela users existe e adicionar is_admin se necessário
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'users') THEN
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'is_admin') THEN
      ALTER TABLE users ADD COLUMN is_admin BOOLEAN DEFAULT FALSE;
      CREATE INDEX idx_users_is_admin ON users(is_admin);
      COMMENT ON COLUMN users.is_admin IS 'Flag indicando se o usuário é administrador do sistema';
    END IF;
  END IF;
END $$;

-- Tabela de leads comerciais
CREATE TABLE IF NOT EXISTS marketing_leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(120) NOT NULL,
    email TEXT NOT NULL,
    company VARCHAR(160),
    phone VARCHAR(40),
    interest VARCHAR(40) NOT NULL DEFAULT 'premium',
    source VARCHAR(80) NOT NULL DEFAULT 'home_conversion_band',
    message TEXT,
    status VARCHAR(30) NOT NULL DEFAULT 'new',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_marketing_leads_email ON marketing_leads(email);
CREATE INDEX IF NOT EXISTS idx_marketing_leads_status_created ON marketing_leads(status, created_at DESC);

-- Tabela de páginas bio
CREATE TABLE IF NOT EXISTS bio_pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    handle VARCHAR(40) NOT NULL UNIQUE,
    title VARCHAR(120) NOT NULL,
    description TEXT,
    views_total INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS bio_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bio_page_id UUID NOT NULL REFERENCES bio_pages(id) ON DELETE CASCADE,
    title VARCHAR(120) NOT NULL,
    url TEXT NOT NULL,
    position INTEGER NOT NULL DEFAULT 0,
    clicks_total INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bio_pages_user ON bio_pages(user_id);
CREATE INDEX IF NOT EXISTS idx_bio_pages_handle_active ON bio_pages(handle, is_active);
CREATE INDEX IF NOT EXISTS idx_bio_links_page_position ON bio_links(bio_page_id, position);
CREATE INDEX IF NOT EXISTS idx_bio_links_active ON bio_links(bio_page_id, is_active);

-- Tabela de solicitações de privacidade (LGPD)
CREATE TABLE IF NOT EXISTS privacy_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_type VARCHAR(40) NOT NULL,
    email TEXT NOT NULL,
    details TEXT,
    status VARCHAR(30) NOT NULL DEFAULT 'new',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_privacy_requests_email ON privacy_requests(email);
CREATE INDEX IF NOT EXISTS idx_privacy_requests_status ON privacy_requests(status);

-- Tabela de eventos processados (idempotência do webhook Stripe)
CREATE TABLE IF NOT EXISTS processed_events (
    id VARCHAR(100) PRIMARY KEY,
    processed_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_processed_events_processed_at ON processed_events(processed_at);
