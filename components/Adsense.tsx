'use client';

import { useEffect } from 'react';

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
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      } catch (err) {
        console.error('AdSense error:', err);
      }
    }
  }, []);

  const style = layout === 'leaderboard' 
    ? { display: 'block', width: '728px', height: '90px', margin: '20px auto' }
    : layout === 'rectangle'
    ? { display: 'block', width: '300px', height: '250px', margin: '20px auto' }
    : { display: 'block', width: '100%', height: 'auto', margin: '20px auto' };

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

export function AdLeaderboard() {
  return <AdSense adSlot="1234567890" layout="leaderboard" />;
}

export function AdRectangle() {
  return <AdSense adSlot="1234567891" layout="rectangle" />;
}

export function AdInArticle() {
  return <AdSense adSlot="1234567892" layout="in-article" />;
}
