import React, { useContext, useEffect, useState } from "react";
import { IntrectiveContex } from "../Intrective_Wraper";
import style from "./style.module.css";
import playLogo from "../../../Assets/Images/intrective/play.png";
import PatientsVideo from "../PatientsVideo";
import { patients } from "../PatientsSection";
import { details } from "../Details";

const PatientSelected = () => {
  const { slide, setSlide, data, setData, checkVideo } =
    useContext(IntrectiveContex);
  const [playVideo, setPlayVideo] = useState(true);
  const[newData,setNewData]=useState()
  useEffect(() => {
    if (checkVideo) {
      setData((prev) => patients.filter((item) => item.id === prev.id)[0]);
      setNewData( patients.filter((item) => item.id !== data.id)[0])
    } else {
     setNewData(details);
      setPlayVideo(true)
    }
  }, [checkVideo]);
  return (
    <>
      <section className={style.wrapper}>
        {playVideo ? (
          <div className={style.patients}>
            {checkVideo ? (
              <h1>
                {` Monday afternoon 1pm, Dr. Smith has a Zoom appointment with 
             ${data.name}.
            Let’s see how it goes.`}
              </h1>
            ) : (
              <h1>
                {` Monday afternoon 5pm, Dr. Smith has a Zoom appointment with ${data.name}. Let’s see how what happens. 
`}
              </h1>
            )}
            <button
              className={style.playButton}
              onClick={() => setPlayVideo(false)}
            >
              <img src={playLogo} alt="play video by clicking on it" />
            </button>
          </div>
        ) : (
          <PatientsVideo url={data.url} newData={newData} />
        )}
      </section>
    </>
  );
};

export default PatientSelected;
