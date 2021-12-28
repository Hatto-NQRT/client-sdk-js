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
exports.maxICEConnectTimeout = void 0;
const events_1 = require("events");
const logger_1 = __importDefault(require("../logger"));
const livekit_models_1 = require("../proto/livekit_models");
const livekit_rtc_1 = require("../proto/livekit_rtc");
const errors_1 = require("./errors");
const events_2 = require("./events");
const PCTransport_1 = __importDefault(require("./PCTransport"));
const utils_1 = require("./utils");
const lossyDataChannel = '_lossy';
const reliableDataChannel = '_reliable';
const maxReconnectRetries = 5;
exports.maxICEConnectTimeout = 5 * 1000;
/** @internal */
class RTCEngine extends events_1.EventEmitter {
    constructor(client, config, options) {
        super();
        this.subscriberPrimary = false;
        this.iceConnected = false;
        this.isClosed = true;
        this.pendingTrackResolvers = {};
        // true if publisher connection has already been established.
        // this is helpful to know if we need to restart ICE on the publisher connection
        this.hasPublished = false;
        this.reconnectAttempts = 0;
        this.handleDataChannel = ({ channel }) => __awaiter(this, void 0, void 0, function* () {
            if (!channel) {
                return;
            }
            if (channel.label === reliableDataChannel) {
                this.reliableDCSub = channel;
            }
            else if (channel.label === lossyDataChannel) {
                this.lossyDCSub = channel;
            }
            else {
                return;
            }
            channel.onmessage = this.handleDataMessage;
        });
        this.handleDataMessage = (message) => __awaiter(this, void 0, void 0, function* () {
            // decode
            let buffer;
            if (message.data instanceof ArrayBuffer) {
                buffer = message.data;
            }
            else if (message.data instanceof Blob) {
                buffer = yield message.data.arrayBuffer();
            }
            else {
                logger_1.default.error('unsupported data type', message.data);
                return;
            }
            const dp = livekit_models_1.DataPacket.decode(new Uint8Array(buffer));
            if (dp.speaker) {
                // dispatch speaker updates
                this.emit(events_2.EngineEvent.ActiveSpeakersUpdate, dp.speaker.speakers);
            }
            else if (dp.user) {
                this.emit(events_2.EngineEvent.DataPacketReceived, dp.user, dp.kind);
            }
        });
        // websocket reconnect behavior. if websocket is interrupted, and the PeerConnection
        // continues to work, we can reconnect to websocket to continue the session
        // after a number of retries, we'll close and give up permanently
        this.handleDisconnect = (connection) => {
            if (this.isClosed) {
                return;
            }
            logger_1.default.debug(`${connection} disconnected`);
            if (this.reconnectAttempts >= maxReconnectRetries) {
                logger_1.default.info('could not connect to signal after', maxReconnectRetries, 'attempts. giving up');
                this.close();
                this.emit(events_2.EngineEvent.Disconnected);
                return;
            }
            const delay = (this.reconnectAttempts * this.reconnectAttempts) * 300;
            setTimeout(() => {
                this.reconnect()
                    .then(() => {
                    this.reconnectAttempts = 0;
                })
                    .catch(this.handleDisconnect);
            }, delay);
        };
        this.client = client;
        this.rtcConfig = config || {};
        this.options = options || {};
    }
    join(url, token, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            this.url = url;
            this.token = token;
            const joinResponse = yield this.client.join(url, token, opts);
            this.isClosed = false;
            this.subscriberPrimary = joinResponse.subscriberPrimary;
            if (!this.publisher) {
                this.configure(joinResponse);
            }
            // create offer
            if (!this.subscriberPrimary) {
                yield this.negotiate();
            }
            return joinResponse;
        });
    }
    close() {
        this.isClosed = true;
        if (this.publisher) {
            this.publisher.pc.getSenders().forEach((sender) => {
                var _a;
                try {
                    (_a = this.publisher) === null || _a === void 0 ? void 0 : _a.pc.removeTrack(sender);
                }
                catch (e) {
                    logger_1.default.warn('could not removeTrack', e);
                }
            });
            this.publisher.close();
            this.publisher = undefined;
        }
        if (this.subscriber) {
            this.subscriber.close();
            this.subscriber = undefined;
        }
        this.client.close();
    }
    addTrack(req) {
        if (this.pendingTrackResolvers[req.cid]) {
            throw new errors_1.TrackInvalidError('a track with the same ID has already been published');
        }
        return new Promise((resolve) => {
            this.pendingTrackResolvers[req.cid] = resolve;
            this.client.sendAddTrack(req);
        });
    }
    updateMuteStatus(trackSid, muted) {
        this.client.sendMuteTrack(trackSid, muted);
    }
    configure(joinResponse) {
        // already configured
        if (this.publisher || this.subscriber) {
            return;
        }
        // update ICE servers before creating PeerConnection
        if (joinResponse.iceServers && !this.rtcConfig.iceServers) {
            const rtcIceServers = [];
            joinResponse.iceServers.forEach((iceServer) => {
                const rtcIceServer = {
                    urls: iceServer.urls,
                };
                if (iceServer.username)
                    rtcIceServer.username = iceServer.username;
                if (iceServer.credential) {
                    rtcIceServer.credential = iceServer.credential;
                }
                rtcIceServers.push(rtcIceServer);
            });
            this.rtcConfig.iceServers = rtcIceServers;
        }
        this.publisher = new PCTransport_1.default(this.rtcConfig);
        this.subscriber = new PCTransport_1.default(this.rtcConfig);
        this.publisher.pc.onicecandidate = (ev) => {
            if (!ev.candidate)
                return;
            logger_1.default.trace('adding ICE candidate for peer', ev.candidate);
            this.client.sendIceCandidate(ev.candidate, livekit_rtc_1.SignalTarget.PUBLISHER);
        };
        this.subscriber.pc.onicecandidate = (ev) => {
            if (!ev.candidate)
                return;
            this.client.sendIceCandidate(ev.candidate, livekit_rtc_1.SignalTarget.SUBSCRIBER);
        };
        this.publisher.onOffer = (offer) => {
            if (this.options.onBeforeSendOffer) {
                offer = this.options.onBeforeSendOffer(offer);
            }
            this.client.sendOffer(offer);
        };
        let primaryPC = this.publisher.pc;
        if (joinResponse.subscriberPrimary) {
            primaryPC = this.subscriber.pc;
            // in subscriber primary mode, server side opens sub data channels.
            this.subscriber.pc.ondatachannel = this.handleDataChannel;
        }
        primaryPC.oniceconnectionstatechange = () => {
            if (primaryPC.iceConnectionState === 'connected') {
                logger_1.default.trace('ICE connected');
                if (!this.iceConnected) {
                    this.iceConnected = true;
                    this.emit(events_2.EngineEvent.Connected);
                }
            }
            else if (primaryPC.iceConnectionState === 'failed') {
                logger_1.default.trace('ICE disconnected');
                if (this.iceConnected) {
                    this.iceConnected = false;
                    this.handleDisconnect('peerconnection');
                }
            }
        };
        this.subscriber.pc.ontrack = (ev) => {
            this.emit(events_2.EngineEvent.MediaTrackAdded, ev.track, ev.streams[0], ev.receiver);
        };
        // data channels
        this.lossyDC = this.publisher.pc.createDataChannel(lossyDataChannel, {
            // will drop older packets that arrive
            ordered: true,
            maxRetransmits: 0,
        });
        this.reliableDC = this.publisher.pc.createDataChannel(reliableDataChannel, {
            ordered: true,
        });
        // also handle messages over the pub channel, for backwards compatibility
        this.lossyDC.onmessage = this.handleDataMessage;
        this.reliableDC.onmessage = this.handleDataMessage;
        // configure signaling client
        this.client.onAnswer = (sd) => __awaiter(this, void 0, void 0, function* () {
            if (!this.publisher) {
                return;
            }
            logger_1.default.debug('received server answer', sd.type, this.publisher.pc.signalingState);
            yield this.publisher.setRemoteDescription(sd);
        });
        // add candidate on trickle
        this.client.onTrickle = (candidate, target) => {
            if (!this.publisher || !this.subscriber) {
                return;
            }
            logger_1.default.trace('got ICE candidate from peer', candidate, target);
            if (target === livekit_rtc_1.SignalTarget.PUBLISHER) {
                this.publisher.addIceCandidate(candidate);
            }
            else {
                this.subscriber.addIceCandidate(candidate);
            }
        };
        // when server creates an offer for the client
        this.client.onOffer = (sd) => __awaiter(this, void 0, void 0, function* () {
            if (!this.subscriber) {
                return;
            }
            logger_1.default.debug('received server offer', sd.type, this.subscriber.pc.signalingState);
            yield this.subscriber.setRemoteDescription(sd);
            // answer the offer
            let answer = yield this.subscriber.pc.createAnswer();
            if (this.options.onBeforeSendAnswer) {
                answer = this.options.onBeforeSendAnswer(answer);
            }
            yield this.subscriber.pc.setLocalDescription(answer);
            this.client.sendAnswer(answer);
        });
        this.client.onParticipantUpdate = (updates) => {
            this.emit(events_2.EngineEvent.ParticipantUpdate, updates);
        };
        this.client.onLocalTrackPublished = (res) => {
            const resolve = this.pendingTrackResolvers[res.cid];
            if (!resolve) {
                logger_1.default.error('missing track resolver for ', res.cid);
                return;
            }
            delete this.pendingTrackResolvers[res.cid];
            resolve(res.track);
        };
        this.client.onSpeakersChanged = (speakers) => {
            this.emit(events_2.EngineEvent.SpeakersChanged, speakers);
        };
        this.client.onClose = () => {
            this.handleDisconnect('signal');
        };
        this.client.onLeave = () => {
            this.close();
            this.emit(events_2.EngineEvent.Disconnected);
        };
        this.client.onRemoteMuteChanged = (trackSid, muted) => {
            this.emit(events_2.EngineEvent.RemoteMuteChanged, trackSid, muted);
        };
        this.client.onRoomUpdate = (room) => {
            this.emit(events_2.EngineEvent.RoomUpdate, room);
        };
        this.client.onConnectionQuality = (update) => {
            this.emit(events_2.EngineEvent.ConnectionQualityUpdate, update);
        };
    }
    reconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isClosed) {
                return;
            }
            if (!this.url || !this.token) {
                throw new errors_1.ConnectionError('could not reconnect, url or token not saved');
            }
            logger_1.default.info('reconnecting to signal connection, attempt', this.reconnectAttempts);
            if (this.reconnectAttempts === 0) {
                this.emit(events_2.EngineEvent.Reconnecting);
            }
            this.reconnectAttempts += 1;
            yield this.client.reconnect(this.url, this.token);
            // trigger publisher reconnect
            if (!this.publisher || !this.subscriber) {
                throw new errors_1.UnexpectedConnectionState('publisher and subscriber connections unset');
            }
            this.subscriber.restartingIce = true;
            // only restart publisher if it's needed
            if (this.hasPublished) {
                yield this.publisher.createAndSendOffer({ iceRestart: true });
            }
            const startTime = (new Date()).getTime();
            while ((new Date()).getTime() - startTime < exports.maxICEConnectTimeout * 2) {
                if (this.iceConnected) {
                    // reconnect success
                    this.emit(events_2.EngineEvent.Reconnected);
                    return;
                }
                yield utils_1.sleep(100);
            }
            // have not reconnected, throw
            throw new errors_1.ConnectionError('could not establish ICE connection');
        });
    }
    /* @internal */
    sendDataPacket(packet, kind) {
        return __awaiter(this, void 0, void 0, function* () {
            const msg = livekit_models_1.DataPacket.encode(packet).finish();
            // make sure we do have a data connection
            yield this.ensurePublisherConnected(kind);
            if (kind === livekit_models_1.DataPacket_Kind.LOSSY && this.lossyDC) {
                this.lossyDC.send(msg);
            }
            else if (kind === livekit_models_1.DataPacket_Kind.RELIABLE && this.reliableDC) {
                this.reliableDC.send(msg);
            }
        });
    }
    ensurePublisherConnected(kind) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.subscriberPrimary) {
                return;
            }
            if (this.publisher && this.publisher.isICEConnected) {
                return;
            }
            // start negotiation
            this.negotiate();
            // wait until publisher ICE connected
            const endTime = (new Date()).getTime() + exports.maxICEConnectTimeout;
            while ((new Date()).getTime() < endTime) {
                if (this.publisher && this.publisher.isICEConnected) {
                    let status = 'connecting';
                    if (kind === livekit_models_1.DataPacket_Kind.LOSSY && this.lossyDC) {
                        status = this.lossyDC.readyState;
                    }
                    else if (kind === livekit_models_1.DataPacket_Kind.RELIABLE && this.reliableDC) {
                        status = this.reliableDC.readyState;
                    }
                    if (status === 'open') {
                        return;
                    }
                }
                yield utils_1.sleep(50);
            }
            throw new errors_1.ConnectionError(`could not establish publisher connection, state ${(_a = this.publisher) === null || _a === void 0 ? void 0 : _a.pc.iceConnectionState}`);
        });
    }
    /** @internal */
    negotiate() {
        if (!this.publisher) {
            return;
        }
        this.hasPublished = true;
        this.publisher.negotiate();
    }
}
exports.default = RTCEngine;
//# sourceMappingURL=RTCEngine.js.map