import { Idiomorph } from "idiomorph";
/**
 *
 * @param {Element | string} target - Element or CSS selector
 * @param {string | Node} content - HTML string or DOM node
 * @param {Parameters<typeof Idiomorph.morph>[2]} [config] - Idiomorph config
 */
export declare function morph(target: Element | string, content: string | Node, config?: Parameters<typeof Idiomorph.morph>[2]): Node[] | Promise<Node[]>;
/**
 * @param {string | Node} content
 * @param {"before" | "start" | "end" | "after" | "into"}  position
 * @param {Element} target
 */
export declare function put(content: string | Node, position: "before" | "start" | "end" | "after" | "into", target: Element): void;
/**
 *
 * @param {string} html
 * @returns {DocumentFragment}
 */
export declare function toFragment(html: string): DocumentFragment;
export type CustomEventName = {
    [K in keyof HTMLElementEventMap]: HTMLElementEventMap[K] extends CustomEvent ? K : never;
}[keyof HTMLElementEventMap];
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
export declare function emit<K extends CustomEventName>(target: EventTarget, type: K, detail: HTMLElementEventMap[K] extends CustomEvent<infer D> ? D : never, { bubbles }?: {
    bubbles?: boolean;
}): boolean;
//# sourceMappingURL=dom.d.ts.map