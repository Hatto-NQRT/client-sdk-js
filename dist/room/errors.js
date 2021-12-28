"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaDeviceFailure = exports.PublishDataError = exports.UnexpectedConnectionState = exports.UnsupportedServer = exports.TrackInvalidError = exports.ConnectionError = exports.LivekitError = void 0;
class LivekitError extends Error {
    constructor(code, message) {
        super(message || 'an error has occured');
        this.code = code;
    }
}
exports.LivekitError = LivekitError;
class ConnectionError extends LivekitError {
    constructor(message) {
        super(1, message);
    }
}
exports.ConnectionError = ConnectionError;
class TrackInvalidError extends LivekitError {
    constructor(message) {
        super(20, message || 'Track is invalid');
    }
}
exports.TrackInvalidError = TrackInvalidError;
class UnsupportedServer extends LivekitError {
    constructor(message) {
        super(10, message || 'Unsupported server');
    }
}
exports.UnsupportedServer = UnsupportedServer;
class UnexpectedConnectionState extends LivekitError {
    constructor(message) {
        super(12, message || 'Unexpected connection state');
    }
}
exports.UnexpectedConnectionState = UnexpectedConnectionState;
class PublishDataError extends LivekitError {
    constructor(message) {
        super(13, message || 'Unable to publish data');
    }
}
exports.PublishDataError = PublishDataError;
var MediaDeviceFailure;
(function (MediaDeviceFailure) {
    // user rejected permissions
    MediaDeviceFailure["PermissionDenied"] = "PermissionDenied";
    // device is not available
    MediaDeviceFailure["NotFound"] = "NotFound";
    // device is in use. On Windows, only a single tab may get access to a device at a time.
    MediaDeviceFailure["DeviceInUse"] = "DeviceInUse";
    MediaDeviceFailure["Other"] = "Other";
})(MediaDeviceFailure = exports.MediaDeviceFailure || (exports.MediaDeviceFailure = {}));
(function (MediaDeviceFailure) {
    function getFailure(error) {
        if (error && 'name' in error) {
            if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
                return MediaDeviceFailure.NotFound;
            }
            if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
                return MediaDeviceFailure.PermissionDenied;
            }
            if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
                return MediaDeviceFailure.DeviceInUse;
            }
            return MediaDeviceFailure.Other;
        }
    }
    MediaDeviceFailure.getFailure = getFailure;
})(MediaDeviceFailure = exports.MediaDeviceFailure || (exports.MediaDeviceFailure = {}));
//# sourceMappingURL=errors.js.map