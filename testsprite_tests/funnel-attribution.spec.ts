import { test, expect, type Page } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';
const CONSENT_KEY = 'urlencurta_cookie_preferences_v1';

type FunnelEvent = { command: string; name?: string; params?: Record<string, unknown> };

/** Cenário 1 do quickstart (SC-003): origem de primeiro toque é atribuída. */
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
          params: (args[2] as Record<string, unknown>) ?? undefined,
        });
        target.dataLayer?.push(args);
      },
    });
  });
}

async function offerViewedFrom(page: Page): Promise<Record<string, unknown> | undefined> {
  return page.evaluate(() => {
    const target = window as unknown as { __funnelEvents?: FunnelEvent[] };
    return (target.__funnelEvents ?? []).find(
      (event) => event.command === 'event' && event.name === 'offer_viewed'
    )?.params;
  });
}

test.describe('Atribuição de origem no funil', () => {
  test('associa a origem de primeiro toque a partir de utm_source', async ({ page }) => {
    await grantAnalyticsConsent(page);
    await stubGtag(page);

    await page.goto(`${BASE_URL}/?utm_source=instagram&utm_medium=social`);

    await expect
      .poll(async () => (await offerViewedFrom(page))?.source, { timeout: 10000 })
      .toBe('instagram/social');
  });

  test('usa unknown quando não há origem identificável', async ({ page }) => {
    await grantAnalyticsConsent(page);
    await stubGtag(page);

    await page.goto(BASE_URL);

    await expect
      .poll(async () => (await offerViewedFrom(page))?.source, { timeout: 10000 })
      .toBe('unknown');
  });
});
