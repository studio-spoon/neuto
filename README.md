# Neuto

A light weight, zero dependency, simple momentum scrolling library.

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

### Using with ScrollTrigger

```ts
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { Neuto, withScrollTrigger } from 'neuto';

gsap.registerPlugin(ScrollTrigger);

export const neuto = withScrollTrigger(new Neuto(), ScrollTrigger);
```

### Options

```ts
new Neuto({
  wrapper: '.neuto-wrapper', // wrapper element: HTMLElement | string
  content: '.neuto-content', // content element: HTMLElement | string
  autoUpdateLayoutDebounceWait: 200,
  lerpIntencity: 0.1,
});
```

### Properties and Methods

**WIP**


## License

Licensed under MIT
