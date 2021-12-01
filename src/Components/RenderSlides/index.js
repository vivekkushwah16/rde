import React, { createContext, useState } from "react";
import Enrollment from "../Enrollment";
import HcpOffice from "../HcpOffice";
import Office from "../Office";
import PatientsHome from "../PatientsHome";
import ViewEmail from "../ViewEmail";

export const SlideContext = createContext(null);

function RenderSlides() {
  const [slide, setSlide] = useState(0);
  return (
    <SlideContext.Provider value={{ setSlide }}>
      <SwitchComponents slide={slide} />
      {/* <Enrollment /> */}
    </SlideContext.Provider>
  );
}


function SwitchComponents({ slide }) {
  switch (slide) {
    case 0:
      return <Enrollment />;
    case 1:
      return <ViewEmail />;
    case 2:
      return <Office />;
    case 3:
      return <HcpOffice />;
    case 4:
      return <PatientsHome />;
    default:
      return null;
  }
}
export default RenderSlides;
// export default SwitchComponents
