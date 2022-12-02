type EventMap = Record<string, CustomEvent>;

export interface ITypedEventTarget<T extends EventMap> extends EventTarget {
  addEventListener<K extends keyof T>(
    type: K,
    listener: (this: EventTarget, ev: T[K]) => void,
    options?: boolean | AddEventListenerOptions,
  ): void;
  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions,
  ): void;
  removeEventListener<K extends keyof T>(
    type: K,
    listener: (this: EventTarget, ev: T[K]) => void,
    options?: boolean | EventListenerOptions,
  ): void;
  removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventListenerOptions,
  ): void;
}

export type TypedEventTarget<T extends EventMap> = {
  new (): ITypedEventTarget<T>;
  prototype: ITypedEventTarget<T>;
};
