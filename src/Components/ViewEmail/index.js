import React, { useContext, useState } from "react";
import style from "../../Assets/css/global.module.css";
import banner from "../../Assets/Images/slides/banner.jpg";
import "./style.css";
import CloseIcon from "../../Assets/svg/CloseIcon.js";
import { SlideContext } from "../RenderSlides";
import AudioIcon from "../../Assets/svg/AudioIcon";
import audio from "../../Assets/audio/Audio/1. Email Reflection.wav";
import { useAudioHook } from "../useAudioHook";
import email1 from "../../Assets/Images/slides/email1.png"
import email2 from "../../Assets/Images/slides/email2.jpg"
import closeMail from "../../Assets/Images/slides/closeEmail.png"
function ViewEmail() {
  const { setSlide } = useContext(SlideContext);
  const[openMail,setMail]=useState(null)
  // const [play, setPlay] = useState(false);
  // const [audioTime,setAudioTime]=useState();
 
  const{handleAudio,audioTime,play}=useAudioHook(audio);
  const handleOpenEmail = (mail) => {
    console.log("..............")
   setMail(mail)
  };
  return (
    <>
      <div className={style.wrapper2}>
        <img className={style.svg} src={banner} alt="banner" />
        <div className="mailWrapper">
       {openMail &&  <img className="mail" src={openMail} alt="email" />}
       {openMail &&  <img className="closeMail" src={closeMail} alt="close email" onClick={()=>handleOpenEmail(null)} />}
        </div>
          

        <button
          className={`${style.button}  positionedBtn`}
          onClick={()=>handleOpenEmail(email1)}
        >
          View
        </button>
        <button
          className={`${style.button} positionedBtn nextBTn`}
          onClick={()=>handleOpenEmail(email2)}
        >
          View
        </button>

        <div onClick={()=>handleAudio(1)}>
          <AudioIcon
            className={`audio playAudio ${audioTime && "player "}`} Time={`${audioTime}s`} play={play} id={1} 
          />
        </div>

        <div>
          <CloseIcon className="CloseViewEmailSlide" onAction={() => setSlide(0)} />
        </div>
      </div>
    </>
  );
}

export default ViewEmail;
