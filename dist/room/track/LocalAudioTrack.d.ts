import LocalTrack from './LocalTrack';
import { CreateAudioTrackOptions } from './options';
export default class LocalAudioTrack extends LocalTrack {
    sender?: RTCRtpSender;
    /** @internal */
    stopOnMute: boolean;
    constructor(mediaTrack: MediaStreamTrack, name?: string, constraints?: MediaTrackConstraints);
    setDeviceId(deviceId: string): Promise<void>;
    mute(): Promise<LocalAudioTrack>;
    unmute(): Promise<LocalAudioTrack>;
    restartTrack(options?: CreateAudioTrackOptions): Promise<void>;
}
