import React, { useContext } from "react";
import style from "../../Assets/css/global.module.css";
import banner from "../../Assets/svg/GettyImages-1295782888 1.svg"
import aboutPage from "../../Assets/Images/Group 1511.png"
import CloseIcon from "../../Assets/svg/CloseIcon.js"
import { SlideContext } from "../RenderSlides";
import "./style.css"
function Office() {
  const {setSlide}=useContext(SlideContext)
  return (
    <>
      <section className={style.wrapper2}>
      <img className={style.svg} src={banner} alt="background" />
      <div className={style.Container}>
        <img className="aboutImg" src={aboutPage} alt="summary" />
        <button className={style.button} onClick={()=>setSlide(3)} >Start</button>
      </div>
      <div  >
          <CloseIcon  className="CloseOfficeSlide" onAction={()=>setSlide(0)}/>
        </div>
      </section>
    </>
  )
}

export default Office
