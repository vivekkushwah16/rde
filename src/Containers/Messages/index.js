import React, { useContext, useRef } from 'react'
import { UIContext } from '../../Context/UIContextProvider'
import { ChatTextStyle, getInitals, UserIconStyle } from '../../Utility'
// import Emoji from "react-emoji-render";
import { Emojione } from 'react-emoji-render';

const Message = ({ name, message, userId, time }) => {
    const { getParticipantColorNumber } = useContext(UIContext)

    // const initals = useRef(getInitals(name))
    // const avartStyleRandom = useRef(Math.floor(Math.random() * 3))
    const avartStyleRandom = useRef(getParticipantColorNumber(userId))
    return (
        <div className="chat-section__text">
            {/* <div className="chat-section__text-header">
                <div className={`user-icon ${UserIconStyle[avartStyleRandom.current]} `}>{initals.current}</div>
                <div>
                    <h3>{name}</h3>
                </div>
            </div> */}
            <div className="chat-section__text-body">
                <h3 className={`chat-user-title ${ChatTextStyle[avartStyleRandom.current]} `}>{name}</h3>
                {/* <h4>Participant</h4> */}
                <p className={`main-message-container ${message.length === 2 ? 'bigEmoji' : ''} `}>
                    <Emojione text={message} />
                    {/* {message} */}
                </p>
                <p className="chat-time">
                    <small>
                        {
                            time &&
                            new Date(time).toLocaleTimeString('en-US', { timeStyle: "short" })
                        }
                    </small>
                </p>
            </div>
        </div>
    )
}

export const ReceivedMsg = React.memo(({ id, name, message, userId, time }) => {
    return (
        <div id={id} className="chat-section__message chat-section__message--received">
            <Message name={name} message={message} userId={userId} time={time} />
        </div>
    )
})

export const SentMsg = React.memo(({ id, name, message, userId, time }) => {
    return (
        <div id={id} className="chat-section__message chat-section__message--sent">
            <Message name={`${name} (You)`} message={message} userId={userId} time={time} />
        </div>
    )
})