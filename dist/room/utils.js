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
exports.getIntersectionObserver = exports.getResizeObserver = exports.sleep = exports.useLegacyAPI = exports.unpackStreamId = void 0;
const separator = '|';
function unpackStreamId(packed) {
    const parts = packed.split(separator);
    if (parts.length > 1) {
        return [parts[0], packed.substr(parts[0].length + 1)];
    }
    return [packed, ''];
}
exports.unpackStreamId = unpackStreamId;
function useLegacyAPI() {
    // react native is using old stream based API
    return typeof navigator !== 'undefined' && navigator.product === 'ReactNative';
}
exports.useLegacyAPI = useLegacyAPI;
function sleep(duration) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve) => setTimeout(resolve, duration));
    });
}
exports.sleep = sleep;
function roDispatchCallback(entries) {
    for (const entry of entries) {
        entry.target.handleResize(entry);
    }
}
function ioDispatchCallback(entries) {
    for (const entry of entries) {
        entry.target.handleVisibilityChanged(entry);
    }
}
let resizeObserver = null;
const getResizeObserver = () => {
    if (!resizeObserver)
        resizeObserver = new ResizeObserver(roDispatchCallback);
    return resizeObserver;
};
exports.getResizeObserver = getResizeObserver;
let intersectionObserver = null;
const getIntersectionObserver = () => {
    if (!intersectionObserver)
        intersectionObserver = new IntersectionObserver(ioDispatchCallback);
    return intersectionObserver;
};
exports.getIntersectionObserver = getIntersectionObserver;
//# sourceMappingURL=utils.js.map