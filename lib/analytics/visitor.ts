'use client';

import { hasCookieConsent } from '@/lib/cookie-consent';

/**
 * Identificador anônimo de primeira parte do visitante.
 *
 * LGPD (FR-004): o cookie só é criado/lido quando o consentimento de analytics
 * está concedido. Nenhum dado pessoal é armazenado — apenas um UUID opaco.
 */
export const VISITOR_COOKIE = 'urlshortener_visitor';

const FIRST_TOUCH_STORAGE_KEY = 'urlencurta_first_touch_source';
const VISITOR_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365; // 12 meses (alinhado à retenção)
const MAX_SOURCE_LENGTH = 80;

function readCookie(name: string): string | null {
  if (typeof document === 'undefined') {
    return null;
  }

  const match = document.cookie.split('; ').find((entry) => entry.startsWith(`${name}=`));

  if (!match) {
    return null;
  }

  const value = match.slice(name.length + 1);
  return value ? decodeURIComponent(value) : null;
}

function writeCookie(name: string, value: string, maxAgeSeconds: number): void {
  if (typeof document === 'undefined') {
    return;
  }

  const secure = window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${maxAgeSeconds}; SameSite=Lax${secure}`;
}

function hasAnalyticsConsent(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    return hasCookieConsent('analytics');
  } catch {
    return false;
  }
}

/** Lê o identificador do visitante. Retorna `null` sem consentimento ou sem cookie. */
export function getVisitorId(): string | null {
  if (!hasAnalyticsConsent()) {
    return null;
  }

  return readCookie(VISITOR_COOKIE);
}

/** Garante um identificador de visitante. Só cria o cookie com consentimento. */
export function ensureVisitorId(): string | null {
  if (!hasAnalyticsConsent()) {
    return null;
  }

  const existing = readCookie(VISITOR_COOKIE);
  if (existing) {
    return existing;
  }

  const id =
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;

  writeCookie(VISITOR_COOKIE, id, VISITOR_COOKIE_MAX_AGE_SECONDS);
  return id;
}

function normalizeSource(value: string): string {
  const trimmed = value.trim().toLowerCase();
  if (!trimmed) {
    return 'unknown';
  }
  return trimmed.slice(0, MAX_SOURCE_LENGTH);
}

/**
 * Captura a origem de primeiro toque (utm_* ou referrer). Retorna `unknown` quando
 * não identificável — nunca descarta o avanço (FR-003).
 */
export function captureAttribution(): string {
  if (typeof window === 'undefined') {
    return 'unknown';
  }

  try {
    const stored = window.localStorage.getItem(FIRST_TOUCH_STORAGE_KEY);
    if (stored) {
      return stored;
    }
  } catch {
    return 'unknown';
  }

  const params = new URLSearchParams(window.location.search);
  const utmSource = params.get('utm_source');
  const utmMedium = params.get('utm_medium');
  const utmCampaign = params.get('utm_campaign');

  let source = 'unknown';

  if (utmSource) {
    source = normalizeSource([utmSource, utmMedium, utmCampaign].filter(Boolean).join('/'));
  } else if (document.referrer) {
    try {
      const referrerHost = new URL(document.referrer).hostname;
      if (referrerHost && referrerHost !== window.location.hostname) {
        source = normalizeSource(referrerHost);
      }
    } catch {
      source = 'unknown';
    }
  }

  // Só persiste quando há origem real, para permitir atribuição em visitas futuras.
  if (source !== 'unknown') {
    try {
      window.localStorage.setItem(FIRST_TOUCH_STORAGE_KEY, source);
    } catch {
      // localStorage indisponível: segue sem persistir
    }
  }

  return source;
}

/** Origem de primeiro toque já capturada (ou captura agora). */
export function getAttributionSource(): string {
  return captureAttribution();
}
