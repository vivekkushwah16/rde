import React, { useContext, useMemo } from 'react'
import { UIContext } from '../../Context/UIContextProvider'
import PublicChat from '../PublicChat/PublicChat'
import arrowSvg from "../../Assets/svg/arrow.svg"
import { ChatContext } from '../../Context/Chat/ChatContextProvider'
import { AvatarStyle, getInitals } from '../../Utility'
import Tooltip from 'rc-tooltip';
import 'rc-tooltip/assets/bootstrap_white.css'
import InCallChatRoom from '../InCallChatRoom/InCallChatRoom'

const InCallChatHeader = (props) => {
    const { inCallRoomParticipantList } = useContext(ChatContext)

    let count = useMemo(() => Object.keys(inCallRoomParticipantList).length, [inCallRoomParticipantList])
    const { getParticipantColorNumber } = useContext(UIContext)
    return (
        <div className="chat-header" onClick={props.onbackClick}>
            <img src={arrowSvg} alt="arrowSvg" />
            <div className="user-profile">
                <span className="user-profile__title">
                    {props.roomName}
                    <small>
                        {
                            count > 0 && `${count} active`
                        }
                    </small>
                </span>
            </div>
            <div className="headerMemberList-container">
                {
                    Object.values(inCallRoomParticipantList).map(user => (
                        <Tooltip id="listMemberTooltip" placement="bottom" trigger={['hover']} overlay={<span >{user.name.toLowerCase()}</span>}>
                            <span className={`user-profile__image ${AvatarStyle[getParticipantColorNumber(user.id)]} headerMemberList`} >{getInitals(user.name)}</span>
                        </Tooltip>
                    ))
                }
            </div>

        </div>
    )
}

export default function IncallChat() {

    const { incallChatActive, setShowInCallChat } = useContext(ChatContext)

    const onbackClick = (e) => {
        if (e) {
            e.preventDefault()
        }
        setShowInCallChat(false)
    }

    return (
        <InCallChatRoom />
        // <PublicChat room={{ roomId: incallChatActive.roomId }} showHeader={true}  >
        //     <InCallChatHeader roomName={incallChatActive.roomName} onbackClick={onbackClick} />
        // </PublicChat>
    )
}
