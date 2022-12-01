import { test, expect, vi, describe } from 'vitest';
import { animateScrolling } from './Scroller';

async function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

test('can play animation', async () => {
  const target = { value: 0 };
  const onProgress = vi.fn((p: number) => {
    target.value = p * 100;
  });
  const onCompleteOrStop = vi.fn();
  await animateScrolling({
    onProgress,
    duration: 500,
    onCompleteOrStop,
  });
  expect(onProgress).toBeCalled();
  expect(onProgress.mock.calls.length).toBeGreaterThan(1);
  expect(target.value).toBe(100);
  expect(onCompleteOrStop).toBeCalled();
});

describe('can stop animation by some events', async () => {
  const events: [
    string,
    typeof WheelEvent | typeof MouseEvent | typeof TouchEvent,
  ][] = [
    ['wheel', WheelEvent],
    ['mousedown', MouseEvent],
    ['touchstart', TouchEvent],
  ];

  events.forEach(async ([type, Event]) => {
    test(`can stop animation by ${type} event`, async () => {
      const onCompleteOrStop = vi.fn();
      const duration = 500;
      animateScrolling({
        onProgress: vi.fn(),
        duration,
        onCompleteOrStop,
      });

      await sleep(duration / 2);
      expect(onCompleteOrStop).not.toBeCalled();
      window.dispatchEvent(new Event(type));
      expect(onCompleteOrStop).toBeCalled();
    });
  });
});
