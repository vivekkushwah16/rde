import React, { useState } from "react";
import { GoPrimitiveDot } from "react-icons/go";
import "../../Assets/css/NegotiationFormStyle/PictureCard.css";
export const PictureChoice = ({ options }) => {
  const [selectFruitPicture, setFruitPicture] = useState(null);
  return (
    <>
      <div className="PictureChoice">
        {options.map((item) => (
          <ChoiceCard
            key={item.key}
            id={item.key}
            image={item.image}
            option={item.option}
            selectFruitPicture={selectFruitPicture}
            setFruitPicture={setFruitPicture}
          />
        ))}
      </div>
    </>
  );
};
const ChoiceCard = ({
  id,
  image,
  option,
  setFruitPicture,
  selectFruitPicture,
}) => {
  return (
    <div
      className={`cardChoice ${
        selectFruitPicture === id ? "cardChoiceSelected" : null
      }`}
      onClick={() => setFruitPicture((prev) => (prev === id ? null : id))}
    >
      <div className="cardImage">
        <img src={image} alt="" />
      </div>
      <div className="SelectPictureCard">
        <p>{option}</p>
        <span
          className={`${
            selectFruitPicture === id ? "SelectPictureCardIcon" : null
          }`}
        >
          {selectFruitPicture === id && <GoPrimitiveDot />}
        </span>
      </div>
    </div>
  );
};
