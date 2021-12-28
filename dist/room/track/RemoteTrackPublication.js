"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("../../logger"));
const livekit_rtc_1 = require("../../proto/livekit_rtc");
const events_1 = require("../events");
const RemoteVideoTrack_1 = __importDefault(require("./RemoteVideoTrack"));
const TrackPublication_1 = __importDefault(require("./TrackPublication"));
class RemoteTrackPublication extends TrackPublication_1.default {
    constructor() {
        super(...arguments);
        this.disabled = false;
        this.currentVideoQuality = livekit_rtc_1.VideoQuality.HIGH;
        this.handleVisibilityChange = (visible) => {
            logger_1.default.debug(`automanage video visibility, visible=${visible}`);
            this.disabled = !visible;
            this.emitTrackUpdate();
        };
        this.handleVideoDimensionsChange = (dimensions) => {
            logger_1.default.debug(`automanage video dimensions, ${dimensions.width}x${dimensions.height}`);
            this.videoDimensions = dimensions;
            this.emitTrackUpdate();
        };
    }
    /**
     * Subscribe or unsubscribe to this remote track
     * @param subscribed true to subscribe to a track, false to unsubscribe
     */
    setSubscribed(subscribed) {
        this.subscribed = subscribed;
        const sub = {
            trackSids: [this.trackSid],
            subscribe: this.subscribed,
        };
        this.emit(events_1.TrackEvent.UpdateSubscription, sub);
    }
    get isSubscribed() {
        if (this.subscribed === false) {
            return false;
        }
        return super.isSubscribed;
    }
    get isEnabled() {
        return !this.disabled;
    }
    /**
     * disable server from sending down data for this track. this is useful when
     * the participant is off screen, you may disable streaming down their video
     * to reduce bandwidth requirements
     * @param enabled
     */
    setEnabled(enabled) {
        if (this.isAutoManageVideo || !this.isSubscribed || this.disabled === !enabled) {
            return;
        }
        if (this.track instanceof RemoteVideoTrack_1.default && this.track.isAutoManaged) {
            return;
        }
        this.disabled = !enabled;
        this.emitTrackUpdate();
    }
    /**
     * for tracks that support simulcasting, adjust subscribed quality
     *
     * This indicates the highest quality the client can accept. if network
     * bandwidth does not allow, server will automatically reduce quality to
     * optimize for uninterrupted video
     */
    setVideoQuality(quality) {
        if (this.isAutoManageVideo || !this.isSubscribed || this.currentVideoQuality === quality) {
            return;
        }
        this.currentVideoQuality = quality;
        this.videoDimensions = undefined;
        this.emitTrackUpdate();
    }
    setVideoDimensions(dimensions) {
        var _a, _b;
        if (!this.isSubscribed || this.isAutoManageVideo) {
            return;
        }
        if (((_a = this.videoDimensions) === null || _a === void 0 ? void 0 : _a.width) === dimensions.width
            && ((_b = this.videoDimensions) === null || _b === void 0 ? void 0 : _b.height) === dimensions.height) {
            return;
        }
        if (this.track instanceof RemoteVideoTrack_1.default) {
            this.videoDimensions = dimensions;
        }
        this.currentVideoQuality = undefined;
        this.emitTrackUpdate();
    }
    get videoQuality() {
        return this.currentVideoQuality;
    }
    setTrack(track) {
        var _a, _b;
        if (this.track) {
            // unregister listener
            this.track.off(events_1.TrackEvent.VideoDimensionsChanged, this.handleVideoDimensionsChange);
            this.track.off(events_1.TrackEvent.VisibilityChanged, this.handleVisibilityChange);
        }
        super.setTrack(track);
        (_a = this.track) === null || _a === void 0 ? void 0 : _a.on(events_1.TrackEvent.VideoDimensionsChanged, this.handleVideoDimensionsChange);
        (_b = this.track) === null || _b === void 0 ? void 0 : _b.on(events_1.TrackEvent.VisibilityChanged, this.handleVisibilityChange);
    }
    /** @internal */
    updateInfo(info) {
        var _a;
        super.updateInfo(info);
        this.metadataMuted = info.muted;
        (_a = this.track) === null || _a === void 0 ? void 0 : _a.setMuted(info.muted);
    }
    get isAutoManageVideo() {
        return this.track instanceof RemoteVideoTrack_1.default && this.track.isAutoManaged;
    }
    emitTrackUpdate() {
        const settings = livekit_rtc_1.UpdateTrackSettings.fromPartial({
            trackSids: [this.trackSid],
            disabled: this.disabled,
        });
        if (this.videoDimensions) {
            settings.width = this.videoDimensions.width;
            settings.height = this.videoDimensions.height;
        }
        else if (this.currentVideoQuality) {
            settings.quality = this.currentVideoQuality;
        }
        else {
            // defaults to high quality
            settings.quality = livekit_rtc_1.VideoQuality.HIGH;
        }
        this.emit(events_1.TrackEvent.UpdateSettings, settings);
    }
}
exports.default = RemoteTrackPublication;
//# sourceMappingURL=RemoteTrackPublication.js.map