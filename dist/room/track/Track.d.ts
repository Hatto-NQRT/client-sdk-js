/// <reference types="node" />
import { EventEmitter } from 'events';
import { TrackSource, TrackType } from '../../proto/livekit_models';
export declare class Track extends EventEmitter {
    kind: Track.Kind;
    name: string;
    mediaStreamTrack: MediaStreamTrack;
    attachedElements: HTMLMediaElement[];
    isMuted: boolean;
    source: Track.Source;
    /**
     * sid is set after track is published to server, or if it's a remote track
     */
    sid?: Track.SID;
    protected constructor(mediaTrack: MediaStreamTrack, kind: Track.Kind, name?: string);
    /**
     * creates a new HTMLAudioElement or HTMLVideoElement, attaches to it, and returns it
     */
    attach(): HTMLMediaElement;
    /**
     * attaches track to an existing HTMLAudioElement or HTMLVideoElement
     */
    attach(element: HTMLMediaElement): HTMLMediaElement;
    /**
     * Detaches from all attached elements
     */
    detach(): HTMLMediaElement[];
    /**
     * Detach from a single element
     * @param element
     */
    detach(element: HTMLMediaElement): HTMLMediaElement;
    stop(): void;
    protected enable(): void;
    protected disable(): void;
    private recycleElement;
}
/** @internal */
export declare function attachToElement(track: MediaStreamTrack, element: HTMLMediaElement): void;
/** @internal */
export declare function detachTrack(track: MediaStreamTrack, element: HTMLMediaElement): void;
export declare namespace Track {
    enum Kind {
        Audio = "audio",
        Video = "video",
        Unknown = "unknown"
    }
    type SID = string;
    enum Source {
        Camera = "camera",
        Microphone = "microphone",
        ScreenShare = "screen_share",
        ScreenShareAudio = "screen_share_audio",
        Unknown = "unknown"
    }
    interface Dimensions {
        width: number;
        height: number;
    }
    /** @internal */
    function kindToProto(k: Kind): TrackType;
    /** @internal */
    function kindFromProto(t: TrackType): Kind | undefined;
    /** @internal */
    function sourceToProto(s: Source): TrackSource;
    /** @internal */
    function sourceFromProto(s: TrackSource): Source;
}
