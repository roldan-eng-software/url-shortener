-- Captura de leads comerciais gerados pela home e páginas de campanha.
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
