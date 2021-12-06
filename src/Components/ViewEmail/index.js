import React, { useContext, useEffect, useMemo, useState } from "react";
import style from "../../Assets/css/global.module.css";
import banner from "../../Assets/svg/Frame.svg";
import "./style.css";
import CloseIcon from "../../Assets/svg/CloseIcon.js";
import { SlideContext } from "../RenderSlides";
import AudioIcon from "../../Assets/svg/AudioIcon";
import audio from "../../Assets/audio/audio.mp3";
import { useAudioHook } from "../useAudioHook";
function ViewEmail() {
  const { setSlide } = useContext(SlideContext);
  // const [play, setPlay] = useState(false);
  // const [audioTime,setAudioTime]=useState();
 
  const{handleAudio,audioTime,play}=useAudioHook(audio);
  const handleOpenEmail = () => {
    console.log("open");
  };
  return (
    <>
      <div className={style.wrapper2}>
        <img className={style.svg} src={banner} alt="banner" />
        <button
          className={`${style.button}  positionedBtn`}
          onClick={handleOpenEmail}
        >
          View
        </button>
        <button
          className={`${style.button} positionedBtn nextBTn`}
          onClick={handleOpenEmail}
        >
          View
        </button>

        <div onClick={()=>handleAudio(1)}>
          <AudioIcon
            className={`audio playAudio ${audioTime && "player "}`} Time={`${audioTime}s`} play={play} id={1} 
          />
        </div>

        <div>
          <CloseIcon className="CloseViewEmailSlide"onAction={() => setSlide(0)} />
        </div>
      </div>
    </>
  );
}

export default ViewEmail;
