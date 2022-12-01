import { beforeAll } from 'vitest';

beforeAll(() => {
  Object.defineProperty(window, 'scrollTo', {
    value: ({ top }: ScrollToOptions) => {
      if (typeof top !== 'number') {
        return;
      }

      if (window.scrollY !== top) {
        window.scrollY = top;
        window.dispatchEvent(new Event('scroll'));
      }
    },
    writable: true,
  });

  Object.defineProperty(window, 'ResizeObserver', {
    value: class ResizeObserver {
      observe() {
        // noop
      }
      unobserve() {
        // noop
      }
      disconnect() {
        // noop
      }
    },
  });
});
