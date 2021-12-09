import React, { useState } from "react";
import Style from "./Perspective.module.css";
function PersPective({ x, y, maskID, blurBanner, banner, SpexSvg,flag }) {
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
        style={{ background: `url(${blurBanner}) 100% 100%` }}
      >
        <div
          className={Style.glass}
          style={{
            opacity: `${opacity}`,
            background: `url(${banner}) 100% 100%`,
            clipPath: ` url(#${maskID})`,
          }}
        ></div>

        <SpexSvg
          style={{
            transform: `translate(${xOffset}px,${yOffset}px) scale(0.6)`,
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
