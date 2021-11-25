import React, { useContext, useReducer, useState } from 'react'
import { v4 as uuidv4 } from 'uuid';
import { NotificationContext } from '../../Context/Notification/NotificationContextProvider';
import "./notification.css"

const DeleteModal = ({
    type,
    id,
    handleDelete,
    setShowDeleteModal,
}) => {
    return (
        <div className="dlt-mdl">
            <div className="dlt-mdl-bdy">
                <div style={{ fontWeight: 700 }}>
                    By deleting this Notification you will loose all associated data and results.
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
                            handleDelete(type, id)
                        }
                        style={{
                            border: "1px solid black",
                        }}
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};
const NOTIFICATION_STATE_TYPE = {
    "Edit": 0,
    "Preview": 1
}

const inputReducer = (state, { key, value }) => {
    return {
        ...state,
        [key]: value
    }
}

const NotificationBuilder = ({ data, handleformSubmit }) => {
    const [state, dispatch] = useReducer(inputReducer, {
        message: data.message,
        id: data.id,
    })

    const updateItem = (key, value) => {
        dispatch({
            key, value
        })
    }

    return (
        <>
            <div className="poll-form" key={`${data.id}_edit`}>
                <input
                    autoFocus
                    type="text"
                    placeholder="Write text here..."
                    value={state.message}
                    onChange={(e) =>
                        updateItem("message", e.target.value)
                    }
                    required
                />

                <button
                    className="poll-btn"
                    onClick={() => handleformSubmit("update", state)}
                    style={{ border: "1px solid black", alignSelf: "center" }}
                >
                    Save
                </button>
            </div>
        </>
    )
}

const NotificationCard = ({ handleformSubmit, data, setShowDeleteModal }) => {
    const [notificationState, setNotificationState] = useState(NOTIFICATION_STATE_TYPE.Preview)
    return (
        <>
            <div key={data.id} className="poll-form poll-form-data">
                <div
                    style={{
                        display: "flex",
                        justifyContent: data.ispublished ? "space-between" : "flex-end",
                        paddingBottom: " 0.5rem",
                        borderBottom: "0.15rem solid #686868"
                    }}
                >
                    {data.ispublished && (
                        <div className="live-text" style={{ fontWeight: 600 }}>
                            <div className="live-mark"></div>
                            LIVE NOW
                        </div>
                    )}
                    <div className="not-card-btn-container">
                        <button
                            className="poll-btn publish-btn"
                            onClick={() =>
                                handleformSubmit(
                                    "publish",
                                    data.id,
                                    data
                                )
                            }
                            style={{
                                border: "1px solid black",
                                // fontWeight: "700",
                            }}
                        >
                            {data.ispublished
                                ? "Unpublish"
                                : "Publish"}
                        </button>
                        <button
                            className="poll-btn"
                            onClick={() => setNotificationState(prev => (prev + 1) % 2)}
                            style={{
                                border: "1px solid black",
                                marginRight: '0.5rem'
                            }}
                        >
                            {notificationState === NOTIFICATION_STATE_TYPE.Edit ? 'Cancel' : 'Edit'}
                        </button>
                        <button
                            className="poll-btn del-btn"
                            onClick={() =>
                                setShowDeleteModal({
                                    open: true,
                                    id: data.id,
                                    type: "publish",
                                    formType: data.type,
                                })
                            }
                            style={{
                                border: "1px solid black",
                                padding: "0.75rem",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <img
                                src={
                                    process.env.PUBLIC_URL +
                                    "assets/images/icons/delete.svg"
                                }
                                alt="delete"
                                height="10px"
                                style={{
                                    display: "inline-block",
                                    width: "1.25rem",
                                    height: "1.0rem",
                                }}
                            />
                        </button>
                    </div>

                </div>
                {
                    notificationState === NOTIFICATION_STATE_TYPE.Preview &&
                    <>
                        <p
                            style={{
                                paddingTop: "10px",
                                marginBottom: "10px",
                                fontWeight: 600,
                            }}
                        >
                            {data.message}
                        </p>
                        <div className="not-time-container admin">
                            {
                                data.createdat &&
                                <p> Created:
                                    {` ${new Date(data.createdat).toLocaleString('en-US', {
                                        year: 'numeric', month: 'numeric', day: 'numeric'
                                    })}  ${new Date(data.createdat).toLocaleString('en-US', {
                                        timeStyle: "short",
                                    })}`} </p>
                            }
                            {
                                data.publishedat &&
                                <p style={{ marginTop: '5px' }}> Last Published:
                                    {` ${new Date(data.publishedat).toLocaleString('en-US', {
                                        year: 'numeric', month: 'numeric', day: 'numeric'
                                    })}  ${new Date(data.publishedat).toLocaleString('en-US', {
                                        timeStyle: "short",
                                    })}`}
                                </p>
                            }
                        </div>
                    </>
                }
                {
                    notificationState === NOTIFICATION_STATE_TYPE.Edit &&
                    <NotificationBuilder data={data} handleformSubmit={(type, data) => {
                        handleformSubmit(type, data.id, data)
                        setNotificationState(NOTIFICATION_STATE_TYPE.Preview)
                    }} />
                }
            </div>
        </>
    )
}

export default function NotificationAdminUI({ eventId, onPlatform }) {
    const [pollForm, setPollForm] = useState([]);
    const [isPollFormOpen, setIsPollFormOpen] = useState(false);
    const [createNewPollbtnOpen, setCreateNewPollbtnOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState({
        open: false,
        id: null,
        type: "",
    });

    const { notificationState, addNotification, togglePublishNotification, deleteNotification, updateNotification } = useContext(NotificationContext);

    const handleAddNotification = () => {
        setPollForm([
            {
                messageid: uuidv4(),
                message: "",
            },
            ...pollForm,
        ]);
        setIsPollFormOpen(true);
        setCreateNewPollbtnOpen(false);
        return;
    };

    const handleDelete = async (type, id) => {
        if (type === "unpublish") {
            if (pollForm.length > 1) {
                let form = pollForm.filter((data, ind) => ind !== id);
                setPollForm(form);
            } else {
                setPollForm([]);
            }
        }
        if (type === "publish") {
            // removePollQuestion(id, eventId);
            deleteNotification({ messageid: id, roomid: eventId })
        }
        setShowDeleteModal({ open: false, id: null, type: "" });
    };


    const updateItem = (index, whichvalue, newvalue) => {
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
    };


    const handleformSubmit = async (type, id, updatedData) => {
        if (type === "save") {
            let form = pollForm.filter((data, ind) => ind === id);
            if (!form[0].message) {
                return;
            }
            if (pollForm.length <= 1) {
                setIsPollFormOpen(false);
            }

            return new Promise(async (res, rej) => {
                try {
                    addNotification({ roomid: eventId, messageid: form[0].messageid, message: form[0].message, publish: false });
                    let newForm = pollForm.filter((data, ind) => ind !== id);
                    setPollForm(newForm);
                    res();
                } catch (error) {
                    setIsPollFormOpen(true);
                    rej(error);
                }
            });
        }
        if (type === "publish") {
            console.log(id, updatedData, eventId)
            togglePublishNotification({ roomid: eventId, messageid: id, publish: !updatedData.ispublished })
        }
        if (type === "update") {
            console.log(id, updatedData, eventId)
            updateNotification({ roomid: eventId, messageid: updatedData.id, message: updatedData.message })
        }
    };

    let notificationValues = Object.values(notificationState[onPlatform ? "platform_notifications" : "notifications"]).reverse()
    return (
        <>
            <div className="communityBox__body">
                <div className="poll-form-container">
                    <div style={{ position: "relative" }}>
                        <button
                            className={`poll-btn ${createNewPollbtnOpen && "pbh"}`}
                            onClick={() => handleAddNotification()}
                        >
                            + Send a notification
                        </button>
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
                                    placeholder="Write text here..."
                                    value={data.message}
                                    onChange={(e) =>
                                        updateItem(index, "message", e.target.value)
                                    }
                                    required
                                />

                                <button
                                    className="poll-btn"
                                    onClick={() => handleformSubmit("save", index)}
                                    style={{ border: "1px solid black", alignSelf: "center" }}
                                >
                                    Save
                                </button>
                            </div>
                        ))}
                    {/* end of Poll Form */}

                    {loading && <div style={{ marginTop: "1rem" }}>Please wait...</div>}

                    {notificationValues &&
                        Object.values(notificationValues).map((data, index) => (
                            <NotificationCard key={data.id + "_" + index} handleformSubmit={handleformSubmit} data={data} setShowDeleteModal={setShowDeleteModal} />
                        ))}

                    {showDeleteModal.open && (
                        <DeleteModal
                            type={showDeleteModal.type}
                            id={showDeleteModal.id}
                            handleDelete={handleDelete}
                            setShowDeleteModal={setShowDeleteModal}
                        />
                    )}

                </div>
            </div>
        </>
    )
}

