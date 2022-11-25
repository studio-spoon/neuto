import { isTouchOnly } from './devices';
import {
  MomentumScroller,
  MomentumScrollerOptions,
} from './scrollers/MomentumScroller';
import { NormalScroller } from './scrollers/NormalScroller';
import { NeutoEventMap, Scroller, ScrollToOptions } from './scrollers/Scroller';
export { type NeutoScrollEvent } from './scrollers/Scroller';

export type NeutoOptions = MomentumScrollerOptions;

export class Neuto implements Omit<Scroller, 'dispatchEvent'> {
  private readonly scroller: Scroller;
  constructor(options: NeutoOptions) {
    this.scroller = isTouchOnly()
      ? new NormalScroller()
      : new MomentumScroller(options);
  }

  public get scrollY(): number {
    return this.scroller.scrollY;
  }

  public get isPaused(): boolean {
    return this.scroller.isPaused;
  }

  public dispose() {
    this.scroller.dispose();
  }

  public addEventListener<K extends keyof NeutoEventMap>(
    type: K,
    listener: (this: EventTarget, ev: NeutoEventMap[K]) => void,
    options?: boolean | AddEventListenerOptions,
  ): void {
    this.scroller.addEventListener(type, listener, options);
  }

  public removeEventListener<K extends keyof NeutoEventMap>(
    type: K,
    listener: (this: EventTarget, ev: NeutoEventMap[K]) => void,
    options?: boolean | AddEventListenerOptions,
  ): void {
    this.scroller.removeEventListener(type, listener, options);
  }

  public scrollTo(value: number): void;
  public scrollTo(
    value: number,
    options?: ScrollToOptions | undefined,
  ): Promise<void>;
  public scrollTo(value: number, options?: ScrollToOptions) {
    return this.scroller.scrollTo(value, options);
  }

  public paused(paused: boolean): void {
    this.scroller.paused(paused);
  }
}
