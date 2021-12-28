export declare function unpackStreamId(packed: string): string[];
export declare function useLegacyAPI(): boolean;
export declare function sleep(duration: number): Promise<void>;
export declare const getResizeObserver: () => ResizeObserver;
export declare const getIntersectionObserver: () => IntersectionObserver;
export interface ObservableMediaElement extends HTMLMediaElement {
    handleResize: (entry: ResizeObserverEntry) => void;
    handleVisibilityChanged: (entry: IntersectionObserverEntry) => void;
}
