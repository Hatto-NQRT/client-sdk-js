"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectionQuality = void 0;
const events_1 = require("events");
const livekit_models_1 = require("../../proto/livekit_models");
const events_2 = require("../events");
const Track_1 = require("../track/Track");
var ConnectionQuality;
(function (ConnectionQuality) {
    ConnectionQuality["Excellent"] = "excellent";
    ConnectionQuality["Good"] = "good";
    ConnectionQuality["Poor"] = "poor";
    ConnectionQuality["Unknown"] = "unknown";
})(ConnectionQuality = exports.ConnectionQuality || (exports.ConnectionQuality = {}));
function qualityFromProto(q) {
    switch (q) {
        case livekit_models_1.ConnectionQuality.EXCELLENT:
            return ConnectionQuality.Excellent;
        case livekit_models_1.ConnectionQuality.GOOD:
            return ConnectionQuality.Good;
        case livekit_models_1.ConnectionQuality.POOR:
            return ConnectionQuality.Poor;
        default:
            return ConnectionQuality.Unknown;
    }
}
class Participant extends events_1.EventEmitter {
    /** @internal */
    constructor(sid, identity) {
        super();
        /** audio level between 0-1.0, 1 being loudest, 0 being softest */
        this.audioLevel = 0;
        /** if participant is currently speaking */
        this.isSpeaking = false;
        this._connectionQuality = ConnectionQuality.Unknown;
        this.sid = sid;
        this.identity = identity;
        this.audioTracks = new Map();
        this.videoTracks = new Map();
        this.tracks = new Map();
    }
    getTracks() {
        return Array.from(this.tracks.values());
    }
    /**
     * Finds the first track that matches the source filter, for example, getting
     * the user's camera track with getTrackBySource(Track.Source.Camera).
     * @param source
     * @returns
     */
    getTrack(source) {
        if (source === Track_1.Track.Source.Unknown) {
            return;
        }
        for (const [, pub] of this.tracks) {
            if (pub.source === source) {
                return pub;
            }
            if (pub.source === Track_1.Track.Source.Unknown) {
                if (source === Track_1.Track.Source.Microphone && pub.kind === Track_1.Track.Kind.Audio && pub.trackName !== 'screen') {
                    return pub;
                }
                if (source === Track_1.Track.Source.Camera && pub.kind === Track_1.Track.Kind.Video && pub.trackName !== 'screen') {
                    return pub;
                }
                if (source === Track_1.Track.Source.ScreenShare && pub.kind === Track_1.Track.Kind.Video && pub.trackName === 'screen') {
                    return pub;
                }
                if (source === Track_1.Track.Source.ScreenShareAudio && pub.kind === Track_1.Track.Kind.Audio && pub.trackName === 'screen') {
                    return pub;
                }
            }
        }
    }
    /**
     * Finds the first track that matches the track's name.
     * @param name
     * @returns
     */
    getTrackByName(name) {
        for (const [, pub] of this.tracks) {
            if (pub.trackName === name) {
                return pub;
            }
        }
    }
    get connectionQuality() {
        return this._connectionQuality;
    }
    get isCameraEnabled() {
        var _a;
        const track = this.getTrack(Track_1.Track.Source.Camera);
        return !((_a = track === null || track === void 0 ? void 0 : track.isMuted) !== null && _a !== void 0 ? _a : true);
    }
    get isMicrophoneEnabled() {
        var _a;
        const track = this.getTrack(Track_1.Track.Source.Microphone);
        return !((_a = track === null || track === void 0 ? void 0 : track.isMuted) !== null && _a !== void 0 ? _a : true);
    }
    get isScreenShareEnabled() {
        const track = this.getTrack(Track_1.Track.Source.ScreenShare);
        return !!track;
    }
    /** when participant joined the room */
    get joinedAt() {
        if (this.participantInfo) {
            return new Date(this.participantInfo.joinedAt * 1000);
        }
        return new Date();
    }
    /** @internal */
    updateInfo(info) {
        this.identity = info.identity;
        this.sid = info.sid;
        this.setMetadata(info.metadata);
        // set this last so setMetadata can detect changes
        this.participantInfo = info;
    }
    /** @internal */
    setMetadata(md) {
        const changed = !this.participantInfo || this.participantInfo.metadata !== md;
        const prevMetadata = this.metadata;
        this.metadata = md;
        if (changed) {
            this.emit(events_2.ParticipantEvent.MetadataChanged, prevMetadata);
        }
    }
    /** @internal */
    setIsSpeaking(speaking) {
        if (speaking === this.isSpeaking) {
            return;
        }
        this.isSpeaking = speaking;
        if (speaking) {
            this.lastSpokeAt = new Date();
        }
        this.emit(events_2.ParticipantEvent.IsSpeakingChanged, speaking);
    }
    /** @internal */
    setConnectionQuality(q) {
        const prevQuality = this._connectionQuality;
        this._connectionQuality = qualityFromProto(q);
        if (prevQuality !== this._connectionQuality) {
            this.emit(events_2.ParticipantEvent.ConnectionQualityChanged, this._connectionQuality);
        }
    }
    addTrackPublication(publication) {
        // forward publication driven events
        publication.on(events_2.TrackEvent.Muted, () => {
            this.emit(events_2.ParticipantEvent.TrackMuted, publication);
        });
        publication.on(events_2.TrackEvent.Unmuted, () => {
            this.emit(events_2.ParticipantEvent.TrackUnmuted, publication);
        });
        const pub = publication;
        if (pub.track) {
            pub.track.sid = publication.trackSid;
        }
        this.tracks.set(publication.trackSid, publication);
        switch (publication.kind) {
            case Track_1.Track.Kind.Audio:
                this.audioTracks.set(publication.trackSid, publication);
                break;
            case Track_1.Track.Kind.Video:
                this.videoTracks.set(publication.trackSid, publication);
                break;
            default:
                break;
        }
    }
}
exports.default = Participant;
//# sourceMappingURL=Participant.js.map