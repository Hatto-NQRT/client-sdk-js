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
const livekit_rtc_1 = require("../../proto/livekit_rtc");
const stats_1 = require("../stats");
const LocalTrack_1 = __importDefault(require("./LocalTrack"));
const Track_1 = require("./Track");
// delay before attempting to upgrade
const QUALITY_UPGRADE_DELAY = 60 * 1000;
// avoid downgrading too quickly
const QUALITY_DOWNGRADE_DELAY = 5 * 1000;
const ridOrder = ['q', 'h', 'f'];
class LocalVideoTrack extends LocalTrack_1.default {
    constructor(mediaTrack, name, constraints) {
        super(mediaTrack, Track_1.Track.Kind.Video, name, constraints);
        this.monitorSender = () => __awaiter(this, void 0, void 0, function* () {
            if (!this.sender) {
                return;
            }
            const stats = yield this.getSenderStats();
            const statsMap = new Map(stats.map((s) => [s.rid, s]));
            if (this.prevStats && this.isSimulcast) {
                this.checkAndUpdateSimulcast(statsMap);
            }
            this.prevStats = statsMap;
            setTimeout(() => {
                this.monitorSender();
            }, stats_1.monitorFrequency);
        });
    }
    get isSimulcast() {
        if (this.sender && this.sender.getParameters().encodings.length > 1) {
            return true;
        }
        return false;
    }
    /* internal */
    startMonitor(signalClient) {
        // only monitor simulcast streams
        if (!this.isSimulcast) {
            return;
        }
        this.signalClient = signalClient;
        setTimeout(() => {
            this.monitorSender();
        }, stats_1.monitorFrequency);
    }
    stop() {
        this.sender = undefined;
        this.mediaStreamTrack.getConstraints();
        super.stop();
    }
    mute() {
        const _super = Object.create(null, {
            mute: { get: () => super.mute }
        });
        return __awaiter(this, void 0, void 0, function* () {
            if (this.source === Track_1.Track.Source.Camera) {
                logger_1.default.debug('stopping camera track');
                // also stop the track, so that camera indicator is turned off
                this.mediaStreamTrack.stop();
            }
            yield _super.mute.call(this);
            return this;
        });
    }
    unmute() {
        const _super = Object.create(null, {
            unmute: { get: () => super.unmute }
        });
        return __awaiter(this, void 0, void 0, function* () {
            if (this.source === Track_1.Track.Source.Camera) {
                logger_1.default.debug('reacquiring camera track');
                yield this.restartTrack();
            }
            yield _super.unmute.call(this);
            return this;
        });
    }
    getSenderStats() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.sender) {
                return [];
            }
            const items = [];
            const stats = yield this.sender.getStats();
            let sender;
            stats.forEach((v) => {
                if (v.type === 'track'
                    && v.trackIdentifier === this.mediaStreamTrack.id) {
                    sender = v;
                }
            });
            if (!sender) {
                return items;
            }
            // match the outbound-rtp items
            stats.forEach((v) => {
                if (v.type === 'outbound-rtp' && v.trackId === sender.id) {
                    const vs = {
                        type: 'video',
                        streamId: v.id,
                        frameHeight: v.frameHeight,
                        frameWidth: v.frameWidth,
                        firCount: v.firCount,
                        pliCount: v.pliCount,
                        nackCount: v.nackCount,
                        packetsSent: v.packetsSent,
                        framesSent: v.framesSent,
                        timestamp: v.timestamp,
                        rid: v.rid,
                        retransmittedPacketsSent: v.retransmittedPacketsSent,
                        qualityLimitationReason: v.qualityLimitationReason,
                        qualityLimitationResolutionChanges: v.qualityLimitationResolutionChanges,
                    };
                    // locate the appropriate remote-inbound-rtp item
                    const r = stats.get(v.remoteId);
                    if (r) {
                        vs.jitter = r.jitter;
                        vs.packetsLost = r.packetsLost;
                        vs.roundTripTime = r.roundTripTime;
                    }
                    items.push(vs);
                }
            });
            return items;
        });
    }
    setPublishingQuality(maxQuality) {
        if (!this.isSimulcast || !this.encodings) {
            return;
        }
        let hasChanged = false;
        const layers = [];
        this.encodings.forEach((encoding) => {
            var _a;
            const quality = videoQualityForRid((_a = encoding.rid) !== null && _a !== void 0 ? _a : '');
            const active = quality <= maxQuality;
            if (active !== encoding.active) {
                hasChanged = true;
                encoding.active = active;
            }
            if (active) {
                layers.push(quality);
            }
        });
        if (!hasChanged || !this.sender || !this.sid) {
            return;
        }
        this.lastQualityChange = new Date().getTime();
        this.lastExplicitQualityChange = new Date().getTime();
        const params = this.sender.getParameters();
        params.encodings = this.encodings;
        logger_1.default.debug('setting publishing quality. max quality', maxQuality);
        this.sender.setParameters(params);
    }
    setDeviceId(deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.constraints.deviceId === deviceId) {
                return;
            }
            this.constraints.deviceId = deviceId;
            // when video is muted, underlying media stream track is stopped and
            // will be restarted later
            if (!this.isMuted) {
                yield this.restartTrack();
            }
        });
    }
    restartTrack(options) {
        return __awaiter(this, void 0, void 0, function* () {
            let constraints;
            if (options) {
                const streamConstraints = LocalTrack_1.default.constraintsForOptions({ video: options });
                if (typeof streamConstraints.video !== 'boolean') {
                    constraints = streamConstraints.video;
                }
            }
            yield this.restart(constraints);
        });
    }
    checkAndUpdateSimulcast(statsMap) {
        var _a, _b;
        if (!this.sender || this.isMuted) {
            return;
        }
        const params = this.sender.getParameters();
        this.encodings = params.encodings;
        let bestEncoding;
        this.encodings.forEach((encoding) => {
            // skip inactive encodings
            if (!encoding.active)
                return;
            if (bestEncoding === undefined) {
                bestEncoding = encoding;
            }
            else if (bestEncoding.rid
                && encoding.rid
                && ridOrder.indexOf(bestEncoding.rid) < ridOrder.indexOf(encoding.rid)) {
                bestEncoding = encoding;
            }
            else if (bestEncoding.maxBitrate !== undefined
                && encoding.maxBitrate !== undefined
                && bestEncoding.maxBitrate < encoding.maxBitrate) {
                bestEncoding = encoding;
            }
        });
        if (!bestEncoding) {
            return;
        }
        const rid = (_a = bestEncoding.rid) !== null && _a !== void 0 ? _a : '';
        const sendStats = statsMap.get(rid);
        const lastStats = (_b = this.prevStats) === null || _b === void 0 ? void 0 : _b.get(rid);
        if (!sendStats || !lastStats) {
            return;
        }
        const currentQuality = videoQualityForRid(rid);
        // adaptive simulcast algorithm notes (davidzhao)
        // Chrome (and other browsers) will automatically pause the highest layer
        // when it runs into bandwidth limitations. When that happens, it would not
        // be able to send any new frames between the two stats checks.
        //
        // We need to set that layer to inactive intentionally, because chrome tends
        // to flicker, meaning it will attempt to send that layer again shortly
        // afterwards, flip-flopping every few seconds. We want to avoid that.
        //
        // Note: even after bandwidth recovers, the flip-flopping behavior continues
        // this is possibly due to SFU-side PLI generation and imperfect bandwidth estimation
        if (sendStats.qualityLimitationResolutionChanges
            - lastStats.qualityLimitationResolutionChanges > 0) {
            this.lastQualityChange = new Date().getTime();
        }
        // log.debug('frameSent', sendStats.framesSent, 'lastSent', lastStats.framesSent,
        //   'elapsed', sendStats.timestamp - lastStats.timestamp);
        if (sendStats.framesSent - lastStats.framesSent > 0) {
            // frames have been sending ok, consider upgrading quality
            if (currentQuality === livekit_rtc_1.VideoQuality.HIGH || !this.lastQualityChange)
                return;
            const nextQuality = currentQuality + 1;
            if ((new Date()).getTime() - this.lastQualityChange < QUALITY_UPGRADE_DELAY) {
                return;
            }
            logger_1.default.debug('upgrading video quality to', nextQuality);
            this.setPublishingQuality(nextQuality);
            return;
        }
        // if best layer has not sent anything, do not downgrade till the
        // best layer starts sending something. It is possible that the
        // browser has not started some layer(s) due to cpu/bandwidth
        // constraints
        if (sendStats.framesSent === 0)
            return;
        // if we've upgraded or downgraded recently, give it a bit of time before
        // downgrading again
        if (this.lastExplicitQualityChange
            && ((new Date()).getTime() - this.lastExplicitQualityChange) < QUALITY_DOWNGRADE_DELAY) {
            return;
        }
        if (currentQuality === livekit_rtc_1.VideoQuality.UNRECOGNIZED) {
            return;
        }
        if (currentQuality === livekit_rtc_1.VideoQuality.LOW) {
            // already the lowest quality, nothing we can do
            return;
        }
        logger_1.default.debug('downgrading video quality to', currentQuality - 1);
        this.setPublishingQuality(currentQuality - 1);
    }
}
exports.default = LocalVideoTrack;
function videoQualityForRid(rid) {
    switch (rid) {
        case 'f':
            return livekit_rtc_1.VideoQuality.HIGH;
        case 'h':
            return livekit_rtc_1.VideoQuality.MEDIUM;
        case 'q':
            return livekit_rtc_1.VideoQuality.LOW;
        default:
            return livekit_rtc_1.VideoQuality.UNRECOGNIZED;
    }
}
//# sourceMappingURL=LocalVideoTrack.js.map