import React, { createContext, useContext, useEffect, useReducer, useRef, useState } from 'react'
import { attachNotificationListener, getAllParticipants, getOnlineUsers, getOnlinPresentUserInRoom, getRoomIdWithUser, getUserInteractedRoom, goOfflineInRoom, userOnlinePresence } from '../../Firebase/chatManager'
import { AppString } from '../../Firebase/constant'
import { attachPublicChatListener } from '../../Firebase/publicChatManager'
import SocketManager, { PRIVATE_MESSAGES_OPERTAION_TYPE, SOCKET_EVENT_NAMES } from '../../Manager/Socket'
import { PollManager } from '../../Managers/PollManager'
import { sortObjectArray } from '../../Utility'
import { UserContext } from "../Auth/UserContextProvider"
import { MenuStates, UIContext } from '../UIContextProvider'

export const ChatContext = createContext()
export const RoomContext = createContext()
export const SocketContext = createContext()
export const MessageContext = createContext()
export const HandRaiseVideoCallContext = createContext()

const initReactiveProperties = (user) => {
    user.hasNewMessages = false;
};

export const ROOM_TYPE = {
    "one-On-one": "one-On-one",
    "privateGroup": "privateGroup"
}

const DEFAULTPUBLICROOM = "call-room-test"

function getPublicRoomName() {
    const urlQuery = new URLSearchParams(window.location.search);
    let publicRoomURl = urlQuery.get("publicRoom");
    if (publicRoomURl) {
        return publicRoomURl
    } else {
        return DEFAULTPUBLICROOM
    }
}

export const HANDRAISE_ACTION_TYPE = {
    add: "add",
    remove: "remove"
}

const handRaiseReducer = (state, { type, payload }) => {
    switch (type) {
        case HANDRAISE_ACTION_TYPE.add: {
            return {
                all: {
                    ...state.all,
                    [payload.id]: {
                        ...payload,
                    }
                },
                active: {
                    ...payload,
                }
            }
        }
        case HANDRAISE_ACTION_TYPE.remove: {
            let newState = {
                ...state
            }
            //state.filter(id => id !== payload.id)
            if (newState.all.hasOwnProperty(payload.id))
                delete newState.all[payload.id]
            if (newState.active.id === payload.id) {
                newState.active = null
            }
            return newState
        }
        default:
            return state
    }
}

export default function ChatContextProvider(props) {
    const { user } = useContext(UserContext)
    const { openSideMenu } = useContext(UIContext)

    const [handRaise, handRasiseDispatch] = useReducer(handRaiseReducer, {
        all: {},
        active: null
    })

    const [onlineUserslist, setOnlineUserslist] = useState({})
    const [socketUserList, setSocketUserList] = useState({})

    const onlineCallUserslistRef = useRef([])
    const [onlineCallUserslist, setOnlineCallUserslist] = useState([])

    const [allParticipantList, setAllParticipantList] = useState({})
    const [activeRoom, setActiveRoom] = useState(null)
    const [roomDetails, setRoomDetails] = useState(null)
    const [privateGroup, setPrivateGroup] = useState(null)

    const [unseenMessageMetaData, setUnseenMessageMetaData] = useState({})
    const [userLastInteractedRoom, setUserLastInteractedRoom] = useState(null)
    const [publicNotification, setPublicNotification] = useState(false)
    const [privateNotification, setPrivateNotification] = useState(false)

    const [incallChatActive, setIncallChatActive] = useState({
        status: false,
        roomId: '',
        roomName: ''
    })
    const [showInCallChat, setShowInCallChat] = useState(false)

    // const [publicRoomName, setPublicRoom] = useState("public-room-test")
    const [publicRoomName, setPublicRoom] = useState(getPublicRoomName())//callchat
    const [publicRoomMessages, setPublicRoomMessages] = useState({})
    // const [typingStatus, setTypingStatus] = useState({})

    const notificationListenerRef = useRef(null)
    const userInteractedRoomRef = useRef(null)
    const PublicChatListenerRef = useRef(null)

    const InCallPresenceListenerRef = useRef(null)
    const InCallOnlineUserListenerRef = useRef(null)
    const InCallRoomValueRef = useRef(null)
    const [inCallRoomParticipantList, setInCallRoomParticipantList] = useState({})


    const { activeMenu, setActiveMenu } = useContext(UIContext)
    const activeMenuRef = useRef(0)


    const [pollRawData, setPollRawData] = useState(null)
    const [pollNotification, setPollNotification] = useState(null)
    const pollAudio = useRef(null)

    const appMessages = useRef({})
    const appPublicGroupMessages = useRef({})
    const appRecentPrivateChatInfo = useRef({})

    // const appTypingStatusRef = useRef(
    //     {
    //         rooms: {},
    //     })

    const getPollData = (roomId) => {
        PollManager.attachPollNotificationListener(roomId, (data, err) => {
            if (err) {
                // setLoading(false);
                // console.log(err)
                return;
            }
            // console.log(data)
            if (data.state === "showQuestion") {
                if (activeMenuRef.current !== MenuStates.polls) {
                    setPollNotification(true)
                    if (data.doctype === "modified") {
                        // console.log(pollAudio.current)
                        if (pollAudio.current) {
                            pollAudio.current.play()
                        }
                    }
                    if (window.parent.notification) {
                        window.parent.notification({
                            type: 'poll',
                            message: "New Poll is live",
                            room: data.eventId
                        })
                    }

                }
            }
        });
    };

    useEffect(() => {
        window.parent.setupInCallChat = setupInCallChat;
        window.parent.closePrivateChatRoom = closePreviousChatRoom;
    }, [])
    const setupInCallChat = (value, roomId = "test-incallChat", roomName = "In Call Messages") => {
        console.log(value, roomId, roomName)
        setIncallChatActive({
            status: value,
            roomId: roomId,
            roomName: roomName,
        })
        if (value) {
            if (window.parent.connectToVideocallRoom) {
                if (roomId.includes('+')) {
                    let uids = roomId.split("+")
                    let newRoomId = uids[0].substr(0, 5) + "_" + uids[1].substr(0, 5)
                    window.parent.connectToVideocallRoom(`pods${newRoomId}`, true, true)
                } else {
                    window.parent.connectToVideocallRoom(`pods${roomId}`, false, true)
                }
            }
            openSideMenu()
            InCallRoomValueRef.current = roomId
            setShowInCallChat(true)
            //attach participant Listener
            // getOnlinPresentUserInRoom(roomId, InCallOnlineUserListenerRef.current, (data, err) => {
            //     if (err) {
            //         console.error("Error in loading online users")
            //         console.error(err)
            //         return
            //     }
            //     console.log(data)
            //     setInCallRoomParticipantList(data)
            // })
            //add disconnect Listener
            // userOnlinePresence(user, roomId, InCallPresenceListenerRef.current)
        } else {
            if (window.parent.connectToVideocallRoom) {
                window.parent.connectToVideocallRoom(null)
            }
            // if (InCallOnlineUserListenerRef.current) {
            //     InCallOnlineUserListenerRef.current.off()
            // }
            // if (InCallPresenceListenerRef.current) {
            //     InCallPresenceListenerRef.current.cancel()
            // }
            if (InCallRoomValueRef.current) {
                // goOfflineInRoom(user, InCallRoomValueRef.current)
                InCallRoomValueRef.current = null
            }
            setShowInCallChat(false)
            openSideMenu(false)
            setInCallRoomParticipantList({})
        }
    }


    useEffect(() => {
        activeMenuRef.current = activeMenu
    }, [activeMenu])

    const socketRef = useRef(null)

    function removeSocketListeners() {
        // console.log("--------removeSocketListeners--------------")
        if (socketRef.current) {
            let socket = socketRef.current
            socket.off(SOCKET_EVENT_NAMES.connect_error);
            socket.off(SOCKET_EVENT_NAMES.connect);
            socket.off(SOCKET_EVENT_NAMES.disconnect);
            socket.off(SOCKET_EVENT_NAMES.users);
            socket.off(SOCKET_EVENT_NAMES['user disconnected']);
            socket.off(SOCKET_EVENT_NAMES['user connected']);
            socket.off(SOCKET_EVENT_NAMES['private message']);
            socket.off(SOCKET_EVENT_NAMES['public messages']);
        }
    }
    useEffect(() => {
        let handleInCallUserJoin = ({ roomid, userid }) => {
            if (roomid === publicRoomName && user.uid !== userid && onlineCallUserslistRef.current.indexOf(userid) === -1) {
                onlineCallUserslistRef.current.push(userid)
                setOnlineCallUserslist(onlineCallUserslistRef.current)
            }
        }

        let handleInCallUserLeft = ({ roomid, userid }) => {
            if (roomid === publicRoomName && onlineCallUserslistRef.current.indexOf(userid) !== -1) {
                onlineCallUserslistRef.current = onlineCallUserslistRef.current.filter(id => id !== userid)
                setOnlineCallUserslist(onlineCallUserslistRef.current)
            }
        }

        let handleInCallAllUsers = (data) => {
            // console.log(data)
            let result = []
            data.forEach(socketid => {
                let __socketList = null
                setSocketUserList(prev => {
                    __socketList = prev
                    return prev
                })
                console.log(__socketList)
                if (__socketList.hasOwnProperty(socketid)) {
                    result.push(__socketList[socketid])
                }
            });
            console.log(result)
            setOnlineCallUserslist([...result])
        }

        if (user && user.isChecked && !socketRef.current) {
            // setupInCallChat()
            // connect with socket
            let socket = SocketManager.initalizeSocket(user)
            socketRef.current = socket
            // console.log(socket)
            //if invalid userName or userid is passed
            socket.on(SOCKET_EVENT_NAMES.connect_error, (err) => {
                if (err.message === "invalid username") {
                    console.error(err)
                }
            });

            socket.on(SOCKET_EVENT_NAMES.connect, () => {
                console.log(socket.id);
                console.log("Successfully Connected with Backedn via socket")
                setOnlineUserslist(prev => {
                    if (prev.hasOwnProperty(socket.auth.userid)) {
                        return {
                            ...prev,
                            [socket.auth.userid]: {
                                ...prev[socket.auth.userid],
                                connected: true,
                                self: true
                            }
                        }
                    } else {
                        return prev
                    }
                })

                //for videoCallRoomChat Only
                // console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx")
                // console.log(publicRoomName)
                if (publicRoomName !== DEFAULTPUBLICROOM) {
                    // console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx")
                    SocketManager.joinRoom(socket, publicRoomName, true, SOCKET_EVENT_NAMES['public messages'], includePublicGroupMessages);
                    socket.on(`${publicRoomName}:userJoined`, handleInCallUserJoin)
                    socket.on(`${publicRoomName}:userLeft`, handleInCallUserLeft)
                    socket.on(`${publicRoomName}:allusers`, handleInCallAllUsers)
                } else {
                    SocketManager.joinRoom(socket, publicRoomName, false, SOCKET_EVENT_NAMES['public messages'], includePublicGroupMessages);
                }

                //remove listener, maintain an array

                //getPublicChat
                socket.emit(SOCKET_EVENT_NAMES.getPublicRoomMessages, publicRoomName, (err, data) => {
                    if (err) {
                        console.error(err)
                    } else {
                        addNewMessagesInPublicRoom(data)
                    }
                })


            });

            socket.on(SOCKET_EVENT_NAMES.disconnect, (reason) => {
                setOnlineUserslist(prev => {
                    if (prev.hasOwnProperty(socket.auth.userid)) {
                        return {
                            ...prev,
                            [socket.auth.userid]: {
                                ...prev[socket.auth.userid],
                                connected: false,
                                self: true
                            }
                        }
                    } else {
                        return prev
                    }
                })
                if (reason === "io server disconnect") {
                    console.error(reason)
                    console.err("the disconnection was initiated by the server, you need to reconnect manually")
                    socket.connect();
                }
            });

            socket.on(SOCKET_EVENT_NAMES.allParticipants, (data) => {
                let result = {}
                data.forEach(user => {
                    result[user.userid] = user
                })
                setAllParticipantList(result)
            });

            socket.on(SOCKET_EVENT_NAMES.recentMessagesList, (data) => {
                appRecentPrivateChatInfo.current = data
                setUserLastInteractedRoom(appRecentPrivateChatInfo.current)
            });

            socket.on(SOCKET_EVENT_NAMES.roomDetails, async (data) => {
                let result = {}
                // let privateChatRoom = {}
                data.forEach(element => {
                    result[element.roomid] = element
                    // if (element.type === ROOM_TYPE.privateGroup) {
                    //     privateChatRoom[element.roomid] = element;
                    // }
                });
                setRoomDetails(result)
                // setPrivateGroup(privateChatRoom)
            })

            socket.on(SOCKET_EVENT_NAMES.getRoomMembersDetails, (data) => {
                // console.log(data)
                let roomids = Object.keys(data)
                roomids.forEach(roomid => {
                    SocketManager.joinRoom(socket, roomid)
                })
                setPrivateGroup(data)
            })


            socket.on(SOCKET_EVENT_NAMES.users, (users) => {
                let PartList = {}
                let socketList = {}
                users.forEach((user) => {
                    socketList[user.id] = user.userid
                    user.self = user.userid === socket.auth.userid;
                    initReactiveProperties(user);
                    PartList[user.userid] = {
                        ...user,
                        connected: true
                    }
                });
                // console.log(PartList)
                // put the current user first, and then sort by username
                // let SortedUserList = users.sort((a, b) => {
                //     if (a.self) return -1;
                //     if (b.self) return 1;
                //     if (a.username < b.username) return -1;
                //     return a.username > b.username ? 1 : 0;
                // });
                // console.log(SortedUserList)
                setSocketUserList(socketList)
                setOnlineUserslist(PartList)
            });

            socket.on(SOCKET_EVENT_NAMES['user connected'], (user) => {
                setOnlineUserslist(prev => ({
                    ...prev,
                    [user.userid]: user
                }))
                setSocketUserList(prev => ({
                    ...prev,
                    [user.id]: user.userid
                }))
            });

            socket.on(SOCKET_EVENT_NAMES['user disconnected'], (_userid) => {
                setOnlineUserslist(prev => ({
                    ...prev,
                    [_userid]: {
                        ...prev[_userid],
                        connected: false,
                    }
                }))
                // setOnlineCallUserslist(prev => {
                //     if (prev.) {
                //         let newVal = prev.filter(id => id !== _userid)
                //         return newVal
                //     }
                //     return prev
                // })
                if (onlineCallUserslistRef.current.indexOf(_userid) !== -1) {
                    onlineCallUserslistRef.current = onlineCallUserslistRef.current.filter(id => id !== _userid)
                    setOnlineCallUserslist(onlineCallUserslistRef.current)
                }
                // if (appTypingStatusRef.current.rooms.hasOwnProperty(_userid)) {
                //     let roomObj = appTypingStatusRef.current.rooms[_userid]
                //     let roomids = Object.keys(roomObj)
                //     roomids.forEach(roomid => {
                //         if (appTypingStatusRef.current.hasOwnProperty(roomid)) {
                //             if (appTypingStatusRef.current[roomid].senderid === _userid) {
                //                 appTypingStatusRef.current[roomid].status = false
                //             }
                //         }
                //     });
                //     setTypingStatus(appTypingStatusRef.current)
                // }
            });

            socket.on(SOCKET_EVENT_NAMES['private message'], includeNewMessage);

            socket.on(SOCKET_EVENT_NAMES.getPrivateRoomMessages, includedNewPrivateRoomMessages);

            socket.on(SOCKET_EVENT_NAMES.getPublicRoomMessages, (roomid, messages, operationType) => {
                if (roomid === publicRoomName) {
                    switch (operationType) {
                        case PRIVATE_MESSAGES_OPERTAION_TYPE.oldMessages:
                            addPreviousMessageInPublicRoom(messages)
                            break;
                        case PRIVATE_MESSAGES_OPERTAION_TYPE.realAll:
                            addNewMessagesInPublicRoom(messages)
                            break
                        default:
                            console.error(`public room recived message of type: ${operationType}`)
                    }
                }
            })

            // socket.on(SOCKET_EVENT_NAMES.typingIndication, ({ roomid, senderid, status }) => {
            //     appTypingStatusRef.current.rooms = {
            //         ...appTypingStatusRef.current.rooms,
            //         [senderid]: {
            //             ...appTypingStatusRef.current.rooms[senderid],
            //             [roomid]: status
            //         }
            //     }
            //     appTypingStatusRef.current[roomid] = { roomid, senderid, status }
            //     // console.log(appTypingStatusRef.current)
            //     setTypingStatus(appTypingStatusRef.current)
            // })

        } else if (socketRef.current) {
            removeSocketListeners()
        }
        return () => {
            removeSocketListeners()
            if (socketRef.current) {
                let socket = socketRef.current
                if (publicRoomName !== DEFAULTPUBLICROOM) {
                    socket.off(`${publicRoomName}:userJoined`, handleInCallUserJoin)
                    socket.off(`${publicRoomName}:userLeft`, handleInCallUserLeft)
                    socket.off(`${publicRoomName}:allusers`, handleInCallAllUsers)
                }
            }
        }
    }, [user])

    useEffect(() => {
        return
        if (user && user.isChecked) {
            // window.parent.toggleIncallChat = (value, roomId = "test-incallChat", roomName = "In Call Messages") => {
            //     setIncallChatActive({
            //         status: value,
            //         roomId: roomId,
            //         roomName: roomName,
            //     })
            //     if (value) {
            //         InCallRoomValueRef.current = roomId
            //         setShowInCallChat(true)
            //         //attach participant Listener
            //         getOnlinPresentUserInRoom(roomId, InCallOnlineUserListenerRef.current, (data, err) => {
            //             if (err) {
            //                 console.error("Error in loading online users")
            //                 console.error(err)
            //                 return
            //             }
            //             console.log(data)
            //             setInCallRoomParticipantList(data)
            //         })
            //         //add disconnect Listener
            //         userOnlinePresence(user, roomId, InCallPresenceListenerRef.current)
            //     } else {
            //         if (InCallOnlineUserListenerRef.current) {
            //             InCallOnlineUserListenerRef.current.off()
            //         }
            //         if (InCallPresenceListenerRef.current) {
            //             InCallPresenceListenerRef.current.cancel()
            //         }
            //         if (InCallRoomValueRef.current) {
            //             goOfflineInRoom(user, InCallRoomValueRef.current)
            //             InCallRoomValueRef.current = null
            //         }
            //         setInCallRoomParticipantList({})
            //     }
            // }

            let attachListenerPublic = (roomId) => {
                attachPublicChatListener(PublicChatListenerRef, roomId, (data, err) => {
                    if (err) {
                        if (err.code === "NotFound") {
                            console.error("")
                            console.error(err)
                        }
                        return
                    }
                    // console.log(data)
                    // console.log(user)
                    // console.log(activeMenuRef.current)
                    if (activeMenuRef.current !== 1 && data.userId !== user.uid) {
                        setPublicNotification({ status: true, data })
                        if (window.parent.notification) {
                            window.parent.notification({
                                type: 'publicChat',
                                senderId: data.userId,
                                senderName: data.userName,
                                message: data.message,
                                room: data.room
                            })
                        }
                    }
                })
            }
            const urlQuery = new URLSearchParams(window.location.search);
            let publicRoomURl = urlQuery.get("publicRoom");
            if (publicRoomURl) {
                setPublicRoom(publicRoomURl)
                //attachListener
                attachListenerPublic(publicRoomURl)
                //read online users list
                getOnlineUsers(AppString.USER_STATUS, (data, err) => {
                    if (err) {
                        console.error("Error in loading online users")
                        console.error(err)
                        return
                    }
                    setOnlineUserslist(data)
                })
                getOnlineUsers(`${publicRoomURl}-userStatus`, (data, err) => {
                    if (err) {
                        console.error("Error in loading online users")
                        console.error(err)
                        return
                    }
                    setOnlineCallUserslist(data)
                })
                getPollData(publicRoomURl)

            } else {
                //attachListener
                attachListenerPublic(publicRoomName)
                //read online users list
                getOnlineUsers(AppString.USER_STATUS, (data, err) => {
                    if (err) {
                        console.error("Error in loading online users")
                        console.error(err)
                        return
                    }
                    setOnlineUserslist(data)
                })
                getOnlineUsers(AppString.USERINCALL_STATUS, (data, err) => {
                    if (err) {
                        console.error("Error in loading online users")
                        console.error(err)
                        return
                    }
                    setOnlineCallUserslist(data)
                })
                getPollData(publicRoomName)
            }
        }

        return () => {
            if (InCallPresenceListenerRef.current) {
                InCallPresenceListenerRef.current.cancel()
            }
            return () => {
                PollManager.removePollListener();
            };
        }
    }, [user])

    useEffect(() => {
        return
        if (user && user.isChecked) {
            //read room name user have interacted
            attachNotificationListener(notificationListenerRef.current, user.uid, (data, err) => {
                if (err) {
                    if (err.code === "NotFound") {
                        setUnseenMessageMetaData({})
                    } else {
                        console.error(err)
                    }
                    return
                }
                console.log(data)
                setUnseenMessageMetaData(data)

                if (window.parent.notification) {
                    let result = []
                    Object.keys(data).forEach(userId => {
                        result.push({
                            ...data[userId],
                            userId: userId,
                        })
                    })

                    if (result.length > 0) {
                        sortObjectArray(result, "createdAt")
                        let details = {
                            type: 'privateChat',
                            senderId: result[0].userId,
                            senderName: result[0].name ?? "Participant",
                            message: result[0].message,
                            room: result[0].roomId,
                            count: result[0].count,
                        }
                        console.log(details)
                        window.parent.notification(details)
                    }
                }
            })

            getUserInteractedRoom(userInteractedRoomRef.current, user.uid, (data, err) => {
                if (err) {
                    console.error(err)
                    return
                }
                // console.log(data)
                let result = []
                Object.keys(data).forEach(roomid => {
                    let roomDetails = data[roomid]
                    // console.log(roomDetails)
                    let otherParticipantId = roomDetails.participants.filter(id => id !== user.uid)[0]
                    if (otherParticipantId) {
                        let otherParticipantName = roomDetails[otherParticipantId]
                        result.push({
                            otherParticipant: {
                                id: otherParticipantId,
                                name: otherParticipantName,
                            },
                            createdAt: roomDetails.createdAt,
                            message: roomDetails.message,
                            senderName: roomDetails.name,
                            senderId: roomDetails.id,
                        })
                    }
                })
                sortObjectArray(result, "createdAt")
                // console.log(result)
                if (result.length > 5) {
                    let newResult = [result[0], result[1], result[2], result[3], result[4]]
                    setUserLastInteractedRoom(newResult)
                } else {
                    setUserLastInteractedRoom(result)
                }
            })

            //AllParticipant
            getAllParticipants((data, err) => {
                if (err) {
                    console.error("Error in loading online users")
                    console.error(err)
                    return
                }
                setAllParticipantList(data)
            })
        }
        return () => {
            if (notificationListenerRef.current) {
                notificationListenerRef.current.off()
            }
        }
    }, [user])

    const includeNewMessage = ({ message, senderid, roomid, createdat, messageid }) => {
        if (appMessages.current.hasOwnProperty(roomid)) {
            appMessages.current[roomid] = {
                ...appMessages.current[roomid],
                [new Date(createdat).getTime()]: { message, senderid, roomid, createdat, messageid }
            }
        } else {
            appMessages.current[roomid] = {
                [new Date(createdat).getTime()]: { message, senderid, roomid, createdat, messageid }
            }
        }

        let currentRoomId = null
        setActiveRoom(prev => {
            if (prev) {
                currentRoomId = prev.roomId
                if (prev.roomId === roomid) {
                    //activeroom is same as roomid of new message
                    if (senderid !== user.uid) {
                        socketRef.current.emit(SOCKET_EVENT_NAMES.markAsSeen, roomid, user.uid, messageid, (err, data) => {
                            console.log(err, data)
                        })
                    }
                    return {
                        ...prev,
                        messages: appMessages.current[roomid]
                    }
                }
            } else {
                return prev
            }
        })

        let currentActiveMenu = null
        setActiveMenu(prev => {
            currentActiveMenu = prev
            return prev
        })
        if (currentActiveMenu !== MenuStates.participants) {
            setPrivateNotification(true)
        }


        if (appRecentPrivateChatInfo.current) {
            let doreorder = false
            let reorderIndex = -1
            let prevRecord = null
            appRecentPrivateChatInfo.current.forEach((msg, index) => {
                if (msg.roomid === roomid) {
                    doreorder = true
                    reorderIndex = index
                    prevRecord = msg
                }
            })
            if (doreorder) {
                appRecentPrivateChatInfo.current.splice(reorderIndex, 1)
                appRecentPrivateChatInfo.current.unshift({
                    message,
                    messageid,
                    senderid,
                    roomid,
                    createdat,
                    otherparticipantid: prevRecord.otherparticipantid
                })
                setUserLastInteractedRoom(appRecentPrivateChatInfo.current)
                // console.log("old user ---recent")
            } else {
                if (socketRef.current) {
                    // console.log("new user ---recent")
                    socketRef.current.emit(SOCKET_EVENT_NAMES.recentMessagesList)
                }
            }
        }

        if (currentRoomId !== roomid) {
            setRoomDetails(prev => {
                if (senderid === user.uid) {
                    // console.log("inc0")
                    return {
                        ...prev,
                        [roomid]: {
                            lastmessageid: messageid,
                            roomid,
                            unreadcount: 0,
                        }
                    }
                } else {
                    // console.log("inc")
                    return {
                        ...prev,
                        [roomid]: {
                            lastmessageid: messageid,
                            roomid,
                            unreadcount: prev[roomid] ? (prev[roomid].unreadcount ? prev[roomid].unreadcount + 1 : 1) : 1,
                        }
                    }
                }
            })
        }
    }

    const includedNewPrivateRoomMessages = ({ roomid, messages, operationType = PRIVATE_MESSAGES_OPERTAION_TYPE.realAll }) => {
        messages.reverse()
        let messagesBox = {}
        messages.forEach(msg => {
            messagesBox = {
                ...messagesBox,
                [new Date(msg.createdat).getTime()]: msg
            }
        })

        if (appMessages.current.hasOwnProperty(roomid)) {
            if (operationType === PRIVATE_MESSAGES_OPERTAION_TYPE.oldMessages) {
                appMessages.current[roomid] = {
                    ...messagesBox,
                    ...appMessages.current[roomid],
                }
            } else {
                appMessages.current[roomid] = {
                    ...appMessages.current[roomid],
                    ...messagesBox,
                }
            }

        } else {
            appMessages.current[roomid] = {
                ...messagesBox,
            }
        }
        setActiveRoom(prev => {
            if (prev) {
                if (prev.roomId === roomid) {
                    return {
                        ...prev,
                        messages: appMessages.current[roomid]
                    }
                }
            } else {
                return prev
            }
        })
    }

    const includePublicGroupMessages = ({ message, senderid, roomid, createdat, messageid }) => {
        // console.log("includePublicGroupMessages")
        // console.log({ message, senderid, roomid, createdat, messageid })
        if (roomid === publicRoomName) {
            // console.log(appPublicGroupMessages.current)
            let currentActiveMenu = null
            setActiveMenu(prev => {
                currentActiveMenu = prev
                return prev
            })
            // console.log(currentActiveMenu)

            if (currentActiveMenu !== MenuStates.publicChat) {
                setPublicNotification(true)
            }
            appPublicGroupMessages.current = {
                ...appPublicGroupMessages.current,
                [createdat]: { message, senderid, roomid, createdat, messageid }
            }
            setPublicRoomMessages(appPublicGroupMessages.current)
        }
    }

    const getPrivateRoomMessages = (roomid, operationType = PRIVATE_MESSAGES_OPERTAION_TYPE.realAll, messageid = null) => {
        if (socketRef.current) {
            // console.log(messageData)
            let options = {
                roomid,
                operationType,
            }
            if (messageid) {
                options = {
                    ...options,
                    messageid
                }
            } else {
                options = {
                    ...options,
                    operationType: PRIVATE_MESSAGES_OPERTAION_TYPE.realAll
                }
            }

            let socket = socketRef.current
            socket.emit(SOCKET_EVENT_NAMES.getPrivateRoomMessages, options);
        }
    }

    const getRoomUpdatedMessage = (roomId) => {
        let _roomMessages = null
        if (appMessages.current.hasOwnProperty(roomId)) {
            _roomMessages = appMessages.current[roomId]
        }

        if (_roomMessages) {
            let lastMessageId = null
            let _messages = Object.values(_roomMessages)
            if (_messages.length > 0) {
                lastMessageId = _messages[0].messageid
                getPrivateRoomMessages(roomId, PRIVATE_MESSAGES_OPERTAION_TYPE.newMessages, lastMessageId)
            } else {
                getPrivateRoomMessages(roomId)
            }

        } else {
            getPrivateRoomMessages(roomId)
        }
        return _roomMessages
    }

    const openChatWithUser = async (userData) => {
        //open the room
        let roomId = getRoomIdWithUser(user.uid, userData.userid)
        if (onlineUserslist && onlineUserslist[userData.userid]) {
            if (onlineUserslist[userData.userid].id) {
                userData = {
                    ...userData,
                    socketId: onlineUserslist[userData.userid].id
                }
            }
        }

        let _roomMessages = getRoomUpdatedMessage(roomId)

        setActiveRoom({
            roomId: roomId,
            participant: userData,
            messages: _roomMessages,
            type: ROOM_TYPE['one-On-one']
        })

        setRoomDetails(prev => ({
            ...prev,
            [roomId]: {
                lastmessageid: null,
                roomid: roomId,
                unreadcount: 0,
            }
        }))
    }

    const openGroupChat = (groupData) => {
        // console.log(groupData)
        let _roomMessages = getRoomUpdatedMessage(groupData.roomid)
        setActiveRoom({
            roomId: groupData.roomid,
            participant: groupData,
            messages: _roomMessages,
            type: ROOM_TYPE.privateGroup
        })
        setRoomDetails(prev => ({
            ...prev,
            [groupData.roomid]: {
                ...prev[groupData.roomid],
                unreadcount: 0,
            }
        }))
    }

    const sendMessage = async (messageData) => {
        if (socketRef.current) {
            // console.log(messageData)
            let socket = socketRef.current
            socket.emit(SOCKET_EVENT_NAMES['private message'], messageData);
        }
    }

    const sendPublicMessage = async (messageData) => {
        if (socketRef.current) {
            // console.log(messageData)
            let socket = socketRef.current
            socket.emit(SOCKET_EVENT_NAMES['public messages'], messageData);
        }
    }

    const closePreviousChatRoom = () => {
        setActiveRoom(null)
    }

    const getOldMessages = async (roomId, lastMessageId) => {
        // console.log("get old messages")
        getPrivateRoomMessages(roomId, PRIVATE_MESSAGES_OPERTAION_TYPE.oldMessages, lastMessageId)
    }

    const getPublicRoomOldMessage = async (roomid, lastMessageId) => {
        let socket = socketRef.current
        if (socket) {
            // console.log("get old messages from public room")
            let options = {
                roomid,
                operationType: PRIVATE_MESSAGES_OPERTAION_TYPE.oldMessages,
                messageid: lastMessageId,
            }
            socket.emit(SOCKET_EVENT_NAMES.getPublicRoomMessages, roomid, (err, data) => {
                if (err) {
                    console.error(err)
                } else {
                    addPreviousMessageInPublicRoom(data)
                }
            }, options);
        }
    }

    const addPreviousMessageInPublicRoom = (data) => {
        // console.log("addPreviousMessageInPublicRoom")
        // console.log(data)
        let publicMessages = {}
        data.reverse()
        data.forEach(msg => {
            publicMessages[new Date(msg.createdat).getTime()] = msg
        })
        appPublicGroupMessages.current = {
            ...publicMessages,
            ...appPublicGroupMessages.current,
        }
        setPublicRoomMessages(appPublicGroupMessages.current)
    }

    const addNewMessagesInPublicRoom = (data) => {
        // console.log("addNewMessagesInPublicRoom")
        // console.log(data)
        let publicMessages = {}
        data.reverse()
        data.forEach(msg => {
            publicMessages[new Date(msg.createdat).getTime()] = msg
        })
        appPublicGroupMessages.current = {
            ...appPublicGroupMessages.current,
            ...publicMessages,
        }
        setPublicRoomMessages(appPublicGroupMessages.current)
    }

    // const removeNotification = (uid) => {
    //     delete unseenMessageMetaData[uid]
    //     setUnseenMessageMetaData(uid)
    // }

    return (
        <>
            <SocketContext.Provider value={socketRef.current}>
                <ChatContext.Provider value={{
                    onlineUserslist,
                    onlineCallUserslist, openChatWithUser,
                    activeRoom, closePreviousChatRoom,
                    unseenMessageMetaData, userLastInteractedRoom,
                    allParticipantList, publicRoomName,
                    publicNotification, setPublicNotification,
                    incallChatActive, setupInCallChat, showInCallChat, setShowInCallChat,
                    inCallRoomParticipantList, pollNotification,
                    setPollNotification, sendMessage,
                    publicRoomMessages, sendPublicMessage,
                    privateNotification, setPrivateNotification
                }}>
                    <MessageContext.Provider value={{ getOldMessages, getPublicRoomOldMessage }}>
                        <RoomContext.Provider value={{ privateGroup, roomDetails, openGroupChat, socketUserList, onlineCallUserslist }}>
                            <HandRaiseVideoCallContext.Provider value={{
                                handRaise, addIdToHandRaise: (id, name, timer = 4000) => {
                                    handRasiseDispatch({ type: HANDRAISE_ACTION_TYPE.add, payload: { id, name } })
                                    setTimeout(() => {
                                        handRasiseDispatch({ type: HANDRAISE_ACTION_TYPE.remove, payload: { id, name } })
                                    }, timer)
                                }
                            }}>
                                {props.children}
                            </HandRaiseVideoCallContext.Provider >
                        </RoomContext.Provider>
                    </MessageContext.Provider>
                </ChatContext.Provider>
            </SocketContext.Provider>
            <audio ref={pollAudio}>
                <source src="/assets/sounds/notification.mp3" type="audio/mpeg" />
            </audio>
        </>
    )
}
