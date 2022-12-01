import { beforeAll, beforeEach, expect, test, vi } from 'vitest';
import { NormalScroller } from './NormalScroller';

let normalScroller: NormalScroller;

beforeAll(() => {
  normalScroller = new NormalScroller();
});

beforeEach(() => {
  normalScroller.scrollTo(0);
});

test('can scroll', () => {
  const destination = 100;
  normalScroller.scrollTo(destination);
  expect(normalScroller.scrollY).toBe(destination);
  expect(window.scrollY).toBe(destination);
});

test('can smooth scroll', async () => {
  const cb = vi.fn();
  const destination = 100;
  const duration = 200;
  normalScroller.addEventListener('scroll', cb);
  await normalScroller.scrollTo(destination, {
    duration,
  });
  expect(normalScroller.scrollY).toBe(destination);
  expect(window.scrollY).toBe(destination);
  expect(cb.mock.calls.length).toBeGreaterThan(1);
  normalScroller.removeEventListener('scroll', cb);
});

test('can pause scrolling', () => {
  normalScroller.paused(true);
  window.scrollTo({ top: 1000 });
  expect(normalScroller.scrollY).toBe(0);
  expect(window.scrollY).toBe(0);
  expect(normalScroller.isPaused).toBeTruthy();
  normalScroller.paused(false);
  expect(normalScroller.isPaused).toBeFalsy();
});
