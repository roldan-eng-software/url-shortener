-- Migration: Add processed_events table for webhook idempotency
-- This table tracks Stripe webhook events that have already been processed
-- to prevent duplicate processing.

CREATE TABLE IF NOT EXISTS processed_events (
  id varchar(100) PRIMARY KEY,
  processed_at timestamp DEFAULT now() NOT NULL
);

-- Index for cleanup queries (optional: delete events older than 30 days)
CREATE INDEX IF NOT EXISTS idx_processed_events_processed_at ON processed_events(processed_at);