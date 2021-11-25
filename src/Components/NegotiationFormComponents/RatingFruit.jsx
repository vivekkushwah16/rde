import React, { useState } from "react";
import "../../Assets/css/NegotiationFormStyle/RatingFruit.css";
import RLDD from "react-list-drag-and-drop/lib/RLDD";
export const RatingFruit = ({ options }) => {
  const [option, setOption] = useState(options);
  return (
    <>
      <div className="RatingContainer">
        <RLDD
          items={option}
          itemRenderer={(event) => {
            return (
              <div key={event.id} className="RatingFruit">
                {event.option}
              </div>
            );
          }}
          onChange={(newOptions) => setOption(newOptions)}
        />
      </div>
    </>
  );
};
