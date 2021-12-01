import React, { useContext,useState } from "react";
import style from "../../Assets/css/global.module.css";
import banner from "../../Assets/svg/Frame.svg";
import "./style.css";
import CloseIcon from "../../Assets/svg/CloseIcon.js";
import { SlideContext } from "../RenderSlides";
import AudioIcon from "../../Assets/svg/AudioIcon";

function ViewEmail() {
  const { setSlide } = useContext(SlideContext);
  const[play,setPlay]=useState(false)
  const handleOpenEmail = () => {
    console.log("open");
  };
  return (
    <>
      <div className={style.wrapper}>
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
        
        <div onClick={()=>setPlay(true)}>
          <AudioIcon className={`audio playAudio ${play && "startLoader"}`} />
        </div>

        <div>
          <CloseIcon className={style.Close} onAction={() => setSlide(0)} />
        </div>
      </div>
    </>
  );
}

export default ViewEmail;
