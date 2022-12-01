import { test, expect, vi } from 'vitest';
import { Animation } from './Animation';

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
  const animation = new Animation(onProgress);
  await animation.play({
    duration: 500,
  });
  expect(onProgress).toBeCalled();
  expect(onProgress.mock.calls.length).toBeGreaterThan(1);
  expect(target.value).toBe(100);
});

test('can stop animation', async () => {
  const target = { value: 0 };
  const onProgress = vi.fn((p: number) => {
    target.value = p * 100;
  });
  const duration = 500;
  const animation = new Animation(onProgress);
  animation.play({
    duration,
  });
  await sleep(duration / 2);
  animation.stop();
  expect(onProgress).toBeCalled();
  expect(target.value).not.toBe(100);
});
