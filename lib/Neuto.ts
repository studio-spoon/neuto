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
  public readonly isMomentumScrolling: boolean;
  constructor(options?: NeutoOptions) {
    this.isMomentumScrolling = !isTouchOnly();
    this.scroller = this.isMomentumScrolling
      ? new MomentumScroller(options)
      : new NormalScroller();
  }

  public get scrollY(): number {
    return this.scroller.scrollY;
  }

  public get isPaused(): boolean {
    return this.scroller.isPaused;
  }

  public get _internalScroller() {
    return this.scroller;
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
