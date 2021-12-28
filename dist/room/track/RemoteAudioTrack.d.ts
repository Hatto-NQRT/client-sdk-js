import { Track } from './Track';
export default class RemoteAudioTrack extends Track {
    /** @internal */
    receiver?: RTCRtpReceiver;
    constructor(mediaTrack: MediaStreamTrack, sid: string, receiver?: RTCRtpReceiver);
    /** @internal */
    setMuted(muted: boolean): void;
    start(): void;
    stop(): void;
}
