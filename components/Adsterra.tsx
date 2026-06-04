'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import {
  COOKIE_CONSENT_UPDATED_EVENT,
  getStoredCookieConsent,
} from '@/lib/cookie-consent';

type AdsterraLayout = 'in-article' | 'display' | 'rectangle' | 'leaderboard';

type AdsterraSlotProps = {
  className?: string;
  containerId?: string;
  label?: string;
  layout?: AdsterraLayout;
  minHeight?: number;
  scriptUrl?: string;
};

const DISALLOWED_AD_PREFIXES = [
  '/api',
  '/dashboard',
  '/login',
  '/premium',
  '/preview',
  '/register',
];

const DISALLOWED_AD_PATHS = ['/termos', '/privacidade'];
const ALLOWED_AD_PATHS = ['/', '/como-funciona'];
const EDITORIAL_AD_PATHS = [
  '/boas-praticas-url-curta',
  '/links-para-whatsapp',
  '/qr-code-para-links',
  '/seguranca-em-links-curtos',
];
const MONETIZABLE_AD_PATHS = [...ALLOWED_AD_PATHS, ...EDITORIAL_AD_PATHS];

const rawScriptValue = process.env.NEXT_PUBLIC_ADSTERRA_NATIVE_SCRIPT_URL?.trim() || '';
const rawContainerId = process.env.NEXT_PUBLIC_ADSTERRA_NATIVE_CONTAINER_ID?.trim() || '';

function normalizeScriptUrl(value: string) {
  const scriptSrc = value.match(/\ssrc=["']([^"']+)["']/i)?.[1] || value;

  if (scriptSrc.startsWith('//')) {
    return `https:${scriptSrc}`;
  }

  if (scriptSrc.startsWith('https://') || scriptSrc.startsWith('http://')) {
    return scriptSrc;
  }

  return '';
}

function getContainerId(value: string) {
  return rawContainerId || value.match(/\sid=["']([^"']+)["']/i)?.[1] || '';
}

function isShortCodePath(pathname: string) {
  const normalizedPath = pathname.split('?')[0].split('#')[0];

  if (!normalizedPath || normalizedPath === '/') {
    return false;
  }

  const segments = normalizedPath.split('/').filter(Boolean);
  return segments.length === 1 && !MONETIZABLE_AD_PATHS.includes(normalizedPath);
}

function canShowAdsterraAds(pathname: string | null) {
  if (!pathname) {
    return false;
  }

  if (DISALLOWED_AD_PATHS.includes(pathname)) {
    return false;
  }

  if (DISALLOWED_AD_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return false;
  }

  if (isShortCodePath(pathname)) {
    return false;
  }

  return MONETIZABLE_AD_PATHS.includes(pathname);
}

function getAdStyle(layout: AdsterraLayout, minHeight: number) {
  if (layout === 'leaderboard') {
    return {
      display: 'block',
      width: '100%',
      maxWidth: '728px',
      minHeight: `${minHeight}px`,
      margin: '0 auto',
    };
  }

  if (layout === 'rectangle') {
    return {
      display: 'block',
      width: '100%',
      maxWidth: '336px',
      minHeight: `${minHeight}px`,
      margin: '0 auto',
    };
  }

  return {
    display: 'block',
    width: '100%',
    minHeight: `${minHeight}px`,
    margin: '0 auto',
  };
}

export function AdsterraSlot({
  className = '',
  containerId,
  label = 'Publicidade',
  layout = 'display',
  minHeight = 160,
  scriptUrl,
}: AdsterraSlotProps) {
  const pathname = usePathname();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [canLoadAds, setCanLoadAds] = useState(false);
  const [adError, setAdError] = useState(false);

  const adsterraConfig = useMemo(
    () => ({
      containerId: containerId || getContainerId(rawScriptValue),
      enabled: process.env.NEXT_PUBLIC_ADSTERRA_ENABLED === 'true',
      scriptUrl: normalizeScriptUrl(scriptUrl || rawScriptValue),
    }),
    [containerId, scriptUrl]
  );

  const canShowAds =
    adsterraConfig.enabled &&
    canLoadAds &&
    canShowAdsterraAds(pathname) &&
    Boolean(adsterraConfig.scriptUrl) &&
    Boolean(adsterraConfig.containerId);

  useEffect(() => {
    const syncConsent = () => {
      setCanLoadAds(Boolean(getStoredCookieConsent()?.ads));
    };

    syncConsent();
    window.addEventListener(COOKIE_CONSENT_UPDATED_EVENT, syncConsent);
    return () => window.removeEventListener(COOKIE_CONSENT_UPDATED_EVENT, syncConsent);
  }, []);

  useEffect(() => {
    if (!canShowAds || !wrapperRef.current) {
      return;
    }

    setAdError(false);
    const script = document.createElement('script');
    script.async = true;
    script.dataset.cfasync = 'false';
    script.src = adsterraConfig.scriptUrl;
    script.onerror = () => setAdError(true);
    wrapperRef.current.appendChild(script);

    return () => {
      script.remove();
    };
  }, [adsterraConfig.scriptUrl, canShowAds, pathname]);

  if (!canShowAds) {
    return null;
  }

  const style = getAdStyle(layout, minHeight);

  return (
    <section className={`px-4 ${className}`}>
      <div className="mx-auto max-w-6xl">
        {label && (
          <p className="mb-2 text-center text-xs font-medium text-text-secondary">
            {label}
          </p>
        )}
        <div
          ref={wrapperRef}
          className="ads-container"
          style={style}
        >
          <div id={adsterraConfig.containerId} />
          {adError && (
            <div className="flex min-h-[inherit] items-center justify-center rounded-xl border border-dashed border-border bg-surface/70 p-4 text-center text-xs font-medium text-text-secondary">
              Publicidade indisponivel no momento
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export function AdsterraSlotTop() {
  return <AdsterraSlot layout="leaderboard" minHeight={120} />;
}

export function AdsterraSlotMiddle() {
  return <AdsterraSlot layout="in-article" minHeight={180} />;
}

export function AdsterraSlotBottom() {
  return (
    <AdsterraSlot
      className="hidden md:block"
      label="Publicidade opcional"
      layout="leaderboard"
      minHeight={100}
    />
  );
}
