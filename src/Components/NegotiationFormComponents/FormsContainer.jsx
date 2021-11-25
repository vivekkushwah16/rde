import React, { useState, createContext, useEffect, useMemo } from "react";
import "../../Assets/css/NegotiationFormStyle/FormContainer.css";
import { FruitChoice } from "./FruitChoice";
import { MultipleChoiceCard } from "./MultipleChoiceCard";
import { PictureChoice } from "./PictureChoice";
import { RatingChoice } from "./RatingChoice";
import { RatingFruit } from "./RatingFruit";
import { IoIosArrowBack } from "react-icons/io";
import ScoreCard from "./ScoreCard";
export const CheckContext = createContext(null);

export const FormsContainer = ({
  id,
  question,
  currentForm,
  setForm,
  formLength,
  type,
  options,
  correctOption,
}) => {
  const [Score, setScore] = useState(false);
  const [Correct, setCorrect] = useState([]);
  const [ScoreData, setScoreData] = useState([]);
  const [rightSelection, setSelection] = useState(false);
  const [wrongSelection, setWrong] = useState(false);
  const [canInteract, toggleCanInteract] = useState(true);

  const currentScoreCard = useMemo(() => {
    let currentScoreCard = ScoreData.filter((item) => item.id === id);
    if (currentScoreCard.length > 0) {
      return currentScoreCard[0];
    } else {
      return null;
    }
  }, [ScoreData, id]);

  useEffect(() => {
    if (currentScoreCard) {
      let selection = currentScoreCard.Selection;
      setCorrect(selection);
      toggleCanInteract(false);
      if (selection.length > 0) {
        if (
          JSON.stringify(correctOption) === JSON.stringify(selection.sort())
        ) {
          setSelection(true);
          setWrong(false);
        } else {
          setSelection(false);
          setWrong(true);
        }
      }
    }
  }, [currentScoreCard]);

  let clearTime;

  useEffect(() => {
    if (currentScoreCard) {
      if (currentScoreCard.id === id) {
        return;
      }
    }
    setCorrect([]);
    setSelection(false);
    setWrong(false);
    toggleCanInteract(true);
  }, [id]);

  useEffect(() => {
    return () => clearImmediate(clearTime);
  }, [clearTime]);

  function showNextQuestion() {
    setForm((prev) => (prev < formLength ? prev + 1 : prev));
    if (id >= formLength) {
      setScore(true);
    }
  }

  function handleNext(selection) {
    if (!selection) {
      return;
    }
    if (!canInteract) {
      return;
    }
    if (selection.length > 0) {
      toggleCanInteract(false);
      if (JSON.stringify(correctOption) === JSON.stringify(selection.sort())) {
        setSelection(true);
        setScoreData((prev) => [
          ...prev,
          { id: id, check: true, Selection: selection },
        ]);
      } else {
        setWrong(true);
        setScoreData((prev) => [
          ...prev,
          { id: id, check: false, Selection: selection },
        ]);
      }
    }
  }
  // console.log("main ID", id);
  return (
    <CheckContext.Provider
      value={{
        correctOption,
        setCorrect,
        rightSelection,
        wrongSelection,
        canInteract,
        currentScoreCard,
      }}
    >
      {!Score ? (
        <div className="FormContainer">
          <div className="Question">
            <p>question {id}</p>
            <h1>{question}</h1>
          </div>
          <div className="allOptions">
            <Form key={id} type={type} options={options} />
          </div>

          <div className="ContainerFooter">
            {currentForm > 1 && (
              <div
                className="goBack"
                onClick={() => setForm((prev) => (prev > 1 ? prev - 1 : prev))}
              >
                <IoIosArrowBack /> Go back
              </div>
            )}
            {currentScoreCard ? (
              <div
                onClick={() => showNextQuestion()}
                className={`goNext`}
                style={{ backgroundColor: "rgba(234, 126, 51, 1)" }}
              >
                Next
              </div>
            ) : (
              <div
                onClick={() => handleNext(Correct)}
                className={`${canInteract ? "" : "disabled_submit"} goNext`}
              >
                Submit
              </div>
            )}
          </div>
        </div>
      ) : (
        <ScoreCard data={ScoreData} />
      )}
    </CheckContext.Provider>
  );
};
const Form = ({ type, options }) => {
  switch (type) {
    case "SingleChoice":
      return <FruitChoice options={options} />;

    case "Range":
      return <RatingFruit options={options} />;

    case "Rate":
      return <RatingChoice options={options} />;

    case "pictureChoice":
      return <PictureChoice options={options} />;

    case "multiChoice":
      return <MultipleChoiceCard options={options} />;
    default:
      return null;
  }
};
