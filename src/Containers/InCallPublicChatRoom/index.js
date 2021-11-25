import React, { useContext, useEffect, useRef, useState } from 'react'
import NewMessageForm from '../../Components/NewMessageForm'
import { UserContext } from '../../Context/Auth/UserContextProvider'
import { ChatContext } from '../../Context/Chat/ChatContextProvider'
import { InCallChatContext } from '../../Context/InCallChat/InCallChatContextProvider'
import { ReceivedMsg, SentMsg } from '../Messages'

export default function InCallPublicChatRoom() {
    const { user } = useContext(UserContext)
    const { inCallChatState, sendMessage, getPublicRoomOldMessage } = useContext(InCallChatContext)
    const { allParticipantList } = useContext(ChatContext)

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
                let publicRoomMessages = inCallChatState.messages
                let messageId = publicRoomMessages[Object.keys(publicRoomMessages)[0]].messageid
                lastMessageIdBeforeScroll.current = "msg-" + Object.keys(publicRoomMessages)[0]
                getPublicRoomOldMessage(inCallChatState.currentRoomId, messageId)
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
    }, [chatBodyRef.current, inCallChatState.messages])

    useEffect(() => {
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
    }, [inCallChatState.messages])

    const handleBtnClick = (event) => {
        if (event) {
            event.preventDefault();
        }
        if (typedMessage.length > 0) {
            sendMessage({ message: typedMessage, senderid: user.uid, roomid: inCallChatState.currentRoomId })
            chatBodyRef.current.scrollTo(0, chatBodyRef.current.scrollHeight)
            setTypedMessage("")
        }
    }
    let currentDate = null

    return (
        <div className="sidebar__body">
            <div className="chat-section">
                <div className="chat-section__body" ref={chatBodyRef}>
                    {
                        inCallChatState.messages && Object.keys(inCallChatState.messages).map(key => {
                            let messageDetails = inCallChatState.messages[key]
                            let currentMsgDate = new Date(messageDetails.createdat).toLocaleDateString()
                            let addDateHeader = false
                            if (currentMsgDate !== currentDate) {
                                addDateHeader = true
                                currentDate = currentMsgDate
                            }
                            if (!allParticipantList[messageDetails.senderid]) {
                                // console.log(messageDetails.senderid)
                                // let aa = { ...allParticipantList }
                                // console.log(aa)
                                // console.log(aa[messageDetails.senderid])
                                // Object.keys(aa).forEach(key => console.log(key, aa[key]))
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
