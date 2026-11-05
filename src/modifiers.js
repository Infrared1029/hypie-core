// @ts-check

/**
 * generic over the event, so a handler typed for a CustomEvent keeps its type
 * @template {Event} E
 * @param {(event: E) => unknown} handler
 * @param {"every" | "all" | "first" | "last" | "none"} mode
 * @returns {(event: E) => void}
 */
export function queued(handler, mode) {
  /**
   * @type {E[]}
   */
  let pending = [];
  let running = false;

  /**
   * @param {E} event
   */
  async function run(event) {
    running = true;
    try {
      await handler(event);
    } catch (e) {
      console.error("hypie: a queued handler failed", e);
    }

    running = false;
    let next = pending.shift();
    if (next) run(next);
  }

  return function (event) {
    if (!running || mode === "every") return run(event);

    // running...
    else if (mode === "all") pending.push(event);
    else if (mode === "first" && !pending.length) pending.push(event);
    else if (mode === "last") pending = [event];
  };
}

/**
 *
 * @template {(...args: any[]) => any} T
 * @param {T} fn
 * @param {number} ms
 * @returns {(...args: Parameters<T>) => void}
 */
export function debounced(fn, ms) {
  /**
   * @type {ReturnType<typeof setTimeout> | undefined}
   */
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
}

/**
 *
 * @template {(...args: any[]) => any} T
 * @param {T} fn
 * @param {number} ms
 * @returns {(...args: Parameters<T>) => void}
 */
export function throttled(fn, ms) {
  let last = 0;

  return (...args) => {
    let now = Date.now();
    if (now - last > ms) {
      last = now;
      fn(...args);
    }
  };
}
