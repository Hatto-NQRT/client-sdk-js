"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const events_2 = require("../events");
const LocalAudioTrack_1 = __importDefault(require("./LocalAudioTrack"));
const LocalVideoTrack_1 = __importDefault(require("./LocalVideoTrack"));
const RemoteAudioTrack_1 = __importDefault(require("./RemoteAudioTrack"));
const RemoteVideoTrack_1 = __importDefault(require("./RemoteVideoTrack"));
const Track_1 = require("./Track");
class TrackPublication extends events_1.EventEmitter {
    constructor(kind, id, name) {
        super();
        this.metadataMuted = false;
        this.kind = kind;
        this.trackSid = id;
        this.trackName = name;
        this.source = Track_1.Track.Source.Unknown;
    }
    /** @internal */
    setTrack(track) {
        this.track = track;
        if (track) {
            // forward events
            track.on(events_2.TrackEvent.Muted, () => {
                this.emit(events_2.TrackEvent.Muted);
            });
            track.on(events_2.TrackEvent.Unmuted, () => {
                this.emit(events_2.TrackEvent.Unmuted);
            });
        }
    }
    get isMuted() {
        return this.metadataMuted;
    }
    get isEnabled() {
        return true;
    }
    get isSubscribed() {
        return this.track !== undefined;
    }
    /**
     * an [AudioTrack] if this publication holds an audio track
     */
    get audioTrack() {
        if (this.track instanceof LocalAudioTrack_1.default || this.track instanceof RemoteAudioTrack_1.default) {
            return this.track;
        }
    }
    /**
     * an [VideoTrack] if this publication holds a video track
     */
    get videoTrack() {
        if (this.track instanceof LocalVideoTrack_1.default || this.track instanceof RemoteVideoTrack_1.default) {
            return this.track;
        }
    }
    /** @internal */
    updateInfo(info) {
        this.trackSid = info.sid;
        this.trackName = info.name;
        this.source = Track_1.Track.sourceFromProto(info.source);
        if (this.kind === Track_1.Track.Kind.Video && info.width > 0) {
            this.dimensions = {
                width: info.width,
                height: info.height,
            };
            this.simulcasted = info.simulcast;
        }
    }
}
exports.default = TrackPublication;
//# sourceMappingURL=TrackPublication.js.map