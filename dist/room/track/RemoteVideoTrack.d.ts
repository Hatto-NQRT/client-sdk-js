import { Track } from './Track';
export default class RemoteVideoTrack extends Track {
    /** @internal */
    receiver?: RTCRtpReceiver;
    private prevStats?;
    private elementInfos;
    private autoManaged?;
    private lastVisible?;
    private lastDimensions?;
    constructor(mediaTrack: MediaStreamTrack, sid: string, receiver?: RTCRtpReceiver, autoManaged?: boolean);
    get isAutoManaged(): boolean;
    /** @internal */
    setMuted(muted: boolean): void;
    attach(): HTMLMediaElement;
    attach(element: HTMLMediaElement): HTMLMediaElement;
    detach(): HTMLMediaElement[];
    detach(element: HTMLMediaElement): HTMLMediaElement;
    start(): void;
    stop(): void;
    private stopObservingElement;
    private handleVisibilityChanged;
    private readonly debouncedHandleVisibilityChanged;
    private handleResize;
    private readonly debouncedHandleResize;
    private updateVisibility;
    private updateDimensions;
}
