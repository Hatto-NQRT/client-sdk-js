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
exports.connect = exports.version = void 0;
const SignalClient_1 = require("./api/SignalClient");
const logger_1 = __importDefault(require("./logger"));
const options_1 = require("./options");
const errors_1 = require("./room/errors");
const events_1 = require("./room/events");
const Room_1 = __importDefault(require("./room/Room"));
const create_1 = require("./room/track/create");
const Track_1 = require("./room/track/Track");
var version_1 = require("./version");
Object.defineProperty(exports, "version", { enumerable: true, get: function () { return version_1.version; } });
/**
 * Connects to a LiveKit room
 *
 * ```typescript
 * connect('wss://myhost.livekit.io', token, {
 *   // publish audio and video tracks on joining
 *   audio: true,
 *   video: true,
 *   captureDefaults: {
 *    facingMode: 'user',
 *   },
 * })
 * ```
 * @param url URL to LiveKit server
 * @param token AccessToken, a JWT token that includes authentication and room details
 * @param options
 */
function connect(url, token, options) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        // set defaults
        options || (options = {});
        options.logLevel || (options.logLevel = options_1.LogLevel.info);
        if (options.audio === undefined)
            options.audio = false;
        if (options.video === undefined)
            options.video = false;
        logger_1.default.setLevel(options.logLevel);
        const config = (_a = options.rtcConfig) !== null && _a !== void 0 ? _a : {};
        if (options.iceServers) {
            config.iceServers = options.iceServers;
        }
        const client = new SignalClient_1.WSSignalClient();
        const room = new Room_1.default(client, {
            rtcConfig: options.rtcConfig,
            autoManageVideo: options.autoManageVideo,
        }, options.rtcEngineOption);
        // connect to room
        yield room.connect(url, token, {
            autoSubscribe: options === null || options === void 0 ? void 0 : options.autoSubscribe,
        });
        // save default publish options
        if (options.publishDefaults) {
            Object.assign(room.defaultPublishOptions, options.publishDefaults);
        }
        if (options.captureDefaults) {
            Object.assign(room.defaultCaptureOptions, options.captureDefaults);
        }
        const publishAudio = options.audio;
        const publishVideo = options.video;
        const sources = [];
        if (publishAudio) {
            sources.push(Track_1.Track.Source.Microphone);
        }
        if (publishVideo) {
            sources.push(Track_1.Track.Source.Camera);
        }
        // lock to prevent user from publishing the same sources
        sources.forEach((s) => room.localParticipant.pendingPublishing.add(s));
        if (publishAudio || publishVideo) {
            setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                let tracks;
                try {
                    tracks = yield create_1.createLocalTracks({
                        audio: publishAudio,
                        video: publishVideo,
                    });
                }
                catch (e) {
                    const errKind = errors_1.MediaDeviceFailure.getFailure(e);
                    logger_1.default.warn('received error while creating media', errKind);
                    if (e instanceof Error) {
                        logger_1.default.warn(e.message);
                    }
                    // when audio and video are both requested, give audio only a shot
                    if ((errKind === errors_1.MediaDeviceFailure.NotFound || errKind === errors_1.MediaDeviceFailure.DeviceInUse)
                        && publishAudio && publishVideo) {
                        try {
                            tracks = yield create_1.createLocalTracks({
                                audio: publishAudio,
                                video: false,
                            });
                        }
                        catch (audioErr) {
                            // ignore
                        }
                    }
                    if (!tracks) {
                        room.emit(events_1.RoomEvent.MediaDevicesError, e);
                        logger_1.default.error('could not create media', e);
                        sources.forEach((s) => room.localParticipant.pendingPublishing.delete(s));
                        return;
                    }
                }
                try {
                    yield Promise.all(tracks.map((track) => room.localParticipant.publishTrack(track)));
                }
                finally {
                    sources.forEach((s) => room.localParticipant.pendingPublishing.delete(s));
                }
            }));
        }
        return room;
    });
}
exports.connect = connect;
//# sourceMappingURL=connect.js.map