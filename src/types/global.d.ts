declare global {
  interface Window {
    lenis?: {
      scrollTo(
        target: number | string | HTMLElement,
        options?: Record<string, unknown>
      ): void;
      destroy(): void;
      raf(time: number): void;
      on(event: string, callback: (...args: unknown[]) => void): void;
    };
  }
}

export {};


