# hypie-core

Behaviors for server-rendered HTML. The server names what an element does with
`data-hp-install`, and the matching behavior runs while the element is in the
document. When it's removed, or the name is taken out of `data-hp-install`, the
behavior's `AbortSignal` aborts, which removes every listener it added with
`{ signal }`. Elements swapped in later (fetched HTML, a morph) work the same way.
There is no build step and no virtual DOM: it's plain DOM with a `MutationObserver`.

## Install

From a GitHub tag:

```sh
npm install github:Infrared1029/hypie-core#v0.1.0
```

## Example

```html
<button data-hp-install="copy-link" data-url="https://example.com">copy</button>
```

```js
import { behavior, start } from "hypie-core";

behavior("copy-link", (button, signal) => {
  button.addEventListener(
    "click",
    () => navigator.clipboard.writeText(button.dataset.url),
    { signal }, // removed automatically when the button leaves the page
  );
});

start();
```

An element can install several behaviors (`data-hp-install="a b"`), each with its
own signal. A behavior can be async; a failure is logged and doesn't stop the others.

## Entry points

- **`hypie-core`**
  - `behavior(name, callback)` registers a behavior. Registering one after `start()`
    also starts it on the elements already naming it.
  - `start()` scans the page and starts watching it.
  - `stop()` stops watching. Behaviors already running keep running, and `start()`
    can be called again.
- **`hypie-core/dom`**
  - `emit(target, type, detail)` dispatches a bubbling `CustomEvent`. With TypeScript,
    the name and detail are checked against the events you add to
    `HTMLElementEventMap` with `declare global`.
  - `toFragment(html)` turns an HTML string into a `DocumentFragment`.
  - `morph(target, content)` morphs an element into new HTML, using
    [idiomorph](https://github.com/bigskysoftware/idiomorph).
  - `put(content, position, target)` inserts content `before` / `after` the target,
    at its `start` / `end`, or `into` it, replacing its children.
- **`hypie-core/modifiers`**: wrappers for event handlers.
  - `queued(handler, mode)` controls what happens to events that arrive while an
    async handler is still running:
    - `every` runs them all at once
    - `all` queues them all
    - `first` keeps the first
    - `last` keeps the latest
    - `none` drops them
  - `debounced(fn, ms)` runs `fn` once calls have stopped for `ms`.
  - `throttled(fn, ms)` runs `fn` at most once per `ms`, on the first call.

The source is plain JavaScript checked by TypeScript through JSDoc. `dist/` holds the
generated type declarations, so run `npm run build` before tagging a release.
