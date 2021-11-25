import React, { useState } from "react";
import { HiStar } from "react-icons/hi";
import "../../Assets/css/NegotiationFormStyle/RatingChoice.css";
export const RatingChoice = () => {
  const StarsNum = [1, 2, 3, 4, 5];
  const [checked, setChecked] = useState(-1);
  function handleChecked(item) {
    setChecked((prev) => (prev === item ? -1 : item));
  }
  return (
    <>
      <div className="RatingChoiceContainer">
        {StarsNum.map((item) => (
          <div onClick={() => handleChecked(item)} key={item} className="Stars">
            <input type="checkbox" />
            <span
              className={`selectedStar ${item <= checked && "checkedStar"}`}
            >
              <HiStar id="star" />
            </span>
          </div>
        ))}
      </div>
    </>
  );
};
