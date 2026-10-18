import { test, expect, type Page } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';
const CONSENT_KEY = 'urlencurta_cookie_preferences_v1';
const VISITOR_COOKIE = 'urlshortener_visitor';

type FunnelEvent = { command: string; name?: string };

/**
 * Cenário 1 do quickstart: instrumentação das etapas de cliente com
 * consentimento de analytics concedido.
 *
 * As etapas verificadas aqui (offer_viewed, account_creation_started) são
 * puramente client-side e não dependem de banco. As etapas server-side
 * (account_created, trial_started, ...) são validadas manualmente conforme
 * specs/005-premium-conversion-funnel/quickstart.md.
 */
async function grantAnalyticsConsent(page: Page) {
  await page.addInitScript((key) => {
    window.localStorage.setItem(
      key,
      JSON.stringify({
        necessary: true,
        analytics: true,
        ads: false,
        version: 1,
        updatedAt: new Date().toISOString(),
      })
    );
  }, CONSENT_KEY);
}

/** Captura as chamadas de gtag sem depender da rede (bloqueia o override inline do next/script). */
async function stubGtag(page: Page) {
  await page.addInitScript(() => {
    const target = window as unknown as { __funnelEvents?: FunnelEvent[]; dataLayer?: unknown[] };
    target.__funnelEvents = [];
    target.dataLayer = target.dataLayer || [];

    Object.defineProperty(window, 'gtag', {
      configurable: true,
      writable: false,
      value: (...args: unknown[]) => {
        target.__funnelEvents?.push({
          command: String(args[0]),
          name: args[1] ? String(args[1]) : undefined,
        });
        target.dataLayer?.push(args);
      },
    });
  });
}

async function funnelEventNames(page: Page): Promise<string[]> {
  return page.evaluate(() => {
    const target = window as unknown as { __funnelEvents?: FunnelEvent[] };
    return (target.__funnelEvents ?? [])
      .filter((event) => event.command === 'event')
      .map((event) => event.name ?? '');
  });
}

test.describe('Funil anônimo → Premium — jornada com consentimento', () => {
  test('registra offer_viewed na home e cria o identificador anônimo', async ({ page }) => {
    await grantAnalyticsConsent(page);
    await stubGtag(page);

    await page.goto(BASE_URL);

    await expect.poll(() => funnelEventNames(page), { timeout: 10000 }).toContain('offer_viewed');

    const cookies = await page.context().cookies();
    expect(cookies.some((cookie) => cookie.name === VISITOR_COOKIE)).toBeTruthy();
  });

  test('registra offer_viewed na página Premium', async ({ page }) => {
    await grantAnalyticsConsent(page);
    await stubGtag(page);

    await page.goto(`${BASE_URL}/premium`);
    await expect.poll(() => funnelEventNames(page), { timeout: 10000 }).toContain('offer_viewed');
  });

  test('registra account_creation_started na página de cadastro', async ({ page }) => {
    await grantAnalyticsConsent(page);
    await stubGtag(page);

    await page.goto(`${BASE_URL}/register`);
    await expect
      .poll(() => funnelEventNames(page), { timeout: 10000 })
      .toContain('account_creation_started');
  });
});
