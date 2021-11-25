import React, { useState, useEffect, useContext } from "react";
import { POLL_STATES } from "../../Constants/PollStates";
import { PollContext } from "../../Context/Poll/PollContextProvider";

export function PollResult(props) {
  const { index: currentIndex } = props;
  const { question, option: options } = props.data;
  // options.sort(function (a, b) {
  //   return a.id - b.id;
  // });

  return (
    <div className="pollBox__question">
      <h3 className="pollBox__title">{`Q${currentIndex + 1}. ${question}`}</h3>
      <ul className="pollBox__options">
        {Object.keys(options).map((optionKey) => {
          let option = options[optionKey]
          let response = props.data.response ? (props.data.response[optionKey] ? props.data.response[optionKey] : 0) : 0
          let totalCount = props.data.response ? (props.data.response.totalCount ? props.data.response.totalCount : 0) : 0
          let percentage = totalCount > 0 ? Math.floor((response / totalCount) * 100) : 0
          return (
            <li>
              <div className="custom-slider">
                <span className="custom-slider__text">{option}</span>
                <div className="custom-slider__bar">
                  <span className="custom-slider__mark">{`${response}/${percentage}%`}</span>
                  <div
                    className="custom-slider__bar-inner"
                    style={{
                      width: `${percentage}%`,
                    }}
                  ></div>
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  );
}

export function PollQuestion(props) {
  const { handleSubmit, checkIfAlreadyAnswered, index: currentIndex, eventId } = props;
  const { question, option: options, type, questionid } = props.data;
  // options?.sort(function (a, b) {
  //   return a.id - b.id;
  // });

  const [answer, setAnswer] = useState(checkIfAlreadyAnswered ? checkIfAlreadyAnswered.response : null);
  const [showError, setShowError] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState(checkIfAlreadyAnswered ? true : false);
  const [feedback, setFeedback] = useState(checkIfAlreadyAnswered ? checkIfAlreadyAnswered.response : "");

  useEffect(() => {
    if (checkIfAlreadyAnswered) {
      setAnswer(checkIfAlreadyAnswered.response);
    }
  }, [checkIfAlreadyAnswered]);

  const handleSubmitButton = (e) => {
    e.preventDefault();
    if (!answer) {
      setShowError(true);
      return;
    }
    setShowError(false);
    handleSubmit(questionid, answer, "poll");
  };

  const handleFeedbackSubmitButton = (e) => {
    e.preventDefault();
    if (!feedback) {
      setShowError(true);
      return;
    }
    setShowError(false);
    handleSubmit(questionid, feedback, "feedback");
    setFeedbackSuccess(true);
    // setFeedback("");
  };

  return (
    <div className="pollBox__question">
      {type === "poll" && (
        <form onSubmit={handleSubmitButton}>
          <h3 className="pollBox__title">{`Q${currentIndex + 1
            }. ${question}`}</h3>
          <ul className="pollBox__options">
            {Object.keys(options).map((optionKey, index) => {
              let option = options[optionKey]
              return (
                <li key={`option-${optionKey}`}>
                  <label
                    key={`checkbox-${optionKey}`}
                    className="custom-checkbox"
                  >
                    {`0${index + 1}.  ${option}`}
                    <input
                      type="radio"
                      name={optionKey}
                      checked={!answer ? false : optionKey === answer}
                      onChange={(e) => {
                        setShowError(false);
                        setAnswer(optionKey);
                      }}
                      disabled={checkIfAlreadyAnswered === null ? false : true}
                    />
                    <span className="custom-checkbox__icon icon-unchecked2"></span>
                  </label>
                </li>
              )
            })}
          </ul>
          {showError && (
            <>
              <div style={{ color: "red", marginBottom: "0rem" }}>
                * Please give some response first, to submit.
              </div>
              <br></br>
            </>
          )}
          <div style={{ textAlign: "center" }}>
            <button
              type="submit"
              className="btn btn-secondary"
              disabled={checkIfAlreadyAnswered === null ? false : true}
            >{`${checkIfAlreadyAnswered === null ? "Submit" : "Answered"
              }`}</button>
          </div>
        </form>
      )}

      {type === "feedback" && (
        <form onSubmit={handleFeedbackSubmitButton}>

          <div>
            <h3 className="pollBox__title">{`Q${currentIndex + 1
              }. ${question}`}</h3>
            {feedbackSuccess && (
              <div style={{ textAlign: "center", position: "relative" }}>
                <div className="success-positioning d-flex">
                  <div className="success-icon">
                    <div style={{
                      position: 'relative',
                      bottom: '7%',
                      left: '-5%',
                    }}>
                      <div className="success-icon__tip"></div>
                      <div className="success-icon__long"></div>
                    </div>
                  </div>
                </div>
                <h4>Response submitted successfully</h4>
              </div>
            )}
            <ul className="pollBox__options">
              <input
                type="text"
                placeholder="Write text here..."
                value={feedback}
                onChange={(e) => {
                  setShowError(false);
                  setFeedback(e.target.value);
                }}
                disabled={feedbackSuccess}
              />
            </ul>
            {showError && (
              <>
                <div style={{ color: "red", marginBottom: "0rem" }}>
                  * Please give some response first, to submit.
                </div>
                <br></br>
              </>
            )}
            {
              !feedbackSuccess &&
              <div style={{ textAlign: "center" }}>
                <button type="submit" className="btn btn-secondary">
                  Submit
                </button>
              </div>
            }

          </div>

        </form>
      )}
    </div>
  );
}

export function PollUser({ eventId }) {
  const { pollState, saveUserReponse } = useContext(PollContext)
  let visiblePollData = Object.values(pollState.questions)
  console.log(visiblePollData)
  let pollAnswerredData = pollState.userResponses

  const submitResponse = (pollId, option, type) => {
    return new Promise(async (res, rej) => {
      try {
        saveUserReponse(eventId, pollId, option, type, () => {
          console.log("Callback")
        })
        res();
      } catch (error) {
        rej(error);
      }
    });
  };


  return (
    <div className="sidebar__body">
      <div className="">
        <div className="pollBox__body">
          {visiblePollData && visiblePollData.length === 0 && (
            <div
              className="noVisiblePoll"
              style={{
                textAlign: "center",
                marginTop: "1rem",
              }}
            >
              {/* <h2>Answer polls and quizes</h2> */}
              <p>
                As soon as a poll is posted <br></br>you will be able to express
                your opinion.
              </p>
            </div>
          )}
          {visiblePollData &&
            visiblePollData.map((pollItem, index) => (
              <div
                className={`pollBox ${pollAnswerredData[pollItem.questionid] ? 'poll-answered' : ''}`}
                key={pollItem.questionid}
                style={{ overflow: "hidden" }}
              >
                {pollItem.status === POLL_STATES.showQuestion && (
                  <PollQuestion
                    data={pollItem}
                    handleSubmit={submitResponse}
                    checkIfAlreadyAnswered={pollAnswerredData[pollItem.questionid] ?? null}
                    index={index}
                    eventId={eventId}
                  />
                )}
                {pollItem.status === POLL_STATES.showResult && (
                  <PollResult data={pollItem} index={index} />
                )}
              </div>
            )
            )}
        </div>
      </div>
    </div >
  );
}
