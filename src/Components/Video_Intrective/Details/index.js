import React, { useContext, useEffect, useState } from "react";
import { IntrectiveContex } from "../Intrective_Wraper";
import style from "./style.module.css";
import playLogo from "../../../Assets/Images/intrective/play.png";
import PatientsVideo from "../PatientsVideo";
export const details = [
  {
    id: 0,
    about:
      "  There is a different between how Dr. Smith talks to Sarah and David. Our research has investigated the reasons behind.",
  },
  {
    id: 1,
    about:
      "Only 44% of assumed clinically eligible patients are offered a clinical trial. One reason for this is underlying bias in the recruiting process. When the doctor was speaking to the first patient, her use of clinical language to describe the trial showed her that it was both scientifically sound and personally beneficial for the patient. But when the doctor spoke with the second patient, she used more general language to describe the clinical trial based on the assumption that he had a lower level of health literacy due to his race and accent. One barrier doctors face when recruiting underrepresented patients is mistrust in the medical system; using specific language conveys respect for the patient, which in turn builds trust",
  },
  {
    id: 2,
    about:
      "After learning about the best practice, Dr Smith is expecting another visit from David. Let’s see what happens this time. ",
  },
];

const Details = () => {
  const { checkVideo, setCheckVideo, setData, data } =
    useContext(IntrectiveContex);
  const [nextBtn, setNextBtn] = useState(0);

  function handleNext(url) {
   
      if (data.length - 1 > nextBtn) {
        setNextBtn((prev) => prev + 1);
      } else {
        if(data.length >2){

          setCheckVideo(true);
          setData({
            url: url,
          });
        }
    
    }
  }
  return (
    <>
      <section className={style.wrapper}>
        {!checkVideo ? (
          <div className={style.patients}>
            {data.map((item) => (
              <h1 key={item.id}>{item.id === nextBtn && item.about}</h1>
            ))}
            <button
              className={style.playButton}
              onClick={() =>
                handleNext(
                  "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4"
                )
              }
            >
              {nextBtn < data.length - 1 || data.length === 2 ? (
                "Next"
              ) : (
                <img src={playLogo} alt="play video by clicking on it" />
              )}
            </button>
          </div>
        ) : (
          <PatientsVideo url={data.url} />
        )}
      </section>
    </>
  );
};

export default Details;
