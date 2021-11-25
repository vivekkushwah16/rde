import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { ChatContext, MessageContext, RoomContext, SocketContext } from '../../Context/Chat/ChatContextProvider'
import { AvatarStyle, EMOJIS, getInitals } from '../../Utility'
import { ReceivedMsg, SentMsg } from '../Messages'
import '../../Assets/css/chatRoom.css'
import { UserContext } from '../../Context/Auth/UserContextProvider'
import arrowSvg from "../../Assets/svg/arrow.svg"
import { UIContext } from '../../Context/UIContextProvider'
import SocketManager, { SOCKET_EVENT_NAMES } from '../../Manager/Socket'
import Tooltip from 'rc-tooltip';
import NewMessageForm from '../../Components/NewMessageForm'

export default function InCallChatRoom() {
    const { user } = useContext(UserContext)
    const { allParticipantList, incallChatActive, setShowInCallChat } = useContext(ChatContext)
    const { getParticipantColorNumber } = useContext(UIContext)
    const { socketUserList } = useContext(RoomContext)

    const socket = useContext(SocketContext)
    const [openEmojiContainer, setEmojiContainerOpen] = useState(false)
    const [typedMessage, setTypedMessage] = useState("")
    const [typingIndicator, setTypingIndicator] = useState(false)

    const [messages, setMessages] = useState(JSON.parse(sessionStorage.getItem(`${incallChatActive.roomId}_messages`)))
    const [participant, setParticipant] = useState([])
    const participantRef = useRef([])

    const avartStyleRandom = useRef(getParticipantColorNumber(incallChatActive.roomId))


    const chatBodyRef = useRef(null)
    const manualScrollUp = useRef(false)

    let inputRef = useRef(null)

    let messageContainer = useRef({})
    let socketUserListRef = useRef(socketUserList)

    useEffect(() => {
        socketUserListRef.current = socketUserList

    }, [socketUserList])

    useEffect(() => {
        let handleScroll = (event) => {
            let scrollHeightForRebond = chatBodyRef.current.scrollHeight - Math.floor(chatBodyRef.current.scrollHeight * 0.4)
            let matrix = chatBodyRef.current.scrollTop < scrollHeightForRebond
            if (matrix) {
                manualScrollUp.current = true
            } else {
                manualScrollUp.current = false
            }
        }
        if (chatBodyRef.current) {
            chatBodyRef.current.addEventListener("scroll", handleScroll)
        }
        return () => {
            if (chatBodyRef.current) {
                chatBodyRef.current.removeEventListener("scroll", handleScroll)
            }
        }
    }, [chatBodyRef.current])

    useEffect(() => {
        let handleDisconnect = (_userid) => {
            setTypingIndicator(prev => {
                if (prev.userid === _userid) {
                    return {
                        userid: _userid,
                        status: false,
                    }
                } else {
                    return prev
                }
            })
        }
        let handleTypingIndication = ({ roomid, senderid, status }) => {
            if (roomid === incallChatActive.roomId) {
                setTypingIndicator({
                    userid: senderid,
                    status: status,
                })
            }
        }

        let handleFocusIn = () => {
            if (socket) {
                socket.emit(SOCKET_EVENT_NAMES.typingIndication, incallChatActive.roomId, user.uid, incallChatActive.roomId, true)
            }
        }
        let handleFocusOut = () => {
            if (socket)
                socket.emit(SOCKET_EVENT_NAMES.typingIndication, incallChatActive.roomId, user.uid, incallChatActive.roomId, false)
        }

        let handleInCallMessages = ({ message, senderid, roomid, createdat, messageid }) => {
            if (roomid === incallChatActive.roomId) {
                messageContainer.current[new Date(createdat).getTime()] = { message, senderid, roomid, createdat, messageid }
                setMessages(prev => ({
                    ...prev,
                    [new Date(createdat).getTime()]: { message, senderid, roomid, createdat, messageid }
                }))
                sessionStorage.setItem(`${incallChatActive.roomId}_messages`, JSON.stringify(messageContainer.current))
            }
        }

        let handleInCallUserJoin = ({ roomid, userid }) => {
            if (roomid === incallChatActive.roomId && user.uid !== userid && participantRef.current.indexOf(userid) === -1) {
                participantRef.current.push(userid)
                setParticipant(participantRef.current)
            }
        }

        let handleInCallUserLeft = ({ roomid, userid }) => {
            if (roomid === incallChatActive.roomId) {
                participantRef.current = participantRef.current.filter(id => id !== userid)
                setParticipant(participantRef.current)
            }
        }

        let handleAllUsers = (data) => {
            let result = []
            data.forEach(socketid => {
                console.log(socketUserListRef.current)
                console.log(socketid)
                if (socketUserListRef.current.hasOwnProperty(socketid)) {
                    result.push(socketUserListRef.current[socketid])
                }
            });
            console.log(result)
            participantRef.current = [...result]
            setParticipant(participantRef.current)
        }

        if (socket) {
            SocketManager.joinRoom(socket, incallChatActive.roomId)

            inputRef.current.addEventListener("focusin", handleFocusIn);
            inputRef.current.addEventListener("focusout", handleFocusOut);
            inputRef.current.focus()

            if (socket) {
                socket.emit(SOCKET_EVENT_NAMES.typingIndication, incallChatActive.roomId, user.uid, incallChatActive.roomId, true)
                socket.on(SOCKET_EVENT_NAMES.typingIndication, handleTypingIndication)
                socket.on(SOCKET_EVENT_NAMES['user disconnected'], handleDisconnect)
                socket.on(SOCKET_EVENT_NAMES.inCallMessaegs, handleInCallMessages)
                socket.on(`${incallChatActive.roomId}:userJoined`, handleInCallUserJoin)
                socket.on(`${incallChatActive.roomId}:userLeft`, handleInCallUserLeft)
                socket.on(`${incallChatActive.roomId}:allusers`, handleAllUsers)
            }
        }

        return () => {
            if (socket) {
                SocketManager.leaaveRoom(socket, incallChatActive.roomId)
                socket.emit(SOCKET_EVENT_NAMES.typingIndication, incallChatActive.roomId, user.uid, incallChatActive.roomId, false)
                socket.off(SOCKET_EVENT_NAMES.typingIndication, handleTypingIndication)
                socket.off(SOCKET_EVENT_NAMES['user disconnected'], handleDisconnect)
                socket.off(SOCKET_EVENT_NAMES.inCallMessaegs, handleInCallMessages)
                socket.off(`${incallChatActive.roomId}:allusers`, handleAllUsers)
            }
            if (inputRef.current) {
                inputRef.current.removeEventListener("focusin", handleFocusIn);
                inputRef.current.removeEventListener("focusout", handleFocusOut);
            }
        }
    }, [socket])


    const handleBtnClick = (event) => {
        if (event) {
            event.preventDefault();
        }
        if (socket) {
            socket.emit(SOCKET_EVENT_NAMES.inCallMessaegs, {
                message: typedMessage, senderid: user.uid, roomid: incallChatActive.roomId, to: incallChatActive.roomId,
                // isFirstMessage: canbeFirstMessage 
            })
        }
        chatBodyRef.current.scrollTo(0, chatBodyRef.current.scrollHeight)
        setTypedMessage("")
    }

    let currentDate = null
    const onbackClick = (e) => {
        if (e) {
            e.preventDefault()
        }
        setShowInCallChat(false)
    }
    return (
        <div className="sidebar__body">
            <div className="chat-section">

                <div className="chat-header" onClick={onbackClick}>
                    <img src={arrowSvg} alt="arrowSvg" />
                    <div className="user-profile">
                        <span className="user-profile__title">
                            <b>
                                {incallChatActive.roomName}
                            </b>
                            <small>
                                {
                                    typingIndicator &&
                                        typingIndicator.status &&
                                        typingIndicator.userid
                                        ? `${allParticipantList[typingIndicator.userid].name} typing...` : participant.length > 0 && `${participant.length} active`
                                }
                            </small>
                        </span>
                    </div>
                    <div className="headerMemberList-container">
                        {
                            participant.map(user => (
                                <Tooltip id="listMemberTooltip" placement="bottom" trigger={['hover']} overlay={<span >{allParticipantList[user].name}</span>}>
                                    <span className={`user-profile__image ${AvatarStyle[getParticipantColorNumber(user)]} headerMemberList`} >{getInitals(allParticipantList[user].name)}</span>
                                </Tooltip>
                            ))
                        }
                    </div>
                </div>


                <div className="chat-section__body" ref={chatBodyRef}>
                    {
                        messages && Object.keys(messages).map(key => {
                            let currentMsgDate = new Date(parseInt(key)).toLocaleDateString()
                            let addDateHeader = false
                            if (currentMsgDate !== currentDate) {
                                addDateHeader = true
                                currentDate = currentMsgDate
                            }
                            let messageDetails = messages[key]
                            if (messageDetails.senderid !== user.uid) {
                                return (
                                    <>
                                        {
                                            addDateHeader &&
                                            <div className={`dateContainer ${AvatarStyle[avartStyleRandom.current]}`}>
                                                <div>
                                                    {currentDate}
                                                </div>
                                                <hr />
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
                                                <hr />
                                            </div>
                                        }
                                        <SentMsg id={`msg-${key}`} userId={messageDetails.senderid} time={messageDetails.createdat} key={messageDetails.createdat + "+" + messageDetails.senderid} name={allParticipantList[messageDetails.senderid].name} message={messageDetails.message} />
                                    </>)
                            }
                        })
                    }
                </div>
                {
                    incallChatActive &&
                    <NewMessageForm setTypedMessage={setTypedMessage} handleBtnClick={handleBtnClick} typedMessage={typedMessage} inputRef={inputRef} />
                }
            </div>
        </div >
    )
}
