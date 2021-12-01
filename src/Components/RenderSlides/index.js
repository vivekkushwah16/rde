import React, { createContext, useState } from "react";
import Enrollment from "../Enrollment";
import HcpOffice from "../HcpOffice";
import Office from "../Office";
import PatientsHome from "../PatientsHome";
import ViewEmail from "../ViewEmail";
export const slideContext = createContext(null);
function RenderSlides() {
  const [slide, setSlide] = useState(0);
  return (
    <slideContext.Provider value={ {setSlide }}>
      <SwitchComponents slide={slide} />
      {/* <Enrollment /> */}
    </slideContext.Provider>
  );
}


function SwitchComponents({ slide }) {
  switch (slide) {
    case 1:
      return <Enrollment />;
    case 0:
      return <ViewEmail />;
    case 3:
      return <Office />;
    case 4:
      return <HcpOffice />;
    case 5:
      return <PatientsHome />;
    default:
      return null;
  }
}
export default RenderSlides;
// export default SwitchComponents
