import React, { useState, useContext, useEffect } from "react";
import { GoPrimitiveDot } from "react-icons/go";
import "../../Assets/css/NegotiationFormStyle/FruitChoice.css";
import { IoClose } from "react-icons/io5";
import { AiOutlineCheck } from "react-icons/ai";
import { CheckContext } from "./FormsContainer";
export const FruitChoice = ({ options }) => {
  const [selectFruit, setFruit] = useState(null);
  const {
    correctOption,
    setCorrect,
    rightSelection,
    wrongSelection,
    canInteract,
    currentScoreCard,
  } = useContext(CheckContext);
  function handleFruit(id) {
    if (!canInteract) {
      return;
    }
    setCorrect((prev) => (prev.some((ele) => ele === id) ? [] : [id]));
    setFruit((prev) => (prev === id ? null : id));
  }

  useEffect(() => {
    if (currentScoreCard) {
      setFruit(currentScoreCard.Selection[0]);
    }
  }, [currentScoreCard]);

  return (
    <>
      <div className="FruitChoiceContainer">
        {options.map((item) => (
          <Fruits
            key={item.key}
            option={item.option}
            selectFruit={selectFruit}
            handleFruit={handleFruit}
            rightSelection={rightSelection}
            wrongSelection={wrongSelection}
            correctOption={correctOption}
            id={item.key}
          />
        ))}
      </div>
    </>
  );
};

const Fruits = ({
  option,
  handleFruit,
  selectFruit,
  id,
  rightSelection,
  wrongSelection,
  correctOption,
}) => {
  // console.log(rightSelection);
  return (
    <>
      <div
        className={`selectFruit ${
          selectFruit === id
            ? rightSelection
              ? "selectionRight"
              : wrongSelection
              ? "selectionWrong"
              : "selectedFruit"
            : ""
        } 
        ${
          correctOption.indexOf(id) !== -1 &&
          wrongSelection &&
          "selectionRight_blink"
        }
        `}
        onClick={() => handleFruit(id)}
      >
        <p>{option}</p>

        <div
          className={`selectBtn 
          ${
            selectFruit === id
              ? "selectedOption_quiz"
              : // rightSelection
                //   ? "selectionRightIcon"
                //   : wrongSelection
                //   ? "selectionWrongIcon"
                //   : "selectedArrow"
                ""
          }
          `}
        >
          {selectFruit === id ? (
            rightSelection ? (
              <AiOutlineCheck />
            ) : wrongSelection ? (
              <IoClose />
            ) : (
              <GoPrimitiveDot />
            )
          ) : (
            ""
          )}
        </div>
      </div>
    </>
  );
};
