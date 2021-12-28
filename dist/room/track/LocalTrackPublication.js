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
const TrackPublication_1 = __importDefault(require("./TrackPublication"));
class LocalTrackPublication extends TrackPublication_1.default {
    constructor(kind, ti, track) {
        super(kind, ti.sid, ti.name);
        this.updateInfo(ti);
        this.setTrack(track);
    }
    get isMuted() {
        if (this.track) {
            return this.track.isMuted;
        }
        return super.isMuted;
    }
    get audioTrack() {
        return super.audioTrack;
    }
    get videoTrack() {
        return super.videoTrack;
    }
    /**
     * Mute the track associated with this publication
     */
    mute() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            return (_a = this.track) === null || _a === void 0 ? void 0 : _a.mute();
        });
    }
    /**
     * Unmute track associated with this publication
     */
    unmute() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            return (_a = this.track) === null || _a === void 0 ? void 0 : _a.unmute();
        });
    }
}
exports.default = LocalTrackPublication;
//# sourceMappingURL=LocalTrackPublication.js.map