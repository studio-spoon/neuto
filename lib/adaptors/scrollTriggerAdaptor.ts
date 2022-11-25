import 'gsap';
import type ScrollTrigger from 'gsap/ScrollTrigger';
import { Adaptor, MomentumScroller } from '../scrollers/MomentumScroller';

export function scrollTriggerAdaptor(
  ScrollTriggerCore: typeof ScrollTrigger,
): Adaptor {
  return (momentumScroller: MomentumScroller) => {
    momentumScroller.addEventListener('scroll', ScrollTriggerCore.update);

    ScrollTriggerCore.scrollerProxy(momentumScroller.wrapper, {
      content: momentumScroller.content,
      scrollTop(value) {
        return typeof value === 'number'
          ? momentumScroller.scrollTo(value)
          : momentumScroller.scrollY;
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
    });

    ScrollTriggerCore.defaults({
      scroller: momentumScroller.wrapper,
    });

    let tmp = 0;
    const handleRefreshInit = () => {
      tmp = momentumScroller.scrollY;
      momentumScroller.scrollTo(0);
    };
    ScrollTriggerCore.addEventListener('refreshInit', handleRefreshInit);
    const handleRefresh = () => {
      momentumScroller.scrollTo(tmp);
      tmp = 0;
    };
    ScrollTriggerCore.addEventListener('refresh', handleRefresh);
  };
}
