import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

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

// function useWindowSize() {
//   const [size, setSize] = useState([0, 0]);
//   useLayoutEffect(() => {
//     function updateSize() {
//       setSize([window.innerWidth, window.innerHeight]);
//     }
//     window.addEventListener('resize', updateSize);
//     updateSize();
//     return () => window.removeEventListener('resize', updateSize);
//   }, []);
//   return size;
// }

function VideoTile(props) {
  const [hover, setHover] = useState(false);
  // const [width, height] = useWindowSize();
  const [width, setWidth] = useState(null);
  const [height, setHeight] = useState(null);

  const videoEl = useRef(null);
  const audioEl = useRef(null);
  const [volume, setVolume] = useState(0);
  const intervalObj = useRef(null);

  const callingBox_container = useRef(null);

  // const callingBox_container = useCallback((node) => {
  //   if (node !== null) {
  //     let nodeWidth = node.getBoundingClientRect().width;
  //     let nodeHeight = node.getBoundingClientRect().height;
  //     console.log(nodeWidth);
  //     console.log(nodeHeight);

  //     let aspect = nodeWidth / nodeHeight;

  //     setWidth(node.getBoundingClientRect().width);
  //     setHeight(node.getBoundingClientRect().height);
  //   }
  // }, []);

  // useEffect(() => {
  //   // The 'current' property contains info of the reference:
  //   // align, title, ... , width, height, etc.
  //   if (callingBox_container.current) {
  //     let height = callingBox_container.current.offsetHeight;
  //     let width = callingBox_container.current.offsetWidth;
  //     console.log(width);
  //   }
  // }, [callingBox_container]);

  // useEffect(() => {
  //   // The 'current' property contains info of the reference:
  //   // align, title, ... , width, height, etc.
  //   if (callingBox_container.current) {
  //     let height = callingBox_container.current.offsetHeight;
  //     let width = callingBox_container.current.offsetWidth;
  //     console.log(width);
  //   }
  // }, []);

  let participantData = props.participant;
  const videoTrack = useMemo(() => {
    // console.log(participantData.tracks);
    return participantData &&
      participantData.tracks &&
      participantData.tracks.video &&
      participantData.tracks.video.state === "playable"
      ? participantData.videoTrack
      : null;
  }, [props.participant?.tracks.video]);

  const audioTrack = useMemo(() => {
    // console.log(participantData.tracks);
    return participantData &&
      participantData.tracks &&
      participantData.tracks.audio &&
      participantData.tracks.audio.state === "playable"
      ? participantData.audioTrack
      : null;
  }, [props.participant?.tracks.audio]);

  // const videoUnavailableMessage = useMemo(() => {
  //     return getTrackUnavailableMessage('video', participantData.tracks.video);
  // }, [props.participant.tracks.video]);

  // const audioUnavailableMessage = useMemo(() => {
  //     return getTrackUnavailableMessage('audio', participantData.tracks.audio);
  // }, [props.participant.tracks.video]);

  /**
   * When video track changes, update video srcObject
   */
  useEffect(() => {
    videoEl.current &&
      (videoEl.current.srcObject = new MediaStream([videoTrack]));

    if (!videoTrack && audioTrack) {
      startAudioLevelTracking();
    } else {
      stopAudioLevelTracking();
    }
  }, [videoTrack]);

  /**
   * When audio track changes, update audio srcObject
   */
  useEffect(() => {
    // console.log(audioTrack);
    audioEl.current &&
      (audioEl.current.srcObject = new MediaStream([audioTrack]));

    if (!videoTrack && audioTrack) {
      startAudioLevelTracking();
    } else {
      stopAudioLevelTracking();
    }

    return () => {
      // console.log("cleaned up");
      stopAudioLevelTracking();
    };
  }, [audioTrack]);

  // useEffect(() => {
  //   startAudioLevelTracking();

  //   return () => {
  //     console.log("cleaned up");
  //     stopAudioLevelTracking();
  //   };
  // }, []);

  // useEffect(() => {
  //   audioEl.current &&
  //     (audioEl.current.srcObject = new MediaStream([audioTrack]));
  // }, [audioTrack]);

  const startAudioLevelTracking = () => {
    // console.log("Start audio tracking");
    if (intervalObj.current) clearInterval(intervalObj.current);
    intervalObj.current = setInterval(
      async () => getParticipantAudioLevel(props.participant.session_id),
      500
    );
  };

  const stopAudioLevelTracking = () => {
    // console.log("Stop audio tracking");
    if (intervalObj.current) clearInterval(intervalObj.current);
    setVolume(0);
  };

  const circleColors = [
    "linear-gradient(0deg, #538995, #538995)",
    "linear-gradient(0deg, #535E95, #535E95)",
    "linear-gradient(0deg, #705395, #705395)",
  ];

  function getVideoComponent() {
    // console.log(props.participant, "------------")
    if (props.participant.session_id) {
      // let newId = props.participant.session_id.split('-')[0]
      // console.log(newId)
      return videoTrack && <video
        // id={`video_${props.participant.session_id}_${newId}`}
        id={`video_${props.participant.user_id}`}
        autoPlay muted playsInline ref={videoEl} />;
    }
  }

  function getAudioComponent() {
    return (
      !props.participant.local &&
      audioTrack && <audio
        id={"audio_" + props.participant.user_id}
        autoPlay playsInline ref={audioEl} />
    );
  }

  function getLayoutIndex() {
    // if (props.participant.local){
    //     return 1;
    // }
    return props.tilesLayout.indexOf(props.participant.session_id) + 1;
  }

  const getNameAbbreviation = (userName) => {
    if (!userName) return null;

    let abbreviatedName = "";
    let splitName = userName.split(" ");
    for (let i = 0; i < splitName.length && i < 2; i++) {
      if (splitName[i].length > 0)
        abbreviatedName += splitName[i][0].toUpperCase();
    }

    return abbreviatedName;
  };

  const getParticipantAudioLevel = async (participantId) => {
    try {
      if (!(window.rtcpeers && window.rtcpeers.sfu)) {
        return;
      }

      let audioLevel = 0;
      if (props.self) {
        const producer = window.rtcpeers.sfu.producers[0];
        if (!(producer && producer.getStats)) {
          return;
        }
        audioLevel = Array.from((await producer.getStats()).values()).find(
          (s) => "audioLevel" in s
        ).audioLevel;
        // console.log(audioLevel);
      } else {
        const consumer =
          window.rtcpeers.sfu.consumers[participantId + "/cam-audio"];
        if (!(consumer && consumer.getStats)) {
          return;
        }
        audioLevel = Array.from((await consumer.getStats()).values()).find(
          (s) => "audioLevel" in s
        ).audioLevel;
        // console.log(audioLevel);
      }

      setVolume(audioLevel);
    } catch (e) {
      console.error(e);
    }
  };

  let tileSize = props.getTileSize();
  if (!props.participant) {
    <div
      //   className="callingBox__video"
      // id={props.participant.session_id}
      style={{
        width: tileSize.width,
        minWidth: tileSize.width,
        maxWidth: tileSize.width,
        height: tileSize.height,
        minHeight: tileSize.height,
        maxHeight: tileSize.height,
        position: "relative",
        border: "0.5rem solid transparent",
        // borderRadius: "1.5rem",
        borderRadius: Math.min(tileSize.height / 20, 12) + "px",
        overflow: "hidden",
      }}
    // ref={callingBox_container}
    ></div>;
  }

  return (
    <>
      {/*  &&  */}
      {
        <div
          //   className="callingBox__video"
          id={props.participant.session_id}
          style={{
            width: tileSize.width,
            minWidth: tileSize.width,
            maxWidth: tileSize.width,
            height: tileSize.height,
            minHeight: tileSize.height,
            maxHeight: tileSize.height,
            position: "relative",
            border: "0.5rem solid transparent",
            // borderRadius: "1.5rem",
            borderRadius: Math.min(tileSize.height / 20, 12) + "px",
            overflow: "hidden",
          }}
          ref={callingBox_container}
        >
          <div
            className={props.videoStyle.callingBox__video_container}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          >
            <span className={props.videoStyle.callingBox__nameTag}>
              {props.participant.user_name.replace("_$translator", "")}
              {/* {props.self && " (Me)"} */}
            </span>
            {!props.self && props.adminControls && hover && (
              <div
                // className={`over-buttons ${
                //   hover ? "over-buttons--center" : ""
                // }`}
                className={`${props.videoStyle.over_buttons} ${props.videoStyle.over_buttons__center}`}
              >
                <div
                  className={props.videoStyle.over_buttons__inner}
                  style={{ zIndex: 5 }}
                >
                  <button onClick={() => props.adminControls.toggleCam()}>
                    <i
                      className={
                        props.participant?.video
                          ? "icon-video-btn-filled"
                          : "icon-video-btn-filled-mute icon-btn--mute"
                      }
                    />
                  </button>
                  <button onClick={() => props.adminControls.toggleMic()}>
                    <i
                      className={
                        props.participant?.audio
                          ? "icon-mic-btn2"
                          : "icon-mic-btn2-mute icon-btn--mute"
                      }
                    />
                  </button>
                  <button onClick={() => props.adminControls.toggleScreen()}>
                    <i
                      className={
                        props.participant?.screen
                          ? "icon-screen-share1 icon-btn--active"
                          : "icon-screen-share1"
                      }
                    />
                  </button>
                </div>
              </div>
            )}
            <div
              className={`${props.videoStyle.callingBox__video_wrapper} ${props.videoStyle.has_video}`}
            >
              {props.adminControls ? (
                <button
                  className={props.videoStyle.dots_btn}
                  onClick={() => props.adminControls.toggleAccess()}
                >
                  <i className="icon-times" />
                </button>
              ) : (
                props.self && (
                  <button
                    className={props.videoStyle.dots_btn}
                    onClick={() => props.cancelRequest()}
                  >
                    <i className="icon-times" />
                  </button>
                )
              )}
              {!audioTrack && (!props.participant.local || !props.isAudioOn) && (
                <div
                  style={{
                    color: "#fff",
                    zIndex: 5,
                    position: "absolute",
                    top: 0,
                    left: 0,
                    padding: "0.5rem",
                    fontSize: "1.25rem",
                  }}
                >
                  <i className="icon-mic-btn2-mute" />
                </div>
              )}

              {videoTrack ? (
                getVideoComponent()
              ) : (
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    background: "#111",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <div
                    style={{
                      height: "50%",
                      width: "auto",
                      aspectRatio: "1/1",
                      fontSize: "1.75rem",
                      borderRadius: "50%",
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      position: "relative",
                      background:
                        circleColors[props.tileIndex % circleColors.length],
                    }}
                  >
                    <div
                      className={
                        props.videoStyle.callingBox__translator_thumb_volume
                      }
                      style={{
                        transform: `scale(${Math.min(
                          1.0 + volume * 3.0,
                          1.5
                        )})`,
                      }}
                    ></div>
                    {props.participant &&
                      props.participant.user_name &&
                      getNameAbbreviation(props.participant?.user_name)}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      }
      {audioTrack && <>{getAudioComponent()}</>}
    </>
  );
}

export default VideoTile;
