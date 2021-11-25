import React, { useContext, useMemo, useReducer, useState } from 'react'
import { PollManager } from '../../Managers/PollManager';
import uniqid from 'uniqid';
import { PollContext } from '../../Context/Poll/PollContextProvider';
import { POLL_STATES } from '../../Constants/PollStates';
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
                                : formType === "poll"
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

const QUESTION_STATE_TYPE = {
    "Edit": 0,
    "Preview": 1
}

const pollBuilderReducer = (state, { key, value }) => {
    return {
        ...state,
        [key]: value
    }
}

const FeedbackBuilder = ({ data, handleformSubmit }) => {
    const [state, dispatch] = useReducer(pollBuilderReducer, {
        question: data.question,
        type: data.type,
        questionid: data.questionid,
        option: {}
    })

    const updateItem = (key, value) => {
        dispatch({
            key, value
        })
    }

    return (
        <>
            <div className="poll-form" key={data.questionid + 'editmode'}>

                <input
                    autoFocus
                    type="text"
                    placeholder="Add question text"
                    value={state.question}
                    onChange={(e) =>
                        updateItem("question", e.target.value)
                    }
                    required
                />

                <button
                    className="poll-btn"
                    onClick={() =>
                        handleformSubmit("update", data.questionid, state)
                    }
                    style={{ border: "1px solid black", alignSelf: "center" }}
                >
                    Save Poll
                </button>
            </div>
        </>
    )
}

const PollBuilder = ({ data, handleformSubmit }) => {
    const [state, dispatch] = useReducer(pollBuilderReducer, {
        question: data.question,
        ...data.option,
        type: data.type,
        questionid: data.questionid
    })

    const updateItem = (key, value) => {
        dispatch({
            key, value
        })
    }
    return (
        <>
            <div className="poll-form" key={data.questionid + 'editmode'}>
                <input
                    autoFocus
                    type="text"
                    placeholder="Add question text"
                    value={state.question}
                    onChange={(e) =>
                        updateItem("question", e.target.value)
                    }
                    required
                />
                <input
                    type="text"
                    placeholder="Option 1"
                    value={state.option1}
                    onChange={(e) =>
                        updateItem("option1", e.target.value)
                    }
                />
                <input
                    type="text"
                    placeholder="Option 2"
                    value={state.option2}
                    onChange={(e) =>
                        updateItem("option2", e.target.value)
                    }
                />
                <input
                    type="text"
                    placeholder="Option 3"
                    value={state.option3}
                    onChange={(e) =>
                        updateItem("option3", e.target.value)
                    }
                />
                <input
                    type="text"
                    placeholder="Option 4"
                    value={state.option4}
                    onChange={(e) =>
                        updateItem("option4", e.target.value)
                    }
                />
                <button
                    className="poll-btn"
                    onClick={() => {
                        handleformSubmit("update", data.questionid, state)
                    }}
                    style={{ border: "1px solid black", alignSelf: "center" }}
                >
                    Update Poll
                </button>
            </div>
        </>
    )
}

const QuestionHeader = ({ data, handleDelete, handleStateToggle, questionState, showEdit }) => {
    return (
        <div
            style={{
                display: "flex",
                justifyContent: "space-between",
                alignSelf: data.status === POLL_STATES.hide && "flex-end",
            }}
        >
            {data.status !== POLL_STATES.hide && (
                <div className="live-text" style={{ fontWeight: 600 }}>
                    <div className="live-mark"></div>
                    LIVE NOW
                </div>
            )}
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                {
                    showEdit &&
                    <button
                        className="poll-btn"
                        onClick={handleStateToggle}
                        style={{
                            border: "1px solid black",
                            marginRight: '0.5rem'
                        }}
                    >
                        {questionState === QUESTION_STATE_TYPE.Edit ? 'Cancel' : 'Edit'}
                    </button>
                }
                <button
                    className="poll-btn"
                    onClick={handleDelete}
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
                    Delete
                </button>
            </div>

        </div>
    )
}

const FeedbackQuestion = ({ questionLength, data, handleformSubmit, handleDelete, isFeedbackExpand, setIsFeedbackExpand, index }) => {
    const [questionState, setQuestionState] = useState(QUESTION_STATE_TYPE.Preview)
    return (
        <>
            <QuestionHeader data={data} handleDelete={handleDelete} handleStateToggle={() => setQuestionState(prev => {
                if (prev === QUESTION_STATE_TYPE.Edit) {
                    return QUESTION_STATE_TYPE.Preview
                } else {
                    return QUESTION_STATE_TYPE.Edit
                }
            })} questionState={questionState} showEdit />
            {
                questionState === QUESTION_STATE_TYPE.Preview &&
                <>
                    <p
                        style={{
                            paddingTop: "10px",
                            marginBottom: "25px",
                            fontWeight: 600,
                        }}
                    >
                        {`Q${index + 1}. ${data.question}`}
                        {data?.response?.feedbacks && (
                            <span
                                style={{ float: "right", cursor: "pointer" }}
                                onClick={() =>
                                    isFeedbackExpand
                                        ? setIsFeedbackExpand("")
                                        : setIsFeedbackExpand(questionLength - index)
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
                        {data?.response?.feedbacks?.length === 0 && (
                            <div
                                style={{
                                    display:
                                        isFeedbackExpand === questionLength - index
                                            ? "block"
                                            : "none",
                                    textAlign: "center",
                                }}
                            >
                                No feedback
                            </div>
                        )}
                        {data?.response?.feedbacks?.map((feedback) => (
                            <li
                                key={feedback.date}
                                className="poll-ans-list"
                                style={{
                                    display:
                                        isFeedbackExpand === questionLength - index
                                            ? "list-item"
                                            : "none",
                                }}
                            >
                                {feedback}
                            </li>
                        ))}
                    </div>
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
                                    data.questionid,
                                    data.status === POLL_STATES.showQuestion
                                        ? POLL_STATES.hide
                                        : POLL_STATES.showQuestion
                                )
                            }
                            style={{
                                border: "1px solid black",
                                fontWeight: "700",
                            }}
                        >
                            {data.status === POLL_STATES.showQuestion
                                ? "Unpublish"
                                : "Publish Feedback"}
                        </button>
                    </div>
                </>
            }
            {
                questionState === QUESTION_STATE_TYPE.Edit &&
                <FeedbackBuilder data={data} handleformSubmit={(type, id, data) => {
                    handleformSubmit(type, id, data)
                    setQuestionState(QUESTION_STATE_TYPE.Preview)
                }} />
            }
        </>
    )
}


const PollQuestion = ({ questionLength, data, handleDelete, handleformSubmit, index }) => {
    const [questionState, setQuestionState] = useState(QUESTION_STATE_TYPE.Preview)
    return (
        <>
            <QuestionHeader data={data} handleDelete={handleDelete} handleStateToggle={() => setQuestionState(prev => {
                if (prev === QUESTION_STATE_TYPE.Edit) {
                    return QUESTION_STATE_TYPE.Preview
                } else {
                    return QUESTION_STATE_TYPE.Edit
                }
            })} questionState={questionState} showEdit />
            {
                questionState === QUESTION_STATE_TYPE.Preview &&
                <>
                    <p
                        style={{
                            paddingTop: "10px",
                            marginBottom: "25px",
                            fontWeight: 600,
                        }}
                    >
                        {`Q${index + 1}. ${data.question}`}
                    </p>
                    {Object.keys(data.option).map((optionKey, index) => {
                        let option = data.option[optionKey]
                        let response = data.response ? (data.response[optionKey] ? data.response[optionKey] : 0) : 0
                        let totalCount = data.response ? (data.response.totalCount ? data.response.totalCount : 0) : 0
                        let percentage = totalCount > 0 ? Math.floor((response / totalCount) * 100) : 0
                        return (
                            <div key={index} className="poll-ans-list">
                                <span>{`0${index + 1}. `}</span> {option}
                                {data.status === POLL_STATES.showResult && (
                                    // -todo
                                    <div
                                        className="custom-slider"
                                        style={{ padingLeft: "6%" }}
                                    >
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
                                )}
                            </div>
                        )
                    })}
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
                                    data.questionid,
                                    data.status === POLL_STATES.showQuestion
                                        ? POLL_STATES.hide
                                        : POLL_STATES.showQuestion
                                )
                            }
                            style={{
                                border: "1px solid black",
                                fontWeight: "700",
                            }}
                        >
                            {data.status === POLL_STATES.showQuestion
                                ? "Unpublish"
                                : "Publish Poll"}
                        </button>
                        <button
                            className="poll-btn"
                            onClick={() =>
                                handleformSubmit(
                                    "showResult",
                                    data.questionid,
                                    data.status === POLL_STATES.showResult
                                        ? POLL_STATES.hide
                                        : POLL_STATES.showResult
                                )
                            }
                            style={{
                                border: "1px solid black",
                                fontWeight: "700",
                            }}
                        >
                            {(data.status === POLL_STATES.hide || data.status === POLL_STATES.showQuestion) ? "Show Results" : "Hide Results"}
                        </button>
                    </div>
                </>
            }
            {
                questionState === QUESTION_STATE_TYPE.Edit &&
                <PollBuilder data={data} handleformSubmit={(type, id, data) => {
                    handleformSubmit(type, id, data)
                    setQuestionState(QUESTION_STATE_TYPE.Preview)
                }} />
            }
        </>
    )
}

export default function PollAdminUI({ eventId }) {
    const { pollState, addPollQuestion, removePollQuestion, updatePollStatus } = useContext(PollContext)
    const [createNewPollbtnOpen, setCreateNewPollbtnOpen] = useState(false);
    const [pollForm, setPollForm] = useState([]);
    const [isPollFormOpen, setIsPollFormOpen] = useState(false);

    const [isFeedbackExpand, setIsFeedbackExpand] = useState();
    const [pollFeedback, setPollFeedback] = useState([]);
    const [isPollFeedback, setIsPollFeedback] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState({
        open: false,
        id: null,
        type: "",
    });
    const [loading, setLoading] = useState(false);

    const handleMultipleChoice = () => {
        setPollForm([
            {
                questionid: uniqid(),
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
                questionid: uniqid(),
                question: "",
            },
            ...pollFeedback,
        ]);
        setIsPollFeedback(true);
        setCreateNewPollbtnOpen(false);
        return;
    };

    const updateItem = (type, index, whichvalue, newvalue) => {
        if (type === "poll") {
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
            removePollQuestion(id, eventId);
        }
        setShowDeleteModal({ open: false, id: null, type: "" });
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
            removePollQuestion(id, eventId);
        }
        setShowDeleteModal({ open: false, id: null, type: "" });
    };

    const handleformSubmit = async (type, id, updatedData) => {
        if (type === "save") {
            let form = pollForm.filter((data, ind) => ind === id);
            if (!form[0].question) {
                return;
            }
            if (pollForm.length <= 1) {
                setIsPollFormOpen(false);
            }

            return new Promise(async (res, rej) => {
                try {
                    addPollQuestion("poll", form[0], eventId);
                    let newForm = pollForm.filter((data, ind) => ind !== id);
                    setPollForm(newForm);
                    res();
                } catch (error) {
                    setIsPollFormOpen(true);
                    rej(error);
                }
            });
        }
        if (type === "publish" || type === "showResult") {
            console.log(id, updatedData, eventId)
            updatePollStatus(id, updatedData, eventId)
        }
        if (type === "update") {
            // console.log(id, updatedData, eventId)
            addPollQuestion("poll", updatedData, eventId);
        }
    };

    const handleFeedBackSubmit = async (type, id, updatedData) => {
        if (type === "save") {
            let form = pollFeedback.filter((data, ind) => ind === id);
            if (!form[0].question) {
                return;
            }
            if (pollFeedback.length <= 1) {
                setIsPollFeedback(false);
            }

            return new Promise(async (res, rej) => {
                try {
                    addPollQuestion("feedback", form[0], eventId);
                    let newForm = pollFeedback.filter((data, ind) => ind !== id);
                    setPollFeedback(newForm);
                    res();
                } catch (error) {
                    setIsPollFeedback(true);
                    rej(error);
                }
            });
        }
    };

    const questionLength = useMemo(() => (Object.keys(pollState.questions).length), [pollState.questions])

    return (
        <>
            <div className="communityBox__body_scroll">
                <div className="poll-form-container">
                    <div style={{ position: "relative" }}>
                        <button
                            className={`poll-btn ${createNewPollbtnOpen && "pbh"}`}
                            onClick={() => setCreateNewPollbtnOpen(!createNewPollbtnOpen)}
                        >
                            + Create new poll
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
                                    onClick={() =>
                                        setShowDeleteModal({
                                            open: true,
                                            id: index,
                                            type: "unpublish",
                                            formType: "poll",
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
                                        updateItem("poll", index, "question", e.target.value)
                                    }
                                    required
                                />
                                <input
                                    type="text"
                                    placeholder="Option 1"
                                    value={data.option1}
                                    onChange={(e) =>
                                        updateItem("poll", index, "option1", e.target.value)
                                    }
                                />
                                <input
                                    type="text"
                                    placeholder="Option 2"
                                    value={data.option2}
                                    onChange={(e) =>
                                        updateItem("poll", index, "option2", e.target.value)
                                    }
                                />
                                <input
                                    type="text"
                                    placeholder="Option 3"
                                    value={data.option3}
                                    onChange={(e) =>
                                        updateItem("poll", index, "option3", e.target.value)
                                    }
                                />
                                <input
                                    type="text"
                                    placeholder="Option 4"
                                    value={data.option4}
                                    onChange={(e) =>
                                        updateItem("poll", index, "option4", e.target.value)
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
                                    Delete
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
                                    Save
                                </button>
                            </div>
                        ))}
                    {/* End of feedback form */}
                </div>

                {loading && <div style={{ marginTop: "1rem" }}>Please wait...</div>}

                {pollState.questions &&
                    Object.values(pollState.questions).map((data, index) => (
                        <div key={data.questionid} className="poll-form poll-form-data">

                            {
                                data.type === "poll" &&
                                <PollQuestion key={`poll-${index}`} index={index} questionLength={questionLength} data={data} handleformSubmit={handleformSubmit} handleDelete={() =>
                                    setShowDeleteModal({
                                        open: true,
                                        id: data.questionid,
                                        type: "publish",
                                        formType: data.type,
                                    })} />
                            }
                            {
                                data.type === "feedback" &&
                                <FeedbackQuestion key={`feedback-${index}`} index={index} questionLength={questionLength} data={data}
                                    handleformSubmit={handleformSubmit} isFeedbackExpand={isFeedbackExpand} setIsFeedbackExpand={setIsFeedbackExpand} handleDelete={() =>
                                        setShowDeleteModal({
                                            open: true,
                                            id: data.questionid,
                                            type: "publish",
                                            formType: data.type,
                                        })}
                                />
                            }
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
        </>
    )
}
