"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectionQualityUpdate = exports.ConnectionQualityInfo = exports.RoomUpdate = exports.SpeakersChanged = exports.ICEServer = exports.LeaveRequest = exports.UpdateTrackSettings = exports.UpdateSubscription = exports.ParticipantUpdate = exports.SessionDescription = exports.TrackPublishedResponse = exports.JoinResponse = exports.MuteTrackRequest = exports.TrickleRequest = exports.AddTrackRequest = exports.SignalResponse = exports.SignalRequest = exports.videoQualityToJSON = exports.videoQualityFromJSON = exports.VideoQuality = exports.signalTargetToJSON = exports.signalTargetFromJSON = exports.SignalTarget = exports.protobufPackage = void 0;
/* eslint-disable */
const long_1 = __importDefault(require("long"));
const minimal_1 = __importDefault(require("protobufjs/minimal"));
const livekit_models_1 = require("./livekit_models");
exports.protobufPackage = "livekit";
var SignalTarget;
(function (SignalTarget) {
    SignalTarget[SignalTarget["PUBLISHER"] = 0] = "PUBLISHER";
    SignalTarget[SignalTarget["SUBSCRIBER"] = 1] = "SUBSCRIBER";
    SignalTarget[SignalTarget["UNRECOGNIZED"] = -1] = "UNRECOGNIZED";
})(SignalTarget = exports.SignalTarget || (exports.SignalTarget = {}));
function signalTargetFromJSON(object) {
    switch (object) {
        case 0:
        case "PUBLISHER":
            return SignalTarget.PUBLISHER;
        case 1:
        case "SUBSCRIBER":
            return SignalTarget.SUBSCRIBER;
        case -1:
        case "UNRECOGNIZED":
        default:
            return SignalTarget.UNRECOGNIZED;
    }
}
exports.signalTargetFromJSON = signalTargetFromJSON;
function signalTargetToJSON(object) {
    switch (object) {
        case SignalTarget.PUBLISHER:
            return "PUBLISHER";
        case SignalTarget.SUBSCRIBER:
            return "SUBSCRIBER";
        default:
            return "UNKNOWN";
    }
}
exports.signalTargetToJSON = signalTargetToJSON;
var VideoQuality;
(function (VideoQuality) {
    VideoQuality[VideoQuality["LOW"] = 0] = "LOW";
    VideoQuality[VideoQuality["MEDIUM"] = 1] = "MEDIUM";
    VideoQuality[VideoQuality["HIGH"] = 2] = "HIGH";
    VideoQuality[VideoQuality["UNRECOGNIZED"] = -1] = "UNRECOGNIZED";
})(VideoQuality = exports.VideoQuality || (exports.VideoQuality = {}));
function videoQualityFromJSON(object) {
    switch (object) {
        case 0:
        case "LOW":
            return VideoQuality.LOW;
        case 1:
        case "MEDIUM":
            return VideoQuality.MEDIUM;
        case 2:
        case "HIGH":
            return VideoQuality.HIGH;
        case -1:
        case "UNRECOGNIZED":
        default:
            return VideoQuality.UNRECOGNIZED;
    }
}
exports.videoQualityFromJSON = videoQualityFromJSON;
function videoQualityToJSON(object) {
    switch (object) {
        case VideoQuality.LOW:
            return "LOW";
        case VideoQuality.MEDIUM:
            return "MEDIUM";
        case VideoQuality.HIGH:
            return "HIGH";
        default:
            return "UNKNOWN";
    }
}
exports.videoQualityToJSON = videoQualityToJSON;
const baseSignalRequest = {};
exports.SignalRequest = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.offer !== undefined) {
            exports.SessionDescription.encode(message.offer, writer.uint32(10).fork()).ldelim();
        }
        if (message.answer !== undefined) {
            exports.SessionDescription.encode(message.answer, writer.uint32(18).fork()).ldelim();
        }
        if (message.trickle !== undefined) {
            exports.TrickleRequest.encode(message.trickle, writer.uint32(26).fork()).ldelim();
        }
        if (message.addTrack !== undefined) {
            exports.AddTrackRequest.encode(message.addTrack, writer.uint32(34).fork()).ldelim();
        }
        if (message.mute !== undefined) {
            exports.MuteTrackRequest.encode(message.mute, writer.uint32(42).fork()).ldelim();
        }
        if (message.subscription !== undefined) {
            exports.UpdateSubscription.encode(message.subscription, writer.uint32(50).fork()).ldelim();
        }
        if (message.trackSetting !== undefined) {
            exports.UpdateTrackSettings.encode(message.trackSetting, writer.uint32(58).fork()).ldelim();
        }
        if (message.leave !== undefined) {
            exports.LeaveRequest.encode(message.leave, writer.uint32(66).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseSignalRequest);
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.offer = exports.SessionDescription.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.answer = exports.SessionDescription.decode(reader, reader.uint32());
                    break;
                case 3:
                    message.trickle = exports.TrickleRequest.decode(reader, reader.uint32());
                    break;
                case 4:
                    message.addTrack = exports.AddTrackRequest.decode(reader, reader.uint32());
                    break;
                case 5:
                    message.mute = exports.MuteTrackRequest.decode(reader, reader.uint32());
                    break;
                case 6:
                    message.subscription = exports.UpdateSubscription.decode(reader, reader.uint32());
                    break;
                case 7:
                    message.trackSetting = exports.UpdateTrackSettings.decode(reader, reader.uint32());
                    break;
                case 8:
                    message.leave = exports.LeaveRequest.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseSignalRequest);
        if (object.offer !== undefined && object.offer !== null) {
            message.offer = exports.SessionDescription.fromJSON(object.offer);
        }
        else {
            message.offer = undefined;
        }
        if (object.answer !== undefined && object.answer !== null) {
            message.answer = exports.SessionDescription.fromJSON(object.answer);
        }
        else {
            message.answer = undefined;
        }
        if (object.trickle !== undefined && object.trickle !== null) {
            message.trickle = exports.TrickleRequest.fromJSON(object.trickle);
        }
        else {
            message.trickle = undefined;
        }
        if (object.addTrack !== undefined && object.addTrack !== null) {
            message.addTrack = exports.AddTrackRequest.fromJSON(object.addTrack);
        }
        else {
            message.addTrack = undefined;
        }
        if (object.mute !== undefined && object.mute !== null) {
            message.mute = exports.MuteTrackRequest.fromJSON(object.mute);
        }
        else {
            message.mute = undefined;
        }
        if (object.subscription !== undefined && object.subscription !== null) {
            message.subscription = exports.UpdateSubscription.fromJSON(object.subscription);
        }
        else {
            message.subscription = undefined;
        }
        if (object.trackSetting !== undefined && object.trackSetting !== null) {
            message.trackSetting = exports.UpdateTrackSettings.fromJSON(object.trackSetting);
        }
        else {
            message.trackSetting = undefined;
        }
        if (object.leave !== undefined && object.leave !== null) {
            message.leave = exports.LeaveRequest.fromJSON(object.leave);
        }
        else {
            message.leave = undefined;
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.offer !== undefined &&
            (obj.offer = message.offer
                ? exports.SessionDescription.toJSON(message.offer)
                : undefined);
        message.answer !== undefined &&
            (obj.answer = message.answer
                ? exports.SessionDescription.toJSON(message.answer)
                : undefined);
        message.trickle !== undefined &&
            (obj.trickle = message.trickle
                ? exports.TrickleRequest.toJSON(message.trickle)
                : undefined);
        message.addTrack !== undefined &&
            (obj.addTrack = message.addTrack
                ? exports.AddTrackRequest.toJSON(message.addTrack)
                : undefined);
        message.mute !== undefined &&
            (obj.mute = message.mute
                ? exports.MuteTrackRequest.toJSON(message.mute)
                : undefined);
        message.subscription !== undefined &&
            (obj.subscription = message.subscription
                ? exports.UpdateSubscription.toJSON(message.subscription)
                : undefined);
        message.trackSetting !== undefined &&
            (obj.trackSetting = message.trackSetting
                ? exports.UpdateTrackSettings.toJSON(message.trackSetting)
                : undefined);
        message.leave !== undefined &&
            (obj.leave = message.leave
                ? exports.LeaveRequest.toJSON(message.leave)
                : undefined);
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseSignalRequest);
        if (object.offer !== undefined && object.offer !== null) {
            message.offer = exports.SessionDescription.fromPartial(object.offer);
        }
        else {
            message.offer = undefined;
        }
        if (object.answer !== undefined && object.answer !== null) {
            message.answer = exports.SessionDescription.fromPartial(object.answer);
        }
        else {
            message.answer = undefined;
        }
        if (object.trickle !== undefined && object.trickle !== null) {
            message.trickle = exports.TrickleRequest.fromPartial(object.trickle);
        }
        else {
            message.trickle = undefined;
        }
        if (object.addTrack !== undefined && object.addTrack !== null) {
            message.addTrack = exports.AddTrackRequest.fromPartial(object.addTrack);
        }
        else {
            message.addTrack = undefined;
        }
        if (object.mute !== undefined && object.mute !== null) {
            message.mute = exports.MuteTrackRequest.fromPartial(object.mute);
        }
        else {
            message.mute = undefined;
        }
        if (object.subscription !== undefined && object.subscription !== null) {
            message.subscription = exports.UpdateSubscription.fromPartial(object.subscription);
        }
        else {
            message.subscription = undefined;
        }
        if (object.trackSetting !== undefined && object.trackSetting !== null) {
            message.trackSetting = exports.UpdateTrackSettings.fromPartial(object.trackSetting);
        }
        else {
            message.trackSetting = undefined;
        }
        if (object.leave !== undefined && object.leave !== null) {
            message.leave = exports.LeaveRequest.fromPartial(object.leave);
        }
        else {
            message.leave = undefined;
        }
        return message;
    },
};
const baseSignalResponse = {};
exports.SignalResponse = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.join !== undefined) {
            exports.JoinResponse.encode(message.join, writer.uint32(10).fork()).ldelim();
        }
        if (message.answer !== undefined) {
            exports.SessionDescription.encode(message.answer, writer.uint32(18).fork()).ldelim();
        }
        if (message.offer !== undefined) {
            exports.SessionDescription.encode(message.offer, writer.uint32(26).fork()).ldelim();
        }
        if (message.trickle !== undefined) {
            exports.TrickleRequest.encode(message.trickle, writer.uint32(34).fork()).ldelim();
        }
        if (message.update !== undefined) {
            exports.ParticipantUpdate.encode(message.update, writer.uint32(42).fork()).ldelim();
        }
        if (message.trackPublished !== undefined) {
            exports.TrackPublishedResponse.encode(message.trackPublished, writer.uint32(50).fork()).ldelim();
        }
        if (message.leave !== undefined) {
            exports.LeaveRequest.encode(message.leave, writer.uint32(66).fork()).ldelim();
        }
        if (message.mute !== undefined) {
            exports.MuteTrackRequest.encode(message.mute, writer.uint32(74).fork()).ldelim();
        }
        if (message.speakersChanged !== undefined) {
            exports.SpeakersChanged.encode(message.speakersChanged, writer.uint32(82).fork()).ldelim();
        }
        if (message.roomUpdate !== undefined) {
            exports.RoomUpdate.encode(message.roomUpdate, writer.uint32(90).fork()).ldelim();
        }
        if (message.connectionQuality !== undefined) {
            exports.ConnectionQualityUpdate.encode(message.connectionQuality, writer.uint32(98).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseSignalResponse);
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.join = exports.JoinResponse.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.answer = exports.SessionDescription.decode(reader, reader.uint32());
                    break;
                case 3:
                    message.offer = exports.SessionDescription.decode(reader, reader.uint32());
                    break;
                case 4:
                    message.trickle = exports.TrickleRequest.decode(reader, reader.uint32());
                    break;
                case 5:
                    message.update = exports.ParticipantUpdate.decode(reader, reader.uint32());
                    break;
                case 6:
                    message.trackPublished = exports.TrackPublishedResponse.decode(reader, reader.uint32());
                    break;
                case 8:
                    message.leave = exports.LeaveRequest.decode(reader, reader.uint32());
                    break;
                case 9:
                    message.mute = exports.MuteTrackRequest.decode(reader, reader.uint32());
                    break;
                case 10:
                    message.speakersChanged = exports.SpeakersChanged.decode(reader, reader.uint32());
                    break;
                case 11:
                    message.roomUpdate = exports.RoomUpdate.decode(reader, reader.uint32());
                    break;
                case 12:
                    message.connectionQuality = exports.ConnectionQualityUpdate.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseSignalResponse);
        if (object.join !== undefined && object.join !== null) {
            message.join = exports.JoinResponse.fromJSON(object.join);
        }
        else {
            message.join = undefined;
        }
        if (object.answer !== undefined && object.answer !== null) {
            message.answer = exports.SessionDescription.fromJSON(object.answer);
        }
        else {
            message.answer = undefined;
        }
        if (object.offer !== undefined && object.offer !== null) {
            message.offer = exports.SessionDescription.fromJSON(object.offer);
        }
        else {
            message.offer = undefined;
        }
        if (object.trickle !== undefined && object.trickle !== null) {
            message.trickle = exports.TrickleRequest.fromJSON(object.trickle);
        }
        else {
            message.trickle = undefined;
        }
        if (object.update !== undefined && object.update !== null) {
            message.update = exports.ParticipantUpdate.fromJSON(object.update);
        }
        else {
            message.update = undefined;
        }
        if (object.trackPublished !== undefined && object.trackPublished !== null) {
            message.trackPublished = exports.TrackPublishedResponse.fromJSON(object.trackPublished);
        }
        else {
            message.trackPublished = undefined;
        }
        if (object.leave !== undefined && object.leave !== null) {
            message.leave = exports.LeaveRequest.fromJSON(object.leave);
        }
        else {
            message.leave = undefined;
        }
        if (object.mute !== undefined && object.mute !== null) {
            message.mute = exports.MuteTrackRequest.fromJSON(object.mute);
        }
        else {
            message.mute = undefined;
        }
        if (object.speakersChanged !== undefined &&
            object.speakersChanged !== null) {
            message.speakersChanged = exports.SpeakersChanged.fromJSON(object.speakersChanged);
        }
        else {
            message.speakersChanged = undefined;
        }
        if (object.roomUpdate !== undefined && object.roomUpdate !== null) {
            message.roomUpdate = exports.RoomUpdate.fromJSON(object.roomUpdate);
        }
        else {
            message.roomUpdate = undefined;
        }
        if (object.connectionQuality !== undefined &&
            object.connectionQuality !== null) {
            message.connectionQuality = exports.ConnectionQualityUpdate.fromJSON(object.connectionQuality);
        }
        else {
            message.connectionQuality = undefined;
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.join !== undefined &&
            (obj.join = message.join ? exports.JoinResponse.toJSON(message.join) : undefined);
        message.answer !== undefined &&
            (obj.answer = message.answer
                ? exports.SessionDescription.toJSON(message.answer)
                : undefined);
        message.offer !== undefined &&
            (obj.offer = message.offer
                ? exports.SessionDescription.toJSON(message.offer)
                : undefined);
        message.trickle !== undefined &&
            (obj.trickle = message.trickle
                ? exports.TrickleRequest.toJSON(message.trickle)
                : undefined);
        message.update !== undefined &&
            (obj.update = message.update
                ? exports.ParticipantUpdate.toJSON(message.update)
                : undefined);
        message.trackPublished !== undefined &&
            (obj.trackPublished = message.trackPublished
                ? exports.TrackPublishedResponse.toJSON(message.trackPublished)
                : undefined);
        message.leave !== undefined &&
            (obj.leave = message.leave
                ? exports.LeaveRequest.toJSON(message.leave)
                : undefined);
        message.mute !== undefined &&
            (obj.mute = message.mute
                ? exports.MuteTrackRequest.toJSON(message.mute)
                : undefined);
        message.speakersChanged !== undefined &&
            (obj.speakersChanged = message.speakersChanged
                ? exports.SpeakersChanged.toJSON(message.speakersChanged)
                : undefined);
        message.roomUpdate !== undefined &&
            (obj.roomUpdate = message.roomUpdate
                ? exports.RoomUpdate.toJSON(message.roomUpdate)
                : undefined);
        message.connectionQuality !== undefined &&
            (obj.connectionQuality = message.connectionQuality
                ? exports.ConnectionQualityUpdate.toJSON(message.connectionQuality)
                : undefined);
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseSignalResponse);
        if (object.join !== undefined && object.join !== null) {
            message.join = exports.JoinResponse.fromPartial(object.join);
        }
        else {
            message.join = undefined;
        }
        if (object.answer !== undefined && object.answer !== null) {
            message.answer = exports.SessionDescription.fromPartial(object.answer);
        }
        else {
            message.answer = undefined;
        }
        if (object.offer !== undefined && object.offer !== null) {
            message.offer = exports.SessionDescription.fromPartial(object.offer);
        }
        else {
            message.offer = undefined;
        }
        if (object.trickle !== undefined && object.trickle !== null) {
            message.trickle = exports.TrickleRequest.fromPartial(object.trickle);
        }
        else {
            message.trickle = undefined;
        }
        if (object.update !== undefined && object.update !== null) {
            message.update = exports.ParticipantUpdate.fromPartial(object.update);
        }
        else {
            message.update = undefined;
        }
        if (object.trackPublished !== undefined && object.trackPublished !== null) {
            message.trackPublished = exports.TrackPublishedResponse.fromPartial(object.trackPublished);
        }
        else {
            message.trackPublished = undefined;
        }
        if (object.leave !== undefined && object.leave !== null) {
            message.leave = exports.LeaveRequest.fromPartial(object.leave);
        }
        else {
            message.leave = undefined;
        }
        if (object.mute !== undefined && object.mute !== null) {
            message.mute = exports.MuteTrackRequest.fromPartial(object.mute);
        }
        else {
            message.mute = undefined;
        }
        if (object.speakersChanged !== undefined &&
            object.speakersChanged !== null) {
            message.speakersChanged = exports.SpeakersChanged.fromPartial(object.speakersChanged);
        }
        else {
            message.speakersChanged = undefined;
        }
        if (object.roomUpdate !== undefined && object.roomUpdate !== null) {
            message.roomUpdate = exports.RoomUpdate.fromPartial(object.roomUpdate);
        }
        else {
            message.roomUpdate = undefined;
        }
        if (object.connectionQuality !== undefined &&
            object.connectionQuality !== null) {
            message.connectionQuality = exports.ConnectionQualityUpdate.fromPartial(object.connectionQuality);
        }
        else {
            message.connectionQuality = undefined;
        }
        return message;
    },
};
const baseAddTrackRequest = {
    cid: "",
    name: "",
    type: 0,
    width: 0,
    height: 0,
    muted: false,
    disableDtx: false,
    source: 0,
};
exports.AddTrackRequest = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.cid !== "") {
            writer.uint32(10).string(message.cid);
        }
        if (message.name !== "") {
            writer.uint32(18).string(message.name);
        }
        if (message.type !== 0) {
            writer.uint32(24).int32(message.type);
        }
        if (message.width !== 0) {
            writer.uint32(32).uint32(message.width);
        }
        if (message.height !== 0) {
            writer.uint32(40).uint32(message.height);
        }
        if (message.muted === true) {
            writer.uint32(48).bool(message.muted);
        }
        if (message.disableDtx === true) {
            writer.uint32(56).bool(message.disableDtx);
        }
        if (message.source !== 0) {
            writer.uint32(64).int32(message.source);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseAddTrackRequest);
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.cid = reader.string();
                    break;
                case 2:
                    message.name = reader.string();
                    break;
                case 3:
                    message.type = reader.int32();
                    break;
                case 4:
                    message.width = reader.uint32();
                    break;
                case 5:
                    message.height = reader.uint32();
                    break;
                case 6:
                    message.muted = reader.bool();
                    break;
                case 7:
                    message.disableDtx = reader.bool();
                    break;
                case 8:
                    message.source = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseAddTrackRequest);
        if (object.cid !== undefined && object.cid !== null) {
            message.cid = String(object.cid);
        }
        else {
            message.cid = "";
        }
        if (object.name !== undefined && object.name !== null) {
            message.name = String(object.name);
        }
        else {
            message.name = "";
        }
        if (object.type !== undefined && object.type !== null) {
            message.type = livekit_models_1.trackTypeFromJSON(object.type);
        }
        else {
            message.type = 0;
        }
        if (object.width !== undefined && object.width !== null) {
            message.width = Number(object.width);
        }
        else {
            message.width = 0;
        }
        if (object.height !== undefined && object.height !== null) {
            message.height = Number(object.height);
        }
        else {
            message.height = 0;
        }
        if (object.muted !== undefined && object.muted !== null) {
            message.muted = Boolean(object.muted);
        }
        else {
            message.muted = false;
        }
        if (object.disableDtx !== undefined && object.disableDtx !== null) {
            message.disableDtx = Boolean(object.disableDtx);
        }
        else {
            message.disableDtx = false;
        }
        if (object.source !== undefined && object.source !== null) {
            message.source = livekit_models_1.trackSourceFromJSON(object.source);
        }
        else {
            message.source = 0;
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.cid !== undefined && (obj.cid = message.cid);
        message.name !== undefined && (obj.name = message.name);
        message.type !== undefined && (obj.type = livekit_models_1.trackTypeToJSON(message.type));
        message.width !== undefined && (obj.width = message.width);
        message.height !== undefined && (obj.height = message.height);
        message.muted !== undefined && (obj.muted = message.muted);
        message.disableDtx !== undefined && (obj.disableDtx = message.disableDtx);
        message.source !== undefined &&
            (obj.source = livekit_models_1.trackSourceToJSON(message.source));
        return obj;
    },
    fromPartial(object) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        const message = Object.assign({}, baseAddTrackRequest);
        message.cid = (_a = object.cid) !== null && _a !== void 0 ? _a : "";
        message.name = (_b = object.name) !== null && _b !== void 0 ? _b : "";
        message.type = (_c = object.type) !== null && _c !== void 0 ? _c : 0;
        message.width = (_d = object.width) !== null && _d !== void 0 ? _d : 0;
        message.height = (_e = object.height) !== null && _e !== void 0 ? _e : 0;
        message.muted = (_f = object.muted) !== null && _f !== void 0 ? _f : false;
        message.disableDtx = (_g = object.disableDtx) !== null && _g !== void 0 ? _g : false;
        message.source = (_h = object.source) !== null && _h !== void 0 ? _h : 0;
        return message;
    },
};
const baseTrickleRequest = { candidateInit: "", target: 0 };
exports.TrickleRequest = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.candidateInit !== "") {
            writer.uint32(10).string(message.candidateInit);
        }
        if (message.target !== 0) {
            writer.uint32(16).int32(message.target);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseTrickleRequest);
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.candidateInit = reader.string();
                    break;
                case 2:
                    message.target = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseTrickleRequest);
        if (object.candidateInit !== undefined && object.candidateInit !== null) {
            message.candidateInit = String(object.candidateInit);
        }
        else {
            message.candidateInit = "";
        }
        if (object.target !== undefined && object.target !== null) {
            message.target = signalTargetFromJSON(object.target);
        }
        else {
            message.target = 0;
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.candidateInit !== undefined &&
            (obj.candidateInit = message.candidateInit);
        message.target !== undefined &&
            (obj.target = signalTargetToJSON(message.target));
        return obj;
    },
    fromPartial(object) {
        var _a, _b;
        const message = Object.assign({}, baseTrickleRequest);
        message.candidateInit = (_a = object.candidateInit) !== null && _a !== void 0 ? _a : "";
        message.target = (_b = object.target) !== null && _b !== void 0 ? _b : 0;
        return message;
    },
};
const baseMuteTrackRequest = { sid: "", muted: false };
exports.MuteTrackRequest = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.sid !== "") {
            writer.uint32(10).string(message.sid);
        }
        if (message.muted === true) {
            writer.uint32(16).bool(message.muted);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseMuteTrackRequest);
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.sid = reader.string();
                    break;
                case 2:
                    message.muted = reader.bool();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseMuteTrackRequest);
        if (object.sid !== undefined && object.sid !== null) {
            message.sid = String(object.sid);
        }
        else {
            message.sid = "";
        }
        if (object.muted !== undefined && object.muted !== null) {
            message.muted = Boolean(object.muted);
        }
        else {
            message.muted = false;
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.sid !== undefined && (obj.sid = message.sid);
        message.muted !== undefined && (obj.muted = message.muted);
        return obj;
    },
    fromPartial(object) {
        var _a, _b;
        const message = Object.assign({}, baseMuteTrackRequest);
        message.sid = (_a = object.sid) !== null && _a !== void 0 ? _a : "";
        message.muted = (_b = object.muted) !== null && _b !== void 0 ? _b : false;
        return message;
    },
};
const baseJoinResponse = {
    serverVersion: "",
    subscriberPrimary: false,
    alternativeUrl: "",
};
exports.JoinResponse = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.room !== undefined) {
            livekit_models_1.Room.encode(message.room, writer.uint32(10).fork()).ldelim();
        }
        if (message.participant !== undefined) {
            livekit_models_1.ParticipantInfo.encode(message.participant, writer.uint32(18).fork()).ldelim();
        }
        for (const v of message.otherParticipants) {
            livekit_models_1.ParticipantInfo.encode(v, writer.uint32(26).fork()).ldelim();
        }
        if (message.serverVersion !== "") {
            writer.uint32(34).string(message.serverVersion);
        }
        for (const v of message.iceServers) {
            exports.ICEServer.encode(v, writer.uint32(42).fork()).ldelim();
        }
        if (message.subscriberPrimary === true) {
            writer.uint32(48).bool(message.subscriberPrimary);
        }
        if (message.alternativeUrl !== "") {
            writer.uint32(58).string(message.alternativeUrl);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseJoinResponse);
        message.otherParticipants = [];
        message.iceServers = [];
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.room = livekit_models_1.Room.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.participant = livekit_models_1.ParticipantInfo.decode(reader, reader.uint32());
                    break;
                case 3:
                    message.otherParticipants.push(livekit_models_1.ParticipantInfo.decode(reader, reader.uint32()));
                    break;
                case 4:
                    message.serverVersion = reader.string();
                    break;
                case 5:
                    message.iceServers.push(exports.ICEServer.decode(reader, reader.uint32()));
                    break;
                case 6:
                    message.subscriberPrimary = reader.bool();
                    break;
                case 7:
                    message.alternativeUrl = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseJoinResponse);
        message.otherParticipants = [];
        message.iceServers = [];
        if (object.room !== undefined && object.room !== null) {
            message.room = livekit_models_1.Room.fromJSON(object.room);
        }
        else {
            message.room = undefined;
        }
        if (object.participant !== undefined && object.participant !== null) {
            message.participant = livekit_models_1.ParticipantInfo.fromJSON(object.participant);
        }
        else {
            message.participant = undefined;
        }
        if (object.otherParticipants !== undefined &&
            object.otherParticipants !== null) {
            for (const e of object.otherParticipants) {
                message.otherParticipants.push(livekit_models_1.ParticipantInfo.fromJSON(e));
            }
        }
        if (object.serverVersion !== undefined && object.serverVersion !== null) {
            message.serverVersion = String(object.serverVersion);
        }
        else {
            message.serverVersion = "";
        }
        if (object.iceServers !== undefined && object.iceServers !== null) {
            for (const e of object.iceServers) {
                message.iceServers.push(exports.ICEServer.fromJSON(e));
            }
        }
        if (object.subscriberPrimary !== undefined &&
            object.subscriberPrimary !== null) {
            message.subscriberPrimary = Boolean(object.subscriberPrimary);
        }
        else {
            message.subscriberPrimary = false;
        }
        if (object.alternativeUrl !== undefined && object.alternativeUrl !== null) {
            message.alternativeUrl = String(object.alternativeUrl);
        }
        else {
            message.alternativeUrl = "";
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.room !== undefined &&
            (obj.room = message.room ? livekit_models_1.Room.toJSON(message.room) : undefined);
        message.participant !== undefined &&
            (obj.participant = message.participant
                ? livekit_models_1.ParticipantInfo.toJSON(message.participant)
                : undefined);
        if (message.otherParticipants) {
            obj.otherParticipants = message.otherParticipants.map((e) => e ? livekit_models_1.ParticipantInfo.toJSON(e) : undefined);
        }
        else {
            obj.otherParticipants = [];
        }
        message.serverVersion !== undefined &&
            (obj.serverVersion = message.serverVersion);
        if (message.iceServers) {
            obj.iceServers = message.iceServers.map((e) => e ? exports.ICEServer.toJSON(e) : undefined);
        }
        else {
            obj.iceServers = [];
        }
        message.subscriberPrimary !== undefined &&
            (obj.subscriberPrimary = message.subscriberPrimary);
        message.alternativeUrl !== undefined &&
            (obj.alternativeUrl = message.alternativeUrl);
        return obj;
    },
    fromPartial(object) {
        var _a, _b, _c;
        const message = Object.assign({}, baseJoinResponse);
        if (object.room !== undefined && object.room !== null) {
            message.room = livekit_models_1.Room.fromPartial(object.room);
        }
        else {
            message.room = undefined;
        }
        if (object.participant !== undefined && object.participant !== null) {
            message.participant = livekit_models_1.ParticipantInfo.fromPartial(object.participant);
        }
        else {
            message.participant = undefined;
        }
        message.otherParticipants = [];
        if (object.otherParticipants !== undefined &&
            object.otherParticipants !== null) {
            for (const e of object.otherParticipants) {
                message.otherParticipants.push(livekit_models_1.ParticipantInfo.fromPartial(e));
            }
        }
        message.serverVersion = (_a = object.serverVersion) !== null && _a !== void 0 ? _a : "";
        message.iceServers = [];
        if (object.iceServers !== undefined && object.iceServers !== null) {
            for (const e of object.iceServers) {
                message.iceServers.push(exports.ICEServer.fromPartial(e));
            }
        }
        message.subscriberPrimary = (_b = object.subscriberPrimary) !== null && _b !== void 0 ? _b : false;
        message.alternativeUrl = (_c = object.alternativeUrl) !== null && _c !== void 0 ? _c : "";
        return message;
    },
};
const baseTrackPublishedResponse = { cid: "" };
exports.TrackPublishedResponse = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.cid !== "") {
            writer.uint32(10).string(message.cid);
        }
        if (message.track !== undefined) {
            livekit_models_1.TrackInfo.encode(message.track, writer.uint32(18).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseTrackPublishedResponse);
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.cid = reader.string();
                    break;
                case 2:
                    message.track = livekit_models_1.TrackInfo.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseTrackPublishedResponse);
        if (object.cid !== undefined && object.cid !== null) {
            message.cid = String(object.cid);
        }
        else {
            message.cid = "";
        }
        if (object.track !== undefined && object.track !== null) {
            message.track = livekit_models_1.TrackInfo.fromJSON(object.track);
        }
        else {
            message.track = undefined;
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.cid !== undefined && (obj.cid = message.cid);
        message.track !== undefined &&
            (obj.track = message.track ? livekit_models_1.TrackInfo.toJSON(message.track) : undefined);
        return obj;
    },
    fromPartial(object) {
        var _a;
        const message = Object.assign({}, baseTrackPublishedResponse);
        message.cid = (_a = object.cid) !== null && _a !== void 0 ? _a : "";
        if (object.track !== undefined && object.track !== null) {
            message.track = livekit_models_1.TrackInfo.fromPartial(object.track);
        }
        else {
            message.track = undefined;
        }
        return message;
    },
};
const baseSessionDescription = { type: "", sdp: "" };
exports.SessionDescription = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.type !== "") {
            writer.uint32(10).string(message.type);
        }
        if (message.sdp !== "") {
            writer.uint32(18).string(message.sdp);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseSessionDescription);
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.type = reader.string();
                    break;
                case 2:
                    message.sdp = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseSessionDescription);
        if (object.type !== undefined && object.type !== null) {
            message.type = String(object.type);
        }
        else {
            message.type = "";
        }
        if (object.sdp !== undefined && object.sdp !== null) {
            message.sdp = String(object.sdp);
        }
        else {
            message.sdp = "";
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.type !== undefined && (obj.type = message.type);
        message.sdp !== undefined && (obj.sdp = message.sdp);
        return obj;
    },
    fromPartial(object) {
        var _a, _b;
        const message = Object.assign({}, baseSessionDescription);
        message.type = (_a = object.type) !== null && _a !== void 0 ? _a : "";
        message.sdp = (_b = object.sdp) !== null && _b !== void 0 ? _b : "";
        return message;
    },
};
const baseParticipantUpdate = {};
exports.ParticipantUpdate = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        for (const v of message.participants) {
            livekit_models_1.ParticipantInfo.encode(v, writer.uint32(10).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseParticipantUpdate);
        message.participants = [];
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.participants.push(livekit_models_1.ParticipantInfo.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseParticipantUpdate);
        message.participants = [];
        if (object.participants !== undefined && object.participants !== null) {
            for (const e of object.participants) {
                message.participants.push(livekit_models_1.ParticipantInfo.fromJSON(e));
            }
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        if (message.participants) {
            obj.participants = message.participants.map((e) => e ? livekit_models_1.ParticipantInfo.toJSON(e) : undefined);
        }
        else {
            obj.participants = [];
        }
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseParticipantUpdate);
        message.participants = [];
        if (object.participants !== undefined && object.participants !== null) {
            for (const e of object.participants) {
                message.participants.push(livekit_models_1.ParticipantInfo.fromPartial(e));
            }
        }
        return message;
    },
};
const baseUpdateSubscription = { trackSids: "", subscribe: false };
exports.UpdateSubscription = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        for (const v of message.trackSids) {
            writer.uint32(10).string(v);
        }
        if (message.subscribe === true) {
            writer.uint32(16).bool(message.subscribe);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseUpdateSubscription);
        message.trackSids = [];
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.trackSids.push(reader.string());
                    break;
                case 2:
                    message.subscribe = reader.bool();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseUpdateSubscription);
        message.trackSids = [];
        if (object.trackSids !== undefined && object.trackSids !== null) {
            for (const e of object.trackSids) {
                message.trackSids.push(String(e));
            }
        }
        if (object.subscribe !== undefined && object.subscribe !== null) {
            message.subscribe = Boolean(object.subscribe);
        }
        else {
            message.subscribe = false;
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        if (message.trackSids) {
            obj.trackSids = message.trackSids.map((e) => e);
        }
        else {
            obj.trackSids = [];
        }
        message.subscribe !== undefined && (obj.subscribe = message.subscribe);
        return obj;
    },
    fromPartial(object) {
        var _a;
        const message = Object.assign({}, baseUpdateSubscription);
        message.trackSids = [];
        if (object.trackSids !== undefined && object.trackSids !== null) {
            for (const e of object.trackSids) {
                message.trackSids.push(e);
            }
        }
        message.subscribe = (_a = object.subscribe) !== null && _a !== void 0 ? _a : false;
        return message;
    },
};
const baseUpdateTrackSettings = {
    trackSids: "",
    disabled: false,
    quality: 0,
    width: 0,
    height: 0,
};
exports.UpdateTrackSettings = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        for (const v of message.trackSids) {
            writer.uint32(10).string(v);
        }
        if (message.disabled === true) {
            writer.uint32(24).bool(message.disabled);
        }
        if (message.quality !== 0) {
            writer.uint32(32).int32(message.quality);
        }
        if (message.width !== 0) {
            writer.uint32(40).uint32(message.width);
        }
        if (message.height !== 0) {
            writer.uint32(48).uint32(message.height);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseUpdateTrackSettings);
        message.trackSids = [];
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.trackSids.push(reader.string());
                    break;
                case 3:
                    message.disabled = reader.bool();
                    break;
                case 4:
                    message.quality = reader.int32();
                    break;
                case 5:
                    message.width = reader.uint32();
                    break;
                case 6:
                    message.height = reader.uint32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseUpdateTrackSettings);
        message.trackSids = [];
        if (object.trackSids !== undefined && object.trackSids !== null) {
            for (const e of object.trackSids) {
                message.trackSids.push(String(e));
            }
        }
        if (object.disabled !== undefined && object.disabled !== null) {
            message.disabled = Boolean(object.disabled);
        }
        else {
            message.disabled = false;
        }
        if (object.quality !== undefined && object.quality !== null) {
            message.quality = videoQualityFromJSON(object.quality);
        }
        else {
            message.quality = 0;
        }
        if (object.width !== undefined && object.width !== null) {
            message.width = Number(object.width);
        }
        else {
            message.width = 0;
        }
        if (object.height !== undefined && object.height !== null) {
            message.height = Number(object.height);
        }
        else {
            message.height = 0;
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        if (message.trackSids) {
            obj.trackSids = message.trackSids.map((e) => e);
        }
        else {
            obj.trackSids = [];
        }
        message.disabled !== undefined && (obj.disabled = message.disabled);
        message.quality !== undefined &&
            (obj.quality = videoQualityToJSON(message.quality));
        message.width !== undefined && (obj.width = message.width);
        message.height !== undefined && (obj.height = message.height);
        return obj;
    },
    fromPartial(object) {
        var _a, _b, _c, _d;
        const message = Object.assign({}, baseUpdateTrackSettings);
        message.trackSids = [];
        if (object.trackSids !== undefined && object.trackSids !== null) {
            for (const e of object.trackSids) {
                message.trackSids.push(e);
            }
        }
        message.disabled = (_a = object.disabled) !== null && _a !== void 0 ? _a : false;
        message.quality = (_b = object.quality) !== null && _b !== void 0 ? _b : 0;
        message.width = (_c = object.width) !== null && _c !== void 0 ? _c : 0;
        message.height = (_d = object.height) !== null && _d !== void 0 ? _d : 0;
        return message;
    },
};
const baseLeaveRequest = { canReconnect: false };
exports.LeaveRequest = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.canReconnect === true) {
            writer.uint32(8).bool(message.canReconnect);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseLeaveRequest);
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.canReconnect = reader.bool();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseLeaveRequest);
        if (object.canReconnect !== undefined && object.canReconnect !== null) {
            message.canReconnect = Boolean(object.canReconnect);
        }
        else {
            message.canReconnect = false;
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.canReconnect !== undefined &&
            (obj.canReconnect = message.canReconnect);
        return obj;
    },
    fromPartial(object) {
        var _a;
        const message = Object.assign({}, baseLeaveRequest);
        message.canReconnect = (_a = object.canReconnect) !== null && _a !== void 0 ? _a : false;
        return message;
    },
};
const baseICEServer = { urls: "", username: "", credential: "" };
exports.ICEServer = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        for (const v of message.urls) {
            writer.uint32(10).string(v);
        }
        if (message.username !== "") {
            writer.uint32(18).string(message.username);
        }
        if (message.credential !== "") {
            writer.uint32(26).string(message.credential);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseICEServer);
        message.urls = [];
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.urls.push(reader.string());
                    break;
                case 2:
                    message.username = reader.string();
                    break;
                case 3:
                    message.credential = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseICEServer);
        message.urls = [];
        if (object.urls !== undefined && object.urls !== null) {
            for (const e of object.urls) {
                message.urls.push(String(e));
            }
        }
        if (object.username !== undefined && object.username !== null) {
            message.username = String(object.username);
        }
        else {
            message.username = "";
        }
        if (object.credential !== undefined && object.credential !== null) {
            message.credential = String(object.credential);
        }
        else {
            message.credential = "";
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        if (message.urls) {
            obj.urls = message.urls.map((e) => e);
        }
        else {
            obj.urls = [];
        }
        message.username !== undefined && (obj.username = message.username);
        message.credential !== undefined && (obj.credential = message.credential);
        return obj;
    },
    fromPartial(object) {
        var _a, _b;
        const message = Object.assign({}, baseICEServer);
        message.urls = [];
        if (object.urls !== undefined && object.urls !== null) {
            for (const e of object.urls) {
                message.urls.push(e);
            }
        }
        message.username = (_a = object.username) !== null && _a !== void 0 ? _a : "";
        message.credential = (_b = object.credential) !== null && _b !== void 0 ? _b : "";
        return message;
    },
};
const baseSpeakersChanged = {};
exports.SpeakersChanged = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        for (const v of message.speakers) {
            livekit_models_1.SpeakerInfo.encode(v, writer.uint32(10).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseSpeakersChanged);
        message.speakers = [];
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.speakers.push(livekit_models_1.SpeakerInfo.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseSpeakersChanged);
        message.speakers = [];
        if (object.speakers !== undefined && object.speakers !== null) {
            for (const e of object.speakers) {
                message.speakers.push(livekit_models_1.SpeakerInfo.fromJSON(e));
            }
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        if (message.speakers) {
            obj.speakers = message.speakers.map((e) => e ? livekit_models_1.SpeakerInfo.toJSON(e) : undefined);
        }
        else {
            obj.speakers = [];
        }
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseSpeakersChanged);
        message.speakers = [];
        if (object.speakers !== undefined && object.speakers !== null) {
            for (const e of object.speakers) {
                message.speakers.push(livekit_models_1.SpeakerInfo.fromPartial(e));
            }
        }
        return message;
    },
};
const baseRoomUpdate = {};
exports.RoomUpdate = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.room !== undefined) {
            livekit_models_1.Room.encode(message.room, writer.uint32(10).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseRoomUpdate);
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.room = livekit_models_1.Room.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseRoomUpdate);
        if (object.room !== undefined && object.room !== null) {
            message.room = livekit_models_1.Room.fromJSON(object.room);
        }
        else {
            message.room = undefined;
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.room !== undefined &&
            (obj.room = message.room ? livekit_models_1.Room.toJSON(message.room) : undefined);
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseRoomUpdate);
        if (object.room !== undefined && object.room !== null) {
            message.room = livekit_models_1.Room.fromPartial(object.room);
        }
        else {
            message.room = undefined;
        }
        return message;
    },
};
const baseConnectionQualityInfo = { participantSid: "", quality: 0 };
exports.ConnectionQualityInfo = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.participantSid !== "") {
            writer.uint32(10).string(message.participantSid);
        }
        if (message.quality !== 0) {
            writer.uint32(16).int32(message.quality);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseConnectionQualityInfo);
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.participantSid = reader.string();
                    break;
                case 2:
                    message.quality = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseConnectionQualityInfo);
        if (object.participantSid !== undefined && object.participantSid !== null) {
            message.participantSid = String(object.participantSid);
        }
        else {
            message.participantSid = "";
        }
        if (object.quality !== undefined && object.quality !== null) {
            message.quality = livekit_models_1.connectionQualityFromJSON(object.quality);
        }
        else {
            message.quality = 0;
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.participantSid !== undefined &&
            (obj.participantSid = message.participantSid);
        message.quality !== undefined &&
            (obj.quality = livekit_models_1.connectionQualityToJSON(message.quality));
        return obj;
    },
    fromPartial(object) {
        var _a, _b;
        const message = Object.assign({}, baseConnectionQualityInfo);
        message.participantSid = (_a = object.participantSid) !== null && _a !== void 0 ? _a : "";
        message.quality = (_b = object.quality) !== null && _b !== void 0 ? _b : 0;
        return message;
    },
};
const baseConnectionQualityUpdate = {};
exports.ConnectionQualityUpdate = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        for (const v of message.updates) {
            exports.ConnectionQualityInfo.encode(v, writer.uint32(10).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseConnectionQualityUpdate);
        message.updates = [];
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.updates.push(exports.ConnectionQualityInfo.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseConnectionQualityUpdate);
        message.updates = [];
        if (object.updates !== undefined && object.updates !== null) {
            for (const e of object.updates) {
                message.updates.push(exports.ConnectionQualityInfo.fromJSON(e));
            }
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        if (message.updates) {
            obj.updates = message.updates.map((e) => e ? exports.ConnectionQualityInfo.toJSON(e) : undefined);
        }
        else {
            obj.updates = [];
        }
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseConnectionQualityUpdate);
        message.updates = [];
        if (object.updates !== undefined && object.updates !== null) {
            for (const e of object.updates) {
                message.updates.push(exports.ConnectionQualityInfo.fromPartial(e));
            }
        }
        return message;
    },
};
if (minimal_1.default.util.Long !== long_1.default) {
    minimal_1.default.util.Long = long_1.default;
    minimal_1.default.configure();
}
//# sourceMappingURL=livekit_rtc.js.map