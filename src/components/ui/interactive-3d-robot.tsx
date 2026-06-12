'use client';

import { Suspense, lazy, useEffect } from 'react';
const Spline = lazy(() => import('@splinetool/react-spline'));

interface InteractiveRobotSplineProps {
  scene: string;
  className?: string;
}

export function InteractiveRobotSpline({ scene, className }: InteractiveRobotSplineProps) {
  useEffect(() => {
    const removeSplineLogo = () => {
      const searchAndRemove = (root: Document | ShadowRoot) => {
        if (!root) return;

        // 1. Remove standard anchors containing spline
        const links = root.querySelectorAll('a');
        links.forEach((link) => {
          const href = link.getAttribute('href') || '';
          const text = link.textContent || '';
          if (href.includes('spline') || text.toLowerCase().includes('spline')) {
            link.style.display = 'none';
            link.style.setProperty('display', 'none', 'important');
            link.style.visibility = 'hidden';
            link.style.opacity = '0';
            link.style.pointerEvents = 'none';
          }
        });

        // 2. Remove common wrapper IDs/classes/elements
        const logos = root.querySelectorAll('#spline-logo, #logo, [id*="spline"], [class*="spline"]');
        logos.forEach((el) => {
          const id = el.id || '';
          const classNameStr = typeof el.className === 'string' ? el.className : '';
          const text = el.textContent || '';
          if (
            el.tagName === 'A' ||
            id === 'logo' ||
            id === 'spline-logo' ||
            id.includes('spline') ||
            classNameStr.includes('spline') ||
            text.toLowerCase().includes('spline')
          ) {
            const htmlEl = el as HTMLElement;
            htmlEl.style.display = 'none';
            htmlEl.style.setProperty('display', 'none', 'important');
            htmlEl.style.visibility = 'hidden';
            htmlEl.style.opacity = '0';
            htmlEl.style.pointerEvents = 'none';
          }
        });

        // 3. Recurse into all shadow roots
        const allElements = root.querySelectorAll('*');
        allElements.forEach((el) => {
          if (el.shadowRoot) {
            searchAndRemove(el.shadowRoot);
          }
        });
      };

      searchAndRemove(document);
    };

    // Run immediately, then poll every 200ms for 10 seconds to catch deferred loads
    removeSplineLogo();
    const interval = setInterval(removeSplineLogo, 200);
    const timeout = setTimeout(() => clearInterval(interval), 10000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <Suspense
      fallback={
        <div className={`w-full h-full flex items-center justify-center bg-transparent text-forest ${className}`}>
          <svg className="animate-spin h-5 w-5 text-forest mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l2-2.647z"></path>
          </svg>
        </div>
      }
    >
      
      <Spline
        scene={scene}
        className={className} 
      />
    </Suspense>
  );
}
