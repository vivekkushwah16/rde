import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

function AudioTile(props) {
  const audioEl = useRef(null);
  const [volume, setVolume] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  // const [volumeDelta, setVolumeDelta] = useState(0);
  const intervalObj = useRef(null);

  let participantData = props.participant;

  const audioTrack = useMemo(() => {
    console.log(participantData.tracks);
    return participantData.tracks &&
      participantData.tracks.audio &&
      participantData.tracks.audio.state === "playable"
      ? participantData.audioTrack
      : null;
  }, [props.participant.tracks.audio]);

  /**
   * When audio track changes, update audio srcObject
   */
  useEffect(() => {
    audioEl.current &&
      (audioEl.current.srcObject = new MediaStream([audioTrack]));
  }, [audioTrack]);

  useEffect(() => {
    intervalObj.current = setInterval(
      async () => getParticipantAudioLevel(props.participant.session_id),
      500
    );

    return () => {
      console.log("cleaned up");
      clearInterval(intervalObj.current);
    };
  }, []);

  const circleColors = [
    "linear-gradient(0deg, #538995, #538995)",
    "linear-gradient(0deg, #535E95, #535E95)",
    "linear-gradient(0deg, #705395, #705395)",
  ];

  function getAudioComponent() {
    return (
      !props.participant.local &&
      audioTrack && <audio id={"audio_" + props.participant.user_id} autoPlay playsInline ref={audioEl} muted={isMuted} />
    );
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

      // let audioLevelDelta = (audioLevel - volume) / volume;
      // if (audioLevelDelta < 0) audioLevelDelta = 0;
      setVolume(audioLevel);
      // setVolumeDelta(audioLevelDelta);
    } catch (e) {
      console.error(e);
    }
  };

  let userName = "";
  let isTranslator = false;
  if (props.participant && props.participant.user_name) {
    userName = props.participant.user_name.replace("_$translator", "");
    isTranslator = props.participant.user_name.includes("_$translator");
  }

  return (
    <>
      {
        !props.onlyAudio &&
        <div
          className={props.callingStyles.callingBox__translator}
          style={{
            display: "flex",
            alignItems: "center",
            height: "5.5rem",
            width: "17rem",
            background: isTranslator ? "#3C4A8F" : "#505050",
            minHeight: "auto",
          }}
        >
          {/* {props.adminControls && (
            <div
              className={props.callingStyles.callingBox__translator__live}
              style={{ position: "absolute", top: 0, left: "1rem" }}
            >
              <span>Live</span>
            </div>
          )} */}
          <div
            className={props.callingStyles.callingBox__translator_thumb}
            style={{
              background: isTranslator
                ? "#2D3456"
                : circleColors[props.tileIndex % circleColors.length],
              margin: "0.75rem 1rem",
            }}
          >
            <div
              className={
                props.callingStyles.callingBox__translator_thumb_volume
              }
              style={{
                transform: `scale(${Math.min(1.0 + volume * 3.0, 1.35)})`,
              }}
            ></div>
            {props.participant &&
              props.participant.user_name &&
              getNameAbbreviation(userName)}
          </div>
          <div style={{ flexGrow: "1", textAlign: "left", margin: "0.5rem" }}>
            {userName}
            {props.self && " (Me)"}
            <br />
            <div className="mg-t10">
              {isTranslator ? "Translator" : "Participant"}
            </div>
          </div>
          {!props.self &&
            (props.participant.user_name.includes("_$translator") ? (
              <div
                className="mg-r10"
                style={{ cursor: "pointer" }}
                onClick={() => setIsMuted(!isMuted)}
              >
                {isMuted ? (
                  <i
                    className="icon-mic-btn2-mute icon-btn--mute"
                    style={{ fontSize: "2.0rem" }}
                  />
                ) : (
                  <i
                    className="icon-mic-btn2"
                    style={{ fontSize: "1.85rem" }}
                  />
                )}
              </div>
            ) : (
              props.adminControls && (
                <div
                  className="mg-r10"
                  style={{ cursor: "pointer" }}
                  onClick={() => props.adminControls.toggleMic()}
                >
                  <i
                    className="icon-mic-btn2"
                    style={{ fontSize: "1.85rem" }}
                  />
                </div>
              )
            ))}
          {/* {props.adminControls &&
            !props.participant.user_name.includes("_$translator") && (
              <div className="text-center pd-t10 pd-b10">
                <button
                  className={props.callingStyles.callingBox__translator_btn2}
                  onClick={() => props.adminControls.toggleMic()}
                >
                  <i className="icon-mic-btn2 "></i>
                </button>
              </div>
            )} */}
        </div>
      }
      {!props.self && audioTrack && <>{getAudioComponent()}</>}
    </>
  );
}

export default AudioTile;
