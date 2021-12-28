"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.RoomState = void 0;
const events_1 = require("events");
const logger_1 = __importDefault(require("../logger"));
const livekit_models_1 = require("../proto/livekit_models");
const defaults_1 = require("./defaults");
const DeviceManager_1 = __importDefault(require("./DeviceManager"));
const errors_1 = require("./errors");
const events_2 = require("./events");
const LocalParticipant_1 = __importDefault(require("./participant/LocalParticipant"));
const RemoteParticipant_1 = __importDefault(require("./participant/RemoteParticipant"));
const RTCEngine_1 = __importStar(require("./RTCEngine"));
const Track_1 = require("./track/Track");
const utils_1 = require("./utils");
var RoomState;
(function (RoomState) {
    RoomState["Disconnected"] = "disconnected";
    RoomState["Connected"] = "connected";
    RoomState["Reconnecting"] = "reconnecting";
})(RoomState = exports.RoomState || (exports.RoomState = {}));
/**
 * In LiveKit, a room is the logical grouping for a list of participants.
 * Participants in a room can publish tracks, and subscribe to others' tracks.
 *
 * a Room fires [[RoomEvent | RoomEvents]].
 *
 * @noInheritDoc
 */
class Room extends events_1.EventEmitter {
    /** @internal */
    constructor(client, options, rtcEngineOption) {
        super();
        this.state = RoomState.Disconnected;
        /**
         * list of participants that are actively speaking. when this changes
         * a [[RoomEvent.ActiveSpeakersChanged]] event is fired
         */
        this.activeSpeakers = [];
        /** room metadata */
        this.metadata = undefined;
        /** @internal */
        this.options = {};
        this.audioEnabled = true;
        /** @internal */
        this.connect = (url, token, opts) => __awaiter(this, void 0, void 0, function* () {
            // guard against calling connect
            if (this.localParticipant) {
                logger_1.default.warn('already connected to room', this.name);
                return this;
            }
            try {
                const joinResponse = yield this.engine.join(url, token, opts);
                logger_1.default.debug('connected to Livekit Server', joinResponse.serverVersion);
                if (!joinResponse.serverVersion) {
                    throw new errors_1.UnsupportedServer('unknown server version');
                }
                this.state = RoomState.Connected;
                const pi = joinResponse.participant;
                this.localParticipant = new LocalParticipant_1.default(pi.sid, pi.identity, this.engine);
                this.localParticipant.updateInfo(pi);
                // forward metadata changed for the local participant
                this.localParticipant
                    .on(events_2.ParticipantEvent.MetadataChanged, (metadata, p) => {
                    this.emit(events_2.RoomEvent.MetadataChanged, metadata, p);
                })
                    .on(events_2.ParticipantEvent.ParticipantMetadataChanged, (metadata, p) => {
                    this.emit(events_2.RoomEvent.ParticipantMetadataChanged, metadata, p);
                })
                    .on(events_2.ParticipantEvent.TrackMuted, (pub) => {
                    this.emit(events_2.RoomEvent.TrackMuted, pub, this.localParticipant);
                })
                    .on(events_2.ParticipantEvent.TrackUnmuted, (pub) => {
                    this.emit(events_2.RoomEvent.TrackUnmuted, pub, this.localParticipant);
                })
                    .on(events_2.ParticipantEvent.LocalTrackPublished, (pub) => {
                    this.emit(events_2.RoomEvent.LocalTrackPublished, pub, this.localParticipant);
                })
                    .on(events_2.ParticipantEvent.LocalTrackUnpublished, (pub) => {
                    this.emit(events_2.RoomEvent.LocalTrackUnpublished, pub, this.localParticipant);
                })
                    .on(events_2.ParticipantEvent.ConnectionQualityChanged, (quality) => {
                    this.emit(events_2.RoomEvent.ConnectionQualityChanged, quality, this.localParticipant);
                })
                    .on(events_2.ParticipantEvent.MediaDevicesError, (e) => {
                    this.emit(events_2.RoomEvent.MediaDevicesError, e);
                });
                // populate remote participants, these should not trigger new events
                joinResponse.otherParticipants.forEach((info) => {
                    this.getOrCreateParticipant(info.sid, info);
                });
                this.name = joinResponse.room.name;
                this.sid = joinResponse.room.sid;
            }
            catch (err) {
                this.engine.close();
                throw err;
            }
            // don't return until ICE connected
            return new Promise((resolve, reject) => {
                const connectTimeout = setTimeout(() => {
                    // timeout
                    this.engine.close();
                    reject(new errors_1.ConnectionError('could not connect after timeout'));
                }, RTCEngine_1.maxICEConnectTimeout);
                this.engine.once(events_2.EngineEvent.Connected, () => {
                    clearTimeout(connectTimeout);
                    // also hook unload event
                    window.addEventListener('beforeunload', this.onBeforeUnload);
                    navigator.mediaDevices.addEventListener('devicechange', this.handleDeviceChange);
                    resolve(this);
                });
            });
        });
        /**
         * disconnects the room, emits [[RoomEvent.Disconnected]]
         */
        this.disconnect = (stopTracks = true) => {
            // send leave
            this.engine.client.sendLeave();
            this.engine.close();
            this.handleDisconnect(stopTracks);
        };
        this.onBeforeUnload = () => {
            this.disconnect();
        };
        // updates are sent only when there's a change to speaker ordering
        this.handleActiveSpeakersUpdate = (speakers) => {
            const activeSpeakers = [];
            const seenSids = {};
            speakers.forEach((speaker) => {
                seenSids[speaker.sid] = true;
                if (speaker.sid === this.localParticipant.sid) {
                    this.localParticipant.audioLevel = speaker.level;
                    this.localParticipant.setIsSpeaking(true);
                    activeSpeakers.push(this.localParticipant);
                }
                else {
                    const p = this.participants.get(speaker.sid);
                    if (p) {
                        p.audioLevel = speaker.level;
                        p.setIsSpeaking(true);
                        activeSpeakers.push(p);
                    }
                }
            });
            if (!seenSids[this.localParticipant.sid]) {
                this.localParticipant.audioLevel = 0;
                this.localParticipant.setIsSpeaking(false);
            }
            this.participants.forEach((p) => {
                if (!seenSids[p.sid]) {
                    p.audioLevel = 0;
                    p.setIsSpeaking(false);
                }
            });
            this.activeSpeakers = activeSpeakers;
            this.emit(events_2.RoomEvent.ActiveSpeakersChanged, activeSpeakers);
        };
        // process list of changed speakers
        this.handleSpeakersChanged = (speakerUpdates) => {
            const lastSpeakers = new Map();
            this.activeSpeakers.forEach((p) => {
                lastSpeakers.set(p.sid, p);
            });
            speakerUpdates.forEach((speaker) => {
                let p = this.participants.get(speaker.sid);
                if (speaker.sid === this.localParticipant.sid) {
                    p = this.localParticipant;
                }
                if (!p) {
                    return;
                }
                p.audioLevel = speaker.level;
                p.setIsSpeaking(speaker.active);
                if (speaker.active) {
                    lastSpeakers.set(speaker.sid, p);
                }
                else {
                    lastSpeakers.delete(speaker.sid);
                }
            });
            const activeSpeakers = Array.from(lastSpeakers.values());
            activeSpeakers.sort((a, b) => b.audioLevel - a.audioLevel);
            this.activeSpeakers = activeSpeakers;
            this.emit(events_2.RoomEvent.ActiveSpeakersChanged, activeSpeakers);
        };
        this.handleDataPacket = (userPacket, kind) => {
            // find the participant
            const participant = this.participants.get(userPacket.participantSid);
            this.emit(events_2.RoomEvent.DataReceived, userPacket.payload, participant, kind);
            // also emit on the participant
            participant === null || participant === void 0 ? void 0 : participant.emit(events_2.ParticipantEvent.DataReceived, userPacket.payload, kind);
        };
        this.handleAudioPlaybackStarted = () => {
            if (this.canPlaybackAudio) {
                return;
            }
            this.audioEnabled = true;
            this.emit(events_2.RoomEvent.AudioPlaybackStatusChanged, true);
        };
        this.handleAudioPlaybackFailed = (e) => {
            logger_1.default.warn('could not playback audio', e);
            if (!this.canPlaybackAudio) {
                return;
            }
            this.audioEnabled = false;
            this.emit(events_2.RoomEvent.AudioPlaybackStatusChanged, false);
        };
        this.handleDeviceChange = () => __awaiter(this, void 0, void 0, function* () {
            this.emit(events_2.RoomEvent.MediaDevicesChanged);
        });
        this.handleRoomUpdate = (r) => {
            this.metadata = r.metadata;
            this.emit(events_2.RoomEvent.RoomMetadataChanged, r.metadata);
        };
        this.handleConnectionQualityUpdate = (update) => {
            update.updates.forEach((info) => {
                if (info.participantSid === this.localParticipant.sid) {
                    this.localParticipant.setConnectionQuality(info.quality);
                    return;
                }
                const participant = this.participants.get(info.participantSid);
                if (participant) {
                    participant.setConnectionQuality(info.quality);
                }
            });
        };
        this.participants = new Map();
        this.options = options || {};
        this.engine = new RTCEngine_1.default(client, this.options.rtcConfig, rtcEngineOption);
        this.acquireAudioContext();
        this.engine.on(events_2.EngineEvent.MediaTrackAdded, (mediaTrack, stream, receiver) => {
            this.onTrackAdded(mediaTrack, stream, receiver);
        });
        this.engine.on(events_2.EngineEvent.Disconnected, () => {
            this.handleDisconnect();
        });
        this.engine.on(events_2.EngineEvent.ParticipantUpdate, (participants) => {
            this.handleParticipantUpdates(participants);
        });
        this.engine.on(events_2.EngineEvent.RoomUpdate, this.handleRoomUpdate);
        this.engine.on(events_2.EngineEvent.ActiveSpeakersUpdate, this.handleActiveSpeakersUpdate);
        this.engine.on(events_2.EngineEvent.SpeakersChanged, this.handleSpeakersChanged);
        this.engine.on(events_2.EngineEvent.DataPacketReceived, this.handleDataPacket);
        this.engine.on(events_2.EngineEvent.Reconnecting, () => {
            this.state = RoomState.Reconnecting;
            this.emit(events_2.RoomEvent.Reconnecting);
        });
        this.engine.on(events_2.EngineEvent.Reconnected, () => {
            this.state = RoomState.Connected;
            this.emit(events_2.RoomEvent.Reconnected);
        });
        this.engine.on(events_2.EngineEvent.ConnectionQualityUpdate, this.handleConnectionQualityUpdate);
    }
    /**
     * getLocalDevices abstracts navigator.mediaDevices.enumerateDevices.
     * In particular, it handles Chrome's unique behavior of creating `default`
     * devices. When encountered, it'll be removed from the list of devices.
     * The actual default device will be placed at top.
     * @param kind
     * @returns a list of available local devices
     */
    static getLocalDevices(kind) {
        return DeviceManager_1.default.getInstance().getDevices(kind);
    }
    /**
     * Set default publish options
     */
    set defaultPublishOptions(opts) {
        defaults_1.setTrackPublishDefaults(opts);
    }
    get defaultPublishOptions() {
        return defaults_1.getTrackPublishDefaults();
    }
    set defaultCaptureOptions(opts) {
        defaults_1.setTrackCaptureDefaults(opts);
    }
    get defaultCaptureOptions() {
        return defaults_1.getTrackCaptureDefaults();
    }
    /**
     * Browsers have different policies regarding audio playback. Most requiring
     * some form of user interaction (click/tap/etc).
     * In those cases, audio will be silent until a click/tap triggering one of the following
     * - `startAudio`
     * - `getUserMedia`
     */
    startAudio() {
        return __awaiter(this, void 0, void 0, function* () {
            this.acquireAudioContext();
            const elements = [];
            this.participants.forEach((p) => {
                p.audioTracks.forEach((t) => {
                    if (t.track) {
                        t.track.attachedElements.forEach((e) => {
                            elements.push(e);
                        });
                    }
                });
            });
            try {
                yield Promise.all(elements.map((e) => e.play()));
                this.handleAudioPlaybackStarted();
            }
            catch (err) {
                this.handleAudioPlaybackFailed(err);
                throw err;
            }
        });
    }
    /**
     * Returns true if audio playback is enabled
     */
    get canPlaybackAudio() {
        return this.audioEnabled;
    }
    /**
     * Switches all active device used in this room to the given device.
     *
     * Note: setting AudioOutput is not supported on some browsers. See [setSinkId](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/setSinkId#browser_compatibility)
     *
     * @param kind use `videoinput` for camera track,
     *  `audioinput` for microphone track,
     *  `audiooutput` to set speaker for all incoming audio tracks
     * @param deviceId
     */
    switchActiveDevice(kind, deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (kind === 'audioinput') {
                const tracks = Array
                    .from(this.localParticipant.audioTracks.values())
                    .filter((track) => track.source === Track_1.Track.Source.Microphone);
                yield Promise.all(tracks.map((t) => { var _a; return (_a = t.audioTrack) === null || _a === void 0 ? void 0 : _a.setDeviceId(deviceId); }));
                this.defaultCaptureOptions.audioDeviceId = deviceId;
            }
            else if (kind === 'videoinput') {
                const tracks = Array
                    .from(this.localParticipant.videoTracks.values())
                    .filter((track) => track.source === Track_1.Track.Source.Camera);
                yield Promise.all(tracks.map((t) => { var _a; return (_a = t.videoTrack) === null || _a === void 0 ? void 0 : _a.setDeviceId(deviceId); }));
                this.defaultCaptureOptions.videoDeviceId = deviceId;
            }
            else if (kind === 'audiooutput') {
                const elements = [];
                this.participants.forEach((p) => {
                    p.audioTracks.forEach((t) => {
                        if (t.isSubscribed && t.track) {
                            t.track.attachedElements.forEach((e) => {
                                elements.push(e);
                            });
                        }
                    });
                });
                yield Promise.all(elements.map((e) => __awaiter(this, void 0, void 0, function* () {
                    if ('setSinkId' in e) {
                        /* @ts-ignore */
                        yield e.setSinkId(deviceId);
                    }
                })));
            }
        });
    }
    onTrackAdded(mediaTrack, stream, receiver) {
        const parts = utils_1.unpackStreamId(stream.id);
        const participantId = parts[0];
        let trackId = parts[1];
        if (!trackId || trackId === '')
            trackId = mediaTrack.id;
        const participant = this.getOrCreateParticipant(participantId);
        participant.addSubscribedMediaTrack(mediaTrack, trackId, receiver, this.options.autoManageVideo);
    }
    handleDisconnect(shouldStopTracks = true) {
        if (this.state === RoomState.Disconnected) {
            return;
        }
        this.participants.forEach((p) => {
            p.tracks.forEach((pub) => {
                p.unpublishTrack(pub.trackSid);
            });
        });
        if (shouldStopTracks) {
            this.localParticipant.tracks.forEach((pub) => {
                var _a, _b;
                (_a = pub.track) === null || _a === void 0 ? void 0 : _a.detach();
                (_b = pub.track) === null || _b === void 0 ? void 0 : _b.stop();
            });
        }
        this.participants.clear();
        this.activeSpeakers = [];
        if (this.audioContext) {
            this.audioContext.close();
            this.audioContext = undefined;
        }
        window.removeEventListener('beforeunload', this.onBeforeUnload);
        navigator.mediaDevices.removeEventListener('devicechange', this.handleDeviceChange);
        this.emit(events_2.RoomEvent.Disconnected);
        this.state = RoomState.Disconnected;
    }
    handleParticipantUpdates(participantInfos) {
        // handle changes to participant state, and send events
        participantInfos.forEach((info) => {
            if (info.sid === this.localParticipant.sid) {
                this.localParticipant.updateInfo(info);
                return;
            }
            let remoteParticipant = this.participants.get(info.sid);
            const isNewParticipant = !remoteParticipant;
            // create participant if doesn't exist
            remoteParticipant = this.getOrCreateParticipant(info.sid, info);
            // when it's disconnected, send updates
            if (info.state === livekit_models_1.ParticipantInfo_State.DISCONNECTED) {
                this.handleParticipantDisconnected(info.sid, remoteParticipant);
            }
            else if (isNewParticipant) {
                // fire connected event
                this.emit(events_2.RoomEvent.ParticipantConnected, remoteParticipant);
            }
            else {
                // just update, no events
                remoteParticipant.updateInfo(info);
            }
        });
    }
    handleParticipantDisconnected(sid, participant) {
        // remove and send event
        this.participants.delete(sid);
        if (!participant) {
            return;
        }
        participant.tracks.forEach((publication) => {
            participant.unpublishTrack(publication.trackSid);
        });
        this.emit(events_2.RoomEvent.ParticipantDisconnected, participant);
    }
    acquireAudioContext() {
        if (this.audioContext) {
            this.audioContext.close();
        }
        // by using an AudioContext, it reduces lag on audio elements
        // https://stackoverflow.com/questions/9811429/html5-audio-tag-on-safari-has-a-delay/54119854#54119854
        // @ts-ignore
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
            this.audioContext = new AudioContext();
        }
    }
    getOrCreateParticipant(id, info) {
        let participant = this.participants.get(id);
        if (!participant) {
            // it's possible for the RTC track to arrive before signaling data
            // when this happens, we'll create the participant and make the track work
            if (info) {
                participant = RemoteParticipant_1.default.fromParticipantInfo(this.engine.client, info);
            }
            else {
                participant = new RemoteParticipant_1.default(this.engine.client, id, '');
            }
            this.participants.set(id, participant);
            // also forward events
            // trackPublished is only fired for tracks added after both local participant
            // and remote participant joined the room
            participant
                .on(events_2.ParticipantEvent.TrackPublished, (trackPublication) => {
                this.emit(events_2.RoomEvent.TrackPublished, trackPublication, participant);
            })
                .on(events_2.ParticipantEvent.TrackSubscribed, (track, publication) => {
                // monitor playback status
                if (track.kind === Track_1.Track.Kind.Audio) {
                    track.on(events_2.TrackEvent.AudioPlaybackStarted, this.handleAudioPlaybackStarted);
                    track.on(events_2.TrackEvent.AudioPlaybackFailed, this.handleAudioPlaybackFailed);
                }
                this.emit(events_2.RoomEvent.TrackSubscribed, track, publication, participant);
            })
                .on(events_2.ParticipantEvent.TrackUnpublished, (publication) => {
                this.emit(events_2.RoomEvent.TrackUnpublished, publication, participant);
            })
                .on(events_2.ParticipantEvent.TrackUnsubscribed, (track, publication) => {
                this.emit(events_2.RoomEvent.TrackUnsubscribed, track, publication, participant);
            })
                .on(events_2.ParticipantEvent.TrackSubscriptionFailed, (sid) => {
                this.emit(events_2.RoomEvent.TrackSubscriptionFailed, sid, participant);
            })
                .on(events_2.ParticipantEvent.TrackMuted, (pub) => {
                this.emit(events_2.RoomEvent.TrackMuted, pub, participant);
            })
                .on(events_2.ParticipantEvent.TrackUnmuted, (pub) => {
                this.emit(events_2.RoomEvent.TrackUnmuted, pub, participant);
            })
                .on(events_2.ParticipantEvent.MetadataChanged, (metadata, p) => {
                this.emit(events_2.RoomEvent.ParticipantMetadataChanged, metadata, p);
                this.emit(events_2.RoomEvent.MetadataChanged, metadata, p);
            })
                .on(events_2.ParticipantEvent.ConnectionQualityChanged, (quality) => {
                this.emit(events_2.RoomEvent.ConnectionQualityChanged, quality, participant);
            });
        }
        return participant;
    }
    /** @internal */
    emit(event, ...args) {
        logger_1.default.debug('room event', event, ...args);
        return super.emit(event, ...args);
    }
}
exports.default = Room;
//# sourceMappingURL=Room.js.map