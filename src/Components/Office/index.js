import React, { useContext } from "react";
import style from "../../Assets/css/global.module.css";
import banner from "../../Assets/Images/slides/banner2.jpg"
import aboutPage from "../../Assets/Images/slides/office.png"
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
        <button className={`${style.button} positionBtn`} onClick={()=>setSlide(3)} >Start</button>
      </div>
      <div  >
          <CloseIcon  className="CloseViewEmailSlide" onAction={()=>setSlide(0)}/>
        </div>
      </section>
    </>
  )
}

export default Office
