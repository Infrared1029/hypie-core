import { Idiomorph } from "idiomorph";

/**
 *
 * @param {Element | string} target - Element or CSS selector
 * @param {string | Node} content - HTML string or DOM node
 * @param {Parameters<typeof Idiomorph.morph>[2]} [config] - Idiomorph config
 */
export function morph(target, content, config) {
  const el =
    typeof target === "string" ? document.querySelector(target) : target;
  if (!el) throw new Error(`morph: target not found: ${target}`);

  return Idiomorph.morph(el, content, config);
}


/**
 * @param {string | Node} content
 * @param {"before" | "start" | "end" | "after" | "into"}  position
 * @param {Element} target
 */
export function put(content, position, target) {
  switch (position) {
    case "into":   target.replaceChildren(content); break;
    case "before": target.before(content); break;
    case "start":  target.prepend(content); break;
    case "end":    target.append(content); break;
    case "after":  target.after(content); break;
  }
}

/**
 *
 * @param {string} html
 * @returns {DocumentFragment}
 */
export function toFragment(html) {
  const t = document.createElement("template");
  t.innerHTML = html;
  return t.content;
}

/**
 * the custom events of HTMLElementEventMap (native ones like click aren't
 * CustomEvents, so they're left out of autocomplete)
 * @typedef {{ [K in keyof HTMLElementEventMap]: HTMLElementEventMap[K] extends CustomEvent ? K : never }[keyof HTMLElementEventMap]} CustomEventName
 */

/**
 * dispatches a CustomEvent, the name and detail are checked against
 * HTMLElementEventMap (apps add their events to it with declare global)
 * @template {CustomEventName} K
 * @param {EventTarget} target
 * @param {K} type
 * @param {HTMLElementEventMap[K] extends CustomEvent<infer D> ? D : never} detail
 * @param {{ bubbles?: boolean }} [options]
 */
export function emit(target, type, detail, { bubbles = true } = {}) {
  return target.dispatchEvent(new CustomEvent(type, { detail, bubbles }));
}
