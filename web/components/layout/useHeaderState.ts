'use client';

import { useEffect, useState } from 'react';

/** Within this distance of the top the header is always expanded. */
const TOP_ZONE = 80;

export interface HeaderState {
  /** Scrolling down past the top zone: only the navigation stays. */
  isCondensed: boolean;
  /** Within the top zone: the bar sits on the page with no fill of its own. */
  isAtTop: boolean;
}

/**
 * Header · Scroll states (Design.pen): scrolling down more than 80px condenses the header,
 * any scroll up expands it, and within 80px of the top it is always expanded.
 */
export function useHeaderState(): HeaderState {
  const [state, setState] = useState<HeaderState>({ isCondensed: false, isAtTop: true });

  useEffect(() => {
    let lastY = window.scrollY;
    let frame = 0;

    const update = () => {
      frame = 0;
      const y = window.scrollY;
      const isAtTop = y < TOP_ZONE;
      const goingDown = y > lastY;
      const moved = y !== lastY;
      lastY = y;
      setState((previous) => {
        const isCondensed = isAtTop ? false : moved ? goingDown : previous.isCondensed;
        return previous.isCondensed === isCondensed && previous.isAtTop === isAtTop
          ? previous
          : { isCondensed, isAtTop };
      });
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return state;
}
