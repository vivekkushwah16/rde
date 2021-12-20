import React, { createContext, useState } from "react";
import Details from "../Details";
import PatientChoice from "../PatientsChoice";
import PatientSelected from "../PatientSelected";
import PatientsSection from "../PatientsSection";
import PatientsVideo from "../PatientsVideo";
import style from "./style.module.css";
export const IntrectiveContex = createContext();
const Intrective_Wrapper = () => {
  const [slide, setSlide] = useState(0);
  const [data, setData] = useState(null);
  const [checkVideo, setCheckVideo] = useState(false);
  function handleClose() {
    setSlide(0);
    setData(null);
  }
  return (
    <IntrectiveContex.Provider
      value={{ slide, setSlide, data, setData, checkVideo, setCheckVideo }}
    >
      <section className={style.wrapper}>
        <SwitchComponents slide={slide} />
        <div className={style.close} onClick={() => handleClose()}>
          X Close
        </div>
      </section>
    </IntrectiveContex.Provider>
  );
};

function SwitchComponents({ slide }) {
  switch (slide) {
    case 0:
      return <PatientsSection />;

    case 1:
      return <PatientSelected />;
    case 2:
      return <PatientSelected />;
    case 3:
      return <Details />;
    case 4:
      return <PatientChoice />;
    case 5:
      return <Details />;
    default:
      return null;
  }
}

export default Intrective_Wrapper;
