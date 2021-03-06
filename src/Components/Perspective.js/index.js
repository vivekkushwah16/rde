import React, { useState } from "react";
import Style from "./Perspective.module.css";
function PersPective({ x, y, maskID, blurBanner, banner, Spex,flag }) {
  const [xOffset, setXoffset] = useState(null);
  const [yOffset, setYoffset] = useState(null);
  const [opacity, setOpacity] = useState(0);
  const handleMouseMove = (e) => {
   
    setXoffset(e.clientX - x);
    setYoffset(e.clientY - y);
    if (opacity === 0) {
      setOpacity(1);
    }
  };
  return (
    <>
      <section
        className={Style.wrapper}
        onMouseMove={handleMouseMove}
        style={{ backgroundImage: `url(${blurBanner})` }}
      >
        <div
          className={Style.glass}
          style={{
            opacity: `${opacity}`,
            backgroundImage: `url(${banner})`,
            clipPath: ` url(#${maskID})`,
          }}
        ></div>

        <Spex
          style={{
            transform: `translate(${xOffset}px,${yOffset}px) `,
            opacity: `${opacity}`,
            transformOrigin: "center",
          }}
          maskID={maskID}
          flag={flag}
        />
      </section>
    </>
  );
}

export default PersPective;
