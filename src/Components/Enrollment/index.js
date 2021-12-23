import React, { useContext } from "react";
import style from "../../Assets/css/global.module.css"
import Circle from "../Circle";
import { SlideContext } from "../RenderSlides"
import enroll from "../../Assets/Images/slides/enroll.jpg"
import "./style.css"
const Enrollment = () => {
  const {setSlide} = useContext(SlideContext)
  const handleTimeClick = () => {
    setSlide(1)
    console.log("clicked")
  }
  const handleCriticalLevelClick = () => {
    setSlide(2)
    console.log("clicked")
  }
  return (
    <>
      <div className={style.wrapper2}>
      <img className={style.svg} src={enroll} alt="" />
        
        <div className={` ${style.positionedCircle1} pulse `}>
          <Circle onAction={handleTimeClick} />
        </div>
        <div className={` ${style.positionedCircle2} pulse `}>
          <Circle onAction={handleCriticalLevelClick} />
        </div>
       
      </div>
    </>
  );
};

export default Enrollment;
