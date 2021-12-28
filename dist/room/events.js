"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrackEvent = exports.EngineEvent = exports.ParticipantEvent = exports.RoomEvent = void 0;
/**
 * Events are the primary way LiveKit notifies your application of changes.
 *
 * The following are events emitted by [[Room]], listen to room events like
 *
 * ```typescript
 * room.on(RoomEvent.TrackPublished, (track, publication, participant) => {})
 * ```
 */
var RoomEvent;
(function (RoomEvent) {
    /**
     * When the connection to the server has been interrupted and it's attempting
     * to reconnect.
     */
    RoomEvent["Reconnecting"] = "reconnecting";
    /**
     * Fires when a reconnection has been successful.
     */
    RoomEvent["Reconnected"] = "reconnected";
    /**
     * When disconnected from room. This fires when room.disconnect() is called or
     * when an unrecoverable connection issue had occured
     */
    RoomEvent["Disconnected"] = "disconnected";
    /**
     * When input or output devices on the machine have changed.
     */
    RoomEvent["MediaDevicesChanged"] = "mediaDevicesChanged";
    /**
     * When a [[RemoteParticipant]] joins *after* the local
     * participant. It will not emit events for participants that are already
     * in the room
     *
     * args: ([[RemoteParticipant]])
     */
    RoomEvent["ParticipantConnected"] = "participantConnected";
    /**
     * When a [[RemoteParticipant]] leaves *after* the local
     * participant has joined.
     *
     * args: ([[RemoteParticipant]])
     */
    RoomEvent["ParticipantDisconnected"] = "participantDisconnected";
    /**
     * When a new track is published to room *after* the local
     * participant has joined. It will not fire for tracks that are already published.
     *
     * A track published doesn't mean the participant has subscribed to it. It's
     * simply reflecting the state of the room.
     *
     * args: ([[RemoteTrackPublication]], [[RemoteParticipant]])
     */
    RoomEvent["TrackPublished"] = "trackPublished";
    /**
     * The [[LocalParticipant]] has subscribed to a new track. This event will **always**
     * fire as long as new tracks are ready for use.
     *
     * args: ([[RemoteTrack]], [[RemoteTrackPublication]], [[RemoteParticipant]])
     */
    RoomEvent["TrackSubscribed"] = "trackSubscribed";
    /**
     * Could not subscribe to a track
     *
     * args: (track sid, [[RemoteParticipant]])
     */
    RoomEvent["TrackSubscriptionFailed"] = "trackSubscriptionFailed";
    /**
     * A [[RemoteParticipant]] has unpublished a track
     *
     * args: ([[RemoteTrackPublication]], [[RemoteParticipant]])
     */
    RoomEvent["TrackUnpublished"] = "trackUnpublished";
    /**
     * A subscribed track is no longer available. Clients should listen to this
     * event and ensure they detach tracks.
     *
     * args: ([[Track]], [[RemoteTrackPublication]], [[RemoteParticipant]])
     */
    RoomEvent["TrackUnsubscribed"] = "trackUnsubscribed";
    /**
     * A track that was muted, fires on both [[RemoteParticipant]]s and [[LocalParticipant]]
     *
     * args: ([[TrackPublication]], [[Participant]])
     */
    RoomEvent["TrackMuted"] = "trackMuted";
    /**
     * A track that was unmuted, fires on both [[RemoteParticipant]]s and [[LocalParticipant]]
     *
     * args: ([[TrackPublication]], [[Participant]])
     */
    RoomEvent["TrackUnmuted"] = "trackUnmuted";
    /**
     * A local track was published successfully. This event is helpful to know
     * when to update your local UI with the newly published track.
     *
     * args: ([[LocalTrackPublication]], [[LocalParticipant]])
     */
    RoomEvent["LocalTrackPublished"] = "localTrackPublished";
    /**
     * A local track was unpublished. This event is helpful to know when to remove
     * the local track from your UI.
     *
     * When a user stops sharing their screen by pressing "End" on the browser UI,
     * this event will also fire.
     *
     * args: ([[LocalTrackPublication]], [[LocalParticipant]])
     */
    RoomEvent["LocalTrackUnpublished"] = "localTrackUnpublished";
    /**
     * Active speakers changed. List of speakers are ordered by their audio level.
     * loudest speakers first. This will include the LocalParticipant too.
     *
     * args: (Array<[[Participant]]>)
     */
    RoomEvent["ActiveSpeakersChanged"] = "activeSpeakersChanged";
    /**
     * @deprecated Use ParticipantMetadataChanged instead
     * @internal
     */
    RoomEvent["MetadataChanged"] = "metadataChanged";
    /**
     * Participant metadata is a simple way for app-specific state to be pushed to
     * all users.
     * When RoomService.UpdateParticipantMetadata is called to change a participant's
     * state, *all*  participants in the room will fire this event.
     *
     * args: (prevMetadata: string, [[Participant]])
     *
     */
    RoomEvent["ParticipantMetadataChanged"] = "participantMetaDataChanged";
    /**
     * Room metadata is a simple way for app-specific state to be pushed to
     * all users.
     * When RoomService.UpdateRoomMetadata is called to change a room's state,
     * *all*  participants in the room will fire this event.
     *
     * args: (string)
     */
    RoomEvent["RoomMetadataChanged"] = "roomMetadataChanged";
    /**
     * Data received from another participant.
     * Data packets provides the ability to use LiveKit to send/receive arbitrary payloads.
     * All participants in the room will receive the messages sent to the room.
     *
     * args: (payload: Uint8Array, participant: [[Participant]], kind: [[DataPacket_Kind]])
     */
    RoomEvent["DataReceived"] = "dataReceived";
    /**
     * LiveKit will attempt to autoplay all audio tracks when you attach them to
     * audio elements. However, if that fails, we'll notify you via AudioPlaybackStatusChanged.
     * `Room.canPlayAudio` will indicate if audio playback is permitted.
     */
    RoomEvent["AudioPlaybackStatusChanged"] = "audioPlaybackChanged";
    /**
     * When we have encountered an error while attempting to create a track.
     * The errors take place in getUserMedia().
     * Use MediaDeviceFailure.getFailure(error) to get the reason of failure.
     * [[getAudioCreateError]] and [[getVideoCreateError]] will indicate if it had
     * an error while creating the audio or video track respectively.
     *
     * args: (error: Error)
     */
    RoomEvent["MediaDevicesError"] = "mediaDevicesError";
    /**
     * Connection quality was changed for a Participant. It'll receive updates
     * from the local participant, as well as any [[RemoteParticipant]]s that we are
     * subscribed to.
     *
     * args: (connectionQuality: [[ConnectionQuality]], participant: [[Participant]])
     */
    RoomEvent["ConnectionQualityChanged"] = "connectionQualityChanged";
})(RoomEvent = exports.RoomEvent || (exports.RoomEvent = {}));
var ParticipantEvent;
(function (ParticipantEvent) {
    ParticipantEvent["TrackPublished"] = "trackPublished";
    ParticipantEvent["TrackSubscribed"] = "trackSubscribed";
    ParticipantEvent["TrackSubscriptionFailed"] = "trackSubscriptionFailed";
    ParticipantEvent["TrackUnpublished"] = "trackUnpublished";
    ParticipantEvent["TrackUnsubscribed"] = "trackUnsubscribed";
    ParticipantEvent["TrackMuted"] = "trackMuted";
    ParticipantEvent["TrackUnmuted"] = "trackUnmuted";
    ParticipantEvent["LocalTrackPublished"] = "localTrackPublished";
    ParticipantEvent["LocalTrackUnpublished"] = "localTrackUnpublished";
    ParticipantEvent["MetadataChanged"] = "metadataChanged";
    ParticipantEvent["ParticipantMetadataChanged"] = "participantMetadataChanged";
    ParticipantEvent["DataReceived"] = "dataReceived";
    ParticipantEvent["IsSpeakingChanged"] = "isSpeakingChanged";
    ParticipantEvent["ConnectionQualityChanged"] = "connectionQualityChanged";
    // fired only on LocalParticipant
    /** @internal */
    ParticipantEvent["MediaDevicesError"] = "mediaDevicesError";
})(ParticipantEvent = exports.ParticipantEvent || (exports.ParticipantEvent = {}));
/** @internal */
var EngineEvent;
(function (EngineEvent) {
    EngineEvent["Connected"] = "connected";
    EngineEvent["Disconnected"] = "disconnected";
    EngineEvent["Reconnecting"] = "reconnecting";
    EngineEvent["Reconnected"] = "reconnected";
    EngineEvent["ParticipantUpdate"] = "participantUpdate";
    EngineEvent["MediaTrackAdded"] = "mediaTrackAdded";
    EngineEvent["ActiveSpeakersUpdate"] = "activeSpeakersUpdate";
    EngineEvent["SpeakersChanged"] = "speakersChanged";
    EngineEvent["DataPacketReceived"] = "dataPacketReceived";
    EngineEvent["RemoteMuteChanged"] = "remoteMuteChanged";
    EngineEvent["RoomUpdate"] = "roomUpdate";
    EngineEvent["ConnectionQualityUpdate"] = "connectionQualityUpdate";
})(EngineEvent = exports.EngineEvent || (exports.EngineEvent = {}));
var TrackEvent;
(function (TrackEvent) {
    TrackEvent["Message"] = "message";
    TrackEvent["Muted"] = "muted";
    TrackEvent["Unmuted"] = "unmuted";
    TrackEvent["Ended"] = "ended";
    /** @internal */
    TrackEvent["UpdateSettings"] = "updateSettings";
    /** @internal */
    TrackEvent["UpdateSubscription"] = "updateSubscription";
    /** @internal */
    TrackEvent["AudioPlaybackStarted"] = "audioPlaybackStarted";
    /** @internal */
    TrackEvent["AudioPlaybackFailed"] = "audioPlaybackFailed";
    /** @internal */
    TrackEvent["VisibilityChanged"] = "visibilityChanged";
    /** @internal */
    TrackEvent["VideoDimensionsChanged"] = "videoDimensionsChanged";
})(TrackEvent = exports.TrackEvent || (exports.TrackEvent = {}));
//# sourceMappingURL=events.js.map