export type CookieConsentPreferences = {
  necessary: true;
  analytics: boolean;
  ads: boolean;
  version: 1;
  updatedAt: string;
};

export const COOKIE_CONSENT_STORAGE_KEY = 'urlencurta_cookie_preferences_v1';
export const COOKIE_CONSENT_UPDATED_EVENT = 'urlencurtaCookieConsentUpdated';

export function getStoredCookieConsent(): CookieConsentPreferences | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const stored = window.localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY);
    if (!stored) {
      return null;
    }

    const parsed = JSON.parse(stored) as Partial<CookieConsentPreferences>;
    if (parsed.necessary !== true || parsed.version !== 1) {
      return null;
    }

    return {
      necessary: true,
      analytics: Boolean(parsed.analytics),
      ads: Boolean(parsed.ads),
      version: 1,
      updatedAt: typeof parsed.updatedAt === 'string' ? parsed.updatedAt : new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

export function saveCookieConsent(preferences: Pick<CookieConsentPreferences, 'analytics' | 'ads'>) {
  if (typeof window === 'undefined') {
    return;
  }

  const nextPreferences: CookieConsentPreferences = {
    necessary: true,
    analytics: preferences.analytics,
    ads: preferences.ads,
    version: 1,
    updatedAt: new Date().toISOString(),
  };

  window.localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, JSON.stringify(nextPreferences));
  window.dispatchEvent(
    new CustomEvent(COOKIE_CONSENT_UPDATED_EVENT, {
      detail: nextPreferences,
    })
  );
}

export function hasCookieConsent(category: 'analytics' | 'ads') {
  return Boolean(getStoredCookieConsent()?.[category]);
}
