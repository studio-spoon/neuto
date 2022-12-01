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
