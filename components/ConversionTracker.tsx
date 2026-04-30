'use client';

import { useEffect } from 'react';
import { trackEvent } from './GoogleAnalytics';

export function ConversionTracker() {
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target instanceof Element ? event.target.closest<HTMLElement>('[data-track]') : null;
      if (!target) return;

      trackEvent(
        target.dataset.trackCategory || 'engagement',
        target.dataset.track || 'click',
        target.dataset.trackLabel
      );
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return null;
}
