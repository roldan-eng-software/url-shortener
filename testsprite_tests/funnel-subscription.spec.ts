import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

/**
 * Cenário 4 do quickstart (FR-007 / FR-006): reentrega do MESMO evento do Stripe
 * não cria segunda linha em `funnel_events` e é reconhecida como duplicata.
 *
 * Requer servidor rodando e DATABASE_URL configurada (a idempotência usa a tabela
 * `processed_events`). Sem banco, o teste é pulado em vez de falhar.
 */
const hasDatabase = Boolean(process.env.DATABASE_URL);

// Evento escolhido por ser inofensivo: não altera assinatura nem premium.
const EVENT_ID = 'evt_funnel_idempotency_test';
const stripeEvent = {
  id: EVENT_ID,
  type: 'customer.subscription.trial_will_end',
  data: {
    object: {
      id: 'sub_funnel_test',
      metadata: { userId: '00000000-0000-0000-0000-000000000000', source: 'teste' },
      trial_end: Math.floor(Date.now() / 1000) + 259200,
    },
  },
};

test.describe('Funil — idempotência do webhook do Stripe', () => {
  test.skip(!hasDatabase, 'Requer DATABASE_URL e servidor local rodando');

  test('reentrega do mesmo evento é marcada como duplicata', async ({ request }) => {
    const first = await request.post(`${BASE_URL}/api/stripe/webhook`, { data: stripeEvent });
    expect(first.ok()).toBeTruthy();

    const second = await request.post(`${BASE_URL}/api/stripe/webhook`, { data: stripeEvent });
    expect(second.ok()).toBeTruthy();

    const payload = await second.json();
    expect(payload.duplicate).toBeTruthy();
  });
});
