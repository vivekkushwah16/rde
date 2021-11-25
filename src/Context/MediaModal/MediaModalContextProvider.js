import React, { createContext, useState, useRef } from 'react'
export const MediaModalContext = createContext();

export default function MediaModalContextProvider(props) {
    const [modalDetails, setModalDetails] = useState({});
    const [mediaModalStatus, setMediaModalStatus] = useState(false)

    let closeCallback = useRef(null)

    const showMediaModal = (content, _cb) => {
        setModalDetails(content)
        setMediaModalStatus(true)
        if (_cb) {
            closeCallback.current = _cb
        }
    }

    const closeMediaModal = () => {
        setMediaModalStatus(false)
        if (closeCallback.current) {
            closeCallback.current()
            closeCallback.current = null
        }
    }

    return (
        <>
            <MediaModalContext.Provider value={{ showMediaModal, closeMediaModal, mediaModalStatus, modalDetails }}>
                {props.children}
            </MediaModalContext.Provider>
        </>
    )
}
