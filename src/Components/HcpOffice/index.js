import React,{useContext, useState} from "react";
import style from "../../Assets/css/global.module.css";
import banner from "../../Assets/svg/hcp.svg";
// import audio from "../../Assets/Images/Group 1516.png";
import CloseIcon from "../../Assets/svg/CloseIcon.js"
import { SlideContext } from "../RenderSlides";
import audio from "../../Assets/audio/audio.mp3";
import audio2 from "../../Assets/audio/audio2.mp3";
import "./style.css";
import AudioIcon from "../../Assets/svg/AudioIcon";
import { useAudioHook } from "../useAudioHook";
function HcpOffice() {
  
  const {setSlide}=useContext(SlideContext)
  const{handleAudio,audioTime,play}=useAudioHook(audio);
  const{handleAudio:handleAudio2,audioTime:audioTime2,play:play2}=useAudioHook(audio2);
  
  return (
    <>
      <section className={style.wrapper2}>
        <img className={style.svg} src={banner} alt="background" />
        
        <div onClick={()=>handleAudio(1)}>
          <AudioIcon className={`audio1 playAudio ${audioTime && "player "}`} Time={`${audioTime}s`} play={play} id={1} />
        </div>
        <div onClick={()=>handleAudio2(2)}>
          <AudioIcon className={`audio2 playAudio ${audioTime2 && "player "}`} Time={`${audioTime2}s`}  play={play2} id={2} /> 
        </div>
        
        <div className={style["footer"]}>
          <button  className={`${style.footerBtn} ${style.secondaryBtn}`} >
            <svg className={style.icon}
              width="19"
              height="18"
              viewBox="0 0 19 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9.61005 0.109375C9.3868 0.109375 9.16573 0.153398 8.95947 0.238831C8.75322 0.324264 8.56582 0.44944 8.40796 0.6073C8.2501 0.765159 8.12492 0.95256 8.03949 1.15881C7.95406 1.36507 7.91003 1.58614 7.91003 1.80939V16.1294C7.91003 16.5803 8.08915 17.0127 8.40796 17.3315C8.72677 17.6503 9.15918 17.8294 9.61005 17.8294C10.0609 17.8294 10.4933 17.6503 10.8121 17.3315C11.1309 17.0127 11.3101 16.5803 11.3101 16.1294V1.80939C11.3101 1.58614 11.2661 1.36507 11.1807 1.15881C11.0952 0.95256 10.97 0.765159 10.8121 0.6073C10.6543 0.44944 10.4669 0.324264 10.2606 0.238831C10.0544 0.153398 9.83329 0.109375 9.61005 0.109375Z"
                 fill="#F17922"
              />
              <path
                d="M0.75 8.96954C0.75 9.42041 0.929113 9.85282 1.24792 10.1716C1.56674 10.4904 1.99914 10.6696 2.45001 10.6696H16.77C17.2209 10.6696 17.6533 10.4904 17.9721 10.1716C18.2909 9.85282 18.47 9.42041 18.47 8.96954C18.47 8.51868 18.2909 8.08627 17.9721 7.76746C17.6533 7.44864 17.2209 7.26953 16.77 7.26953H2.45001C1.99914 7.26953 1.56674 7.44864 1.24792 7.76746C0.929113 8.08627 0.75 8.51868 0.75 8.96954Z"
                 fill="#F17922"
              />
            </svg>
          HCP<br/>Office
          </button>

          <svg className={style.icon}
            width="23"
            height="13"
            viewBox="0 0 23 13"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0.119995 5.88958C0.119995 6.34045 0.299108 6.77286 0.61792 7.09167C0.936732 7.41048 1.36914 7.5896 1.82001 7.5896H16.12C16.5709 7.5896 17.0033 7.41048 17.3221 7.09167C17.6409 6.77286 17.82 6.34045 17.82 5.88958C17.82 5.43871 17.6409 5.00631 17.3221 4.6875C17.0033 4.36868 16.5709 4.18957 16.12 4.18957H1.83997C1.61504 4.18692 1.39186 4.22898 1.18329 4.31323C0.974721 4.39748 0.784923 4.52223 0.624939 4.68035C0.464955 4.83848 0.337963 5.0268 0.251282 5.23437C0.164601 5.44194 0.11998 5.66464 0.119995 5.88958Z"
              fill="#F17922"
            />
            <path
              d="M13.35 0.0800781V12.0801L22.35 6.08008L13.35 0.0800781Z"
              fill="#F17922"
            />
          </svg>
          <button className={style.footerBtn} onClick={()=>setSlide(4)}  >
            <svg className={style.icon}
              width="20"
              height="19"
              viewBox="0 0 20 19"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3.76001 9.47064L9.85999 3.6106C9.88519 3.58428 9.91546 3.56338 9.94897 3.54907C9.98249 3.53476 10.0186 3.52734 10.055 3.52734C10.0914 3.52734 10.1275 3.53476 10.161 3.54907C10.1945 3.56338 10.2248 3.58428 10.25 3.6106L16.25 9.47064L16.45 9.64062L16.54 9.85065V18.5406C16.54 18.6149 16.5105 18.6861 16.458 18.7386C16.4055 18.7911 16.3343 18.8206 16.26 18.8206H11.94V13.5406C11.94 13.4664 11.9105 13.3952 11.858 13.3427C11.8055 13.2901 11.7342 13.2606 11.66 13.2606H8.37C8.29573 13.2606 8.22451 13.2901 8.172 13.3427C8.11949 13.3952 8.08997 13.4664 8.08997 13.5406V18.8206H3.77002C3.69576 18.8206 3.62453 18.7911 3.57202 18.7386C3.51951 18.6861 3.48999 18.6149 3.48999 18.5406V9.8006L3.58997 9.59064L3.71997 9.46063L3.76001 9.47064Z"
                fill="white"
              />
              <path
                d="M10.0599 2.16931L1.7199 10.0893C1.60815 10.1725 1.46984 10.2118 1.33104 10.2C1.19225 10.1881 1.06261 10.1258 0.966602 10.0249C0.870594 9.92397 0.81484 9.79138 0.809925 9.65216C0.805011 9.51295 0.851278 9.37674 0.93993 9.26929L9.66991 0.989258C9.77272 0.888483 9.91096 0.832031 10.0549 0.832031C10.1989 0.832031 10.3371 0.888483 10.4399 0.989258L19.1699 9.26929C19.2786 9.3714 19.3424 9.51253 19.3471 9.66162C19.3518 9.81071 19.297 9.95553 19.1949 10.0643C19.0928 10.173 18.9517 10.2368 18.8026 10.2415C18.6535 10.2461 18.5087 10.1914 18.4 10.0893L10.0599 2.16931Z"
                fill="white"
              />
            </svg>
          Patients<br/>home
          </button>
        </div>
        <div  >
          <CloseIcon  className={style.Close2} onAction={()=>setSlide(0)}/>
        </div>
      </section>
    </>
  );
}

export default HcpOffice;
