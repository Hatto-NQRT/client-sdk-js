"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("../events");
const Track_1 = require("./Track");
class RemoteAudioTrack extends Track_1.Track {
    constructor(mediaTrack, sid, receiver) {
        super(mediaTrack, Track_1.Track.Kind.Audio);
        this.sid = sid;
        this.receiver = receiver;
    }
    /** @internal */
    setMuted(muted) {
        if (this.isMuted !== muted) {
            this.isMuted = muted;
            this.emit(muted ? events_1.TrackEvent.Muted : events_1.TrackEvent.Unmuted, this);
        }
    }
    start() {
        // use `enabled` of track to enable re-use of transceiver
        super.enable();
    }
    stop() {
        // use `enabled` of track to enable re-use of transceiver
        super.disable();
    }
}
exports.default = RemoteAudioTrack;
//# sourceMappingURL=RemoteAudioTrack.js.map