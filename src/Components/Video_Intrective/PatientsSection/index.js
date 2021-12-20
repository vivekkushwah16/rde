import React, { useContext } from "react";
import style from "./style.module.css";
import { IntrectiveContex } from "../Intrective_Wraper";
export const patients = [
  {
    id: 0,
    name: "Sarah",
    url: "https://media.istockphoto.com/videos/equality-march-fight-for-lgbtq-rights-rainbow-flags-banners-and-masks-video-id1304697099",
   
  },
  {
    id: 1,
    name: "David",
  
    url: "https://media.istockphoto.com/videos/climatic-strike-close-portrait-of-a-shorthaired-girl-the-student-her-video-id1203743518",
  },
];
const PatientsSection = () => {
  const { setSlide, setData,setCheckVideo } = useContext(IntrectiveContex);
  function handlePatientSelection(id) {
    setSlide((prev) => prev + 1);
    // setData(patients.filter((item) => item.id == id)[0]);
    setData({id:id})
    setCheckVideo(true)
  }
  return (
    <>
      <section className={style.wrapper}>
        {patients.map((item) => (
          <div
            key={item.id}
            className={style.patients}
            onClick={() => handlePatientSelection(item.id)}
          >
            <h1>Patient A</h1>
            <h2>{item.name}</h2>
          </div>
        ))}
      </section>
    </>
  );
};

export default PatientsSection;
