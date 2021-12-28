import 'webrtc-adapter';
import { ParticipantInfo, Room, SpeakerInfo } from '../proto/livekit_models';
import { AddTrackRequest, ConnectionQualityUpdate, JoinResponse, SignalRequest, SignalTarget, TrackPublishedResponse, UpdateSubscription, UpdateTrackSettings } from '../proto/livekit_rtc';
interface ConnectOpts {
    autoSubscribe?: boolean;
    /** internal */
    reconnect?: boolean;
}
export interface SignalOptions {
    autoSubscribe?: boolean;
}
/**
 * RTCClient is the signaling layer of WebRTC, it's LiveKit's signaling protocol
 * so that it
 */
export interface SignalClient {
    join(url: string, token: string, opts?: SignalOptions): Promise<JoinResponse>;
    reconnect(url: string, token: string): Promise<void>;
    sendOffer(offer: RTCSessionDescriptionInit): void;
    sendAnswer(answer: RTCSessionDescriptionInit): void;
    sendIceCandidate(candidate: RTCIceCandidateInit, target: SignalTarget): void;
    sendMuteTrack(trackSid: string, muted: boolean): void;
    sendAddTrack(req: AddTrackRequest): void;
    sendUpdateTrackSettings(settings: UpdateTrackSettings): void;
    sendUpdateSubscription(sub: UpdateSubscription): void;
    sendLeave(): void;
    close(): void;
    readonly isConnected: boolean;
    onClose?: (reason: string) => void;
    onAnswer?: (sd: RTCSessionDescriptionInit) => void;
    onOffer?: (sd: RTCSessionDescriptionInit) => void;
    onTrickle?: (sd: RTCIceCandidateInit, target: SignalTarget) => void;
    onParticipantUpdate?: (updates: ParticipantInfo[]) => void;
    onLocalTrackPublished?: (res: TrackPublishedResponse) => void;
    onSpeakersChanged?: (res: SpeakerInfo[]) => void;
    onRemoteMuteChanged?: (trackSid: string, muted: boolean) => void;
    onRoomUpdate?: (room: Room) => void;
    onConnectionQuality?: (update: ConnectionQualityUpdate) => void;
    onLeave?: () => void;
}
export declare class WSSignalClient {
    isConnected: boolean;
    useJSON: boolean;
    onClose?: (reason: string) => void;
    onAnswer?: (sd: RTCSessionDescriptionInit) => void;
    onOffer?: (sd: RTCSessionDescriptionInit) => void;
    onTrickle?: (sd: RTCIceCandidateInit, target: SignalTarget) => void;
    onParticipantUpdate?: (updates: ParticipantInfo[]) => void;
    onLocalTrackPublished?: (res: TrackPublishedResponse) => void;
    onNegotiateRequested?: () => void;
    onSpeakersChanged?: (res: SpeakerInfo[]) => void;
    onRemoteMuteChanged?: (trackSid: string, muted: boolean) => void;
    onRoomUpdate?: (room: Room) => void;
    onConnectionQuality?: (update: ConnectionQualityUpdate) => void;
    onLeave?: () => void;
    ws?: WebSocket;
    constructor(useJSON?: boolean);
    join(url: string, token: string, opts?: SignalOptions): Promise<JoinResponse>;
    reconnect(url: string, token: string): Promise<void>;
    connect(url: string, token: string, opts: ConnectOpts): Promise<JoinResponse | void>;
    close(): void;
    sendOffer(offer: RTCSessionDescriptionInit): void;
    sendAnswer(answer: RTCSessionDescriptionInit): void;
    sendIceCandidate(candidate: RTCIceCandidateInit, target: SignalTarget): void;
    sendMuteTrack(trackSid: string, muted: boolean): void;
    sendAddTrack(req: AddTrackRequest): void;
    sendUpdateTrackSettings(settings: UpdateTrackSettings): void;
    sendUpdateSubscription(sub: UpdateSubscription): void;
    sendLeave(): void;
    sendRequest(req: SignalRequest): void;
    private handleSignalResponse;
    private handleWSError;
}
export {};
