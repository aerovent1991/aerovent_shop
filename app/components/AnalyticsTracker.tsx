"use client";
import { useEffect } from 'react';
import { trackEvent } from '@/app/lib/track';

export function AnalyticsTracker() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const key = 'session_tracked';
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, '1');
    trackEvent({ eventType: 'session_start' });
  }, []);

  return null;
}
