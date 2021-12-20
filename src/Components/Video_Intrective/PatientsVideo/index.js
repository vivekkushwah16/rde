import React, { useContext } from "react";
import style from "./style.module.css";
import { IntrectiveContex } from "../Intrective_Wraper";
import { patients } from "../PatientsSection";
const PatientsVideo = ({url,newData}) => {
  const { setSlide,setData ,setCheckVideo} = useContext(IntrectiveContex);

  const handleVideo=()=>{
    setSlide((prev)=>prev+1)
    setCheckVideo(false)
    setData(newData)
  }
  return (
    <>
      <section className={style.wrapper}>
        <video  autoPlay onEnded={handleVideo} controls>
          <source src={url} type="video/mp4" />
          <source src={url} type="video/ogg" />
          Your browser does not support the video tag.
        </video>
      </section>
    </>
  );
};

export default PatientsVideo;
