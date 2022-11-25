export function easeOutCubic(p: number): number {
  return 1 - Math.pow(1 - p, 3);
}

export function linear(p: number): number {
  return p;
}
