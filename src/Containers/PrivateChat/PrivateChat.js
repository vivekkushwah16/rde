import React, { useContext } from 'react'
import { ChatContext, ROOM_TYPE } from '../../Context/Chat/ChatContextProvider'
import Participants from '../Participants/Participants'
import PrivateChatRoom from '../PrivateChatRoom/PrivateChatRoom'
import PrivateGroupChat from '../PrivateGroupChat/PrivateGroupChat'

export default function PrivateChat() {
    const { activeRoom } = useContext(ChatContext)
    return (
        <>
            {
                activeRoom ?
                    <>
                        {
                            activeRoom.type === ROOM_TYPE['one-On-one'] &&
                            <PrivateChatRoom />
                        }
                        {
                            activeRoom.type === ROOM_TYPE.privateGroup &&
                            <PrivateGroupChat />
                        }
                    </>
                    :
                    <Participants />
            }
        </>
    )
}
