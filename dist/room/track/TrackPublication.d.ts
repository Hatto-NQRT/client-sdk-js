/// <reference types="node" />
import { EventEmitter } from 'events';
import { TrackInfo } from '../../proto/livekit_models';
import LocalAudioTrack from './LocalAudioTrack';
import LocalVideoTrack from './LocalVideoTrack';
import RemoteAudioTrack from './RemoteAudioTrack';
import RemoteVideoTrack from './RemoteVideoTrack';
import { Track } from './Track';
export default class TrackPublication extends EventEmitter {
    kind: Track.Kind;
    trackName: string;
    trackSid: Track.SID;
    track?: Track;
    source: Track.Source;
    /** dimension of the original published stream, video-only */
    dimensions?: Track.Dimensions;
    /** true if track was simulcasted to server, video-only */
    simulcasted?: boolean;
    protected metadataMuted: boolean;
    constructor(kind: Track.Kind, id: string, name: string);
    /** @internal */
    setTrack(track?: Track): void;
    get isMuted(): boolean;
    get isEnabled(): boolean;
    get isSubscribed(): boolean;
    /**
     * an [AudioTrack] if this publication holds an audio track
     */
    get audioTrack(): LocalAudioTrack | RemoteAudioTrack | undefined;
    /**
     * an [VideoTrack] if this publication holds a video track
     */
    get videoTrack(): LocalVideoTrack | RemoteVideoTrack | undefined;
    /** @internal */
    updateInfo(info: TrackInfo): void;
}
