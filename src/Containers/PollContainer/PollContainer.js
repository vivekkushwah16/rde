import React, { useContext, useEffect, useState } from "react";
import { POLL_STATES } from "../../Constants/PollStates";
import { PollUser } from "../../Components/Poll";
import { UserContext } from "../../Context/Auth/UserContextProvider";
import { PollManager } from "../../Managers/PollManager";

import "./PollContainer.css";
// import { ChatContext } from "../../Context/Chat/ChatContextProvider";
// import { getByPlaceholderText } from "@testing-library/react";
export default function PollContainer(props) {
  // const { pollRawData } = useContext(ChatContext)
  const { id: eventId, isPollUser, pollAnalytics } = props;
  const { user } = useContext(UserContext);
  const [pollAnswerredData, setPollAnswerredData] = useState({});

  const [pollData, setPollData] = useState(null);
  const [pollForm, setPollForm] = useState([]);
  const [isPollFormOpen, setIsPollFormOpen] = useState(false);

  const [isFeedbackExpand, setIsFeedbackExpand] = useState();
  const [pollFeedback, setPollFeedback] = useState([]);
  const [isPollFeedback, setIsPollFeedback] = useState(false);

  const [createNewPollbtnOpen, setCreateNewPollbtnOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState({
    open: false,
    id: null,
    type: "",
  });

  // useEffect(() => {
  //   if (pollRawData) {
  //     setPollData(sortData(pollRawData));
  //     getAllPollAnsweredDataForCurrentUser(pollRawData);
  //     setLoading(false);
  //   }
  // }, [pollRawData])

  useEffect(() => {
    getPoll();
    return () => {
      PollManager.removePollListener();
    };
  }, []);

  const submitResponse = (pollId, option, type) => {
    return new Promise(async (res, rej) => {
      try {
        await PollManager.addResponse(
          eventId,
          pollId,
          user.uid,
          user.displayName,
          option,
          type
        );
        // pollAnalytics(pollId, option.id);
        setPollAnswerredData({ ...pollAnswerredData, [pollId]: option });
        res();
      } catch (error) {
        rej(error);
      }
    });
  };

  const getAllPollAnsweredDataForCurrentUser = async (data) => {
    if (data.length > 0) {
      let _pollAnswerredData = {};
      for (let i = 0; i < data.length; i++) {
        let res = await checkIfAlreadyAnswered(data[i].id);
        _pollAnswerredData = {
          ..._pollAnswerredData,
          [data[i].id]: res,
        };
      }
      setPollAnswerredData(_pollAnswerredData);
    }
  };

  const checkIfAlreadyAnswered = (pollId) => {
    return new Promise(async (res, rej) => {
      try {
        const pollIds = Object.keys(pollAnswerredData);
        if (pollIds.indexOf(pollId) !== -1) {
          // console.log(pollIds[pollId])
          res(pollIds[pollId]);
        }
        const result = await PollManager.getPollResponse(pollId, user?.uid);
        if (result) {
          res(result);
        } else {
          res(null);
        }
      } catch (error) {
        rej(error);
      }
    });
  };

  let visiblePollData = null;
  if (pollData) {
    visiblePollData = pollData.filter(
      (item) => item.state !== POLL_STATES.hide
    ); //pass index also
  }
  const getPoll = () => {
    setLoading(true);
    PollManager.attachPollListener(eventId, (data, err) => {
      if (err) {
        setLoading(false);
        // console.log(err)
        return;
      }
      setPollData(sortData(data));
      getAllPollAnsweredDataForCurrentUser(data);
      setLoading(false);
    });
  };
  const handleformSubmit = async (type, id, updatedData) => {
    // handling save button
    if (type === "save") {
      // extracting current form data from form array
      let form = pollForm.filter((data, ind) => ind === id);
      if (!form[0].question) {
        return;
      }
      if (pollForm.length <= 1) {
        setIsPollFormOpen(false);
      }

      return new Promise(async (res, rej) => {
        try {
          await PollManager.addPollQuestion("multiple", form[0], eventId);
          // updating saved form data array
          getPoll();//=
          let newForm = pollForm.filter((data, ind) => ind !== id);
          // removing that form from form array
          // newForm.sort((a, b) => a - b);
          setPollForm(newForm);
          res();
        } catch (error) {
          setIsPollFormOpen(true);
          rej(error);
        }
      });
    }
    if (type === "publish") {
      const result = await PollManager.publishPollQuestion(id, {
        state: updatedData,
      });
      if (result === "success") {
        let allForms = pollData.filter((data) => data.id !== id);
        let form = pollData.filter((data) => data.id === id);
        form[0].state = updatedData;
        allForms.push(form[0]);
        setPollData(sortData(allForms));
      }
    }
    if (type === "showResult") {
      const result = await PollManager.publishPollQuestion(id, {
        state: updatedData,
      });
      if (result === "success") {
        let allForms = pollData.filter((data) => data.id !== id);
        let form = pollData.filter((data) => data.id === id);
        form[0].state = updatedData;
        allForms.push(form[0]);
        setPollData(sortData(allForms));
      }
    }
  };
  const handleMultipleChoice = () => {
    setPollForm([
      {
        question: "",
        option1: "",
        option2: "",
        option3: "",
        option4: "",
      },
      ...pollForm,
    ]);
    setIsPollFormOpen(true);
    setCreateNewPollbtnOpen(false);
    return;
  };

  const handleFeedback = () => {
    setPollFeedback([
      {
        question: "",
      },
      ...pollFeedback,
    ]);
    setIsPollFeedback(true);
    setCreateNewPollbtnOpen(false);
    return;
  };
  const handleDeleteFeedbackPoll = async (type, id) => {
    if (type === "unpublish") {
      if (pollFeedback.length > 1) {
        let form = pollFeedback.filter((data, ind) => ind !== id);
        setPollFeedback(form);
      } else {
        setPollFeedback([]);
      }
    }
    if (type === "publish") {
      const result = await PollManager.removePollQuestion(id);
      if (result === "success") {
        let form = pollFeedback.filter((data) => data.id !== id);
        setPollData(sortData(form));
      }
    }
    setShowDeleteModal({ open: false, id: null, type: "" });
  };
  const handleFeedBackSubmit = async (type, id, updatedData) => {
    // handling save button
    if (type === "save") {
      // extracting current form data from form array
      let form = pollFeedback.filter((data, ind) => ind === id);
      if (!form[0].question) {
        return;
      }
      if (pollFeedback.length <= 1) {
        setIsPollFeedback(false);
      }

      return new Promise(async (res, rej) => {
        try {
          await PollManager.addPollQuestion("feedback", form[0], eventId);
          // updating saved form data array
          getPoll();//=
          let newForm = pollFeedback.filter((data, ind) => ind !== id);
          // removing that form from form array
          // newForm.sort((a, b) => a - b);
          setPollFeedback(newForm);
          res();
        } catch (error) {
          setIsPollFeedback(true);
          rej(error);
        }
      });
    }
    if (type === "publish") {
      const result = await PollManager.publishPollQuestion(id, {
        state: updatedData,
      });
      if (result === "success") {
        let allForms = pollData.filter((data) => data.id !== id);
        let form = pollData.filter((data) => data.id === id);
        form[0].state = updatedData;
        allForms.push(form[0]);
        setPollData(sortData(allForms));
      }
    }
    if (type === "showResult") {
      const result = await PollManager.publishPollQuestion(id, {
        state: updatedData,
      });
      if (result === "success") {
        let allForms = pollData.filter((data) => data.id !== id);
        let form = pollData.filter((data) => data.id === id);
        form[0].state = updatedData;
        allForms.push(form[0]);
        setPollData(sortData(allForms));
      }
    }
  };
  const handleDeletePoll = async (type, id) => {
    if (type === "unpublish") {
      if (pollForm.length > 1) {
        let form = pollForm.filter((data, ind) => ind !== id);
        setPollForm(form);
      } else {
        setPollForm([]);
      }
    }
    if (type === "publish") {
      const result = await PollManager.removePollQuestion(id);
      if (result === "success") {
        let form = pollData.filter((data) => data.id !== id);
        setPollData(sortData(form));
      }
    }
    setShowDeleteModal({ open: false, id: null, type: "" });
  };

  const updateItem = (type, index, whichvalue, newvalue) => {
    if (type === "multiple") {
      let g = pollForm[index];
      g[whichvalue] = newvalue;
      if (index === -1) {
        // handle error
        console.log("no match");
      } else
        setPollForm([
          ...pollForm.slice(0, index),
          g,
          ...pollForm.slice(index + 1),
        ]);
    }
    if (type === "feedback") {
      let g = pollFeedback[index];
      g[whichvalue] = newvalue;
      if (index === -1) {
        // handle error
        console.log("no match");
      } else
        setPollFeedback([
          ...pollFeedback.slice(0, index),
          g,
          ...pollFeedback.slice(index + 1),
        ]);
    }
  };

  const sortData = (data) => {
    let sorted = data.sort((a, b) => (a.timestamp >= b.timestamp ? -1 : 1));
    return sorted;
  };
  return (
    <>
      {!isPollUser ? (
        <div className="communityBox__body">
          <div className="poll-form-container">
            <div style={{ position: "relative" }}>
              <button
                className={`poll-btn ${createNewPollbtnOpen && "pbh"}`}
                onClick={() => setCreateNewPollbtnOpen(!createNewPollbtnOpen)}
              >
                + Create new Poll
              </button>
              {createNewPollbtnOpen && (
                <div className="create-new-btn-optns">
                  <div onClick={() => handleMultipleChoice()}>
                    Multiple Choice
                  </div>
                  <div onClick={() => handleFeedback()}>Feedback</div>
                </div>
              )}
            </div>
            {/* Poll Form Start */}
            {isPollFormOpen &&
              pollForm?.map((data, index) => (
                <div className="poll-form" key={index}>
                  <button
                    className="poll-btn"
                    // onClick={() => handleDeletePoll("unpublish", index)}
                    onClick={() =>
                      setShowDeleteModal({
                        open: true,
                        id: index,
                        type: "unpublish",
                        formType: "multiple",
                      })
                    }
                    style={{
                      border: "1px solid black",
                      alignSelf: "flex-end",
                    }}
                  >
                    <img
                      src={
                        process.env.PUBLIC_URL +
                        "assets/images/icons/delete.svg"
                      }
                      alt="delete"
                      height="10px"
                      style={{ display: "inline-block", paddingRight: "5px" }}
                    />
                    Delete Poll
                  </button>
                  <input
                    autoFocus
                    type="text"
                    placeholder="Add question text"
                    value={data.question}
                    onChange={(e) =>
                      updateItem("multiple", index, "question", e.target.value)
                    }
                    required
                  />
                  <input
                    type="text"
                    placeholder="Option 1"
                    value={data.option1}
                    onChange={(e) =>
                      updateItem("multiple", index, "option1", e.target.value)
                    }
                  />
                  <input
                    type="text"
                    placeholder="Option 2"
                    value={data.option2}
                    onChange={(e) =>
                      updateItem("multiple", index, "option2", e.target.value)
                    }
                  />
                  <input
                    type="text"
                    placeholder="Option 3"
                    value={data.option3}
                    onChange={(e) =>
                      updateItem("multiple", index, "option3", e.target.value)
                    }
                  />
                  <input
                    type="text"
                    placeholder="Option 4"
                    value={data.option4}
                    onChange={(e) =>
                      updateItem("multiple", index, "option4", e.target.value)
                    }
                  />
                  <button
                    className="poll-btn"
                    onClick={() => handleformSubmit("save", index)}
                    style={{ border: "1px solid black", alignSelf: "center" }}
                  >
                    Save Poll
                  </button>
                </div>
              ))}
            {/* end of Poll Form */}
            {/* Feedback form start */}
            {isPollFeedback &&
              pollFeedback?.map((data, index) => (
                <div className="poll-form" key={index}>
                  <button
                    className="poll-btn"
                    // onClick={() => handleDeletePoll("unpublish", index)}
                    onClick={() =>
                      setShowDeleteModal({
                        open: true,
                        id: index,
                        type: "unpublish",
                        formType: "feedback",
                      })
                    }
                    style={{
                      border: "1px solid black",
                      alignSelf: "flex-end",
                    }}
                  >
                    <img
                      src={
                        process.env.PUBLIC_URL +
                        "assets/images/icons/delete.svg"
                      }
                      alt="delete"
                      height="10px"
                      style={{ display: "inline-block", paddingRight: "5px" }}
                    />
                    Delete Poll
                  </button>
                  <input
                    autoFocus
                    type="text"
                    placeholder="Add question text"
                    value={data.question}
                    onChange={(e) =>
                      updateItem("feedback", index, "question", e.target.value)
                    }
                    required
                  />

                  <button
                    className="poll-btn"
                    onClick={() => handleFeedBackSubmit("save", index)}
                    style={{ border: "1px solid black", alignSelf: "center" }}
                  >
                    Save Poll
                  </button>
                </div>
              ))}
            {/* End of feedback form */}
          </div>
          {loading && <div style={{ marginTop: "1rem" }}>Please wait...</div>}
          {pollData &&
            pollData.map((data, index) => (
              <div key={data.id} className="poll-form poll-form-data">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignSelf: data.state === POLL_STATES.hide && "flex-end",
                  }}
                >
                  {data.state !== POLL_STATES.hide && (
                    <div className="live-text" style={{ fontWeight: 600 }}>
                      <div className="live-mark"></div>
                      LIVE NOW
                    </div>
                  )}
                  <button
                    className="poll-btn"
                    onClick={() =>
                      setShowDeleteModal({
                        open: true,
                        id: data.id,
                        type: "publish",
                        formType: "multiple",
                      })
                    }
                    // onClick={() => handleDeletePoll("publish", data.id)}
                    style={{
                      border: "1px solid black",
                    }}
                  >
                    <img
                      src={
                        process.env.PUBLIC_URL +
                        "assets/images/icons/delete.svg"
                      }
                      alt="delete"
                      height="10px"
                      style={{ display: "inline-block", paddingRight: "5px" }}
                    />
                    Delete Poll
                  </button>
                </div>
                <p
                  style={{
                    paddingTop: "10px",
                    marginBottom: "25px",
                    fontWeight: 600,
                  }}
                >
                  {`Q${pollData.length - index}. ${data.question}`}
                  {data.feedbacks && (
                    <span
                      style={{ float: "right", cursor: "pointer" }}
                      onClick={() =>
                        isFeedbackExpand
                          ? setIsFeedbackExpand("")
                          : setIsFeedbackExpand(pollData.length - index)
                      }
                    >
                      {!isFeedbackExpand ? (
                        <img
                          src={
                            process.env.PUBLIC_URL +
                            "assets/images/icons/chevrondown.svg"
                          }
                          alt="down"
                          height="15px"
                        />
                      ) : (
                        <img
                          src={
                            process.env.PUBLIC_URL +
                            "assets/images/icons/chevronup.svg"
                          }
                          alt="down"
                          height="15px"
                        />
                      )}
                    </span>
                  )}
                </p>
                <div style={{ maxHeight: "200px", overflow: "auto" }}>
                  {data?.feedbacks?.length === 0 && (
                    <div
                      style={{
                        display:
                          isFeedbackExpand === pollData.length - index
                            ? "block"
                            : "none",
                        textAlign: "center",
                      }}
                    >
                      No feedback
                    </div>
                  )}
                  {data?.feedbacks?.map((feedback) => (
                    <li
                      key={feedback.date}
                      className="poll-ans-list"
                      style={{
                        display:
                          isFeedbackExpand === pollData.length - index
                            ? "list-item"
                            : "none",
                      }}
                    >
                      {feedback.feedback}
                    </li>
                  ))}
                </div>
                {data?.options?.map((option, index) => (
                  <div key={index} className="poll-ans-list">
                    <span>{`0${index + 1}. `}</span> {option.value}
                    {data.state === POLL_STATES.showResult && (
                      <div
                        className="custom-slider"
                        style={{ padingLeft: "6%" }}
                      >
                        {/* <span className="custom-slider__text">
                        {option.value}
                      </span> */}
                        <div className="custom-slider__bar">
                          <span className="custom-slider__mark">{`${data.totalResponse > 0
                            ? Math.floor((option.response / data.totalResponse) * 100)
                            : 0
                            }%`}</span>
                          <div
                            className="custom-slider__bar-inner"
                            style={{
                              width: `${data.totalResponse > 0
                                ? Math.floor((option.response / data.totalResponse) * 100)
                                : 0
                                }%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <button
                    className="poll-btn"
                    onClick={() =>
                      handleformSubmit(
                        "publish",
                        data.id,
                        data.state === POLL_STATES.showQuestion
                          ? POLL_STATES.hide
                          : POLL_STATES.showQuestion
                      )
                    }
                    style={{
                      border: "1px solid black",
                      fontWeight: "700",
                    }}
                  >
                    {data.state === POLL_STATES.showQuestion
                      ? "Unpublish"
                      : "Publish Poll"}
                  </button>
                  {
                    // data.state !== POLL_STATES.hide && 
                    !data.feedbacks && (
                      <button
                        className="poll-btn"
                        onClick={() =>
                          handleformSubmit(
                            "showResult",
                            data.id,
                            data.state === POLL_STATES.showResult
                              ? POLL_STATES.hide
                              : POLL_STATES.showResult
                          )
                        }
                        style={{
                          border: "1px solid black",
                          fontWeight: "700",
                        }}
                      >
                        {(data.state === POLL_STATES.hide || data.state === POLL_STATES.showQuestion) ? "Show Result" : "Hide Result"}
                      </button>
                    )}
                </div>
              </div>
            ))}
          {showDeleteModal.open && (
            <DeleteModal
              type={showDeleteModal.type}
              id={showDeleteModal.id}
              formType={showDeleteModal.formType}
              handleDeletePoll={handleDeletePoll}
              handleDeleteFeedbackPoll={handleDeleteFeedbackPoll}
              setShowDeleteModal={setShowDeleteModal}
            />
          )}
        </div>
      ) : (
        <PollUser
          visiblePollData={visiblePollData}
          submitResponse={submitResponse}
          pollAnswerredData={pollAnswerredData}
        />
      )}
    </>
  );
}
const DeleteModal = ({
  handleDeletePoll,
  type,
  id,
  formType,
  handleDeleteFeedbackPoll,
  setShowDeleteModal,
}) => {
  return (
    <div className="dlt-mdl">
      <div className="dlt-mdl-bdy">
        <div style={{ fontWeight: 700 }}>
          By deleting this poll you will loose all associated data and results.
        </div>
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          <button
            className="poll-btn"
            onClick={() =>
              setShowDeleteModal({ open: false, id: null, type: "" })
            }
            style={{
              border: "1px solid black",
            }}
          >
            Not Now
          </button>
          <button
            className="poll-btn"
            onClick={() =>
              formType === "feedback"
                ? handleDeleteFeedbackPoll(type, id)
                : formType === "multiple"
                  ? handleDeletePoll(type, id)
                  : null
            }
            style={{
              border: "1px solid black",
            }}
          >
            Delete Poll
          </button>
        </div>
      </div>
    </div>
  );
};
