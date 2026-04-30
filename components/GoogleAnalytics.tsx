'use client';

import Script from 'next/script';

const GA_MEASUREMENT_ID = 'G-ZRN8PG2KZX';

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
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value
    });
  }
}

export function trackConversion(conversionId: string, conversionLabel: string) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'conversion', {
      send_to: `${conversionId}/${conversionLabel}`
    });
  }
}
