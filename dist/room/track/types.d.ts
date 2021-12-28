import LocalAudioTrack from './LocalAudioTrack';
import LocalVideoTrack from './LocalVideoTrack';
import RemoteAudioTrack from './RemoteAudioTrack';
import RemoteVideoTrack from './RemoteVideoTrack';
export declare type RemoteTrack = RemoteAudioTrack | RemoteVideoTrack;
export declare type AudioTrack = RemoteAudioTrack | LocalAudioTrack;
export declare type VideoTrack = RemoteVideoTrack | LocalVideoTrack;
