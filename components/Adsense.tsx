'use client';

import { useEffect, useState } from 'react';

declare global {
  interface Window {
    adsbygoogle?: Array<Record<string, unknown>>;
  }
}

interface AdSenseProps {
  adSlot: string;
  adClient?: string;
  layout?: 'in-article' | 'display' | 'rectangle' | 'leaderboard';
  className?: string;
  minHeight?: number;
  label?: string;
}

export function AdSense({ 
  adSlot, 
  adClient = 'ca-pub-6076119895678197',
  layout = 'display',
  className = '',
  minHeight,
  label = 'Publicidade',
}: AdSenseProps) {
  const [adError, setAdError] = useState(false);
  const isPlaceholderSlot = adSlot.startsWith('123456');

  useEffect(() => {
    if (typeof window !== 'undefined' && !isPlaceholderSlot) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (err) {
        console.error('AdSense error:', err);
        setAdError(true);
      }
    }
  }, [isPlaceholderSlot]);

  const style = layout === 'leaderboard'
    ? { display: 'block', width: '100%', maxWidth: '728px', height: `${minHeight || 90}px`, margin: '0 auto' }
    : layout === 'rectangle'
    ? { display: 'block', width: '100%', maxWidth: '336px', height: `${minHeight || 250}px`, margin: '0 auto' }
    : { display: 'block', width: '100%', minHeight: `${minHeight || 120}px`, margin: '0 auto' };

  // Fallback/placeholder when AdSense is not loaded or using test slots
  if (isPlaceholderSlot || adError) {
    return (
      <div className={`ads-container ${className}`}>
        <div 
          className="flex items-center justify-center rounded-xl border border-dashed border-border bg-surface/70"
          style={style}
        >
          <div className="text-center p-4">
            <p className="text-xs font-medium text-text-secondary">
              {label}
            </p>
            {isPlaceholderSlot && (
              <p className="mt-1 text-xs text-text-secondary">
                Configure seu Ad Slot no painel
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`ads-container ${className}`}>
      {label && (
        <p className="mb-2 text-center text-xs font-medium text-text-secondary">
          {label}
        </p>
      )}
      <ins
        className="adsbygoogle"
        style={style}
        data-ad-client={adClient}
        data-ad-slot={adSlot}
        data-ad-format={layout === 'in-article' ? 'fluid' : 'auto'}
        data-full-width-responsive="true"
      />
    </div>
  );
}

export function AdSenseScript() {
  useEffect(() => {
    const scriptId = 'adsense-script';

    if (document.getElementById(scriptId)) {
      return;
    }

    const script = document.createElement('script');
    script.id = scriptId;
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6076119895678197';
    document.head.appendChild(script);
  }, []);

  return null;
}

// IMPORTANT: Replace these placeholder slots with your actual AdSense ad unit IDs
// You can find them in your AdSense dashboard under Ads > Ad units
export function AdLeaderboard() {
  return <AdSense adSlot="1234567890" layout="leaderboard" />;
}

export function AdRectangle() {
  return <AdSense adSlot="1234567891" layout="rectangle" />;
}

export function AdInArticle() {
  return <AdSense adSlot="1234567892" layout="in-article" />;
}

export function AdSlot({
  className = '',
  format = 'display',
  label = 'Publicidade',
  minHeight = 120,
  slot = '1234567890',
}: {
  className?: string;
  format?: 'in-article' | 'display' | 'rectangle' | 'leaderboard';
  label?: string;
  minHeight?: number;
  slot?: string;
}) {
  return (
    <section className={`px-4 ${className}`}>
      <div className="mx-auto max-w-6xl">
        <AdSense
          adSlot={slot}
          className="my-6 md:my-8"
          label={label}
          layout={format}
          minHeight={minHeight}
        />
      </div>
    </section>
  );
}

export function AdSlotTop() {
  return <AdSlot format="leaderboard" minHeight={120} slot="1234567890" />;
}

export function AdSlotMiddle() {
  return <AdSlot format="in-article" minHeight={160} slot="1234567892" />;
}

export function AdSlotBottom() {
  return (
    <AdSlot
      className="hidden md:block"
      format="leaderboard"
      label="Publicidade opcional"
      minHeight={100}
      slot="1234567893"
    />
  );
}
