import { useCallback, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { ChatContext, MessageContext, SocketContext } from '../../Context/Chat/ChatContextProvider'
import { AvatarStyle, EMOJIS, getInitals, LOREM_TEXT } from '../../Utility'
import { ReceivedMsg, SentMsg } from '../Messages'
import '../../Assets/css/chatRoom.css'
import { attachNewMessagesListener, attachOnDisconnectForTyping, attachTypingIndicator, getRoomIdWithUser, removeNotification, sendMessage1on1, singalTypingIndicator } from '../../Firebase/chatManager'
import { UserContext } from '../../Context/Auth/UserContextProvider'
import { database } from '../../Firebase'
import { AppString } from '../../Firebase/constant'
import arrowSvg from "../../Assets/svg/arrow.svg"
import { UIContext } from '../../Context/UIContextProvider'
import { SOCKET_EVENT_NAMES } from '../../Manager/Socket'
import NewMessageForm from '../../Components/NewMessageForm'

export default function PrivateChatRoom() {
    const { user } = useContext(UserContext)
    const { activeRoom, closePreviousChatRoom, sendMessage, allParticipantList, typingStatus, appTypingStatusRef } = useContext(ChatContext)
    const { getOldMessages } = useContext(MessageContext)
    const { getParticipantColorNumber } = useContext(UIContext)
    const socket = useContext(SocketContext)
    const [openEmojiContainer, setEmojiContainerOpen] = useState(false)
    const [typedMessage, setTypedMessage] = useState("")

    const [typingIndicator, setTypingIndicator] = useState(false)
    const chatBodyRef = useRef(null)
    const manualScrollUp = useRef(false)
    const initals = useRef(getInitals(activeRoom.participant.name))
    const avartStyleRandom = useRef(getParticipantColorNumber(activeRoom.participant.id))

    let currentChatListenerRef = useRef(null)
    let typingListenerRef = useRef(null)
    let typingDisconnectRef = useRef(null)


    let inputRef = useRef(null)

    let canbeFirstMessage = useMemo(() => {
        if (activeRoom.messages) {
            return Object.keys(activeRoom.messages).length === 0
        } else {
            return true
        }
    }, [activeRoom])

    let loadingOld = useRef(false)
    let lastMessageIdBeforeScroll = useRef(null)


    useEffect(() => {
        let handleScroll = (event) => {
            let scrollHeightForRebond = chatBodyRef.current.scrollHeight - Math.floor(chatBodyRef.current.scrollHeight * 0.4)
            let matrix = chatBodyRef.current.scrollTop < scrollHeightForRebond
            if (matrix) {
                manualScrollUp.current = true
            } else {
                manualScrollUp.current = false
            }
            if (chatBodyRef.current.scrollTop === 0 && !loadingOld.current) {
                //get earlier msgs
                loadingOld.current = true
                let messageId = activeRoom.messages[Object.keys(activeRoom.messages)[0]].messageid
                console.log(activeRoom.messages)
                console.log(messageId)
                lastMessageIdBeforeScroll.current = "msg-" + Object.keys(activeRoom.messages)[0]
                getOldMessages(activeRoom.roomId, messageId)
            }
        }
        if (chatBodyRef.current) {
            chatBodyRef.current.addEventListener("scroll", handleScroll)
        }

        return () => {
            if (chatBodyRef.current) {
                chatBodyRef.current.removeEventListener("scroll", handleScroll)
                // if (currentChatListenerRef.current)
                //     currentChatListenerRef.current.off()
                // if (typingListenerRef.current)
                //     typingListenerRef.current.off()
                // if (typingDisconnectRef.current)
                //     typingDisconnectRef.current.cancel();
            }
        }
    }, [chatBodyRef.current, activeRoom.messages])

    useEffect(() => {
        let handleDisconnect = (_userid) => {
            if (_userid === activeRoom.participant.userid) {
                setTypingIndicator(false)
            }
        }
        let handleTypingIndication = ({ roomid, senderid, status }) => {
            if (roomid === activeRoom.roomId) {
                setTypingIndicator(status)
            }
        }

        let handleFocusIn = () => {
            if (socket) {
                socket.emit(SOCKET_EVENT_NAMES.typingIndication, activeRoom.roomId, user.uid, activeRoom.participant.userid, true)
            }
        }
        let handleFocusOut = () => {
            if (socket)
                socket.emit(SOCKET_EVENT_NAMES.typingIndication, activeRoom.roomId, user.uid, activeRoom.participant.userid, false)
        }
        if (socket) {
            inputRef.current.addEventListener("focusin", handleFocusIn);
            inputRef.current.addEventListener("focusout", handleFocusOut);
            inputRef.current.focus()
            if (socket) {
                socket.emit(SOCKET_EVENT_NAMES.typingIndication, activeRoom.roomId, user.uid, activeRoom.participant.userid, true)
                socket.emit(SOCKET_EVENT_NAMES.markAsSeen, activeRoom.roomId, user.uid, null, (err, data) => {
                    console.log(err)
                    console.log(data)
                })

                socket.on(SOCKET_EVENT_NAMES.typingIndication, handleTypingIndication)
                socket.on(SOCKET_EVENT_NAMES['user disconnected'], handleDisconnect)
            }

        }

        return () => {
            if (socket) {
                socket.emit(SOCKET_EVENT_NAMES.typingIndication, activeRoom.roomId, user.uid, activeRoom.participant.userid, false)
                socket.off(SOCKET_EVENT_NAMES.typingIndication, handleTypingIndication)
                socket.off(SOCKET_EVENT_NAMES['user disconnected'], handleDisconnect)
            }
            if (inputRef.current) {
                inputRef.current.removeEventListener("focusin", handleFocusIn);
                inputRef.current.removeEventListener("focusout", handleFocusOut);
            }
        }
    }, [socket])

    useEffect(() => {
        // if (chatBodyRef.current && !manualScrollUp.current) {
        //     chatBodyRef.current.scrollTo(0, chatBodyRef.current.scrollHeight)
        // }

        if (lastMessageIdBeforeScroll.current && loadingOld.current) {
            loadingOld.current = false
            let el = document.querySelector(`#${lastMessageIdBeforeScroll.current}`)
            console.log(el, lastMessageIdBeforeScroll.current)
            if (el)
                el.scrollIntoView({ behavior: "smooth" })
            lastMessageIdBeforeScroll.current = null
        } else {
            if (chatBodyRef.current) {
                chatBodyRef.current.scrollTo(0, chatBodyRef.current.scrollHeight)
            }
        }
    }, [activeRoom.messages])

    const handleBtnClick = (event) => {
        if (event) {
            event.preventDefault();
        }
        sendMessage({ message: typedMessage, senderid: user.uid, roomid: activeRoom.roomId, to: activeRoom.participant.userid, isFirstMessage: canbeFirstMessage })
        chatBodyRef.current.scrollTo(0, chatBodyRef.current.scrollHeight)
        setTypedMessage("")
    }

    let currentDate = null
    return (
        <div className="sidebar__body">
            <div className="chat-section">
                <div className="chat-header" onClick={closePreviousChatRoom}>
                    <img src={arrowSvg} alt="arrowSvg" />
                    <div className="user-profile">
                        <span className={`user-profile__image ${AvatarStyle[avartStyleRandom.current]}`}>{initals.current}</span>
                        <span className="user-profile__title">
                            <b>
                                {activeRoom.participant.name.toLowerCase()}
                            </b>
                            <small>
                                {
                                    typingIndicator ? "typing..." : "Participant"
                                }
                            </small>
                        </span>
                    </div>
                </div>
                <div className="chat-section__body" ref={chatBodyRef}>
                    {
                        activeRoom.messages && Object.keys(activeRoom.messages).map(key => {
                            let currentMsgDate = new Date(parseInt(key)).toLocaleDateString()
                            let addDateHeader = false
                            if (currentMsgDate !== currentDate) {
                                addDateHeader = true
                                currentDate = currentMsgDate
                            }
                            let messageDetails = activeRoom.messages[key]
                            if (messageDetails.senderid !== user.uid) {
                                return (
                                    <>
                                        {
                                            addDateHeader &&
                                            <div className={`dateContainer ${AvatarStyle[avartStyleRandom.current]}`}>
                                                <div>
                                                    {currentDate}
                                                </div>
                                                {/* <hr /> */}
                                            </div>
                                        }
                                        <ReceivedMsg id={`msg-${key}`} userId={messageDetails.senderid} time={messageDetails.createdat} key={messageDetails.createdat + "+" + messageDetails.senderid} name={allParticipantList[messageDetails.senderid].name} message={messageDetails.message} />
                                    </>
                                )
                            } else {
                                return (
                                    <>
                                        {
                                            addDateHeader &&
                                            <div className={`dateContainer ${AvatarStyle[avartStyleRandom.current]}`}>
                                                <div>
                                                    {currentDate}
                                                </div>
                                                {/* <hr /> */}
                                            </div>
                                        }
                                        <SentMsg id={`msg-${key}`} userId={messageDetails.senderid} time={messageDetails.createdat} key={messageDetails.createdat + "+" + messageDetails.senderid} name={allParticipantList[messageDetails.senderid].name} message={messageDetails.message} />
                                    </>)
                            }
                        })
                    }
                </div>
                {
                    activeRoom &&
                    <NewMessageForm setTypedMessage={setTypedMessage} handleBtnClick={handleBtnClick} typedMessage={typedMessage} inputRef={inputRef} />
                }
            </div>
        </div >
    )
}
