import 'gsap';
import type IScrollTrigger from 'gsap/ScrollTrigger';
import { Neuto } from './Neuto';
import { MomentumScroller } from './scrollers/MomentumScroller';

export function withScrollTrigger(
  neuto: Neuto,
  ScrollTrigger: typeof IScrollTrigger,
): Neuto {
  const scroller = neuto._internalScroller;
  if (!(scroller instanceof MomentumScroller)) {
    return neuto;
  }

  scroller.addEventListener('scroll', ScrollTrigger.update);

  ScrollTrigger.scrollerProxy(scroller.wrapper, {
    content: scroller.content,
    scrollTop(value) {
      return typeof value === 'number'
        ? scroller.scrollTo(value)
        : scroller.scrollY;
    },
    getBoundingClientRect() {
      return {
        top: 0,
        left: 0,
        width: window.innerWidth,
        height: window.innerHeight,
      };
    },
    fixedMarkers: true,
    pinType: 'transform',
  });

  ScrollTrigger.defaults({
    scroller: scroller.wrapper,
  });

  let isEnabledBeforeRefresh = true;
  const handleRefreshInit = () => {
    isEnabledBeforeRefresh = !scroller.isDisabled;
    scroller.disable();
  };
  ScrollTrigger.addEventListener('refreshInit', handleRefreshInit);
  const handleRefresh = () => {
    if (isEnabledBeforeRefresh) {
      scroller.enable();
    }
  };
  ScrollTrigger.addEventListener('refresh', handleRefresh);

  return neuto;
}
