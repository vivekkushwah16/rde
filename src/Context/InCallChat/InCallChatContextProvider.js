import React, { createContext, useContext, useEffect, useReducer, useRef } from 'react'
import SocketManager, { PRIVATE_MESSAGES_OPERTAION_TYPE, SOCKET_EVENT_NAMES } from '../../Manager/Socket'
import { ChatContext, RoomContext } from '../Chat/ChatContextProvider'
import { MenuStates, UIContext } from '../UIContextProvider'

const OPERATION_TYPE = {
    "Ready": "inCallChat:Ready",
    "sendMessage": "inCallChat:sendMessage",
    "fetchPublicMessage": "inCallChat:fetchPublicMessage",
    "userslist": "inCallChat:userslist",
    "userJoined": "inCallChat:userJoined",
    "userleft": "inCallChat:userleft",
    "error": "inCallChat:error",
}

const initalState = {
    currentRoomId: null,
    initialized: false,
    socketList: [],
    userslist: {},
    messages: {},
}

const ACTION_TYPE = {
    joinRoom: "joinRoom",
    leaveRoom: "leaveRoom",
    initalize: "initalize",
    userListIncrement: 'userListIncrement',
    userListDecrement: 'userListDecrement',
    addOldMessage: 'addOldMessages',
    addMessages: 'addMessages',
    reset: "reset"
}

export const InCallChatContext = createContext(null)
const getEventNameForOperation = (roomid, operation) => {
    return `${roomid}:${operation}`
}
function reducer(state, { type, payload }) {
    //// console.log({ type, payload })
    switch (type) {
        case ACTION_TYPE.joinRoom:
            return { ...state, currentRoomId: payload.roomid }
        case ACTION_TYPE.leaveRoom:
            if (state.currentRoomId === payload.roomid) {
                return initalState
            } else {
                return state
            }
        case ACTION_TYPE.reset: {
            return initalState
        }
        case ACTION_TYPE.userListIncrement: {
            return {
                ...state,
                userslist: {
                    ...state.userslist,
                    ...payload.userlist
                },
                socketList: [
                    ...state.socketList,
                    ...payload.socketList
                ]
            }
        }
        case ACTION_TYPE.userListDecrement: {
            let cul = { ...state.userslist }
            let csl = [...state.socketList]
            if (payload.userid) {
                delete cul[payload.userid]
            }
            if (payload.socketId) {
                let idIndex = csl.indexOf(payload.socketId)
                if (idIndex !== -1) {
                    csl.splice(idIndex, 1)
                }
            }
            return {
                ...state,
                userslist: cul,
                socketList: csl
            }
        }
        case ACTION_TYPE.addMessages: {
            return {
                ...state,
                messages: {
                    ...state.messages,
                    ...payload.messages,
                }
            }
        }
        case ACTION_TYPE.addOldMessage: {
            return {
                ...state,
                messages: {
                    ...payload.messages,
                    ...state.messages,
                }
            }
        }
        default:
            throw new Error();
    }
}


export default function InCallChatContextProvider(props) {
    const { onlineUserslist, setPublicNotification } = useContext(ChatContext)
    const { socketUserList } = useContext(RoomContext)
    const { activeMenu, setActiveMenu } = useContext(UIContext)
    const socketRef = useRef(null)
    const [state, dispatch] = useReducer(reducer, initalState)
    const isListenerAttached = useRef(false)
    const onlineUserslistRef = useRef({})
    const socketUserListRef = useRef({})

    useEffect(() => {
        onlineUserslistRef.current = onlineUserslist
    }, [onlineUserslist])
    useEffect(() => {
        socketUserListRef.current = socketUserList
    }, [socketUserList])

    const attachNotificationListeners = (roomid) => {
        if (isListenerAttached.current) {
            detachNotificationListener()
        }
        isListenerAttached.current = true
        let socket = socketRef.current
        const handleReadyState = ({ roomid }) => {
            dispatch({ type: ACTION_TYPE.joinRoom, payload: { roomid } })
            // console.log("Inchat listener found=-------------------")
        }

        const handleUserList = (data) => {
            // console.log(data, '///////////////////////////')
            //will get an array of socketid's
            if (data) {
                let _userlist = {}
                data.forEach(socketId => {
                    if (socketUserListRef.current) {
                        if (socketUserListRef.current.hasOwnProperty(socketId)) {
                            let userid = socketUserListRef.current[socketId]
                            if (onlineUserslistRef.current) {
                                if (onlineUserslistRef.current.hasOwnProperty(userid)) {
                                    _userlist = {
                                        ..._userlist,
                                        [userid]: onlineUserslistRef.current[userid]
                                    }
                                }
                            } else {
                                // console.log(onlineUserslistRef.current, '///////////////////////////')
                            }

                        }
                        dispatch({ type: ACTION_TYPE.userListIncrement, payload: { userlist: _userlist, socketList: data } })
                    } else {
                        // console.log(socketUserListRef.current)
                    }
                });
            }
        }
        const handleUserJoined = (data) => {
            //will get an object containing { roomid userid socketId }
            if (data) {
                let { userid, socketId } = data
                if (userid) {
                    if (onlineUserslistRef.current)
                        if (onlineUserslistRef.current.hasOwnProperty(userid)) {
                            dispatch({ type: ACTION_TYPE.userListIncrement, payload: { userlist: { [userid]: onlineUserslistRef.current[userid] }, socketList: [socketId] } })
                        }
                    // else
                    // console.log(onlineUserslistRef.current)
                }
            }
            // console.log('handleUserJoined', data)

        }
        const handleUserLeft = (data) => {
            //will get an object containing { roomid userid socketId }
            if (data) {
                let { userid, socketId } = data
                dispatch({ type: ACTION_TYPE.userListDecrement, payload: { userid, socketId } })
            }
            // console.log('handleUserLeft', data)
        }

        const handleFetchPublicMessage = ({ data, operationType }) => {
            // console.log('handleFetchPublicMessage', data)
            if (data) {
                let newRecivedMessages = {}
                data.reverse()
                data.forEach(msg => {
                    newRecivedMessages[new Date(msg.createdat).getTime()] = msg
                })
                switch (operationType) {
                    case PRIVATE_MESSAGES_OPERTAION_TYPE.oldMessages:
                        dispatch({ type: ACTION_TYPE.addOldMessage, payload: { messages: newRecivedMessages } })
                        break;
                    case PRIVATE_MESSAGES_OPERTAION_TYPE.realAll:
                        dispatch({ type: ACTION_TYPE.addMessages, payload: { messages: newRecivedMessages } })
                        break
                    default:
                        console.error(`public room recived message of type: ${operationType}`)
                }
            }
        }

        const handleNewPublicMessage = (_data) => {
            // console.log('handleNewPublicMessage', _data)
            if (_data) {
                if (_data.length > 0) {
                    let data = _data[0]
                    let { createdat } = data
                    let currentActiveMenu = null
                    setActiveMenu(prev => {
                        currentActiveMenu = prev
                        return prev
                    })

                    if (currentActiveMenu !== MenuStates.publicChat) {
                        setPublicNotification(true)
                    }
                    dispatch({
                        type: ACTION_TYPE.addMessages, payload: {
                            messages: {
                                [createdat]: data
                            }
                        }
                    })
                }
            }
        }

        socket.on(getEventNameForOperation(roomid, OPERATION_TYPE.Ready), handleReadyState)
        socket.on(getEventNameForOperation(roomid, OPERATION_TYPE.userslist), handleUserList)
        socket.on(getEventNameForOperation(roomid, OPERATION_TYPE.userJoined), handleUserJoined)
        socket.on(getEventNameForOperation(roomid, OPERATION_TYPE.userleft), handleUserLeft)
        socket.on(getEventNameForOperation(roomid, OPERATION_TYPE.fetchPublicMessage), handleFetchPublicMessage)
        socket.on(getEventNameForOperation(roomid, OPERATION_TYPE.sendMessage), handleNewPublicMessage)
        socket.emit(getEventNameForOperation(roomid, OPERATION_TYPE.fetchPublicMessage), roomid,
            null, (err, data) => {
                // console.log(err)
                // console.log(data)
            })
    }


    useEffect(() => {
        const handleVideoCallRoomJoin = ({ roomid, vcsessionid, permissions }) => {
            attachNotificationListeners(roomid)
            dispatch({ type: ACTION_TYPE.joinRoom, payload: { roomid } })
        }
        const handleVideoCallRoomLeft = ({ roomid }) => {
            dispatch({ type: ACTION_TYPE.leaveRoom, payload: { roomid } })
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

    const detachNotificationListener = (roomid) => {
        if (isListenerAttached.current) {
            isListenerAttached.current = false
        }
    }

    useEffect(() => {
        if (state.currentRoomId) {
            // attachPollListeners(state.currentRoomId)
        } else {
            detachNotificationListener()
        }
        return () => {
            detachNotificationListener()
        }
    }, [state.currentRoomId])

    const sendMessage = (data) => {
        // { message: typedMessage, senderid: user.uid, roomid: publicRoomName }
        let socket = socketRef.current
        if (socket) {
            socket.emit(getEventNameForOperation(state.currentRoomId, OPERATION_TYPE.sendMessage), data)
        }
    }

    const getPublicRoomOldMessage = (publicRoomName, messageid) => {
        let socket = socketRef.current
        if (socket && messageid) {
            socket.emit(getEventNameForOperation(state.currentRoomId, OPERATION_TYPE.fetchPublicMessage), publicRoomName, { operationType: PRIVATE_MESSAGES_OPERTAION_TYPE.oldMessages, messageid, publicRoomName }, (err, data) => {
                // console.log(err)
                // console.log(data)
            })
        }
    }

    return (
        <InCallChatContext.Provider value={{ inCallChatState: state, dispatch, sendMessage, getPublicRoomOldMessage }}>
            {props.children}
        </InCallChatContext.Provider>
    )
}
