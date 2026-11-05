/**
 * generic over the event, so a handler typed for a CustomEvent keeps its type
 * @template {Event} E
 * @param {(event: E) => unknown} handler
 * @param {"every" | "all" | "first" | "last" | "none"} mode
 * @returns {(event: E) => void}
 */
export declare function queued<E extends Event>(handler: (event: E) => unknown, mode: "every" | "all" | "first" | "last" | "none"): (event: E) => void;
/**
 *
 * @template {(...args: any[]) => any} T
 * @param {T} fn
 * @param {number} ms
 * @returns {(...args: Parameters<T>) => void}
 */
export declare function debounced<T extends (...args: any[]) => any>(fn: T, ms: number): (...args: Parameters<T>) => void;
/**
 *
 * @template {(...args: any[]) => any} T
 * @param {T} fn
 * @param {number} ms
 * @returns {(...args: Parameters<T>) => void}
 */
export declare function throttled<T extends (...args: any[]) => any>(fn: T, ms: number): (...args: Parameters<T>) => void;
//# sourceMappingURL=modifiers.d.ts.map