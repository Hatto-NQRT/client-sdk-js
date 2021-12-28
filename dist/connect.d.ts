import { ConnectOptions } from './options';
import Room from './room/Room';
export { version } from './version';
/**
 * Connects to a LiveKit room
 *
 * ```typescript
 * connect('wss://myhost.livekit.io', token, {
 *   // publish audio and video tracks on joining
 *   audio: true,
 *   video: true,
 *   captureDefaults: {
 *    facingMode: 'user',
 *   },
 * })
 * ```
 * @param url URL to LiveKit server
 * @param token AccessToken, a JWT token that includes authentication and room details
 * @param options
 */
export declare function connect(url: string, token: string, options?: ConnectOptions): Promise<Room>;
