export type BehaviorCallback = (element: HTMLElement, signal: AbortSignal) => void | Promise<void>;
/**
 * registers a behavior: every element whose data-hp-install names it runs the
 * callback while it's in the document, the signal aborts when it leaves (or the
 * name is removed from data-hp-install)
 * @param {string} name
 * @param {BehaviorCallback} callback
 */
export declare function behavior(name: string, callback: BehaviorCallback): void;
export declare function start(): void;
/**
 * stops watching the document (behaviors already running keep running), start()
 * can be called again
 */
export declare function stop(): void;
//# sourceMappingURL=behavior.d.ts.map