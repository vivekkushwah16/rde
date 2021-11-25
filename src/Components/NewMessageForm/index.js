import React, { useState } from 'react'
import { EMOJIS } from '../../Utility'
import 'emoji-mart/css/emoji-mart.css'
import { Picker } from 'emoji-mart'
import { Emojione } from 'react-emoji-render';


export default function NewMessageForm({ setTypedMessage, handleBtnClick, typedMessage, inputRef }) {
    const [openEmojiContainer, setEmojiContainerOpen] = useState(false)
    const addEmoji = e => {
        // let sym = e.unified.split('-')
        // let codesArray = []
        // sym.forEach(el => codesArray.push('0x' + el))
        // let emoji = String.fromCodePoint(...codesArray)
        // setTypedMessage(prev => prev + emoji)

        let emoji = e.native;
        setTypedMessage(prev => prev + emoji)

    };

    const toggleEmojiWindow = (e) => {
        e.stopPropagation()
        e.preventDefault()
        setEmojiContainerOpen(prev => (!prev))
    }
    return (

        <div className="chat-section__footer">
            <div className="chat-section__form">


                <form onSubmit={handleBtnClick}>

                    <div className="emoji-button">
                        {
                            <div className={`emoji-container ${openEmojiContainer ? "emoji-container-open" : ""}`}>
                                {/* <span>
                                    <Picker
                                        onSelect={addEmoji}
                                        emojiTooltip={false}
                                        set='google' //'apple', 'google', 'twitter', 'facebook'
                                        exclude={['flags', 'foods', 'activity', 'places', 'objects', 'symbols', 'search']}
                                        showPreview={false}
                                        showSkinTones={false}
                                        emojiSize={28}
                                        perLine={9}
                                        enableFrequentEmojiSort={true}
                                    />
                                </span> */}
                                {
                                    EMOJIS.map(emoji =>
                                        <p onClick={(e) => {
                                            e.stopPropagation()
                                            e.preventDefault()
                                            setTypedMessage(prev => prev + emoji)
                                            setEmojiContainerOpen(false)
                                        }}>
                                            <Emojione text={emoji} />
                                            {/* {emoji} */}
                                        </p>
                                    )
                                }
                            </div>
                        }
                        <i className={`icon-emoji  emojiIcon ${openEmojiContainer ? "emojiIcon-close" : ""}`} onClick={toggleEmojiWindow}></i>
                        <i className={`icon-plus  closeIcon ${openEmojiContainer ? "closeIcon-open" : ""}`} onClick={toggleEmojiWindow}></i>
                    </div>

                    {/* <input
                        type="text" className="chat-section__input" placeholder="Write here"
                        value={typedMessage} onChange={e => setTypedMessage(e.target.value)}
                        ref={inputRef}
                        autoFocus
                    >
                    </input> */}
                    <textarea className="chat-section__input" placeholder="Write here"
                        value={typedMessage}
                        onKeyPress={
                            e => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    handleBtnClick();
                                }
                            }
                        }
                        onChange={e => {
                            setTypedMessage(e.target.value)
                        }}
                        ref={inputRef}
                        autoFocus />
                    <button type="submit" className="chat-section__btn "
                        disabled={typedMessage.length === 0}
                    ><i className="icon-send"></i></button>
                </form>
            </div>
        </div>
    )
}
