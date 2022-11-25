export function lerp(x: number, y: number, p: number) {
  return x + (y - x) * p;
}
export function findContainerElement(
  val: string | Element | null,
): HTMLElement {
  const targetEl =
    typeof val === 'string'
      ? document.querySelector(val)
      : val instanceof Element
      ? val
      : null;

  if (!(targetEl instanceof HTMLElement)) {
    throw new TypeError(
      `${val} is invalid value as HTMLElement for Neuto wrapper.`,
    );
  }
  return targetEl;
}

export function debounce<T extends unknown[], U>(
  fn: (...args: T) => U,
  wait: number,
): (...args: T) => void {
  if (wait === 0) {
    return fn;
  }

  let timerId: number | undefined;
  return (...args) => {
    window.clearTimeout(timerId);
    timerId = window.setTimeout(() => fn(...args), wait);
  };
}
