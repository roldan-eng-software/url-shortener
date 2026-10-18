-- Migration 008: Create funnel_events table
-- Date: 2026-10-18
-- Feature: Instrumentação do Funil Anônimo → Premium (005-premium-conversion-funnel)
--
-- Registra cada etapa do funil anônimo -> Premium. Passos comportamentais
-- (result_viewed, offer_viewed, account_creation_started) são espelhados a partir
-- do Google Analytics; passos de conta e cobrança (account_created, trial_started,
-- subscription_active, payment_failed, subscription_canceled) são gravados
-- server-side. Nenhuma tabela existente é alterada.

CREATE TABLE IF NOT EXISTS funnel_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  step VARCHAR(40) NOT NULL,
  source VARCHAR(80) NOT NULL DEFAULT 'unknown',
  visitor_id VARCHAR(64),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  dedupe_key VARCHAR(180) NOT NULL,
  occurred_at TIMESTAMP NOT NULL DEFAULT NOW(),
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb
);

-- Deduplicação: impede que recarregar/voltar infle o funil (FR-006)
CREATE UNIQUE INDEX IF NOT EXISTS funnel_events_dedupe_key_idx
  ON funnel_events (dedupe_key);

-- Leitura do funil por período (SC-001)
CREATE INDEX IF NOT EXISTS funnel_events_step_occurred_at_idx
  ON funnel_events (step, occurred_at);

-- Conversão por canal/origem (SC-003)
CREATE INDEX IF NOT EXISTS funnel_events_source_occurred_at_idx
  ON funnel_events (source, occurred_at);

-- Jornada de um usuário
CREATE INDEX IF NOT EXISTS funnel_events_user_id_idx
  ON funnel_events (user_id);

COMMENT ON TABLE funnel_events IS 'Etapas do funil anonimo -> Premium (instrumentacao)';
COMMENT ON COLUMN funnel_events.dedupe_key IS 'Chave derivada no servidor: visitor_id|user_id|step[:sufixo]';
COMMENT ON COLUMN funnel_events.source IS 'Canal/origem de primeiro toque; "unknown" quando nao identificavel';
COMMENT ON COLUMN funnel_events.metadata IS 'Dados minimos e sem PII (ex.: plan, cycle, surface)';
