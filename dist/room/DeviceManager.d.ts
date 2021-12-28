export default class DeviceManager {
    private static instance?;
    static mediaDeviceKinds: MediaDeviceKind[];
    static getInstance(): DeviceManager;
    getDevices(kind: MediaDeviceKind): Promise<MediaDeviceInfo[]>;
    normalizeDeviceId(kind: MediaDeviceKind, deviceId?: string, groupId?: string): Promise<string | undefined>;
}
