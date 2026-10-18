import { randomUUID } from 'node:crypto';
import { getDb, schema } from '@/lib/db';

const { funnelEvents: funnelEventsTable } = schema;

/**
 * Enum canônico das etapas do funil anônimo -> Premium.
 * Contrato: specs/005-premium-conversion-funnel/contracts/analytics-events.md
 */
export const FUNNEL_STEPS = [
  'result_viewed',
  'offer_viewed',
  'account_creation_started',
  'account_created',
  'trial_started',
  'subscription_active',
  'payment_failed',
  'subscription_canceled',
] as const;

export type FunnelStep = (typeof FUNNEL_STEPS)[number];

const FUNNEL_STEP_SET = new Set<string>(FUNNEL_STEPS);

export function isFunnelStep(value: unknown): value is FunnelStep {
  return typeof value === 'string' && FUNNEL_STEP_SET.has(value);
}

const MAX_SOURCE_LENGTH = 80;
const MAX_DEDUPE_KEY_LENGTH = 180;

/** Normaliza a origem; ausência vira `unknown` (FR-003). Nunca descarta o avanço. */
export function normalizeSource(source?: string | null): string {
  if (typeof source !== 'string') {
    return 'unknown';
  }

  const trimmed = source.trim().toLowerCase();
  if (!trimmed) {
    return 'unknown';
  }

  return trimmed.slice(0, MAX_SOURCE_LENGTH);
}

export type FunnelStepInput = {
  step: FunnelStep;
  source?: string | null;
  visitorId?: string | null;
  userId?: string | null;
  metadata?: Record<string, string | number | boolean | undefined | null>;
  /**
   * Sufixo opcional para desambiguar eventos que podem se repetir legitimamente
   * ao longo do tempo (ex.: id do evento do Stripe). Derivado no servidor.
   */
  dedupeSuffix?: string | null;
};

/** Deriva a chave de deduplicação no servidor. Nunca aceita valor do cliente. */
export function buildDedupeKey(input: FunnelStepInput): string {
  const visitorId = input.visitorId?.trim() || '';
  const userId = input.userId?.trim() || '';
  const suffix = input.dedupeSuffix?.trim() || '';

  // Sem identidade alguma: usa um valor único para não colapsar eventos distintos.
  if (!visitorId && !userId && !suffix) {
    return `anon|${randomUUID()}|${input.step}`.slice(0, MAX_DEDUPE_KEY_LENGTH);
  }

  const base = `${visitorId}|${userId}|${input.step}`;
  const key = suffix ? `${base}:${suffix}` : base;

  // Se ultrapassar o limite, mantém o início e garante unicidade com hash curto.
  if (key.length <= MAX_DEDUPE_KEY_LENGTH) {
    return key;
  }

  return `${key.slice(0, MAX_DEDUPE_KEY_LENGTH - 9)}#${randomUUID().slice(0, 8)}`;
}

function sanitizeMetadata(
  metadata: FunnelStepInput['metadata']
): Record<string, string | number | boolean> {
  const result: Record<string, string | number | boolean> = {};

  if (!metadata) {
    return result;
  }

  for (const [key, value] of Object.entries(metadata)) {
    if (value === undefined || value === null) {
      continue;
    }
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      result[key] = value;
    }
  }

  return result;
}

/**
 * Registra uma etapa do funil. Fire-and-forget: nunca propaga erro nem bloqueia a
 * ação do usuário (FR-008). Idempotente via `dedupe_key` único (FR-006).
 */
export async function recordFunnelStep(input: FunnelStepInput): Promise<void> {
  try {
    if (!isFunnelStep(input.step)) {
      console.warn('[funnel] Etapa desconhecida ignorada:', input.step);
      return;
    }

    const db = getDb();

    await db
      .insert(funnelEventsTable)
      .values({
        step: input.step,
        source: normalizeSource(input.source),
        visitorId: input.visitorId?.trim()?.slice(0, 64) || null,
        userId: input.userId?.trim() || null,
        dedupeKey: buildDedupeKey(input),
        metadata: sanitizeMetadata(input.metadata),
      })
      .onConflictDoNothing({ target: funnelEventsTable.dedupeKey });
  } catch (error) {
    console.error('[funnel] Falha ao registrar etapa', input.step, error);
  }
}
