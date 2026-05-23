'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';
import {
  COOKIE_CONSENT_UPDATED_EVENT,
  getStoredCookieConsent,
} from '@/lib/cookie-consent';

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-ZRN8PG2KZX';

type Gtag = (
  command: 'config' | 'event' | 'js',
  target: string | Date,
  params?: Record<string, string | number | boolean | undefined>
) => void;

declare global {
  interface Window {
    gtag?: Gtag;
  }
}

export function GoogleAnalytics() {
  const [canLoadAnalytics, setCanLoadAnalytics] = useState(false);

  useEffect(() => {
    const syncConsent = () => {
      setCanLoadAnalytics(Boolean(getStoredCookieConsent()?.analytics));
    };

    syncConsent();
    window.addEventListener(COOKIE_CONSENT_UPDATED_EVENT, syncConsent);
    return () => window.removeEventListener(COOKIE_CONSENT_UPDATED_EVENT, syncConsent);
  }, []);

  if (!GA_MEASUREMENT_ID || !canLoadAnalytics) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', {
            page_title: document.title,
            page_location: window.location.href,
            anonymize_ip: true,
            ads_data_redaction: true
          });
        `}
      </Script>
    </>
  );
}

export function trackEvent(category: string, action: string, label?: string, value?: number) {
  if (typeof window !== 'undefined' && getStoredCookieConsent()?.analytics && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value
    });
  }
}

export function trackConversionEvent(action: string, params?: Record<string, string | number | boolean | undefined>) {
  if (typeof window !== 'undefined' && getStoredCookieConsent()?.analytics && window.gtag) {
    window.gtag('event', action, {
      event_category: 'conversion',
      ...params,
    });
  }
}

export function trackConversion(conversionId: string, conversionLabel: string) {
  if (typeof window !== 'undefined' && getStoredCookieConsent()?.analytics && window.gtag) {
    window.gtag('event', 'conversion', {
      send_to: `${conversionId}/${conversionLabel}`
    });
  }
}
