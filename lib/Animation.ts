import { easeOutCubic } from './eases';

export class Animation {
  private rafId: number | null = null;
  private startTime?: number;

  constructor(private onProgress: (progress: number) => void) {}

  public play({
    duration = 500,
    ease = easeOutCubic,
  }: { duration?: number; ease?: (p: number) => number } = {}) {
    return new Promise<void>((resolve) => {
      const animate = (time: number) => {
        if (!this.startTime) {
          this.startTime = time;
        }
        const elapsedTime = time - this.startTime;
        const shouldHaveNextFrame = elapsedTime < duration;

        if (shouldHaveNextFrame) {
          const progress = ease(elapsedTime / duration);
          this.onProgress(progress);
          this.rafId = requestAnimationFrame(animate);
          return;
        } else {
          this.onProgress(1);
          return resolve();
        }
      };
      this.rafId = requestAnimationFrame(animate);
    });
  }

  public stop() {
    if (this.rafId != null) {
      cancelAnimationFrame(this.rafId);
    }
  }
}

if (import.meta.vitest) {
  const { test, expect, vi } = import.meta.vitest;

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
    async function sleep(ms: number) {
      return new Promise((resolve) => {
        setTimeout(resolve, ms);
      });
    }

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
}
