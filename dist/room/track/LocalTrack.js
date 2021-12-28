"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("../../logger"));
const defaults_1 = require("../defaults");
const DeviceManager_1 = __importDefault(require("../DeviceManager"));
const errors_1 = require("../errors");
const events_1 = require("../events");
const Track_1 = require("./Track");
class LocalTrack extends Track_1.Track {
    constructor(mediaTrack, kind, name, constraints) {
        super(mediaTrack, kind, name);
        this.handleEnded = () => {
            this.emit(events_1.TrackEvent.Ended);
        };
        this.mediaStreamTrack.addEventListener('ended', this.handleEnded);
        this.constraints = constraints !== null && constraints !== void 0 ? constraints : mediaTrack.getConstraints();
    }
    get id() {
        return this.mediaStreamTrack.id;
    }
    get dimensions() {
        if (this.kind !== Track_1.Track.Kind.Video) {
            return undefined;
        }
        const { width, height } = this.mediaStreamTrack.getSettings();
        if (width && height) {
            return {
                width,
                height,
            };
        }
        return undefined;
    }
    static constraintsForOptions(options) {
        const constraints = {};
        // default video options
        const defaults = defaults_1.getTrackCaptureDefaults();
        const videoOptions = {
            deviceId: defaults.videoDeviceId,
        };
        if (defaults.videoResolution) {
            videoOptions.width = defaults.videoResolution.width;
            videoOptions.height = defaults.videoResolution.height;
            videoOptions.frameRate = defaults.videoResolution.frameRate;
        }
        if (typeof options.video === 'object' && options.video) {
            Object.assign(videoOptions, options.video);
            if (options.video.resolution) {
                Object.assign(videoOptions, options.video.resolution);
            }
        }
        if (options.video === false) {
            constraints.video = false;
        }
        else {
            // use defaults
            constraints.video = videoOptions;
        }
        // default audio options
        const audioOptions = {
            deviceId: defaults.audioDeviceId,
            echoCancellation: defaults.echoCancellation,
            /* @ts-ignore */
            autoGainControl: defaults.autoGainControl,
            /* @ts-ignore */
            noiseSuppression: defaults.noiseSuppression,
            channelCount: defaults.channelCount,
        };
        if (typeof options.audio === 'object' && options.audio) {
            Object.assign(audioOptions, options.audio);
        }
        if (options.audio === false) {
            constraints.audio = false;
        }
        else {
            constraints.audio = audioOptions;
        }
        return constraints;
    }
    /**
     * @returns DeviceID of the device that is currently being used for this track
     */
    getDeviceId() {
        return __awaiter(this, void 0, void 0, function* () {
            // screen share doesn't have a usable device id
            if (this.source === Track_1.Track.Source.ScreenShare) {
                return;
            }
            const { deviceId, groupId } = this.mediaStreamTrack.getSettings();
            const kind = this.kind === Track_1.Track.Kind.Audio ? 'audioinput' : 'videoinput';
            return DeviceManager_1.default.getInstance().normalizeDeviceId(kind, deviceId, groupId);
        });
    }
    mute() {
        return __awaiter(this, void 0, void 0, function* () {
            this.setTrackMuted(true);
            return this;
        });
    }
    unmute() {
        return __awaiter(this, void 0, void 0, function* () {
            this.setTrackMuted(false);
            return this;
        });
    }
    restart(constraints) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.sender) {
                throw new errors_1.TrackInvalidError('unable to restart an unpublished track');
            }
            if (!constraints) {
                constraints = this.constraints;
            }
            logger_1.default.debug('restarting track with constraints', constraints);
            const streamConstraints = {
                audio: false,
                video: false,
            };
            if (this.kind === Track_1.Track.Kind.Video) {
                streamConstraints.video = constraints;
            }
            else {
                streamConstraints.audio = constraints;
            }
            // detach
            this.attachedElements.forEach((el) => {
                Track_1.detachTrack(this.mediaStreamTrack, el);
            });
            this.mediaStreamTrack.removeEventListener('ended', this.handleEnded);
            // on Safari, the old audio track must be stopped before attempting to acquire
            // the new track, otherwise the new track will stop with
            // 'A MediaStreamTrack ended due to a capture failure`
            this.mediaStreamTrack.stop();
            // create new track and attach
            const mediaStream = yield navigator.mediaDevices.getUserMedia(streamConstraints);
            const newTrack = mediaStream.getTracks()[0];
            newTrack.addEventListener('ended', this.handleEnded);
            logger_1.default.debug('re-acquired MediaStreamTrack');
            yield this.sender.replaceTrack(newTrack);
            this.mediaStreamTrack = newTrack;
            this.attachedElements.forEach((el) => {
                Track_1.attachToElement(newTrack, el);
            });
            this.constraints = constraints;
            return this;
        });
    }
    setTrackMuted(muted) {
        if (this.isMuted === muted) {
            return;
        }
        this.isMuted = muted;
        this.mediaStreamTrack.enabled = !muted;
        this.emit(muted ? events_1.TrackEvent.Muted : events_1.TrackEvent.Unmuted, this);
    }
}
exports.default = LocalTrack;
//# sourceMappingURL=LocalTrack.js.map