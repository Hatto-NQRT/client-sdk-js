import { SignalClient } from '../../api/SignalClient';
import { VideoQuality } from '../../proto/livekit_rtc';
import { VideoSenderStats } from '../stats';
import LocalTrack from './LocalTrack';
import { CreateVideoTrackOptions } from './options';
export default class LocalVideoTrack extends LocalTrack {
    signalClient?: SignalClient;
    private prevStats?;
    private lastQualityChange?;
    private lastExplicitQualityChange?;
    private encodings?;
    constructor(mediaTrack: MediaStreamTrack, name?: string, constraints?: MediaTrackConstraints);
    get isSimulcast(): boolean;
    startMonitor(signalClient: SignalClient): void;
    stop(): void;
    mute(): Promise<LocalVideoTrack>;
    unmute(): Promise<LocalVideoTrack>;
    getSenderStats(): Promise<VideoSenderStats[]>;
    setPublishingQuality(maxQuality: VideoQuality): void;
    setDeviceId(deviceId: string): Promise<void>;
    restartTrack(options?: CreateVideoTrackOptions): Promise<void>;
    private monitorSender;
    private checkAndUpdateSimulcast;
}
