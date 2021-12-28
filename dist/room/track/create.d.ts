import LocalAudioTrack from './LocalAudioTrack';
import LocalTrack from './LocalTrack';
import LocalVideoTrack from './LocalVideoTrack';
import { CreateAudioTrackOptions, CreateLocalTracksOptions, CreateScreenTrackOptions, CreateVideoTrackOptions } from './options';
export declare function getLastAudioCreateError(): Error | undefined;
export declare function getLastVideoCreateError(): Error | undefined;
/**
 * Creates a local video and audio track at the same time. When acquiring both
 * audio and video tracks together, it'll display a single permission prompt to
 * the user instead of two separate ones.
 * @param options
 */
export declare function createLocalTracks(options?: CreateLocalTracksOptions): Promise<Array<LocalTrack>>;
/**
 * Creates a [[LocalVideoTrack]] with getUserMedia()
 * @param options
 */
export declare function createLocalVideoTrack(options?: CreateVideoTrackOptions): Promise<LocalVideoTrack>;
export declare function createLocalAudioTrack(options?: CreateAudioTrackOptions): Promise<LocalAudioTrack>;
/**
 * Creates a screen capture tracks with getDisplayMedia().
 * A LocalVideoTrack is always created and returned.
 * If { audio: true }, and the browser supports audio capture, a LocalAudioTrack is also created.
 */
export declare function createLocalScreenTracks(options?: CreateScreenTrackOptions): Promise<Array<LocalTrack>>;
