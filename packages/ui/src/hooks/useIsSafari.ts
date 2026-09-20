'use client';

import { useState, useEffect } from 'react';

/**
 * Detects if the current browser is Safari.
 * Returns false during SSR and updates on client mount.
 */
export function useIsSafari(): boolean {
  const [isSafari, setIsSafari] = useState(false);

  useEffect(() => {
    const ua = navigator.userAgent;
    // Safari: contains "Safari" but NOT "Chrome" (Chrome also has Safari in UA)
    const safari = /Safari/.test(ua) && !/Chrome/.test(ua) && !/Chromium/.test(ua);
    setIsSafari(safari);
  }, []);

  return isSafari;
}
