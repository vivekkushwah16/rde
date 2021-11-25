import React, { useContext, useMemo, useRef, useEffect, useState } from 'react'
import { UserContext } from '../../Context/Auth/UserContextProvider'
import { ChatContext, HandRaiseVideoCallContext, RoomContext } from '../../Context/Chat/ChatContextProvider'
import { UIContext } from '../../Context/UIContextProvider'
import { AvatarStyle, getInitals } from '../../Utility'
import IncallChat from '../IncallChat/IncallChat'
import './index.css'
import arrowSvg from "../../Assets/svg/arrow.svg"
import Loader from '../Loader/Loader'
import { getRoomIdWithUser } from '../../Firebase/chatManager'
import { Emojione } from 'react-emoji-render';


const defaultUserRole = "Participant"

const UserTile = ({ user, role, notification, showHandRaise }) => {
    const { user: currentUser } = useContext(UserContext)
    const { openChatWithUser, onlineUserslist } = useContext(ChatContext)
    const { getParticipantColorNumber, adminList, isPollAdmin } = useContext(UIContext)
    const { roomDetails } = useContext(RoomContext)

    const initals = useRef(getInitals(user.name))
    const avartStyleRandom = useRef(getParticipantColorNumber(user.id))
    const isSpeaker = useMemo(() => adminList ? adminList.indexOf(user.id) !== -1 : false, [adminList, isPollAdmin])
    const roomid = useMemo(() => getRoomIdWithUser(currentUser.uid, user.userid), [user])

    const getDotStyle = () => {
        if (notification) {
            return 'user-notification'
        } else if (onlineUserslist.hasOwnProperty(user.userid)) {
            if (onlineUserslist[user.userid].connected) {
                return 'user-notification user-online-dot'
            } else {
                return 'user-notification user-offline-dot'
            }
        } else {
            return 'user-notification user-offline-dot'
        }
    }

    return (
        <div className="user-profile" style={showHandRaise ? { justifyContent: "space-between" } : {}} onClick={() => openChatWithUser(user)}>
            <div style={{ display: 'flex' }}>
                <span className={`user-profile__image  ${getDotStyle()} ${AvatarStyle[avartStyleRandom.current]}`}>{initals.current}</span>
                <span className="user-profile__title">
                    <b> {`${user.name.toLowerCase()} ${isSpeaker && role !== "Speaker" ? "( Speaker )" : ""}`}</b>
                    <small>

                        {isSpeaker ? "Speaker" : <Emojione text={role} /> ?? defaultUserRole}
                    </small>
                </span>
            </div>

            {
                showHandRaise &&
                <span className="user-profile-raiseHand" style={{ fontSize: '1.5rem' }}>
                    <i className="icon-raise-hand" />
                </span>
            }
            {
                roomDetails &&
                roomDetails[roomid] && roomDetails[roomid].unreadcount !== 0 &&
                <span className={`notification_count ${AvatarStyle[avartStyleRandom.current]}`}>
                    {roomDetails[roomid].unreadcount}
                </span>
            }
        </div>
    )
}

const UsersSection = ({ heading, role, userList }) => {
    const { user } = useContext(UserContext)
    const [visible, setstate] = useState(true)
    return (
        <>
            {
                heading &&
                <h2 className={`sidebar__title withArrow ${visible ? '' : 'closed'}`}>{heading}
                    <i className="icon-angle-down" onClick={() => setstate(prev => !prev)} />
                </h2>
            }
            <ul className="sidebar__menu">
                {
                    visible &&
                    Object.keys(userList).map(userId => {
                        if (userList[userId].userid !== user.uid) {
                            return (<li key={userList[userId].id + "--li"}>
                                <UserTile key={userList[userId].id} user={userList[userId]} role={role} />
                            </li>)
                        } else {
                            return null
                        }
                    })
                }
            </ul>
        </>
    )
}

const UsersOnlineSection = ({ heading, role, userList }) => {
    const { user } = useContext(UserContext)
    const { allParticipantList } = useContext(ChatContext)
    const { handRaise } = useContext(HandRaiseVideoCallContext)
    const [visible, setstate] = useState(true)
    let handRaiseUserId = handRaise ? Object.keys(handRaise.all) : []
    return (
        <>
            {
                heading &&
                // <h2 className="sidebar__title">{heading}</h2>
                <h2 className={`sidebar__title withArrow ${visible ? '' : 'closed'}`}>{heading}
                    <i className="icon-angle-down" onClick={() => setstate(prev => !prev)} />
                </h2>
            }
            <ul className="sidebar__menu">
                {
                    visible &&
                    Object.keys(userList).map(userId => {
                        if (userList[userId].userid !== user.uid && userList[userId].connected) {
                            if (!userList[userId].name) {
                                if (!allParticipantList[userId]) {
                                    window.alert(userId)
                                    console.log(userId)
                                }
                                userList[userId].name = allParticipantList[userId].name

                            }
                            return (<li key={userList[userId].id + "--li"}>
                                <UserTile key={userList[userId].id}
                                    user={userList[userId]}
                                    role={role}
                                    showHandRaise={handRaiseUserId.indexOf(userId) !== -1}
                                />
                            </li>)
                        } else {
                            return null
                        }
                    })
                }
            </ul>
        </>
    )
}

const UserSectionByUserId = ({ heading, role, userList }) => {
    const { user } = useContext(UserContext)
    const { allParticipantList } = useContext(ChatContext)
    const [visible, setstate] = useState(true)
    return (
        <>
            {
                heading &&
                // <h2 className="sidebar__title">{heading}</h2>
                <h2 className={`sidebar__title withArrow ${visible ? '' : 'closed'}`}>{heading}
                    <i className="icon-angle-down" onClick={() => setstate(prev => !prev)} />
                </h2>
            }
            <ul className="sidebar__menu">
                {
                    visible &&
                    userList.map(userid => {
                        if (userid !== user.uid && allParticipantList[userid].name) {
                            return (<li key={allParticipantList[userid].id + "--li"}>
                                <UserTile key={allParticipantList[userid].id} user={allParticipantList[userid]} role={role} />
                            </li>)
                        } else {
                            return null
                        }
                    })
                }
            </ul>
        </>
    )
}


function getTrimedMessage(sendId, senderName, currentUserId, message, limit = 40) {
    if (!message) {
        return ''
    }
    let result = ""
    if (sendId === currentUserId) {
        result = "me: "
    } else {
        result = senderName.toLowerCase() + ": "
    }
    if (message.length > limit) {
        result += message.substr(0, limit) + "..."
    } else {
        result += message
    }
    return result

}

const RecentMessageSection = ({ heading, role, recentList }) => {
    const { user } = useContext(UserContext)
    const { allParticipantList } = useContext(ChatContext)
    const [visible, setstate] = useState(true)
    return (
        <>
            {
                heading &&
                // <h2 className="sidebar__title">{heading}</h2>
                <h2 className={`sidebar__title withArrow ${visible ? '' : 'closed'}`}>{heading}
                    <i className="icon-angle-down" onClick={() => setstate(prev => !prev)} />
                </h2>
            }
            <ul className="sidebar__menu">
                {
                    visible &&
                    recentList.map(recentMsg => (
                        <>
                            {
                                recentMsg.senderid && allParticipantList[recentMsg.senderid] && allParticipantList[recentMsg.otherparticipantid] ?
                                    (

                                        <li key={recentMsg.senderid + "recent--li"}>
                                            <UserTile key={recentMsg.senderid + "recent"} user={allParticipantList[recentMsg.otherparticipantid]}
                                                role={getTrimedMessage(recentMsg.senderid, allParticipantList[recentMsg.senderid].name, user.uid, recentMsg.message)}
                                            />
                                        </li>
                                    ) :
                                    console.log(recentMsg)
                            }
                        </>
                    )
                    )
                }
            </ul>
        </>
    )
}

const GroupTile = ({ groupInfo }) => {
    const { getParticipantColorNumber } = useContext(UIContext)
    const { openGroupChat } = useContext(RoomContext)
    const { roomDetails } = useContext(RoomContext)

    const initals = useRef(getInitals(groupInfo.name))
    const avartStyleRandom = useRef(getParticipantColorNumber(groupInfo.roomid))
    const openGrpChat = () => {
        openGroupChat(groupInfo)
    }

    return (
        <div className="user-profile" onClick={openGrpChat}>
            <span className={`user-profile__image`}>{initals.current}</span>
            <span className="user-profile__title">
                <b> {`${groupInfo.name.toLowerCase()}`}</b>
                {/* <small>{isSpeaker ? "Speaker" : role ?? defaultUserRole}</small> */}
            </span>
            {
                roomDetails &&
                roomDetails[groupInfo.roomid] && roomDetails[groupInfo.roomid].unreadcount !== 0 &&
                <span className={`notification_count ${AvatarStyle[avartStyleRandom.current]}`}>
                    {roomDetails[groupInfo.roomid].unreadcount}
                </span>
            }
        </div>
    )
}

const PrivateGroupSection = ({ heading, list }) => {
    const [visible, setstate] = useState(true)
    return (
        <>
            {
                heading &&
                // <h2 className="sidebar__title">{heading}</h2>
                <h2 className={`sidebar__title withArrow ${visible ? '' : 'closed'}`}>{heading}
                    <i className="icon-angle-down" onClick={() => setstate(prev => !prev)} />
                </h2>
            }
            <ul className="sidebar__menu">
                {
                    visible &&
                    Object.values(list).map(groups => (
                        <>
                            {
                                groups.roomid &&
                                <li key={groups.roomid}>
                                    <GroupTile groupInfo={groups} />
                                </li>
                            }
                        </>
                    ))
                }
            </ul>
        </>
    )
}

export default function Participants() {
    const { user } = useContext(UserContext)

    const { userLastInteractedRoom, allParticipantList, incallChatActive, showInCallChat, setShowInCallChat, onlineUserslist } = useContext(ChatContext)
    const { adminList, isPollAdmin } = useContext(UIContext)
    const { privateGroup, onlineCallUserslist } = useContext(RoomContext)
    const onlineAdminList = useMemo(() => {
        if (Object.keys(onlineCallUserslist).length > 1) {
            if (isPollAdmin ? (adminList.length > 1) : (adminList.length > 0)) {
                let resultList = {}
                adminList.forEach(id => {
                    if (onlineCallUserslist.hasOwnProperty(id)) {
                        resultList[id] = onlineCallUserslist[id]
                    }
                });
                return resultList
            } else {
                return {}
            }
        } else {
            return {}
        }
    }, [onlineCallUserslist, adminList, isPollAdmin])

    const onlineUserPresent = useMemo(() => {
        let keys = Object.keys(onlineUserslist)
        if (keys.length > 0) {
            for (let i = 0; i < keys.length; i++) {
                if (onlineUserslist[keys[i]].connected && onlineUserslist[keys[i]].userid !== user.uid) {
                    return true
                }
            }
        } else {
            return false
        }
    }, [onlineUserslist])

    const sortedAllparticipant = useMemo(() => {
        let sortedPL = Object.keys(allParticipantList).sort().reduce((obj, key) => {
            obj[key] = allParticipantList[key];
            return obj;
        }, {})
        return sortedPL
    }, allParticipantList)

    // console.log(isPollAdmin ? Object.keys(onlineAdminList).length > 1 : Object.keys(onlineAdminList).length > 0)
    // console.log(onlineCallUserslist)
    return (
        <>
            {
                showInCallChat && incallChatActive.status && incallChatActive.roomId &&
                <IncallChat />
            }
            {
                !showInCallChat &&
                <div className="sidebar__body">
                    {
                        incallChatActive.status && incallChatActive.roomId &&
                        <div className="chat-header" onClick={() => setShowInCallChat(true)}>
                            <div className="user-profile">
                                <span className="user-profile__title">
                                    In Call Messages
                                </span>
                            </div>
                            <img className="enterArrow" src={arrowSvg} alt="arrowSvg" />
                        </div>
                    }
                    {
                        userLastInteractedRoom && Object.keys(allParticipantList).length > 0 &&
                        <RecentMessageSection heading="Recent" role="Participant" recentList={userLastInteractedRoom} />
                    }

                    {
                        Object.keys(onlineAdminList).length > 0 ?
                            <UsersSection heading={onlineAdminList ? "Speakers" : ''} role="Speaker" userList={onlineAdminList} />
                            :
                            null
                        // <Loader />
                    }
                    {
                        privateGroup &&
                            Object.keys(privateGroup).length > 0 ?
                            <PrivateGroupSection heading={onlineAdminList ? "Groups" : ''} list={privateGroup} />
                            :
                            null
                    }
                    {/* {
                        onlineCallUserslist.length > 0 ?
                            <UserSectionByUserId heading={onlineCallUserslist ? "Online Participant" : ''} role="Participant" userList={onlineCallUserslist} />
                            :
                            null
                        // <Loader />
                    } */}
                    {
                        Object.keys(allParticipantList).length > 0 && onlineUserPresent ?
                            <UsersOnlineSection heading={onlineUserslist ? "Online Participants" : ''} role="Participant" userList={onlineUserslist} />
                            :
                            null
                        // <Loader />
                    }
                    {
                        Object.keys(allParticipantList).length > 0 &&
                        <UsersSection heading={allParticipantList ? "All Participants" : ''} role="Participant" userList={sortedAllparticipant} />
                    }
                </div>
            }

        </>
    )
}
