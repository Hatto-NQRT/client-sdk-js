/// <reference types="node" />
import { EventEmitter } from 'events';
import { ConnectionQuality as ProtoQuality, ParticipantInfo } from '../../proto/livekit_models';
import { Track } from '../track/Track';
import TrackPublication from '../track/TrackPublication';
export declare enum ConnectionQuality {
    Excellent = "excellent",
    Good = "good",
    Poor = "poor",
    Unknown = "unknown"
}
export default class Participant extends EventEmitter {
    protected participantInfo?: ParticipantInfo;
    audioTracks: Map<string, TrackPublication>;
    videoTracks: Map<string, TrackPublication>;
    /** map of track sid => all published tracks */
    tracks: Map<string, TrackPublication>;
    /** audio level between 0-1.0, 1 being loudest, 0 being softest */
    audioLevel: number;
    /** if participant is currently speaking */
    isSpeaking: boolean;
    /** server assigned unique id */
    sid: string;
    /** client assigned identity, encoded in JWT token */
    identity: string;
    /** client metadata, opaque to livekit */
    metadata?: string;
    lastSpokeAt?: Date | undefined;
    private _connectionQuality;
    /** @internal */
    constructor(sid: string, identity: string);
    getTracks(): TrackPublication[];
    /**
     * Finds the first track that matches the source filter, for example, getting
     * the user's camera track with getTrackBySource(Track.Source.Camera).
     * @param source
     * @returns
     */
    getTrack(source: Track.Source): TrackPublication | undefined;
    /**
     * Finds the first track that matches the track's name.
     * @param name
     * @returns
     */
    getTrackByName(name: string): TrackPublication | undefined;
    get connectionQuality(): ConnectionQuality;
    get isCameraEnabled(): boolean;
    get isMicrophoneEnabled(): boolean;
    get isScreenShareEnabled(): boolean;
    /** when participant joined the room */
    get joinedAt(): Date | undefined;
    /** @internal */
    updateInfo(info: ParticipantInfo): void;
    /** @internal */
    setMetadata(md: string): void;
    /** @internal */
    setIsSpeaking(speaking: boolean): void;
    /** @internal */
    setConnectionQuality(q: ProtoQuality): void;
    protected addTrackPublication(publication: TrackPublication): void;
}
