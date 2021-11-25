import React, { useState, useContext, useEffect } from "react";
import { AiOutlineCheck } from "react-icons/ai";
import "../../Assets/css/NegotiationFormStyle/MultipleChoiceCard.css";
import { GoPrimitiveDot } from "react-icons/go";
import { IoClose } from "react-icons/io5";
import { CheckContext } from "./FormsContainer";
export const MultipleChoiceCard = ({ options }) => {
  return (
    <>
      <div className="multipleChoiceWrapper">
        {options.map((item) => (
          <MultipleChoice key={item.key} option={item.option} id={item.key} />
        ))}
      </div>
    </>
  );
};

const MultipleChoice = ({ option, id }) => {
  const [selectOptions, setOption] = useState(false);
  const {
    correctOption,
    setCorrect,
    rightSelection,
    wrongSelection,
    canInteract,
    currentScoreCard,
  } = useContext(CheckContext);
  // const [rightSelection, setSelection] = useState(false);
  // const [wrongSelection, setWrong] = useState(false);
  useEffect(() => {
    if (currentScoreCard) {
      setOption(currentScoreCard.Selection.indexOf(id) !== -1);
    }
  }, [currentScoreCard]);

  function handleSelection() {
    if (!canInteract) {
      return;
    }
    setCorrect((prv) =>
      prv.some((ele) => ele === id)
        ? prv.filter((ele) => ele !== id)
        : [...prv, id]
    );
    setOption(!selectOptions);
  }

  return (
    <>
      <div
        className={`multipleChoiceContent 
       
        ${
          selectOptions
            ? rightSelection || wrongSelection
              ? correctOption.indexOf(id) !== -1
                ? "selectionRight"
                : "selectionWrong"
              : "selectedMultipleChoiceContent"
            : ""
        }
        ${
          !selectOptions && correctOption.indexOf(id) !== -1 && wrongSelection
            ? "selectionRight_blink"
            : ""
        }
        `}
      >
        <input type="checkbox" onChange={handleSelection} />
        <div
          className={`selectContent ${
            selectOptions && (rightSelection || wrongSelection)
              ? "selectedContent"
              : ""
          }`}
        >
          <p>{option}</p>

          <span
            className={` ${
              selectOptions
                ? "selectedOption_quiz"
                : // ? rightSelection
                  //   ? "selectionRightIcon"
                  //   : wrongSelection && !correctOption.includes(id)
                  //   ? "selectionWrongIcon"
                  //   : "selectedArrow"
                  ""
            } `}
          >
            {selectOptions ? (
              rightSelection ? (
                <AiOutlineCheck />
              ) : wrongSelection ? (
                correctOption.indexOf(id) !== -1 ? (
                  <AiOutlineCheck />
                ) : (
                  <IoClose />
                )
              ) : (
                <GoPrimitiveDot />
              )
            ) : (
              ""
            )}
          </span>
        </div>
      </div>
    </>
  );
};
