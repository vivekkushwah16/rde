import React, { createContext, useContext, useEffect, useReducer, useRef, useState } from "react";
import { POLL_STATES } from "../../Constants/PollStates";
import { OPERATION_TYPE } from "../../Constants/VideoCallConstants";
import SocketManager, { SOCKET_EVENT_NAMES } from "../../Manager/Socket";
import { SocketContext } from "../Chat/ChatContextProvider";
import ding from "./ding2.ogg"
import { MenuStates, UIContext } from "../UIContextProvider";

export const PollContext = createContext()

const POLL_SOCKET_OPERATION_TYPE = {
    "Ready": "Poll:Ready",
    "UpsertQuestion": "Poll:UpsertQuestion",
    "UpdateQuestionStatus": "Poll:UpdateQuestionStatus",
    "GetAllQuestions": "Poll:GetAllQuestions",
    "GetActiveQuestions": "GetActiveQuestions",
    "DeleteQuestion": "Poll:DeleteQuestion",
    "SubmitQuestionResponse": "Poll:SubmitQuestionResponse",
    "GetUserQuestionResponses": "Poll:GetUserQuestionResponses",
    "GetQuestionResults": "Poll:GetQuestionResults",
    "UpdateFeedbackResponse": "Poll:UpdateFeedbackResponse",
    "error": "Poll:error",
}

const initalState = {
    currentRoomId: null,
    isPollAdmin: false,
    initialized: false,
    questions: {},
    userResponses: {}
}
const POLL_ACTION_TYPE = {
    joinRoom: "joinRoom",
    leaveRoom: "leaveRoom",
    initalize: "initalize",
    updateQuestion: "updateQuestion",
    addBulkQuestions: "addBulkQuestions",
    removeQuestion: "removeQuestion",
    addBuilkResponse: "addBuilkResponse",
    updateFeedbackResponse: "updateFeedbackResponse",
    reset: "reset",
}

const QuestionType = {
    poll: 'poll',
    feedback: 'feedback'
}

function reducer(state, { type, payload }) {
    switch (type) {
        case POLL_ACTION_TYPE.joinRoom:
            return { ...state, currentRoomId: payload.roomid }
        case POLL_ACTION_TYPE.leaveRoom:
            if (state.currentRoomId === payload.roomid) {
                return initalState
            } else {
                return state
            }
        case POLL_ACTION_TYPE.initalize:
            return { ...state, isPollAdmin: payload.isRoomAdmin, initialized: payload.initialized }
        case POLL_ACTION_TYPE.addBulkQuestions:
            return {
                ...state,
                questions: {
                    ...state.questions,
                    ...payload.questions,
                }
            }
        case POLL_ACTION_TYPE.removeQuestion:
            {
                let questionid = payload.questionid
                if (state.questions.hasOwnProperty(questionid)) {
                    let questions = { ...state.questions }
                    delete questions[questionid]
                    return {
                        ...state,
                        questions
                    }
                } else {
                    return state
                }
            }

        case POLL_ACTION_TYPE.addBuilkResponse:
            return {
                ...state,
                userResponses: {
                    ...state.userResponses,
                    ...payload.userResponses,
                }
            }
        case POLL_ACTION_TYPE.updateFeedbackResponse:
            {
                let questionid = payload.questionid
                if (state.questions.hasOwnProperty(questionid)) {
                    return {
                        ...state,
                        questions: {
                            ...state.questions,
                            [questionid]: {
                                ...state.questions[questionid],
                                response: payload.response
                            }
                        }
                    }
                } else {
                    return state
                }
            }
        case POLL_ACTION_TYPE.reset:
            {
                return initalState
            }

        default:
            throw new Error();
    }
}
const getEventNameForOperation = (roomid, operation) => {
    return `${roomid}:${operation}`
}

export default function PollContextProvider(props) {
    const socketRef = useRef(null)
    const [state, dispatch] = useReducer(reducer, initalState)
    const { activeMenu, setActiveMenu, toggleMenuOpen } = useContext(UIContext)

    useEffect(() => {
        const handleVideoCallRoomJoin = ({ roomid, vcsessionid, permissions }) => {
            attachPollListeners(roomid)
            dispatch({ type: POLL_ACTION_TYPE.joinRoom, payload: { roomid } })
        }
        const handleVideoCallRoomLeft = ({ roomid }) => {
            dispatch({ type: POLL_ACTION_TYPE.leaveRoom, payload: { roomid } })
        }

        SocketManager.subscribe_GetSocket((socketInstance) => {
            socketRef.current = socketInstance
            let socket = socketRef.current
            if (socket) {
                socket.on(SOCKET_EVENT_NAMES.joinVideoCallRoom, handleVideoCallRoomJoin)
                socket.on(SOCKET_EVENT_NAMES.leftVideoCallRoom, handleVideoCallRoomLeft)
            }
        })

        return () => {
            if (socketRef.current) {
                socketRef.current.off(SOCKET_EVENT_NAMES.joinVideoCallRoom, handleVideoCallRoomJoin)
                socketRef.current.off(SOCKET_EVENT_NAMES.leftVideoCallRoom, handleVideoCallRoomLeft)
            }
        }
    }, [])

    const isListenerAttached = useRef(false)
    const attachPollListeners = (roomid) => {
        if (isListenerAttached.current) {
            detachPollListener()
        }
        isListenerAttached.current = true
        //  console.log("attach poll listener")
        let socket = socketRef.current

        const handleUpdateQuestionStatus = (data) => {
            //  console.log("----------------------handleUpdateQuestionStatus")
            //  console.log(data)
            dispatch({ type: POLL_ACTION_TYPE.addBulkQuestions, payload: { questions: { [data.questionid]: data } } })
        }

        const handleUpdateFeedbackResponse = (data) => {
            //  console.log("----------------------handleUpdateQuestionStatus")
            //  console.log(data)
            dispatch({ type: POLL_ACTION_TYPE.updateFeedbackResponse, payload: data })
        }

        const handleUpdateQuestionStatusAsClient = (data) => {
            //  console.log("----------------------handleUpdateQuestionStatusAsClient")
            //  console.log(data)
            if (data.status === POLL_STATES.hide) {
                dispatch({ type: POLL_ACTION_TYPE.removeQuestion, payload: { questionid: data.questionid } })
            } else {
                dispatch({ type: POLL_ACTION_TYPE.addBulkQuestions, payload: { questions: { [data.questionid]: data } } })
                const playAudio = () => {
                    let audio = new Audio(ding)
                    audio.volume = 0.2
                    audio.play();
                }
                setActiveMenu(prev => {
                    if (prev) {
                        // console.log("Poll new update sate----------------------")
                        // console.log(prev)
                        if (prev !== MenuStates.polls) {
                            playAudio()
                            return MenuStates.polls
                        } else {
                            return prev
                        }
                    } else {
                        playAudio()
                        return MenuStates.polls
                    }
                });
                toggleMenuOpen(true)

            }
        }

        const handleFetchQuestions = (data) => {
            //  console.log("----------------------handleFetchQuestions")
            let processData = {}
            data.forEach(question => {
                processData[question.questionid] = question
            })
            dispatch({ type: POLL_ACTION_TYPE.addBulkQuestions, payload: { questions: processData } })
        }

        const handleResponseFetch = (data) => {
            //  console.log("----------------------handleResponseFetch")
            dispatch({ type: POLL_ACTION_TYPE.addBuilkResponse, payload: { userResponses: data } })
        }

        const handleDeleteQuestions = (data) => {
            //  console.log("----------------------handleDeleteQuestions")
            dispatch({ type: POLL_ACTION_TYPE.removeQuestion, payload: { questionid: data.Question.questionid } })
        }

        const handleVideoReady = ({
            roomid: _rmid,
            isRoomAdmin,
            adminType
        }) => {
            if (isRoomAdmin) {
                let pollAdminRoomName = `${roomid}:pollAdmin`
                SocketManager.joinRoom(socket, pollAdminRoomName, false);

                socket.on(getEventNameForOperation(roomid, POLL_SOCKET_OPERATION_TYPE.GetAllQuestions), handleFetchQuestions)
                socket.on(getEventNameForOperation(roomid, POLL_SOCKET_OPERATION_TYPE.UpsertQuestion), handleFetchQuestions)
                socket.on(getEventNameForOperation(roomid, POLL_SOCKET_OPERATION_TYPE.DeleteQuestion), handleDeleteQuestions)
                socket.on(getEventNameForOperation(roomid, POLL_SOCKET_OPERATION_TYPE.UpdateQuestionStatus), handleUpdateQuestionStatus)
                socket.on(getEventNameForOperation(roomid, POLL_SOCKET_OPERATION_TYPE.UpdateFeedbackResponse), handleUpdateFeedbackResponse)

            } else {
                socket.on(getEventNameForOperation(roomid, POLL_SOCKET_OPERATION_TYPE.GetActiveQuestions), handleFetchQuestions)
                socket.on(getEventNameForOperation(roomid, POLL_SOCKET_OPERATION_TYPE.DeleteQuestion), handleDeleteQuestions)
                socket.on(getEventNameForOperation(roomid, POLL_SOCKET_OPERATION_TYPE.GetUserQuestionResponses), handleResponseFetch)
                socket.on(getEventNameForOperation(roomid, POLL_SOCKET_OPERATION_TYPE.UpdateQuestionStatus), handleUpdateQuestionStatusAsClient)
            }
            // socket.on(getEventNameForOperation(roomid, POLL_SOCKET_OPERATION_TYPE.UpdateQuestionStatus), handleFetchQuestions)

            dispatch({ type: POLL_ACTION_TYPE.initalize, payload: { isRoomAdmin, initialized: true } })
        }
        socket.on(getEventNameForOperation(roomid, POLL_SOCKET_OPERATION_TYPE.Ready), handleVideoReady)
    }

    const detachPollListener = (roomid) => {
        if (isListenerAttached.current) {
            isListenerAttached.current = false
        }
        // dispatch({ type: POLL_ACTION_TYPE.reset })
        //  console.log("detach poll listener")
    }

    useEffect(() => {
        if (state.currentRoomId) {
            // attachPollListeners(state.currentRoomId)
        } else {
            detachPollListener()
        }
        return () => {
            detachPollListener()
        }
    }, [state.currentRoomId])

    const addPollQuestion = (type, data, roomid) => {
        //  console.log('-----------addPollQuestion')
        let socket = socketRef.current
        if (socket) {
            socket.emit(getEventNameForOperation(roomid, POLL_SOCKET_OPERATION_TYPE.UpsertQuestion),
                {
                    questionid: data.questionid,
                    question: data.question,
                    type: QuestionType[type],
                    option: JSON.stringify({
                        option1: data.option1,
                        option2: data.option2,
                        option3: data.option3,
                        option4: data.option4,
                    })
                })
        }
    }

    const removePollQuestion = (questionid, roomid) => {
        //  console.log('-----------removePollQuestion')
        let socket = socketRef.current
        if (socket && questionid) {
            socket.emit(getEventNameForOperation(roomid, POLL_SOCKET_OPERATION_TYPE.DeleteQuestion), { questionid })
        }
    }

    const updatePollStatus = (questionid, status, roomid) => {
        //  console.log('-----------updatePollStatus')
        let socket = socketRef.current
        if (socket && questionid) {
            socket.emit(getEventNameForOperation(roomid, POLL_SOCKET_OPERATION_TYPE.UpdateQuestionStatus), { questionid, status })
        }
    }

    const saveUserReponse = (roomid, questionid, questionResponse, type, callback) => {
        //  console.log('-----------saveUserReponse')
        let socket = socketRef.current
        if (socket && questionid) {
            socket.emit(getEventNameForOperation(roomid, POLL_SOCKET_OPERATION_TYPE.SubmitQuestionResponse), { questionid, questionResponse, type, callback })
        }
    }

    return (
        <PollContext.Provider value={{ pollState: state, dispatch, addPollQuestion, removePollQuestion, updatePollStatus, saveUserReponse }}>
            {props.children}
        </PollContext.Provider>
    )
}
