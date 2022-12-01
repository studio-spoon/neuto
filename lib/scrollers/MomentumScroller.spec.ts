import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { MomentumScroller } from './MomentumScroller';

let momentumScroller: MomentumScroller;
let wrapperEl: HTMLDivElement;
let contentEl: HTMLDivElement;

async function nextTick(cb: () => void) {
  return new Promise<void>((resolve) => {
    requestAnimationFrame(() => {
      cb();
      resolve();
    });
  });
}

async function waitFor(cond: () => boolean) {
  return new Promise<void>((resolve) => {
    const tick = () => {
      const result = cond();
      if (result) {
        resolve();
        return;
      }
      requestAnimationFrame(tick);
    };

    tick();
  });
}

function setupHtml() {
  const div = document.createElement('div');
  div.innerHTML = `
    <div class="neuto-wrapper">
      <div class="neuto-content">
        <h1>Testing</h1>
      </div>
    </div>
  `;

  /* eslint-disable @typescript-eslint/no-non-null-assertion */
  return {
    outerEl: div,
    wrapperEl: div.querySelector<HTMLDivElement>('.neuto-wrapper')!,
    contentEl: div.querySelector<HTMLDivElement>('.neuto-content')!,
  };
  /* eslint-enable @typescript-eslint/no-non-null-assertion */
}

beforeEach(async () => {
  const { outerEl, wrapperEl: wrapper, contentEl: content } = setupHtml();
  wrapperEl = wrapper;
  contentEl = content;
  document.body.appendChild(outerEl);
  momentumScroller = new MomentumScroller();

  momentumScroller.scrollTo(0);
  return new Promise<void>((resolve) =>
    requestAnimationFrame(() => {
      resolve();
    }),
  );
});

afterEach(() => {
  momentumScroller.dispose();
  document.body.innerHTML = '';
});

test('can scroll', () => {
  const destination = 100;
  momentumScroller.scrollTo(destination);
  expect(momentumScroller.scrollY).toBe(destination);
  expect(window.scrollY).toBe(destination);
});

test('can smooth scroll', async () => {
  const cb = vi.fn();
  const destination = 100;
  const duration = 200;
  momentumScroller.addEventListener('scroll', cb);
  await momentumScroller.scrollTo(destination, {
    duration,
  });
  expect(momentumScroller.scrollY).toBe(destination);
  expect(window.scrollY).toBe(destination);
  expect(cb.mock.calls.length).toBeGreaterThan(1);
  momentumScroller.removeEventListener('scroll', cb);
});

test('can pause scrolling', () => {
  momentumScroller.paused(true);
  window.scrollTo({ top: 1000 });
  expect(momentumScroller.scrollY).toBe(0);
  expect(window.scrollY).toBe(0);
  expect(momentumScroller.isPaused).toBeTruthy();
  momentumScroller.paused(false);
  expect(momentumScroller.isPaused).toBeFalsy();
});

test('can momentum scrolling', async () => {
  const top = 100;
  window.scrollTo({ top });
  await nextTick(() => {
    expect(momentumScroller.scrollY).toBeLessThan(top);
  });
});

test('wrapper element should be `position: fixed` on momentum scrolling', async () => {
  const initialStyle = window.getComputedStyle(wrapperEl);
  expect(initialStyle.overflow).toBe('hidden');
  expect(initialStyle.position).not.toBe('fixed');

  window.scrollTo({ top: 100 });
  await nextTick(() => {
    const activeStyle = window.getComputedStyle(wrapperEl);
    expect(activeStyle.position).toBe('fixed');
  });
  await waitFor(() => momentumScroller.scrollY === 100);
  await nextTick(() => {
    const finalStyle = window.getComputedStyle(wrapperEl);
    expect(finalStyle.position).not.toBe('fixed');
  });
});

test('content element should have translate property on momentum scrolling', async () => {
  /**
   * NOTE:
   * For some reason, removeProperty does not work correctly in JSDOM,
   * so I spy it and mock implementation.
   */
  const removePropertySpy = vi
    .spyOn(contentEl.style, 'removeProperty')
    .mockImplementation((property) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      contentEl.style[property as any] = '';
      return '';
    });
  expect(contentEl.style.translate).toBeFalsy();
  window.scrollTo({ top: 100 });
  await nextTick(() => {
    expect(contentEl.style.translate).toBeTruthy();
  });
  await waitFor(() => momentumScroller.scrollY === 100);
  await nextTick(() => {
    expect(removePropertySpy).toBeCalledWith('translate');
    expect(contentEl.style.translate).toBeFalsy();
  });
});
