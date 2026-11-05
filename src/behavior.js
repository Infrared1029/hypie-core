// @ts-check

/**
 * @typedef {(element: HTMLElement, signal: AbortSignal) => void | Promise<void>} BehaviorCallback
 */

/**
 * @type {Map<string, BehaviorCallback>}
 */
const behaviorNameToCallback = new Map();

/**
 * the behaviors running on an element, each with its own controller so one can
 * stop (its name left data-hp-install) without the others
 * @type {WeakMap<Element, Map<BehaviorCallback, AbortController>>}
 */
const elementToRunningBehaviors = new WeakMap();

/**
 * registers a behavior: every element whose data-hp-install names it runs the
 * callback while it's in the document, the signal aborts when it leaves (or the
 * name is removed from data-hp-install)
 * @param {string} name
 * @param {BehaviorCallback} callback
 */
export function behavior(name, callback) {
  behaviorNameToCallback.set(name, callback);
  // registered after start() scanned the page: start it on the elements already
  // naming it (before that, the scan will)
  if (observer && document.readyState !== "loading") {
    document
      .querySelectorAll(`[data-hp-install~="${CSS.escape(name)}"]`)
      .forEach((el) => {
        if (el instanceof HTMLElement) syncBehaviors(el);
      });
  }
}

/**
 *
 * @param {Element} root
 */
function scanDom(root = document.documentElement) {
  [root, ...root.querySelectorAll("[data-hp-install]")].forEach((el) => {
    if (el instanceof HTMLElement) syncBehaviors(el);
  });
}

/**
 * makes the behaviors running on el match its data-hp-install: starts the named
 * ones that aren't running, stops the running ones whose name is gone. runs on
 * insertion and when the attribute changes (e.g. a morph turned an existing node
 * into a behavior host), safe to call again
 * @param {HTMLElement} el
 */
function syncBehaviors(el) {
  const names = el.dataset.hpInstall?.trim().split(/\s+/) ?? [];
  /** @type {Map<BehaviorCallback, string>} the callbacks to run, by their name */
  const wanted = new Map();
  for (const name of names) {
    const cb = behaviorNameToCallback.get(name);
    if (cb) wanted.set(cb, name);
  }

  let running = elementToRunningBehaviors.get(el);
  if (!running) {
    // nothing to run and nothing running, don't track the element
    if (!wanted.size) return;
    running = new Map();
    elementToRunningBehaviors.set(el, running);
  }

  for (const [cb, controller] of running) {
    if (wanted.has(cb)) continue;
    controller.abort();
    running.delete(cb);
  }
  for (const [cb, name] of wanted) {
    if (!running.has(cb)) runBehavior(el, name, cb, running);
  }
}

/**
 * runs one behavior on el, a failure is logged and doesn't stop the others
 * @param {HTMLElement} el
 * @param {string} name
 * @param {BehaviorCallback} behavior
 * @param {Map<BehaviorCallback, AbortController>} running
 */
function runBehavior(el, name, behavior, running) {
  const controller = new AbortController();
  running.set(behavior, controller);

  /** @param {unknown} e */
  const logFailure = (e) => console.error(`hypie: behavior "${name}" failed`, el, e);
  try {
    const fnOut = behavior(el, controller.signal);
    if (fnOut instanceof Promise) fnOut.catch(logFailure);
  } catch (e) {
    logFailure(e);
  }
}

/**
 * stops every behavior on a removed element
 * @param {Element} el
 */
function cleanup(el) {
  elementToRunningBehaviors.get(el)?.forEach((controller) => controller.abort());
  elementToRunningBehaviors.delete(el);
}

/**
 * @type {MutationObserver | undefined}
 */
let observer;

export function start() {
  // scan everything
  // start the mutation observer over the dom
  // any added dom element is checked if its hypie powered
  // if an element is added, apply the behaviors
  // if an element is removed (not moved), apply cleanup
  // if an element's data-hp-install changes in place (a morph), sync its behaviors
  if (observer) return;
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => scanDom());
  } else {
    scanDom();
  }

  observer = new MutationObserver((mutations) => {
    mutations.forEach((m) => {
      // data-hp-install changed on a node that stayed in place
      if (m.type === "attributes") {
        if (m.target.isConnected && m.target instanceof HTMLElement) {
          syncBehaviors(m.target);
        }
        return;
      }

      m.addedNodes.forEach((n) => {
        if (!n.isConnected) return;
        if (n instanceof HTMLElement) {
          scanDom(n);
        }
      });

      m.removedNodes.forEach((n) => {
        if (n.isConnected) return;
        if (n instanceof HTMLElement) {
          [n, ...n.querySelectorAll("[data-hp-install]")].forEach((el) =>
            cleanup(el),
          );
        }
      });
    });
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["data-hp-install"],
  });
}

/**
 * stops watching the document (behaviors already running keep running), start()
 * can be called again
 */
export function stop() {
  observer?.disconnect();
  observer = undefined;
}
