import { TrackInfo } from '../../proto/livekit_models';
import LocalAudioTrack from './LocalAudioTrack';
import LocalTrack from './LocalTrack';
import LocalVideoTrack from './LocalVideoTrack';
import { Track } from './Track';
import TrackPublication from './TrackPublication';
export default class LocalTrackPublication extends TrackPublication {
    track?: LocalTrack;
    constructor(kind: Track.Kind, ti: TrackInfo, track?: LocalTrack);
    get isMuted(): boolean;
    get audioTrack(): LocalAudioTrack | undefined;
    get videoTrack(): LocalVideoTrack | undefined;
    /**
     * Mute the track associated with this publication
     */
    mute(): Promise<LocalTrack | undefined>;
    /**
     * Unmute track associated with this publication
     */
    unmute(): Promise<LocalTrack | undefined>;
}
