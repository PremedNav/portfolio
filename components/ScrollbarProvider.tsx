'use client';

import { useEffect } from 'react';
import { OverlayScrollbars } from 'overlayscrollbars';
import 'overlayscrollbars/overlayscrollbars.css';

export default function ScrollbarProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const instance = OverlayScrollbars(document.body, {
      scrollbars: {
        theme: 'os-theme-dark os-theme-custom',
        autoHide: 'scroll',
        autoHideDelay: 800,
        autoHideSuspend: true,
      },
      overflow: {
        x: 'hidden',
      },
    });

    return () => instance.destroy();
  }, []);

  return <>{children}</>;
}
