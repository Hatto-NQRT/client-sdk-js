import { SignalClient } from '../../api/SignalClient';
import { ParticipantInfo } from '../../proto/livekit_models';
import RemoteTrackPublication from '../track/RemoteTrackPublication';
import { Track } from '../track/Track';
import TrackPublication from '../track/TrackPublication';
import Participant from './Participant';
export default class RemoteParticipant extends Participant {
    audioTracks: Map<string, RemoteTrackPublication>;
    videoTracks: Map<string, RemoteTrackPublication>;
    tracks: Map<string, RemoteTrackPublication>;
    signalClient: SignalClient;
    /** @internal */
    static fromParticipantInfo(signalClient: SignalClient, pi: ParticipantInfo): RemoteParticipant;
    /** @internal */
    constructor(signalClient: SignalClient, id: string, name?: string);
    protected addTrackPublication(publication: TrackPublication): void;
    getTrack(source: Track.Source): RemoteTrackPublication | undefined;
    getTrackByName(name: string): RemoteTrackPublication | undefined;
    /** @internal */
    addSubscribedMediaTrack(mediaTrack: MediaStreamTrack, sid: Track.SID, receiver?: RTCRtpReceiver, autoManageVideo?: boolean, triesLeft?: number): RemoteTrackPublication | undefined;
    /** @internal */
    get hasMetadata(): boolean;
    getTrackPublication(sid: Track.SID): RemoteTrackPublication | undefined;
    /** @internal */
    updateInfo(info: ParticipantInfo): void;
    /** @internal */
    unpublishTrack(sid: Track.SID, sendUnpublish?: boolean): void;
    /** @internal */
    emit(event: string | symbol, ...args: any[]): boolean;
}
