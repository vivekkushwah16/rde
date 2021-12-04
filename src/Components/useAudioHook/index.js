import React, { useMemo, useEffect, useState } from "react";
// import audio from "../../Assets/audio/audio.mp3";
export const useAudioHook = (audio) => {
  const [play, setPlay] = useState(null);
  const [audioTime, setAudioTime] = useState();
  const audioFile = useMemo(() => {
    return new Audio(audio);
  }, [audio]);
  useEffect(() => {
    return () => {
      audioFile.pause();
    };
  }, [audioFile]);

  function handleAudio(id) {
    setPlay((prv) => (prv === id ? null : id));
    if (audioFile.paused) {
      audioFile.play();
      setAudioTime(audioFile.duration);
      console.log(audioFile.duration);
      console.log(audioFile.paused);
     
    } else {
      audioFile.pause();
      console.log(audioFile.currentTime);
    }
  }
  audioFile.addEventListener("ended", () => {
    setPlay(null);
    console.log("current");
    audioFile.currentTime = 0;
  });
  audioFile.addEventListener("progress", (e) => {
    if(!e){

      setPlay(null);
      console.log("current");
    }
    else{
      console.log("loaded")
    }
    // audioFile.currentTime = 0;
  });
  return {
    handleAudio,
    audioTime,
    play,
  };
};
