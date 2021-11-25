import React, { useEffect, useMemo, useRef } from "react";
import { FullScreen, useFullScreenHandle } from "react-full-screen";

function getTrackUnavailableMessage(kind, trackState) {
  if (!trackState) return;
  switch (trackState.state) {
    case "blocked":
      if (trackState.blocked.byPermissions) {
        return `${kind} permission denied`;
      } else if (trackState.blocked.byDeviceMissing) {
        return `${kind} device missing`;
      }
    case "off":
      if (trackState.off.byUser) {
        return `${kind} muted`;
      } else if (trackState.off.byBandwidth) {
        return `${kind} muted to save bandwidth`;
      }
    case "sendable":
      return `${kind} not subscribed`;
    case "loading":
      return `${kind} loading...`;
    case "interrupted":
      return `${kind} interrupted`;
    case "playable":
      return null;
  }
}

const trackStatesForInclusion = ["loading", "playable", "interrupted"];

function ScreenTile(props) {
  const screenVideoEl = useRef(null);
  const screenAudioEl = useRef(null);

  const fsHandle = useFullScreenHandle();

  let participantData = props.participant;
  const screenVideoTrack = useMemo(() => {
    return participantData.screen &&
      trackStatesForInclusion.includes(participantData.tracks.screenVideo.state)
      ? participantData.screenVideoTrack
      : null;
  }, [props.participant.tracks.screenVideo]);

  const screenAudioTrack = useMemo(() => {
    return participantData.screen &&
      trackStatesForInclusion.includes(participantData.tracks.screenAudio.state)
      ? participantData.screenAudioTrack
      : null;
  }, [props.participant.tracks.screenAudio]);

  // const videoUnavailableMessage = useMemo(() => {
  //     return getTrackUnavailableMessage('video', participantData.tracks.video);
  // }, [props.participant.tracks.video]);

  // const audioUnavailableMessage = useMemo(() => {
  //     return getTrackUnavailableMessage('audio', participantData.tracks.audio);
  // }, [props.participant.tracks.video]);

  /**
   * When Screen video track changes, update video srcObject
   */
  useEffect(() => {
    screenVideoEl.current &&
      (screenVideoEl.current.srcObject = new MediaStream([screenVideoTrack]));
  }, [screenVideoTrack]);

  /**
   * When Screen audio track changes, update audio srcObject
   */
  useEffect(() => {
    screenAudioEl.current &&
      (screenAudioEl.current.srcObject = new MediaStream([screenAudioTrack]));
  }, [screenAudioTrack]);

  function getScreenVideoComponent() {
    return (
      screenVideoTrack && (
        <video
          autoPlay
          muted
          playsInline
          ref={screenVideoEl}
          style={{ minWidth: "100%", minHeight: "100%", width: "100%" }}
        />
      )
    );
  }

  function getScreenAudioComponent() {
    return (
      !props.participant.local &&
      screenAudioTrack && <audio autoPlay playsInline ref={screenAudioEl} />
    );
  }

  return (
    <>
      {/* {screenVideoTrack && (
        <div className={`shared-screenBox`} id="screen-share">
          {getScreenVideoComponent()}
          {getScreenAudioComponent()}
        </div>
      )} */}
      {screenVideoTrack && (
        <div
          className={`${props.screenStyle.callingBox__video} ${props.screenStyle.callingBox__video__shared}`}
          style={{
            width: props.isAdmin ? "100%" : "auto",
            flexGrow: "1",
            maxHeight: "100%",
          }}
        >
          <div className={props.screenStyle.callingBox__video_container}>
            <span className={props.screenStyle.callingBox__nameTag}>
              {props.participant.user_name} is sharing screen
            </span>
            <div className={`${props.screenStyle.callingBox__video_wrapper} ${props.screenStyle.has_video}`}>
              <button className={props.screenStyle.full_screen_btn} onClick={fsHandle.enter}>
                <i className="icon-full-screen" />
              </button>
              <FullScreen handle={fsHandle}>
                {getScreenVideoComponent()}
              </FullScreen>
              {getScreenAudioComponent()}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ScreenTile;
