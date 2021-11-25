import React, { createContext, useEffect, useReducer, useRef } from 'react'
import SocketManager, { PLATFORM_NOTIFICATION_ROOM, SOCKET_EVENT_NAMES } from '../../Manager/Socket'

export const NotificationContext = createContext()

const Notification_Socket_OPERTAION_TYPE = {
    "Ready": "Notification:Ready",
    "addNotification": "Notification:addNotification",
    "updateNotification": "Notification:updateNotification",
    "togglePublishNotification": "Notification:togglePublishNotification",
    "deleteNotification": "Notification:deleteNotification",
    "getNotifications": "Notification:getNotifications",
    "error": "Notification:error",
}

const initalRoomState = {
    currentRoomId: null,
    isNotificationAdmin: false,
    notifications: {},
    lastSeenNotification: null,
    initialized: false,
}

const initalPlatformState = {
    platform_currentRoomId: null,
    platform_isNotificationAdmin: false,
    platform_notifications: {},
    platform_lastSeenNotification: null,
    platform_initialized: false,
}

const initalState = {
    ...initalRoomState,
    ...initalPlatformState,
    flashNotification: null
}
const NOTIFICATION_ACTION_TYPE = {
    joinRoom: "joinRoom",
    leaveRoom: "leaveRoom",
    initalize: "initalize",
    updateNotification: "updateNotification",
    addBulkNotifications: "addBulkNotifications",
    removeNotifications: "removeNotifications",
    removeFlashNotifications: "removeFlashNotifications",
    updateLastSeenNotification: "updateLastSeenNotification",
    reset: "reset"
}

function reducer(state, { type, payload }) {
    //  console.log({ type, payload })
    const { isPlatformNotification } = payload
    switch (type) {
        case NOTIFICATION_ACTION_TYPE.joinRoom:
            return { ...state, currentRoomId: payload.roomid }
        case NOTIFICATION_ACTION_TYPE.leaveRoom:
            if (state.currentRoomId === payload.roomid) {
                return {
                    ...state,
                    ...initalRoomState,
                }
            } else {
                return state
            }
        case NOTIFICATION_ACTION_TYPE.initalize:
            return {
                ...state,
                [isPlatformNotification ? "platform_isNotificationAdmin" : "isPollAdmin"]: payload.isRoomAdmin,
                [isPlatformNotification ? "platform_initialized" : "initialized"]: payload.initialized
            }
        case NOTIFICATION_ACTION_TYPE.addBulkNotifications:
            let newState = null
            if (isPlatformNotification) {
                newState = {
                    ...state,
                    ["platform_notifications"]
                        : {
                        ...state.platform_notifications,
                        ...payload.notifications,
                    }
                }
            } else {
                newState = {
                    ...state,
                    notifications
                        : {
                        ...state.notifications,
                        ...payload.notifications,
                    }
                }
            }
            if (payload.markAsLastNotification) {
                newState = {
                    ...newState,
                    flashNotification: payload.flashNotification
                }
            }
            if (payload.removeFlashNotification && state.flashNotification) {
                if (state.flashNotification.id === payload.flashNotification.id) {
                    newState = {
                        ...newState,
                        flashNotification: null
                    }
                }
            }
            return newState
        case NOTIFICATION_ACTION_TYPE.removeNotifications:
            {
                let notificationsid = payload.notificationsid
                let notificationListRef = isPlatformNotification ? state.platform_notifications : state.notifications
                if (notificationListRef.hasOwnProperty(notificationsid)) {
                    let notifications = { ...notificationListRef }
                    delete notifications[notificationsid]
                    let newState = {
                        ...state,
                        [isPlatformNotification ? "platform_notifications" : "notifications"]: notifications
                    }
                    if (payload.removeLastNotification && state.flashNotification) {
                        if (state.flashNotification.id === notificationsid) {
                            newState = {
                                ...newState,
                                flashNotification: null
                            }
                        }
                    }
                    return newState
                } else {
                    return state
                }
            }
        case NOTIFICATION_ACTION_TYPE.removeFlashNotifications: {
            return {
                ...state,
                flashNotification: null
            }
        }
        case NOTIFICATION_ACTION_TYPE.updateLastSeenNotification: {
            return {
                ...state,
                [isPlatformNotification ? "platform_lastSeenNotification" : "lastSeenNotification"]: payload.data
            }
        }
        case NOTIFICATION_ACTION_TYPE.reset: {
            return initalState
        }
        default:
            throw new Error();
    }
}
const getEventNameForOperation = (roomid, operation) => {
    return `${roomid}:${operation}`
}

export default function NotificationContextProvider(props) {
    const socketRef = useRef(null)
    const lastNotificationTimerRef = useRef(null)
    const [state, dispatch] = useReducer(reducer, initalState)

    const isListenerAttached = useRef(false)
    const attachNotificationListeners = (roomid, isPlatformNotification = false) => {
        if (!isPlatformNotification) {
            if (isListenerAttached.current) {
                detachNotificationListener()
            }
            isListenerAttached.current = true
            //  console.log("attach Notification listener")
        }
        let socket = socketRef.current


        const handleUpdateNotification = (data) => {
            //  console.log("----------------------handleAddNotification")
            //  console.log(data)
            if (data)
                dispatch({ type: NOTIFICATION_ACTION_TYPE.addBulkNotifications, payload: { notifications: { [data.id]: data }, isPlatformNotification, markAsLastNotification: data.ispublished, flashNotification: data, removeFlashNotification: !data.ispublished } })
        }
        const handleTogglePublishNotificationAsClient = (data) => {
            //  console.log("----------------------handleTogglePublishNotificationAsClient")
            if (data) {
                if (data.ispublished) {
                    dispatch({ type: NOTIFICATION_ACTION_TYPE.addBulkNotifications, payload: { notifications: { [data.id]: data }, isPlatformNotification, markAsLastNotification: true, flashNotification: data } })
                } else {
                    dispatch({ type: NOTIFICATION_ACTION_TYPE.removeNotifications, payload: { notificationsid: data.id, isPlatformNotification, removeLastNotification: true } })
                }
            }
        }
        const handleDeleteNotification = (data) => {
            //  console.log("----------------------handleDeleteNotification")
            if (data) {
                dispatch({ type: NOTIFICATION_ACTION_TYPE.removeNotifications, payload: { notificationsid: data.id, isPlatformNotification } })
            }
        }

        const handleGetNotifications = (data) => {
            //  console.log("----------------------handleGetNotifications")
            if (data) {
                let processData = {}
                data.forEach(not => {
                    processData[not.id] = not
                })
                dispatch({ type: NOTIFICATION_ACTION_TYPE.addBulkNotifications, payload: { notifications: processData, isPlatformNotification } })
            }
        }


        const handleVideoReady = ({
            roomid: _rmid,
            isRoomAdmin,
            adminType
        }) => {
            console.log("nofiticaton ", roomid,
                isRoomAdmin,
                adminType)
            if (isRoomAdmin) {
                let notificationAdminRoomName = `${roomid}:notificationAdmin`
                SocketManager.joinRoom(socket, notificationAdminRoomName, false);
                socket.on(getEventNameForOperation(roomid, Notification_Socket_OPERTAION_TYPE.addNotification), handleUpdateNotification)
                socket.on(getEventNameForOperation(roomid, Notification_Socket_OPERTAION_TYPE.togglePublishNotification), handleUpdateNotification)
            } else {
                socket.on(getEventNameForOperation(roomid, Notification_Socket_OPERTAION_TYPE.togglePublishNotification), handleTogglePublishNotificationAsClient)
            }

            socket.on(getEventNameForOperation(roomid, Notification_Socket_OPERTAION_TYPE.updateNotification), handleUpdateNotification)
            socket.on(getEventNameForOperation(roomid, Notification_Socket_OPERTAION_TYPE.deleteNotification), handleDeleteNotification)
            socket.on(getEventNameForOperation(roomid, Notification_Socket_OPERTAION_TYPE.getNotifications), handleGetNotifications)

            dispatch({ type: NOTIFICATION_ACTION_TYPE.initalize, payload: { isRoomAdmin, initialized: true, isPlatformNotification } })
        }
        socket.on(getEventNameForOperation(roomid, Notification_Socket_OPERTAION_TYPE.Ready), handleVideoReady)
    }

    const detachNotificationListener = (roomid) => {
        if (isListenerAttached.current) {
            isListenerAttached.current = false
        }
        // dispatch({ type: NOTIFICATION_ACTION_TYPE.reset })
        //  console.log("detach Notification listener")
    }


    useEffect(() => {
        const handleVideoCallRoomJoin = ({ roomid, vcsessionid, permissions }) => {
            attachNotificationListeners(roomid)
            dispatch({ type: NOTIFICATION_ACTION_TYPE.joinRoom, payload: { roomid } })
        }
        const handleVideoCallRoomLeft = ({ roomid }) => {
            dispatch({ type: NOTIFICATION_ACTION_TYPE.leaveRoom, payload: { roomid } })
        }

        SocketManager.subscribe_GetSocket((socketInstance) => {
            socketRef.current = socketInstance
            let socket = socketRef.current
            if (socket) {
                //join platform notification room
                socket.emit(SOCKET_EVENT_NAMES.JoinToRoom, PLATFORM_NOTIFICATION_ROOM, false, null, null, 'notificationRoom')
                //add pltformNotificatonRoom join
                attachNotificationListeners(PLATFORM_NOTIFICATION_ROOM, true)
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


    useEffect(() => {
        if (lastNotificationTimerRef.current) {
            clearTimeout(lastNotificationTimerRef.current)
        }
        if (state.flashNotification) {
            lastNotificationTimerRef.current = setTimeout(() => {
                console.log(state.flashNotification, "clean")
                dispatch({ type: NOTIFICATION_ACTION_TYPE.removeFlashNotifications, payload: { isPlatformNotification: false } })
            }, 10 * 1000)
        }
        return () => {
            clearTimeout(lastNotificationTimerRef.current)
        }
    }, [state.flashNotification])

    const addNotification = ({ roomid, messageid, message, publish }) => {
        //  console.log('-----------updateNotification')
        let socket = socketRef.current
        if (socket && messageid) {
            socket.emit(getEventNameForOperation(roomid, Notification_Socket_OPERTAION_TYPE.addNotification), { messageid, roomid, message, publish })
        }
    }

    const updateNotification = ({ roomid, messageid, message }) => {
        //  console.log('-----------updateNotification')
        let socket = socketRef.current
        if (socket && messageid) {
            socket.emit(getEventNameForOperation(roomid, Notification_Socket_OPERTAION_TYPE.updateNotification), { messageid, roomid, message })
        }
    }

    const togglePublishNotification = ({ roomid, messageid, publish }) => {
        console.log('-----------togglePublishNotification', roomid, messageid, publish)

        let socket = socketRef.current
        if (socket && messageid) {
            socket.emit(getEventNameForOperation(roomid, Notification_Socket_OPERTAION_TYPE.togglePublishNotification), { messageid, roomid, publish })
        }
    }

    const deleteNotification = ({ messageid, roomid }) => {
        //  console.log('-----------deleteNotification')
        //  console.log({ messageid, roomid })
        let socket = socketRef.current
        if (socket && messageid) {
            //  console.log(getEventNameForOperation(roomid, Notification_Socket_OPERTAION_TYPE.deleteNotification), { messageid, roomid })
            socket.emit(getEventNameForOperation(roomid, Notification_Socket_OPERTAION_TYPE.deleteNotification), { messageid, roomid })
        }
    }

    const updateLastSeenNotification = (data, isPlatformNotification) => {
        dispatch({ type: NOTIFICATION_ACTION_TYPE.updateLastSeenNotification, payload: { data, isPlatformNotification } })
    }

    return (
        <NotificationContext.Provider value={{ notificationState: state, dispatch, addNotification, updateNotification, togglePublishNotification, deleteNotification, updateLastSeenNotification }}>
            {props.children}
        </NotificationContext.Provider>
    )
}
