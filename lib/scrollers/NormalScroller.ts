import { easeOutCubic } from '../eases';
import {
  animateScrolling,
  Scroller,
  ScrollerEventTarget,
  ScrollToOptions,
} from './Scroller';

export class NormalScroller
  extends (EventTarget as ScrollerEventTarget)
  implements Scroller
{
  public scrollY = window.scrollY;
  public isPaused = false;
  constructor() {
    super();
    window.addEventListener('scroll', this.handleScroll);
  }

  private handleScroll = () => {
    if (this.isPaused) {
      window.scrollTo({
        top: this.scrollY,
      });
      return;
    }

    this.scrollY = window.scrollY;
    this.dispatchEvent(new CustomEvent('scroll', { detail: this.scrollY }));
  };

  public scrollTo(value: number): void;
  public scrollTo(value: number, options?: ScrollToOptions): Promise<void>;
  public scrollTo(
    value: number,
    { duration = 0, ease = easeOutCubic }: ScrollToOptions = {},
  ) {
    if (duration === 0) {
      window.scrollTo({
        top: value,
      });
      return value;
    }

    const from = this.scrollY;
    const delta = value - from;
    return animateScrolling({
      onProgress: (progress) => {
        window.scrollTo({
          top: from + delta * progress,
        });
      },
      duration,
      ease,
    });
  }

  public paused(paused: boolean): void {
    this.isPaused = paused;
  }
  public dispose(): void {
    window.removeEventListener('scroll', this.handleScroll);
  }
}
