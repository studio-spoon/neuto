export function lerp(x: number, y: number, p: number) {
  return x + (y - x) * p;
}
export function findContainerElement(val: string | Element | null): HTMLElement {
  const targetEl = typeof val === 'string' ? document.querySelector(val) : val instanceof Element ? val : null;

  if (!(targetEl instanceof HTMLElement)) {
    throw new TypeError(`${val} is invalid value as HTMLElement for Neuto wrapper.`);
  }
  return targetEl;
}
