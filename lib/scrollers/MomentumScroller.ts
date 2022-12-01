import { easeOutCubic } from '../eases';
import { debounce, findContainerElement, lerp } from '../utils';
import {
  animateScrolling,
  Scroller,
  ScrollerEventTarget,
  ScrollToOptions,
} from './Scroller';

const delta60 = 16;
const activeWrapperStyle = {
  position: 'fixed',
  width: '100%',
  height: '100%',
  top: 0,
  left: 0,
} as const;

export type MomentumScrollerOptions = {
  wrapper?: Element | string | null;
  content?: Element | string | null;
  intencity?: number;
  autoUpdateLayoutDebounceWait?: number;
};

export class MomentumScroller
  extends (EventTarget as ScrollerEventTarget)
  implements Scroller
{
  public scrollY = window.scrollY;
  private nativeScrollY = window.scrollY;
  private tickerRafId?: number;
  public elapsed = 0;
  public delta = delta60;
  private resizeObserver?: ResizeObserver;
  public readonly wrapper: HTMLElement;
  public readonly content: HTMLElement;
  public isPaused = false;
  private intencity: number;
  private isTranslating = false;
  private isSmoothScrolling = false;
  private isStyled = false;
  private height = this.calcDocumentHeight();

  constructor({
    wrapper = document.querySelector('.neuto-wrapper'),
    content = document.querySelector('.neuto-content'),
    intencity = 0.1,
    autoUpdateLayoutDebounceWait = 200,
  }: MomentumScrollerOptions = {}) {
    super();

    this.intencity = intencity;
    this.wrapper = findContainerElement(wrapper);
    this.content = findContainerElement(content);
    this.init();
    this.initAutoUpdateLayout(autoUpdateLayoutDebounceWait);
  }

  private init() {
    this.forceStyles();
    this.tick(this.elapsed);
    window.addEventListener('focusin', this.handleFocusIn);
    window.addEventListener('scroll', this.handleScroll);
  }

  private forceStyles() {
    /**
     * NOTE:
     *
     * Enforce `overflow: hidden` with important because
     * the `overflow` property of the wrapper element is
     * rewritten to `scroll` by ScrollTrigger.
     */
    const style = document.createElement('style');
    document.head.appendChild(style);
    const internalClassName = 'neuto-wrapper';
    this.wrapper.classList.add(internalClassName);
    const styleSheet = style.sheet;
    styleSheet?.insertRule(
      `.${internalClassName} { overflow: hidden !important; }`,
      0,
    );
  }

  private activateStyles() {
    if (this.isStyled) {
      return;
    }
    this.isStyled = true;
    document.body.style.height = `${this.height}px`;
    Object.assign(this.wrapper.style, activeWrapperStyle);
  }

  private deactivateStyles() {
    if (!this.isStyled) {
      return;
    }
    this.isStyled = false;
    document.body.style.removeProperty('height');
    Object.keys(activeWrapperStyle).forEach((property) => {
      this.wrapper.style.removeProperty(property);
    });
    this.content.style.removeProperty('translate');
  }

  private calcDocumentHeight() {
    const { top, height } = document.body.getBoundingClientRect();
    const offsetY = this.scrollY + top;
    return offsetY + height;
  }

  private initAutoUpdateLayout(debounceWait: number) {
    this.resizeObserver = new ResizeObserver(
      debounce(() => {
        this.height = this.calcDocumentHeight();
      }, debounceWait),
    );
    this.resizeObserver.observe(this.content);
  }

  private handleScroll = () => {
    if (this.isPaused) {
      window.scrollTo({
        top: this.nativeScrollY,
      });
      return;
    }

    this.nativeScrollY = window.scrollY;
  };

  private handleFocusIn = (e: FocusEvent) => {
    const hasFocusVisible = !!document.querySelector(':focus-visible');
    if (!hasFocusVisible) {
      return;
    }
    const { target } = e;
    if (target instanceof HTMLElement) {
      const { top, bottom } = target.getBoundingClientRect();
      const isInView = top >= 0 && bottom <= window.innerHeight;
      if (isInView) return;

      this.scrollTo(this.scrollY + top);
    }
  };

  private tick(time: number) {
    this.delta = time - this.elapsed || delta60;
    this.elapsed = time;

    const oldScrollY = this.scrollY;
    const ratio = 1 - Math.pow(1 - this.intencity, this.delta / delta60);
    this.scrollY =
      Math.floor(lerp(this.scrollY, this.nativeScrollY, ratio) * 100) / 100;

    if (Math.abs(this.scrollY - this.nativeScrollY) < 0.5) {
      this.scrollY = this.nativeScrollY;
    }

    this.isTranslating = this.isSmoothScrolling || oldScrollY !== this.scrollY;

    if (this.isTranslating) {
      this.activateStyles();
      this.content.style.translate = `0 -${this.scrollY}px`;
      this.dispatchEvent(new CustomEvent('scroll', { detail: this.scrollY }));
    } else {
      this.deactivateStyles();
    }

    this.tickerRafId = requestAnimationFrame((time) => {
      this.tick(time);
    });
  }

  public scrollTo(value: number): number;
  public scrollTo(value: number, options?: ScrollToOptions): Promise<void>;
  public scrollTo(
    value: number,
    { duration = 0, ease = easeOutCubic }: ScrollToOptions = {},
  ) {
    const destination = Math.max(value, 0);
    if (duration === 0) {
      window.scrollTo({
        top: destination,
      });
      if (this.scrollY !== destination) {
        this.scrollY = destination;
      }
      return destination;
    }

    const from = this.scrollY;
    const delta = destination - from;
    this.isSmoothScrolling = true;
    return animateScrolling({
      onProgress: (progress) => {
        this.scrollTo(from + delta * progress);
      },
      duration,
      ease,
      onCompleteOrStop: () => {
        this.isSmoothScrolling = false;
      },
    });
  }

  public paused(paused: boolean) {
    this.isPaused = paused;
  }

  public dispose() {
    this.resizeObserver?.disconnect();
    window.removeEventListener('scroll', this.handleScroll);
    window.removeEventListener('focusin', this.handleFocusIn);
    if (this.tickerRafId != null) {
      cancelAnimationFrame(this.tickerRafId);
    }
    Object.assign(this.wrapper.style, {
      position: '',
      width: '',
      height: '',
      top: '',
      left: '',
    });
    this.content.style.removeProperty('translate');
  }
}
