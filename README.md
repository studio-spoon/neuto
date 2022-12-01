# Neuto

A light weight, zero dependency, simple momentum scrolling library.

## Features

- Keyboard navigation
- Native scrollbar
- History back / forward by trackpad or mouse gestures
- **experimental**: Find on page (**partially supported**)
- Smooth scrolling with custom duration/easing
- gsap/ScrollTrigger integration

**NOTICE: Momentum scrolling is not enabled on touch-only devices.**

## Installation

```
npm i neuto
```

## Usage

### quick start

```html
<body>
  <div class="neuto-wrapper">
    <div class="neuto-content">
      <!-- contents -->
    </div>
  </div>
</body>
```

```ts
import { Neuto } from 'neuto';

const neuto = new Neuto();
```

### Options

| Option                         | Type                    | Default          | Description                        |
|--------------------------------|-------------------------|------------------|------------------------------------|
| `wrapper`                      | `HTMLElement \| string` | `.neuto-wrapper` | Wrapper element or selector for it |
| `content`                      | `HTMLElement \| string` | `.neuto-content` | Content element or selector for it |
| `intencity`                    | `number`                | `0.1`            | Strength of momentum scrolling     |
| `autoUpdateLayoutDebounceWait` | `number`                | `200`            | Debounce time for updating layout  |



### Using with ScrollTrigger

```ts
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { Neuto, withScrollTrigger } from 'neuto';

gsap.registerPlugin(ScrollTrigger);

export const neuto = withScrollTrigger(new Neuto({ /* options */ }), ScrollTrigger);
```

## Properties

| Property              | Type      | Description                                     |
|-----------------------|-----------|-------------------------------------------------|
| `isMomentumScrolling` | `boolean` | Whether Momentum scrolling is enabled           |
| `isPaused`            | `boolean` | Whether the scrolling is in paused state or not |
| `scrollY`             | `number`  | Current Scrolling position                      |

## Methods

| Method | Description | Arguments |
|---|---|---|
| `scrollTo(destination, options)` | Scrolls to the specified position. Smooth scrolling by specifying `duration` as the second argument. | `destination`: number<br>`options`: `{ duration?: number; ease?: (t: number) => number }` |
| `paused(isPaused)` | Pause scrolling. | `isPaused`: boolean |
| `addEventListener(type, callback, options)` | Subscribe to events. | `type`: string<br>`callback`: Function<br>`options`: EventListenerOptions (optional) |
| `removeEventListener(type, callback, options)` | Unsubscribe to events. | `type`: string<br>`callback`: Function<br>`options`: EventListenerOptions (optional) |

## Events

Example:

```ts
neuto.addEventListener('scroll', ({ detail }) => console.log(`current position: ${detail}`));
```

| Event | Description | Callback Arguments |
|---|---|---|
| `scroll` | Fires on scrolling. | `detail: number` - Current scrolling position |




## License

Licensed under MIT
