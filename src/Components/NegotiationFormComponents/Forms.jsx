import React, { useEffect, useState, useRef, useMemo } from "react";
import formsBgImage from "../../Assets/Images/NegotiationForm/7.png";
import "../../Assets/css/NegotiationFormStyle/Forms.css";
import { FormsContainer } from "./FormsContainer";
import { formsData2 } from "../../Constants/NegotiationFormData/FormsData";

export const Forms = ({ data }) => {
  let { formsData, formid } = data;
  const [currentForm, setForm] = useState(1);
  const formLength = formsData.length;
  const currentFormData = useMemo(() => {
    let farray = formsData.filter((item) => item.id == currentForm);
    if (farray.length > 0) {
      return farray[0];
    } else {
      return formsData[0];
    }
  }, [formsData, currentForm]);

  return (
    <>
      <div className="FormsWrapper">
        <div className="FormsBgImage">
          <img src={formsBgImage} alt="" />
        </div>
        <div className="FormsContent">
          <div>
            <FormsContainer
              currentForm={currentForm}
              setForm={setForm}
              formLength={formLength}
              id={currentFormData.id}
              type={currentFormData.type}
              question={currentFormData.question}
              options={currentFormData.options}
              correctOption={currentFormData.correct}
              QuestionCount={formsData.length}
            />
          </div>
        </div>
      </div>
    </>
  );
};
