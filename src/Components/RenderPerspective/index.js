import React, { useState } from "react";
import PersPective from "../Perspective.js";
import { perspectivePurple,perspectiveBrown,perspectiveBlack} from "../../Constants/PersPectiveData";

import Style from "./Style.module.css";
import Black from "../SpexFrames/Black"
import Brown from "../SpexFrames/Brown"
import Purple from "../SpexFrames/Purple"
//Perspective Data

const RenderPerspective = () => {
  const flag="Black";
  const [frame, setFrame] = useState(1);
  const frameData =  flag === "Black" ? perspectiveBlack  : flag === "Brown" ? perspectiveBrown :perspectivePurple
  const spexFrame =  flag === "Black" ?  Black : flag === "Brown" ? Brown : Purple

  function handleFrame(id) {
    
    setFrame(id);
  }
  return (
    <>
      <div>
        <nav className={Style.navBar}>
          <h1 className={Style.pageHeading}>{flag === "Black" ? "Sponsor’s Perspective" : flag === "Brown" ? "Site’s Perspective" :"Patient’s Perspective"} </h1>
          <div className={Style.navOptions}>
            <p>
              Move the glasses around to see the full picture. When you have
              
              finished exploring, click to see another patient’s perspective
            </p>
            {frameData.map((item) => (
              <button
                onClick={() => handleFrame(item.key)}
                className={`${Style.CircleBtn} ${
                  frame === item.key && Style.active
                }`}
              >
                {item.key}
              </button>
            ))}
            {/* <button onClick={()=>handleFrame(2)} className={`${Style.CircleBtn} ${frame ===2 && Style.active}`}>2</button>
            <button onClick={()=>handleFrame(3)} className={`${Style.CircleBtn} ${frame ===3 && Style.active}`}>3</button> */}
            <button  className={Style.OFFBtn}>
              <svg
                width="66"
                height="24"
                viewBox="0 0 66 24"
                fill="none"
                className={Style.SpexIcon}
              >
                <path
                  d="M62.197 5.01324C58.4053 -1.00774 37.6108 -0.757479 35.5889 8.21679H29.7377C27.7158 -0.757479 6.92119 -1.00774 3.12947 5.01324C1.97104 4.63425 0.190544 4.4644 0.058254 6.92071C-0.0740361 9.35913 1.54921 10.0438 2.79524 10.228C3.9787 17.638 9.19702 25.1428 18.1874 23.0673C26.3161 21.192 29.1441 16.6154 29.777 12.3732H35.5495C36.1841 16.6154 39.0123 21.192 47.141 23.0673C56.1314 25.1428 61.3479 17.638 62.5313 10.228C63.7791 10.0438 65.4006 9.35913 65.2683 6.92071C65.136 4.4644 63.3554 4.63425 62.197 5.01324ZM17.6671 20.1765C10.098 21.9249 6.16682 14.4273 6.16682 8.38483C6.16682 2.34239 25.6027 1.97954 26.257 9.91336C26.5538 13.4959 25.2381 18.4299 17.6671 20.1765ZM47.6594 20.1765C40.0885 18.4299 38.7745 13.4959 39.0695 9.91336C39.7238 1.97954 59.1615 2.34239 59.1615 8.38483C59.1615 14.4273 55.2304 21.9249 47.6594 20.1765Z"
                  fill="white"
                />
              </svg>
              OFF
            </button>
          </div>
        </nav>

        {frameData.map(
          (item) =>
            frame === item.key && (
              <PersPective
                key={item.key}
                x="700"
                y="160"
                maskID="glass"
                id={item.key}
                setFrame={setFrame}
                frame={frame}
                blurBanner={item.blurImage}
                banner={item.clearImage}
                Spex={spexFrame}
                flag={flag}
              />
            )
        )}
      </div>
    </>
  );
};

export default RenderPerspective;
