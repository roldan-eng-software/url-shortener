import { test, expect, type Page } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';
const VISITOR_COOKIE = 'urlshortener_visitor';

type FunnelEvent = { command: string; name?: string };

/**
 * Cenário 2 do quickstart (SC-002 / FR-004): sem consentimento de analytics,
 * NENHUM evento de funil é emitido e o cookie de visitante não é criado.
 */
async function denyAnalyticsConsent(page: Page) {
  await page.addInitScript(() => {
    window.localStorage.setItem(
      'urlencurta_cookie_preferences_v1',
      JSON.stringify({
        necessary: true,
        analytics: false,
        ads: false,
        version: 1,
        updatedAt: new Date().toISOString(),
      })
    );
  });
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

test.describe('Funil anônimo → Premium — sem consentimento', () => {
  const surfaces = ['/', '/premium', '/register'];

  for (const surface of surfaces) {
    test(`não emite evento nem cria cookie de visitante em ${surface}`, async ({ page }) => {
      await denyAnalyticsConsent(page);
      await stubGtag(page);

      await page.goto(`${BASE_URL}${surface}`);
      await page.waitForLoadState('networkidle');

      const events = await funnelEventNames(page);
      expect(events).toEqual([]);

      const cookies = await page.context().cookies();
      expect(cookies.some((cookie) => cookie.name === VISITOR_COOKIE)).toBeFalsy();
    });
  }
});
