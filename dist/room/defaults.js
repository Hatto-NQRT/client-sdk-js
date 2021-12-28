"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setTrackCaptureDefaults = exports.getTrackCaptureDefaults = exports.setTrackPublishDefaults = exports.getTrackPublishDefaults = void 0;
const options_1 = require("./track/options");
let publishDefaults = {
    audioBitrate: options_1.AudioPresets.speech.maxBitrate,
    stopMicTrackOnMute: false,
};
let captureDefaults = {
    autoGainControl: true,
    channelCount: 1,
    echoCancellation: true,
    noiseSuppression: true,
    videoResolution: options_1.VideoPresets.qhd.resolution,
};
function getTrackPublishDefaults() {
    return publishDefaults;
}
exports.getTrackPublishDefaults = getTrackPublishDefaults;
function setTrackPublishDefaults(defaults) {
    publishDefaults = defaults;
}
exports.setTrackPublishDefaults = setTrackPublishDefaults;
function getTrackCaptureDefaults() {
    return captureDefaults;
}
exports.getTrackCaptureDefaults = getTrackCaptureDefaults;
function setTrackCaptureDefaults(defaults) {
    captureDefaults = defaults;
}
exports.setTrackCaptureDefaults = setTrackCaptureDefaults;
//# sourceMappingURL=defaults.js.map