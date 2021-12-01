import React from 'react'
import style from "../../Assets/css/global.module.css";
import banner from "../../Assets/svg/GettyImages-1295782888 1.svg"
import aboutPage from "../../Assets/Images/Group 1511.png"
import "./style.css"
function Office() {
  return (
    <>
      <section className={style.wrapper}>
      <img className={style.svg} src={banner} alt="background" />
      <div className={style.Container}>
        <img className="aboutImg" src={aboutPage} alt="summary" />
        <button className={style.button}>Start</button>
      </div>
      </section>
    </>
  )
}

export default Office
