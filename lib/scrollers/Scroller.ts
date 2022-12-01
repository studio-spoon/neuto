import { Animation } from '../Animation';
import { easeOutCubic } from '../eases';
import { TypedEventTarget, ITypedEventTarget } from '../TypedEventTarget';

export type NeutoScrollEvent = CustomEvent<number>;

export type NeutoEventMap = {
  scroll: NeutoScrollEvent;
};

export type ScrollToOptions = {
  duration?: number;
  ease?: (progress: number) => number;
};

export type ScrollerEventTarget = TypedEventTarget<NeutoEventMap>;
export type IScrollerEventTarget = ITypedEventTarget<NeutoEventMap>;

export interface Scroller extends IScrollerEventTarget {
  scrollY: number;
  isPaused: boolean;
  scrollTo(value: number): void;
  scrollTo(value: number, options?: ScrollToOptions): Promise<void>;
  paused(paused: boolean): void;
  dispose(): void;
}

export async function animateScrolling({
  onProgress,
  duration = 500,
  ease = easeOutCubic,
  onCompleteOrStop,
}: {
  duration?: number;
  ease?: (p: number) => number;
  onProgress: (progress: number) => void;
  onCompleteOrStop?: () => void;
}) {
  const animation = new Animation(onProgress);
  const eventTypesForStop = ['wheel', 'mousedown', 'touchstart'];
  const stop = () => {
    removeListeners();
    animation.stop();
    onCompleteOrStop?.();
  };
  const addListeners = () => {
    eventTypesForStop.forEach((eventType) => {
      window.addEventListener(eventType, stop);
    });
  };
  const removeListeners = () => {
    eventTypesForStop.forEach((eventType) => {
      window.removeEventListener(eventType, stop);
    });
  };

  addListeners();
  await animation.play({ duration, ease });
  removeListeners();
  onCompleteOrStop?.();
}
