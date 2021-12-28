"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("../../logger"));
const events_1 = require("../events");
const RemoteAudioTrack_1 = __importDefault(require("../track/RemoteAudioTrack"));
const RemoteTrackPublication_1 = __importDefault(require("../track/RemoteTrackPublication"));
const RemoteVideoTrack_1 = __importDefault(require("../track/RemoteVideoTrack"));
const Track_1 = require("../track/Track");
const Participant_1 = __importDefault(require("./Participant"));
class RemoteParticipant extends Participant_1.default {
    /** @internal */
    constructor(signalClient, id, name) {
        super(id, name || '');
        this.signalClient = signalClient;
        this.tracks = new Map();
        this.audioTracks = new Map();
        this.videoTracks = new Map();
    }
    /** @internal */
    static fromParticipantInfo(signalClient, pi) {
        const rp = new RemoteParticipant(signalClient, pi.sid, pi.identity);
        rp.updateInfo(pi);
        return rp;
    }
    addTrackPublication(publication) {
        super.addTrackPublication(publication);
        // register action events
        publication.on(events_1.TrackEvent.UpdateSettings, (settings) => {
            this.signalClient.sendUpdateTrackSettings(settings);
        });
        publication.on(events_1.TrackEvent.UpdateSubscription, (sub) => {
            this.signalClient.sendUpdateSubscription(sub);
        });
    }
    getTrack(source) {
        const track = super.getTrack(source);
        if (track) {
            return track;
        }
    }
    getTrackByName(name) {
        const track = super.getTrackByName(name);
        if (track) {
            return track;
        }
    }
    /** @internal */
    addSubscribedMediaTrack(mediaTrack, sid, receiver, autoManageVideo, triesLeft) {
        // find the track publication
        // it's possible for the media track to arrive before participant info
        let publication = this.getTrackPublication(sid);
        // it's also possible that the browser didn't honor our original track id
        // FireFox would use its own local uuid instead of server track id
        if (!publication) {
            if (!sid.startsWith('TR')) {
                // find the first track that matches type
                this.tracks.forEach((p) => {
                    if (!publication && mediaTrack.kind === p.kind.toString()) {
                        publication = p;
                    }
                });
            }
        }
        // when we couldn't locate the track, it's possible that the metadata hasn't
        // yet arrived. Wait a bit longer for it to arrive, or fire an error
        if (!publication) {
            if (triesLeft === 0) {
                logger_1.default.error('could not find published track', this.sid, sid);
                this.emit(events_1.ParticipantEvent.TrackSubscriptionFailed, sid);
                return;
            }
            if (triesLeft === undefined)
                triesLeft = 20;
            setTimeout(() => {
                this.addSubscribedMediaTrack(mediaTrack, sid, receiver, autoManageVideo, triesLeft - 1);
            }, 150);
            return;
        }
        const isVideo = mediaTrack.kind === 'video';
        let track;
        if (isVideo) {
            track = new RemoteVideoTrack_1.default(mediaTrack, sid, receiver, autoManageVideo);
        }
        else {
            track = new RemoteAudioTrack_1.default(mediaTrack, sid, receiver);
        }
        track.start();
        publication.setTrack(track);
        // set track name etc
        track.name = publication.trackName;
        track.sid = publication.trackSid;
        track.source = publication.source;
        // keep publication's muted status
        track.isMuted = publication.isMuted;
        // when media track is ended, fire the event
        mediaTrack.onended = () => {
            if (publication) {
                publication.track = undefined;
            }
            this.emit(events_1.ParticipantEvent.TrackUnsubscribed, track, publication);
        };
        this.emit(events_1.ParticipantEvent.TrackSubscribed, track, publication);
        return publication;
    }
    /** @internal */
    get hasMetadata() {
        return !!this.participantInfo;
    }
    getTrackPublication(sid) {
        return this.tracks.get(sid);
    }
    /** @internal */
    updateInfo(info) {
        const alreadyHasMetadata = this.hasMetadata;
        super.updateInfo(info);
        // we are getting a list of all available tracks, reconcile in here
        // and send out events for changes
        // reconcile track publications, publish events only if metadata is already there
        // i.e. changes since the local participant has joined
        const validTracks = new Map();
        const newTracks = new Map();
        info.tracks.forEach((ti) => {
            let publication = this.getTrackPublication(ti.sid);
            if (!publication) {
                // new publication
                const kind = Track_1.Track.kindFromProto(ti.type);
                if (!kind) {
                    return;
                }
                publication = new RemoteTrackPublication_1.default(kind, ti.sid, ti.name);
                publication.updateInfo(ti);
                newTracks.set(ti.sid, publication);
                this.addTrackPublication(publication);
            }
            else {
                publication.updateInfo(ti);
            }
            validTracks.set(ti.sid, publication);
        });
        // send new tracks
        if (alreadyHasMetadata) {
            newTracks.forEach((publication) => {
                this.emit(events_1.ParticipantEvent.TrackPublished, publication);
            });
        }
        // detect removed tracks
        this.tracks.forEach((publication) => {
            if (!validTracks.has(publication.trackSid)) {
                this.unpublishTrack(publication.trackSid, true);
            }
        });
    }
    /** @internal */
    unpublishTrack(sid, sendUnpublish) {
        const publication = this.tracks.get(sid);
        if (!publication) {
            return;
        }
        this.tracks.delete(sid);
        // remove from the right type map
        switch (publication.kind) {
            case Track_1.Track.Kind.Audio:
                this.audioTracks.delete(sid);
                break;
            case Track_1.Track.Kind.Video:
                this.videoTracks.delete(sid);
                break;
            default:
                break;
        }
        // also send unsubscribe, if track is actively subscribed
        const { track } = publication;
        if (track) {
            const { isSubscribed } = publication;
            track.stop();
            publication.setTrack(undefined);
            // always send unsubscribed, since apps may rely on this
            if (isSubscribed) {
                this.emit(events_1.ParticipantEvent.TrackUnsubscribed, track, publication);
            }
        }
        if (sendUnpublish) {
            this.emit(events_1.ParticipantEvent.TrackUnpublished, publication);
        }
    }
    /** @internal */
    emit(event, ...args) {
        logger_1.default.trace('participant event', this.sid, event, ...args);
        return super.emit(event, ...args);
    }
}
exports.default = RemoteParticipant;
//# sourceMappingURL=RemoteParticipant.js.map