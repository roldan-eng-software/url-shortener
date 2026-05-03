-- Páginas públicas do modo "link na bio".
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
