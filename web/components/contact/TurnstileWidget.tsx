'use client';

import { useEffect, useRef, useState } from 'react';
import type { Locale } from '@/lib/i18n';

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement,
        options: {
          sitekey: string;
          language?: string;
          theme?: 'light' | 'dark' | 'auto';
          callback?: (token: string) => void;
          'expired-callback'?: () => void;
          'error-callback'?: () => void;
        },
      ) => string;
      remove: (widgetId: string) => void;
    };
  }
}

const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

interface Props {
  siteKey: string;
  locale: Locale;
}

/**
 * Cloudflare Turnstile spam check. The token travels in a hidden `turnstileToken` field and
 * is verified on the server before any email is sent. The script loads only where a form is
 * shown; its origin is allowed in the CSP (lib/securityHeaders.ts).
 */
export function TurnstileWidget({ siteKey, locale }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [token, setToken] = useState('');

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let widgetId: string | undefined;
    let isCancelled = false;

    const render = () => {
      if (isCancelled || widgetId || !window.turnstile) return;
      widgetId = window.turnstile.render(container, {
        sitekey: siteKey,
        language: locale,
        theme: 'dark',
        callback: setToken,
        'expired-callback': () => setToken(''),
        'error-callback': () => setToken(''),
      });
    };

    let script = document.querySelector<HTMLScriptElement>(`script[src="${SCRIPT_SRC}"]`);
    if (window.turnstile) render();
    else {
      if (!script) {
        script = document.createElement('script');
        script.src = SCRIPT_SRC;
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
      }
      script.addEventListener('load', render, { once: true });
    }

    return () => {
      isCancelled = true;
      script?.removeEventListener('load', render);
      if (widgetId) window.turnstile?.remove(widgetId);
    };
  }, [siteKey, locale]);

  return (
    <>
      <div ref={containerRef} />
      <input type="hidden" name="turnstileToken" value={token} />
    </>
  );
}
