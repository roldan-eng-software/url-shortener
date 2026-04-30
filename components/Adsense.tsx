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
}

export function AdSense({ 
  adSlot, 
  adClient = 'ca-pub-6076119895678197',
  layout = 'display' 
}: AdSenseProps) {
  const [adError, setAdError] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (err) {
        console.error('AdSense error:', err);
        setAdError(true);
      }
    }
  }, []);

  const isPlaceholderSlot = adSlot.startsWith('123456');

  const style = layout === 'leaderboard' 
    ? { display: 'block', width: '728px', height: '90px', margin: '20px auto' }
    : layout === 'rectangle'
    ? { display: 'block', width: '300px', height: '250px', margin: '20px auto' }
    : { display: 'block', width: '100%', height: 'auto', margin: '20px auto' };

  // Fallback/placeholder when AdSense is not loaded or using test slots
  if (isPlaceholderSlot || adError) {
    return (
      <div className="ads-container my-8">
        <div 
          className="bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center"
          style={style}
        >
          <div className="text-center p-4">
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
              Espaço Publicitário
            </p>
            {isPlaceholderSlot && (
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                Configure seu Ad Slot no painel
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ads-container my-8">
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
