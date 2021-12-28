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
exports.createLocalScreenTracks = exports.createLocalAudioTrack = exports.createLocalVideoTrack = exports.createLocalTracks = exports.getLastVideoCreateError = exports.getLastAudioCreateError = void 0;
const errors_1 = require("../errors");
const LocalAudioTrack_1 = __importDefault(require("./LocalAudioTrack"));
const LocalTrack_1 = __importDefault(require("./LocalTrack"));
const LocalVideoTrack_1 = __importDefault(require("./LocalVideoTrack"));
const options_1 = require("./options");
const Track_1 = require("./Track");
let audioError;
function getLastAudioCreateError() {
    return audioError;
}
exports.getLastAudioCreateError = getLastAudioCreateError;
let videoError;
function getLastVideoCreateError() {
    return videoError;
}
exports.getLastVideoCreateError = getLastVideoCreateError;
/**
 * Creates a local video and audio track at the same time. When acquiring both
 * audio and video tracks together, it'll display a single permission prompt to
 * the user instead of two separate ones.
 * @param options
 */
function createLocalTracks(options) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!options)
            options = {};
        if (options.audio === true)
            options.audio = {};
        if (options.video === true)
            options.video = {};
        const constraints = LocalTrack_1.default.constraintsForOptions(options);
        let stream;
        try {
            stream = yield navigator.mediaDevices.getUserMedia(constraints);
        }
        catch (err) {
            if (err instanceof Error) {
                if (constraints.audio) {
                    audioError = err;
                }
                if (constraints.video) {
                    videoError = err;
                }
            }
            throw err;
        }
        if (constraints.audio) {
            audioError = undefined;
        }
        if (constraints.video) {
            videoError = undefined;
        }
        return stream.getTracks().map((mediaStreamTrack) => {
            const isAudio = mediaStreamTrack.kind === 'audio';
            let trackOptions = isAudio ? options.audio : options.video;
            if (typeof trackOptions === 'boolean' || !trackOptions) {
                trackOptions = {};
            }
            let trackConstraints;
            const conOrBool = isAudio ? constraints.audio : constraints.video;
            if (typeof conOrBool !== 'boolean') {
                trackConstraints = conOrBool;
            }
            const track = createLocalTrack(mediaStreamTrack, trackOptions === null || trackOptions === void 0 ? void 0 : trackOptions.name, trackConstraints);
            if (track.kind === Track_1.Track.Kind.Video) {
                track.source = Track_1.Track.Source.Camera;
            }
            else if (track.kind === Track_1.Track.Kind.Audio) {
                track.source = Track_1.Track.Source.Microphone;
            }
            return track;
        });
    });
}
exports.createLocalTracks = createLocalTracks;
/**
 * Creates a [[LocalVideoTrack]] with getUserMedia()
 * @param options
 */
function createLocalVideoTrack(options) {
    return __awaiter(this, void 0, void 0, function* () {
        const tracks = yield createLocalTracks({
            audio: false,
            video: options,
        });
        return tracks[0];
    });
}
exports.createLocalVideoTrack = createLocalVideoTrack;
function createLocalAudioTrack(options) {
    return __awaiter(this, void 0, void 0, function* () {
        const tracks = yield createLocalTracks({
            audio: options,
            video: false,
        });
        return tracks[0];
    });
}
exports.createLocalAudioTrack = createLocalAudioTrack;
/**
 * Creates a screen capture tracks with getDisplayMedia().
 * A LocalVideoTrack is always created and returned.
 * If { audio: true }, and the browser supports audio capture, a LocalAudioTrack is also created.
 */
function createLocalScreenTracks(options) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        if (options === undefined) {
            options = {};
        }
        if (options.name === undefined) {
            options.name = 'screen';
        }
        if (options.resolution === undefined) {
            options.resolution = options_1.VideoPresets.fhd.resolution;
        }
        let videoConstraints = true;
        if (options.resolution) {
            videoConstraints = {
                width: options.resolution.width,
                height: options.resolution.height,
            };
        }
        // typescript definition is missing getDisplayMedia: https://github.com/microsoft/TypeScript/issues/33232
        // @ts-ignore
        const stream = yield navigator.mediaDevices.getDisplayMedia({
            audio: (_a = options.audio) !== null && _a !== void 0 ? _a : false,
            video: videoConstraints,
        });
        const tracks = stream.getVideoTracks();
        if (tracks.length === 0) {
            throw new errors_1.TrackInvalidError('no video track found');
        }
        const screenVideo = new LocalVideoTrack_1.default(tracks[0], options.name);
        screenVideo.source = Track_1.Track.Source.ScreenShare;
        const localTracks = [screenVideo];
        if (stream.getAudioTracks().length > 0) {
            const screenAudio = new LocalAudioTrack_1.default(stream.getAudioTracks()[0], options.name);
            screenAudio.source = Track_1.Track.Source.ScreenShareAudio;
            localTracks.push(screenAudio);
        }
        return localTracks;
    });
}
exports.createLocalScreenTracks = createLocalScreenTracks;
/** @internal */
function createLocalTrack(mediaStreamTrack, name, constraints) {
    switch (mediaStreamTrack.kind) {
        case 'audio':
            return new LocalAudioTrack_1.default(mediaStreamTrack, name, constraints);
        case 'video':
            return new LocalVideoTrack_1.default(mediaStreamTrack, name, constraints);
        default:
            throw new errors_1.TrackInvalidError(`unsupported track type: ${mediaStreamTrack.kind}`);
    }
}
//# sourceMappingURL=create.js.map