import { useContext, useEffect, useState } from "react";
import { ContentType } from "../../../Containers/MediaModal/MediaModal";
import { MediaModalContext } from "../../../Context/MediaModal/MediaModalContextProvider";

export default function DailyCoSettings({ data }) {
  const [inputVideoDeviceId, setInputVideoDeviceId] = useState();
  const [inputAudioDeviceId, setInputAudioDeviceId] = useState();
  const [outputAudioDeviceId, setOutputAudioDeviceId] = useState();
  const [applyingSettings, setApplyingSettings] = useState(false);

  useEffect(() => {
    if (
      data.currDevices &&
      data.currDevices.camera &&
      data.currDevices.camera.deviceId !== inputVideoDeviceId
    ) {
      setInputVideoDeviceId(data.currDevices.camera.deviceId);
    } else if (!inputVideoDeviceId) {
      if (data && data.videoInputDevices && data.videoInputDevices.length > 0) {
        setInputVideoDeviceId(data.videoInputDevices[0].deviceId);
      }
    }

    if (
      data.currDevices &&
      data.currDevices.mic &&
      data.currDevices.mic.deviceId !== inputAudioDeviceId
    ) {
      setInputAudioDeviceId(data.currDevices.mic.deviceId);
    } else if (!inputAudioDeviceId) {
      if (data && data.audioInputDevices && data.audioInputDevices.length > 0) {
        setInputAudioDeviceId(data.audioInputDevices[0].deviceId);
      }
    }

    if (
      data.currDevices &&
      data.currDevices.speaker &&
      data.currDevices.speaker.deviceId !== outputAudioDeviceId
    ) {
      setOutputAudioDeviceId(data.currDevices.mic.deviceId);
    } else if (!outputAudioDeviceId) {
      if (
        data &&
        data.audioOutputDevices &&
        data.audioOutputDevices.length > 0
      ) {
        setInputAudioDeviceId(data.audioOutputDevices[0].deviceId);
      }
    }
  }, [data]);

  const handleAudioChange = (event) => {
    if (!event) return;

    setInputAudioDeviceId(event.target.value);
  };

  const handleVideoChange = (event) => {
    if (!event) return;

    setInputVideoDeviceId(event.target.value);
  };

  const applySettings = async () => {
    if (data.hasJoinedCall && data.callFrame) {
      setApplyingSettings(true);
      let updatedDevices = await data.callFrame.setInputDevicesAsync({
        audioDeviceId: inputAudioDeviceId,
        videoDeviceId: inputVideoDeviceId,
      });
      console.log("updatedDevices", updatedDevices);
      data.closeModal();
      setApplyingSettings(false);
    }
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "#222",
        color: "white",
        fontSize: "1.75rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <h2 style={{ marginBottom: "5rem" }}>Camera and Microphone Settings</h2>
      <div style={{ marginBottom: "0.5rem" }}>Camera</div>
      <div>
        <select
          id="videoDevices"
          style={{
            backgroundColor: "#222",
            color: "white",
            borderRadius: "4px",
            marginBottom: "3rem",
          }}
          value={inputVideoDeviceId}
          onChange={handleVideoChange}
        >
          {data &&
            data.videoInputDevices &&
            data.videoInputDevices.map((videoInput) => (
              <option key={videoInput.deviceId} value={videoInput.deviceId}>
                {videoInput.label}
              </option>
            ))}
        </select>
      </div>

      <div style={{ marginBottom: "0.5rem" }}>Microphone</div>
      <div>
        <select
          id="audioDevices"
          style={{
            backgroundColor: "#222",
            color: "white",
            borderRadius: "4px",
            marginBottom: "1rem",
          }}
          value={inputAudioDeviceId}
          onChange={handleAudioChange}
        >
          {data &&
            data.audioInputDevices &&
            data.audioInputDevices.map((audioInput) => (
              <option key={audioInput.deviceId} value={audioInput.deviceId}>
                {audioInput.label}
              </option>
            ))}
        </select>
      </div>
      <button
        style={{
          backgroundColor: "#222",
          color: "white",
          border: "solid 1px white",
          borderRadius: "4px",
          padding: "0.5rem 2rem",
          marginTop: "2rem",
        }}
        disabled={applyingSettings}
        onClick={applySettings}
      >
        Save
      </button>
    </div>
  );
}
