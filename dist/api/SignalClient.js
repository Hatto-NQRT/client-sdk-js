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
exports.WSSignalClient = void 0;
require("webrtc-adapter");
const logger_1 = __importDefault(require("../logger"));
const livekit_rtc_1 = require("../proto/livekit_rtc");
const errors_1 = require("../room/errors");
const version_1 = require("../version");
class WSSignalClient {
    constructor(useJSON = false) {
        this.isConnected = false;
        this.useJSON = useJSON;
    }
    join(url, token, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.connect(url, token, {
                autoSubscribe: opts === null || opts === void 0 ? void 0 : opts.autoSubscribe,
            });
            return res;
        });
    }
    reconnect(url, token) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.connect(url, token, {
                reconnect: true,
            });
        });
    }
    connect(url, token, opts) {
        if (url.startsWith('http')) {
            url = url.replace('http', 'ws');
        }
        // strip trailing slash
        url = url.replace(/\/$/, '');
        url += '/rtc';
        let params = `?access_token=${token}&protocol=${version_1.protocolVersion}&sdk=js&version=${version_1.version}`;
        if (opts.reconnect) {
            params += '&reconnect=1';
        }
        if (opts.autoSubscribe !== undefined) {
            params += `&auto_subscribe=${opts.autoSubscribe ? '1' : '0'}`;
        }
        return new Promise((resolve, reject) => {
            logger_1.default.debug('connecting to', url + params);
            this.ws = undefined;
            const ws = new WebSocket(url + params);
            ws.binaryType = 'arraybuffer';
            ws.onerror = (ev) => __awaiter(this, void 0, void 0, function* () {
                if (!this.ws) {
                    try {
                        const resp = yield fetch(`http${url.substr(2)}/validate${params}`);
                        if (!resp.ok) {
                            const msg = yield resp.text();
                            reject(new errors_1.ConnectionError(msg));
                        }
                        else {
                            reject(new errors_1.ConnectionError('Internal error'));
                        }
                    }
                    catch (e) {
                        reject(new errors_1.ConnectionError('server was not reachable'));
                    }
                    return;
                }
                // other errors, handle
                this.handleWSError(ev);
            });
            ws.onopen = () => {
                this.ws = ws;
                if (opts.reconnect) {
                    // upon reconnection, there will not be additional handshake
                    this.isConnected = true;
                    resolve();
                }
            };
            ws.onmessage = (ev) => {
                // not considered connected until JoinResponse is received
                let msg;
                if (typeof ev.data === 'string') {
                    const json = JSON.parse(ev.data);
                    msg = livekit_rtc_1.SignalResponse.fromJSON(json);
                }
                else if (ev.data instanceof ArrayBuffer) {
                    msg = livekit_rtc_1.SignalResponse.decode(new Uint8Array(ev.data));
                }
                else {
                    logger_1.default.error('could not decode websocket message', typeof ev.data);
                    return;
                }
                if (!this.isConnected) {
                    // handle join message only
                    if (msg.join) {
                        this.isConnected = true;
                        resolve(msg.join);
                    }
                    else {
                        reject(new errors_1.ConnectionError('did not receive join response'));
                    }
                    return;
                }
                this.handleSignalResponse(msg);
            };
            ws.onclose = (ev) => {
                if (!this.isConnected)
                    return;
                logger_1.default.debug('websocket connection closed', ev.reason);
                this.isConnected = false;
                if (this.onClose)
                    this.onClose(ev.reason);
            };
        });
    }
    close() {
        var _a;
        this.isConnected = false;
        if (this.ws)
            this.ws.onclose = null;
        (_a = this.ws) === null || _a === void 0 ? void 0 : _a.close();
    }
    // initial offer after joining
    sendOffer(offer) {
        logger_1.default.debug('sending offer', offer);
        this.sendRequest({
            offer: toProtoSessionDescription(offer),
        });
    }
    // answer a server-initiated offer
    sendAnswer(answer) {
        logger_1.default.debug('sending answer');
        this.sendRequest({
            answer: toProtoSessionDescription(answer),
        });
    }
    sendIceCandidate(candidate, target) {
        logger_1.default.debug('sending ice candidate', candidate);
        this.sendRequest({
            trickle: {
                candidateInit: JSON.stringify(candidate),
                target,
            },
        });
    }
    sendMuteTrack(trackSid, muted) {
        this.sendRequest({
            mute: {
                sid: trackSid,
                muted,
            },
        });
    }
    sendAddTrack(req) {
        this.sendRequest({
            addTrack: livekit_rtc_1.AddTrackRequest.fromPartial(req),
        });
    }
    sendUpdateTrackSettings(settings) {
        this.sendRequest({ trackSetting: settings });
    }
    sendUpdateSubscription(sub) {
        this.sendRequest({ subscription: sub });
    }
    sendLeave() {
        this.sendRequest(livekit_rtc_1.SignalRequest.fromPartial({ leave: {} }));
    }
    sendRequest(req) {
        if (!this.ws) {
            throw new errors_1.ConnectionError('cannot send signal request before connected');
        }
        if (this.useJSON) {
            this.ws.send(JSON.stringify(livekit_rtc_1.SignalRequest.toJSON(req)));
        }
        else {
            this.ws.send(livekit_rtc_1.SignalRequest.encode(req).finish());
        }
    }
    handleSignalResponse(msg) {
        if (msg.answer) {
            const sd = fromProtoSessionDescription(msg.answer);
            if (this.onAnswer) {
                this.onAnswer(sd);
            }
        }
        else if (msg.offer) {
            const sd = fromProtoSessionDescription(msg.offer);
            if (this.onOffer) {
                this.onOffer(sd);
            }
        }
        else if (msg.trickle) {
            const candidate = JSON.parse(msg.trickle.candidateInit);
            if (this.onTrickle) {
                this.onTrickle(candidate, msg.trickle.target);
            }
        }
        else if (msg.update) {
            if (this.onParticipantUpdate) {
                this.onParticipantUpdate(msg.update.participants);
            }
        }
        else if (msg.trackPublished) {
            if (this.onLocalTrackPublished) {
                this.onLocalTrackPublished(msg.trackPublished);
            }
        }
        else if (msg.speakersChanged) {
            if (this.onSpeakersChanged) {
                this.onSpeakersChanged(msg.speakersChanged.speakers);
            }
        }
        else if (msg.leave) {
            if (this.onLeave) {
                this.onLeave();
            }
        }
        else if (msg.mute) {
            if (this.onRemoteMuteChanged) {
                this.onRemoteMuteChanged(msg.mute.sid, msg.mute.muted);
            }
        }
        else if (msg.roomUpdate) {
            if (this.onRoomUpdate) {
                this.onRoomUpdate(msg.roomUpdate.room);
            }
        }
        else if (msg.connectionQuality) {
            if (this.onConnectionQuality) {
                this.onConnectionQuality(msg.connectionQuality);
            }
        }
        else {
            logger_1.default.debug('unsupported message', msg);
        }
    }
    handleWSError(ev) {
        logger_1.default.error('websocket error', ev);
    }
}
exports.WSSignalClient = WSSignalClient;
function fromProtoSessionDescription(sd) {
    const rsd = {
        type: 'offer',
        sdp: sd.sdp,
    };
    switch (sd.type) {
        case 'answer':
        case 'offer':
        case 'pranswer':
        case 'rollback':
            rsd.type = sd.type;
            break;
        default:
            break;
    }
    return rsd;
}
function toProtoSessionDescription(rsd) {
    const sd = {
        sdp: rsd.sdp,
        type: rsd.type,
    };
    return sd;
}
//# sourceMappingURL=SignalClient.js.map