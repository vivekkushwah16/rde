import React from "react";
import style from "../../Assets/css/global.module.css";
import banner from "../../Assets/svg/Frame.svg"
import "./style.css"
import CloseIcon from "../../Assets/svg/CloseIcon.js"
const handleOpenEmail=()=>{
  console.log("open")
}
function ViewEmail() {
  return (
    <>
      <div className={style.wrapper}>
       <img className={style.svg} src={banner} alt="banner" />
       <button className={`${style.button}  positionedBtn`} onClick={handleOpenEmail}>View</button>
       <button className={`${style.button} positionedBtn nextBTn`} onClick={handleOpenEmail}>View</button>
       {/* <article className={"emailWrapper"}>
       <button className={style.closebutton}></button>
       </article> */}
       <div  >
          <CloseIcon  className={style.Close} />
        </div>
      </div>
    </>
  );
}

export default ViewEmail;
