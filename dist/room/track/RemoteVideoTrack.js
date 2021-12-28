"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts_debounce_1 = require("ts-debounce");
const events_1 = require("../events");
const utils_1 = require("../utils");
const Track_1 = require("./Track");
const REACTION_DELAY = 1000;
class RemoteVideoTrack extends Track_1.Track {
    constructor(mediaTrack, sid, receiver, autoManaged) {
        super(mediaTrack, Track_1.Track.Kind.Video);
        this.elementInfos = [];
        this.handleVisibilityChanged = (entry) => {
            const { target, isIntersecting } = entry;
            const elementInfo = this.elementInfos.find((info) => info.element === target);
            if (elementInfo) {
                elementInfo.visible = isIntersecting;
                elementInfo.visibilityChangedAt = Date.now();
            }
            this.updateVisibility();
        };
        this.debouncedHandleVisibilityChanged = ts_debounce_1.debounce(this.handleVisibilityChanged, REACTION_DELAY);
        this.handleResize = (entry) => {
            const { target, contentRect } = entry;
            const elementInfo = this.elementInfos.find((info) => info.element === target);
            if (elementInfo) {
                elementInfo.width = contentRect.width;
                elementInfo.height = contentRect.height;
            }
            this.updateDimensions();
        };
        this.debouncedHandleResize = ts_debounce_1.debounce(this.handleResize, REACTION_DELAY);
        // override id to parsed ID
        this.sid = sid;
        this.receiver = receiver;
        this.autoManaged = autoManaged;
    }
    get isAutoManaged() {
        var _a;
        return (_a = this.autoManaged) !== null && _a !== void 0 ? _a : false;
    }
    /** @internal */
    setMuted(muted) {
        if (this.isMuted !== muted) {
            this.isMuted = muted;
            this.emit(muted ? events_1.TrackEvent.Muted : events_1.TrackEvent.Unmuted, this);
        }
        this.attachedElements.forEach((element) => {
            // detach or attach
            if (muted) {
                Track_1.detachTrack(this.mediaStreamTrack, element);
            }
            else {
                Track_1.attachToElement(this.mediaStreamTrack, element);
            }
        });
    }
    attach(element) {
        if (!element) {
            element = super.attach();
        }
        super.attach(element);
        if (this.autoManaged) {
            this.elementInfos.push({
                element,
                visible: true,
                width: element.clientWidth,
                height: element.clientHeight,
            });
            element
                .handleResize = this.debouncedHandleResize;
            element
                .handleVisibilityChanged = this.debouncedHandleVisibilityChanged;
            utils_1.getIntersectionObserver().observe(element);
            utils_1.getResizeObserver().observe(element);
        }
        return element;
    }
    detach(element) {
        let detachedElements = [];
        if (element) {
            detachedElements.push(element);
            return super.detach(element);
        }
        detachedElements = super.detach();
        for (const e of detachedElements) {
            this.stopObservingElement(e);
        }
        return detachedElements;
    }
    start() {
        // use `enabled` of track to enable re-use of transceiver
        super.enable();
    }
    stop() {
        // use `enabled` of track to enable re-use of transceiver
        super.disable();
    }
    stopObservingElement(element) {
        var _a, _b;
        (_a = utils_1.getIntersectionObserver()) === null || _a === void 0 ? void 0 : _a.unobserve(element);
        (_b = utils_1.getResizeObserver()) === null || _b === void 0 ? void 0 : _b.unobserve(element);
        this.elementInfos = this.elementInfos.filter((info) => info.element !== element);
    }
    updateVisibility() {
        const lastVisibilityChange = this.elementInfos.reduce((prev, info) => Math.max(prev, info.visibilityChangedAt || 0), 0);
        const isVisible = this.elementInfos.some((info) => info.visible);
        if (this.lastVisible === isVisible) {
            return;
        }
        if (!isVisible && Date.now() - lastVisibilityChange < REACTION_DELAY) {
            // delay hidden events
            setTimeout(() => {
                this.updateVisibility();
            }, Date.now() - lastVisibilityChange);
            return;
        }
        this.lastVisible = isVisible;
        this.emit(events_1.TrackEvent.VisibilityChanged, isVisible, this);
    }
    updateDimensions() {
        var _a, _b;
        let maxWidth = 0;
        let maxHeight = 0;
        for (const info of this.elementInfos) {
            if (info.visible) {
                if (info.width + info.height > maxWidth + maxHeight) {
                    maxWidth = info.width;
                    maxHeight = info.height;
                }
            }
        }
        if (((_a = this.lastDimensions) === null || _a === void 0 ? void 0 : _a.width) === maxWidth && ((_b = this.lastDimensions) === null || _b === void 0 ? void 0 : _b.height) === maxHeight) {
            return;
        }
        this.lastDimensions = {
            width: maxWidth,
            height: maxHeight,
        };
        this.emit(events_1.TrackEvent.VideoDimensionsChanged, this.lastDimensions, this);
    }
}
exports.default = RemoteVideoTrack;
//# sourceMappingURL=RemoteVideoTrack.js.map