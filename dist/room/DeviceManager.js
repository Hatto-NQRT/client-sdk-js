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
Object.defineProperty(exports, "__esModule", { value: true });
const defaultId = 'default';
class DeviceManager {
    static getInstance() {
        if (this.instance === undefined) {
            this.instance = new DeviceManager();
        }
        return this.instance;
    }
    getDevices(kind) {
        return __awaiter(this, void 0, void 0, function* () {
            let devices = yield navigator.mediaDevices.enumerateDevices();
            devices = devices.filter((device) => device.kind === kind);
            // Chrome returns 'default' devices, we would filter them out, but put the default
            // device at first
            // we would only do this if there are more than 1 device though
            if (devices.length > 1 && devices[0].deviceId === defaultId) {
                // find another device with matching group id, and move that to 0
                const defaultDevice = devices[0];
                for (let i = 1; i < devices.length; i += 1) {
                    if (devices[i].groupId === defaultDevice.groupId) {
                        const temp = devices[0];
                        devices[0] = devices[i];
                        devices[i] = temp;
                        break;
                    }
                }
                return devices.filter((device) => device !== defaultDevice);
            }
            return devices;
        });
    }
    normalizeDeviceId(kind, deviceId, groupId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (deviceId !== defaultId) {
                return deviceId;
            }
            // resolve actual device id if it's 'default': Chrome returns it when no
            // device has been chosen
            const devices = yield this.getDevices(kind);
            const device = devices.find((d) => d.groupId === groupId && d.deviceId !== defaultId);
            return device === null || device === void 0 ? void 0 : device.deviceId;
        });
    }
}
exports.default = DeviceManager;
DeviceManager.mediaDeviceKinds = [
    'audioinput',
    'audiooutput',
    'videoinput',
];
//# sourceMappingURL=DeviceManager.js.map