"use client";

import React, { useEffect, useLayoutEffect, useRef, useCallback } from 'react';
import Lenis from 'lenis';
import './ScrollStack.css';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

// ─── Types ────────────────────────────────────────────────────────────────────

interface TransformData {
  translateY: number;
  scale: number;
  rotation: number;
  blur: number;
}

export interface ScrollStackItemProps {
  children: React.ReactNode;
  itemClassName?: string;
}

export interface ScrollStackProps {
  children: React.ReactNode;
  className?: string;
  itemDistance?: number;
  itemScale?: number;
  itemStackDistance?: number;
  stackPosition?: string | number;
  scaleEndPosition?: string | number;
  baseScale?: number;
  scaleDuration?: number;
  rotationAmount?: number;
  blurAmount?: number;
  useWindowScroll?: boolean;
  onStackComplete?: () => void;
}

// ─── ScrollStackItem ──────────────────────────────────────────────────────────

export const ScrollStackItem: React.FC<ScrollStackItemProps> = ({
  children,
  itemClassName = '',
}) => (
  <div className={`scroll-stack-card ${itemClassName}`.trim()}>{children}</div>
);

// ─── ScrollStack ──────────────────────────────────────────────────────────────

const ScrollStack: React.FC<ScrollStackProps> = ({
  children,
  className = '',
  itemDistance = 100,
  itemScale = 0.03,
  itemStackDistance = 30,
  stackPosition = '20%',
  scaleEndPosition = '10%',
  baseScale = 0.85,
  scaleDuration = 0.5,
  rotationAmount = 0,
  blurAmount = 0,
  useWindowScroll = false,
  onStackComplete,
}) => {
  const scrollerRef   = useRef<HTMLDivElement | null>(null);
  const stackCompletedRef   = useRef<boolean>(false);
  const animationFrameRef   = useRef<number | null>(null);
  const lenisRef            = useRef<Lenis | null>(null);
  const cardsRef            = useRef<HTMLElement[]>([]);
  const lastTransformsRef   = useRef<Map<number, TransformData>>(new Map());

  // ── Helpers ──────────────────────────────────────────────────────────────

  const calculateProgress = useCallback(
    (scrollTop: number, start: number, end: number): number => {
      if (scrollTop < start) return 0;
      if (scrollTop > end)   return 1;
      return (scrollTop - start) / (end - start);
    },
    []
  );

  const parsePercentage = useCallback(
    (value: string | number, containerHeight: number): number => {
      if (typeof value === 'string' && value.includes('%')) {
        return (parseFloat(value) / 100) * containerHeight;
      }
      return parseFloat(value as string);
    },
    []
  );

  /**
   * When using Lenis in wrapper/content mode (inner scroll),
   * Lenis applies CSS transforms to the content element and sets
   * overflow:hidden on the wrapper — so scroller.scrollTop is always 0.
   * We must read the virtual scroll position from lenis.scroll instead.
   */
  const getScrollData = useCallback(() => {
    if (useWindowScroll) {
      return {
        scrollTop: window.scrollY,
        containerHeight: window.innerHeight,
        scrollContainer: document.documentElement as HTMLElement,
      };
    } else {
      const scroller = scrollerRef.current;
      const scrollTop = lenisRef.current
        ? lenisRef.current.scroll
        : (scroller?.scrollTop ?? 0);
      return {
        scrollTop,
        containerHeight: scroller?.clientHeight ?? 0,
        scrollContainer: scroller,
      };
    }
  }, [useWindowScroll]);

  const getElementOffset = useCallback(
    (element: HTMLElement): number => {
      if (useWindowScroll) {
        return element.getBoundingClientRect().top + window.scrollY;
      } else {
        // offsetTop is relative to positioned ancestor inside the content div —
        // unaffected by Lenis transforms, so positions are always correct.
        return element.offsetTop;
      }
    },
    [useWindowScroll]
  );

  // ── Card transforms ───────────────────────────────────────────────────────

  const updateCardTransforms = useCallback(() => {
    if (!cardsRef.current.length) return;

    const { scrollTop, containerHeight } = getScrollData();
    const stackPositionPx    = parsePercentage(stackPosition,    containerHeight);
    const scaleEndPositionPx = parsePercentage(scaleEndPosition, containerHeight);

    const endElement = (useWindowScroll
      ? document.querySelector('.scroll-stack-end')
      : scrollerRef.current?.querySelector('.scroll-stack-end')) as HTMLElement | null;

    const endElementTop = endElement ? getElementOffset(endElement) : 0;

    cardsRef.current.forEach((card, i) => {
      if (!card) return;

      const cardTop    = getElementOffset(card);
      const triggerStart = cardTop - stackPositionPx - itemStackDistance * i;
      const triggerEnd   = cardTop - scaleEndPositionPx;
      const pinStart     = cardTop - stackPositionPx - itemStackDistance * i;
      const pinEnd       = endElementTop - containerHeight / 2;

      const scaleProgress = calculateProgress(scrollTop, triggerStart, triggerEnd);
      const targetScale   = baseScale + i * itemScale;
      const scale         = 1 - scaleProgress * (1 - targetScale);
      const rotation      = rotationAmount ? i * rotationAmount * scaleProgress : 0;

      let blur = 0;
      if (blurAmount) {
        let topCardIndex = 0;
        for (let j = 0; j < cardsRef.current.length; j++) {
          const jCard = cardsRef.current[j];
          if (!jCard) continue;
          const jCardTop     = getElementOffset(jCard);
          const jTriggerStart = jCardTop - stackPositionPx - itemStackDistance * j;
          if (scrollTop >= jTriggerStart) topCardIndex = j;
        }
        if (i < topCardIndex) blur = Math.max(0, (topCardIndex - i) * blurAmount);
      }

      let translateY = 0;
      const isPinned = scrollTop >= pinStart && scrollTop <= pinEnd;
      if (isPinned) {
        translateY = scrollTop - cardTop + stackPositionPx + itemStackDistance * i;
      } else if (scrollTop > pinEnd) {
        translateY = pinEnd - cardTop + stackPositionPx + itemStackDistance * i;
      }

      // 4dp precision — 2dp causes visible 0.1 px quantization hops at slow speeds
      const newT: TransformData = {
        translateY: Math.round(translateY * 10000) / 10000,
        scale:      Math.round(scale      * 10000) / 10000,
        rotation:   Math.round(rotation   * 10000) / 10000,
        blur:       Math.round(blur       * 10000) / 10000,
      };

      const last = lastTransformsRef.current.get(i);
      const changed =
        !last ||
        Math.abs(last.translateY - newT.translateY) > 0.001 ||
        Math.abs(last.scale      - newT.scale)      > 0.0001 ||
        Math.abs(last.rotation   - newT.rotation)   > 0.001 ||
        Math.abs(last.blur       - newT.blur)        > 0.001;

      if (changed) {
        card.style.transform = `translate3d(0,${newT.translateY}px,0) scale(${newT.scale}) rotate(${newT.rotation}deg)`;
        card.style.filter    = newT.blur > 0 ? `blur(${newT.blur}px)` : '';
        lastTransformsRef.current.set(i, newT);
      }

      if (i === cardsRef.current.length - 1) {
        const inView = scrollTop >= pinStart && scrollTop <= pinEnd;
        if (inView && !stackCompletedRef.current) {
          stackCompletedRef.current = true;
          onStackComplete?.();
        } else if (!inView && stackCompletedRef.current) {
          stackCompletedRef.current = false;
        }
      }
    });
  }, [
    itemScale, itemStackDistance, stackPosition, scaleEndPosition,
    baseScale, rotationAmount, blurAmount, useWindowScroll, onStackComplete,
    calculateProgress, parsePercentage, getScrollData, getElementOffset,
  ]);

  /**
   * Called by the inner Lenis on every scroll tick.
   * Updates data-at-top / data-at-bottom on the scroller element so the
   * global-page virtualScroll filter can decide when to hand off to the page.
   */
  const handleScroll = useCallback((scrollLenis: Lenis) => {
    updateCardTransforms();

    const scroller = scrollerRef.current;
    if (!scroller || !scrollLenis) return;

    // Calculate the scroll position where the last card finishes stacking
    const cards = cardsRef.current;
    let lastCardPinStart = scrollLenis.limit;
    if (cards.length > 0) {
      const lastCard = cards[cards.length - 1];
      if (lastCard) {
        const { containerHeight } = getScrollData();
        const stackPositionPx = parsePercentage(stackPosition, containerHeight);
        const cardTop = getElementOffset(lastCard);
        lastCardPinStart = cardTop - stackPositionPx - itemStackDistance * (cards.length - 1);
      }
    }

    // A tiny 1 px tolerance avoids floating-point issues at the limits
    const atTop    = scrollLenis.scroll <= 1;
    const atBottom = scrollLenis.limit <= 0 || scrollLenis.scroll >= lastCardPinStart - 1;
    scroller.dataset.atTop    = String(atTop);
    scroller.dataset.atBottom = String(atBottom);
  }, [
    updateCardTransforms,
    stackPosition,
    itemStackDistance,
    getScrollData,
    parsePercentage,
    getElementOffset,
  ]);

  // ── Lenis setup ───────────────────────────────────────────────────────────

  const setupLenis = useCallback(() => {
    if (useWindowScroll) {
      // ── Window-level smooth scroll (global Lenis) ──
      const lenis = new Lenis({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        touchMultiplier: 2,
        infinite: false,
        wheelMultiplier: 1,
        lerp: 0.1,
        syncTouch: true,
        syncTouchLerp: 0.075,
      });
      lenis.on('scroll', handleScroll);
      const raf = (time: number) => {
        lenis.raf(time);
        animationFrameRef.current = requestAnimationFrame(raf);
      };
      animationFrameRef.current = requestAnimationFrame(raf);
      lenisRef.current = lenis;
      return lenis;
    } else {
      // ── Nested / inner smooth scroll (wrapper + content mode) ──
      const scroller = scrollerRef.current;
      if (!scroller) return null;
      const content = scroller.querySelector<HTMLElement>('.scroll-stack-inner');
      if (!content) return null;

      const lenis = new Lenis({
        wrapper: scroller,
        content,
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        touchMultiplier: 2,
        infinite: false,
        wheelMultiplier: 1,
        lerp: 0.1,
        syncTouch: true,
        syncTouchLerp: 0.075,
        virtualScroll: (data: any) => {
          const section = scroller.closest("section");
          if (!section) return true;

          const sectionTop = section.getBoundingClientRect().top + window.scrollY;
          const atBottom = scroller.dataset.atBottom === "true";
          const atTop    = scroller.dataset.atTop    === "true";

          if (data.deltaY > 0) {
            // Scrolling down
            if (window.scrollY < sectionTop - 5) return false;
            if (atBottom) return false;
            return true;
          } else {
            // Scrolling up
            if (window.scrollY > sectionTop + 5) return false;
            if (atTop) return false;
            return true;
          }
        }
      });
      lenis.on('scroll', handleScroll);
      const raf = (time: number) => {
        lenis.raf(time);
        animationFrameRef.current = requestAnimationFrame(raf);
      };
      animationFrameRef.current = requestAnimationFrame(raf);
      lenisRef.current = lenis;
      return lenis;
    }
  }, [handleScroll, useWindowScroll]);

  // ── Effect ────────────────────────────────────────────────────────────────

  useIsomorphicLayoutEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const cards = Array.from(
      useWindowScroll
        ? document.querySelectorAll('.scroll-stack-card')
        : scroller.querySelectorAll('.scroll-stack-card')
    ) as HTMLElement[];

    cardsRef.current = cards;
    const transformsCache = lastTransformsRef.current;

    // Initialise limit markers — starts at top, nowhere near bottom
    scroller.dataset.atTop    = 'true';
    scroller.dataset.atBottom = 'false';

    cards.forEach((card, i) => {
      if (i < cards.length - 1) card.style.marginBottom = `${itemDistance}px`;
      card.style.willChange        = 'transform, filter';
      card.style.transformOrigin   = 'top center';
      card.style.backfaceVisibility = 'hidden';
      card.style.transform         = 'translateZ(0)';
      card.style.setProperty('-webkit-transform', 'translateZ(0)');
      card.style.perspective       = '1000px';
      card.style.setProperty('-webkit-perspective', '1000px');
    });

    // Calculate the scroll position where the last card finishes stacking
    let lastCardPinStart = 0;
    if (cards.length > 0) {
      const lastCard = cards[cards.length - 1];
      if (lastCard) {
        const containerHeight = scroller.clientHeight;
        
        let stackPositionPx = 0;
        if (typeof stackPosition === 'string' && stackPosition.includes('%')) {
          stackPositionPx = (parseFloat(stackPosition) / 100) * containerHeight;
        } else {
          stackPositionPx = parseFloat(stackPosition as string);
        }

        const cardTop = lastCard.offsetTop;
        lastCardPinStart = cardTop - stackPositionPx - itemStackDistance * (cards.length - 1);
        
        // Dynamically adjust the inner container height so the scroll limit is exactly lastCardPinStart
        const inner = scroller.querySelector<HTMLElement>('.scroll-stack-inner');
        if (inner && !useWindowScroll) {
          inner.style.height = `${containerHeight + lastCardPinStart}px`;
        }
      }
    }

    setupLenis();
    updateCardTransforms();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      if (lenisRef.current) {
        lenisRef.current.destroy();
        lenisRef.current = null;
      }
      const inner = scroller.querySelector<HTMLElement>('.scroll-stack-inner');
      if (inner) {
        inner.style.height = '';
      }
      stackCompletedRef.current = false;
      cardsRef.current = [];
      transformsCache.clear();
    };
  }, [
    itemDistance, itemScale, itemStackDistance,
    stackPosition, scaleEndPosition, baseScale, scaleDuration,
    rotationAmount, blurAmount, useWindowScroll, onStackComplete,
    setupLenis, updateCardTransforms,
  ]);

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div
      className={`scroll-stack-scroller ${className}`.trim()}
      ref={scrollerRef}
      // No data-lenis-prevent here — the global Lenis's virtualScroll filter
      // dynamically decides when to yield based on data-at-top / data-at-bottom.
    >
      <div className="scroll-stack-inner">
        {children}
        <div className="scroll-stack-end" />
      </div>
    </div>
  );
};

export default ScrollStack;
