import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { ChatContext, MessageContext } from '../../Context/Chat/ChatContextProvider'
import { AvatarStyle, EMOJIS, getInitals, LOREM_TEXT } from '../../Utility'
import { ReceivedMsg, SentMsg } from '../Messages'
import '../../Assets/css/chatRoom.css'
import { attachNewMessagesListener, attachOnDisconnectForTyping, attachTypingIndicator, removeNotification, sendMessage1on1, singalTypingIndicator } from '../../Firebase/chatManager'
import { UserContext } from '../../Context/Auth/UserContextProvider'
import { database } from '../../Firebase'
import { AppString } from '../../Firebase/constant'
import arrowSvg from "../../Assets/svg/arrow.svg"
import { UIContext } from '../../Context/UIContextProvider'
import NewMessageForm from '../../Components/NewMessageForm'

export default function PublicGroupChatRoom() {
    const { user } = useContext(UserContext)
    const { activeRoom, sendPublicMessage, allParticipantList, publicRoomMessages, publicRoomName } = useContext(ChatContext)
    const { getPublicRoomOldMessage } = useContext(MessageContext)

    const [typedMessage, setTypedMessage] = useState("")

    const chatBodyRef = useRef(null)
    const manualScrollUp = useRef(false)
    let inputRef = useRef(null)

    useEffect(() => {
        inputRef.current.focus()
    }, [])


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
                let messageId = publicRoomMessages[Object.keys(publicRoomMessages)[0]].messageid
                lastMessageIdBeforeScroll.current = "msg-" + Object.keys(publicRoomMessages)[0]
                getPublicRoomOldMessage(publicRoomName, messageId)
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
    }, [chatBodyRef.current, publicRoomMessages])


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
    }, [publicRoomMessages])

    const handleBtnClick = (event) => {
        if (event) {
            event.preventDefault();
        }
        sendPublicMessage({ message: typedMessage, senderid: user.uid, roomid: publicRoomName })
        chatBodyRef.current.scrollTo(0, chatBodyRef.current.scrollHeight)
        setTypedMessage("")
    }
    let currentDate = null

    return (
        <div className="sidebar__body">
            <div className="chat-section">
                <div className="chat-section__body" ref={chatBodyRef}>
                    {
                        publicRoomMessages && Object.keys(publicRoomMessages).map(key => {
                            let currentMsgDate = new Date(parseInt(key)).toLocaleDateString()
                            let addDateHeader = false
                            if (currentMsgDate !== currentDate) {
                                addDateHeader = true
                                currentDate = currentMsgDate
                            }
                            let messageDetails = publicRoomMessages[key]
                            if (!allParticipantList[messageDetails.senderid]) {
                                console.log(messageDetails.senderid)
                                let aa = { ...allParticipantList }
                                console.log(aa)
                                console.log(aa[messageDetails.senderid])
                                Object.keys(aa).forEach(key => console.log(key, aa[key]))
                                return null
                            }
                            if (messageDetails.senderid !== user.uid) {
                                return (
                                    <>
                                        {
                                            addDateHeader &&
                                            <div className={`dateContainer`}>
                                                <div>
                                                    {currentDate}
                                                </div>
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
                                            <div className={`dateContainer`}>
                                                <div>
                                                    {currentDate}
                                                </div>
                                            </div>
                                        }
                                        <SentMsg id={`msg-${key}`} userId={messageDetails.senderid} time={messageDetails.createdat} key={messageDetails.createdat + "+" + messageDetails.senderid} name={allParticipantList[messageDetails.senderid].name} message={messageDetails.message} />
                                    </>)
                            }
                        })
                    }
                </div>
                <NewMessageForm setTypedMessage={setTypedMessage} handleBtnClick={handleBtnClick} typedMessage={typedMessage} inputRef={inputRef} />
            </div>
        </div>
    )
}
