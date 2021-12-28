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
const ts_debounce_1 = require("ts-debounce");
const logger_1 = __importDefault(require("../logger"));
/** @internal */
class PCTransport {
    constructor(config) {
        this.pendingCandidates = [];
        this.restartingIce = false;
        this.renegotiate = false;
        // debounced negotiate interface
        this.negotiate = ts_debounce_1.debounce(() => { this.createAndSendOffer(); }, 100);
        this.pc = new RTCPeerConnection(config);
    }
    get isICEConnected() {
        return this.pc.iceConnectionState === 'connected' || this.pc.iceConnectionState === 'completed';
    }
    addIceCandidate(candidate) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.pc.remoteDescription && !this.restartingIce) {
                return this.pc.addIceCandidate(candidate);
            }
            this.pendingCandidates.push(candidate);
        });
    }
    setRemoteDescription(sd) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.pc.setRemoteDescription(sd);
            this.pendingCandidates.forEach((candidate) => {
                this.pc.addIceCandidate(candidate);
            });
            this.pendingCandidates = [];
            this.restartingIce = false;
            if (this.renegotiate) {
                this.renegotiate = false;
                this.createAndSendOffer();
            }
        });
    }
    createAndSendOffer(options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.onOffer === undefined) {
                return;
            }
            if (options === null || options === void 0 ? void 0 : options.iceRestart) {
                logger_1.default.debug('restarting ICE');
                this.restartingIce = true;
            }
            if (this.pc.signalingState === 'have-local-offer') {
                // we're waiting for the peer to accept our offer, so we'll just wait
                // the only exception to this is when ICE restart is needed
                const currentSD = this.pc.remoteDescription;
                if ((options === null || options === void 0 ? void 0 : options.iceRestart) && currentSD) {
                    // TODO: handle when ICE restart is needed but we don't have a remote description
                    // the best thing to do is to recreate the peerconnection
                    yield this.pc.setRemoteDescription(currentSD);
                }
                else {
                    this.renegotiate = true;
                    return;
                }
            }
            // actually negotiate
            logger_1.default.debug('starting to negotiate');
            const offer = yield this.pc.createOffer(options);
            yield this.pc.setLocalDescription(offer);
            this.onOffer(offer);
        });
    }
    close() {
        this.pc.close();
    }
}
exports.default = PCTransport;
//# sourceMappingURL=PCTransport.js.map