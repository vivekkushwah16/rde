import React, { useContext, useEffect, useState } from "react";
import { IntrectiveContex } from "../Intrective_Wraper";
import style from "./style.module.css";
import playLogo from "../../../Assets/Images/intrective/play.png";
import PatientsVideo from "../PatientsVideo";
const details =[
  {
    id:0,
    about:"Trying again does work!"
    
  },
  {
    id:1,
    about:"Patients who decided not to participate in trials often believed they’d made the right choice—but they were still open to future clinical trial opportunities. 75% of patients will consider participating in a trial if recommended by a doctor. By using clinical language and focusing on personal benefits for her patient, the doctor was able to recruit a patient for the trial who initially refused." 
    
    
  },
]
const PatientChoice = () => {
  const { slide, setSlide, data, setData, checkVideo,setCheckVideo } =
    useContext(IntrectiveContex);
    const[newData,setNewData]=useState()
  const[noBtn,setNoBtn]=useState(false);
 function handleVideoURL(url){
  setCheckVideo(true)
  setData({
    url:url
  })
  setNewData(details)
 }

  return (
    <>
      <section className={style.wrapper}>
        { !checkVideo ? (
          <div className={style.patients}>
            <h1>
            { !noBtn?  "If you were Dr. Smith, will you ask David to participate in the clinical trial again?" :"During the appointment, Dr. Smith did not mention about the clinical trial and David lost the chance to participate. Let’s see what happens if Dr. Smith tried again."}
            </h1>
            <div className={style.btnSection}>

            {!noBtn?<>
           <button
              className={style.playButton}
              onClick={() => handleVideoURL("https://media.istockphoto.com/videos/equality-march-fight-for-lgbtq-rights-rainbow-flags-banners-and-masks-video-id1304697099")}
            >
             Yes
            </button>
            <button
              className={style.playButton}
              onClick={() => setNoBtn(true)}
            >
             No  
            </button>
            </> :
              
            <button
              className={style.playButton}
              onClick={() => handleVideoURL("https://media.istockphoto.com/videos/climatic-strike-close-portrait-of-a-shorthaired-girl-the-student-her-video-id1203743518")}
            >
             <img src={playLogo} alt="play video by clicking on it" />
            </button>}
            </div>
          </div>
        ) : (
          <PatientsVideo url={data.url} newData={newData} />
        )}
      </section>
    </>
  );
};

export default PatientChoice;
