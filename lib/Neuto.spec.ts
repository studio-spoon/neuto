import { test, expect, vi, afterEach } from 'vitest';
import { Neuto } from './Neuto';
import { MomentumScroller } from './scrollers/MomentumScroller';
import { NormalScroller } from './scrollers/NormalScroller';
import * as devices from './devices';

/**
 * NOTE:
 *
 * For detailed testing refer to the respective spec.ts files.
 */

vi.mock('./scrollers/MomentumScroller', () => ({
  MomentumScroller: vi.fn(),
}));

vi.mock('./scrollers/NormalScroller', () => ({
  NormalScroller: vi.fn(),
}));

afterEach(() => {
  vi.restoreAllMocks();
});

test('should use momentum scroller', () => {
  vi.spyOn(devices, 'isTouchOnly').mockImplementation(() => false);
  const neuto = new Neuto();
  expect(neuto.isMomentumScrolling).toBe(true);
  expect(MomentumScroller).toBeCalled();
  expect(NormalScroller).not.toBeCalled();
});

test('should use normal scroller', () => {
  vi.spyOn(devices, 'isTouchOnly').mockImplementation(() => true);
  const neuto = new Neuto();
  expect(neuto.isMomentumScrolling).toBe(false);
  expect(NormalScroller).toBeCalled();
  expect(MomentumScroller).not.toBeCalled();
});
