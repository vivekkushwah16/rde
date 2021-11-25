import { useContext, useEffect, useMemo, useState } from "react";
import Menu from "../../Containers/Menu/Menu";
import Participants from "../../Containers/Participants/Participants";
import PrivateChat from "../../Containers/PrivateChat/PrivateChat";
import PublicChat from "../../Containers/PublicChat/PublicChat";
import { UserContext } from "../../Context/Auth/UserContextProvider";
import { MenuStates, UIContext } from "../../Context/UIContextProvider";
import PollContainer from "../../Containers/PollContainer/PollContainer";
import NotificationContainer from "../../Containers/NotificationContainer/NotificationContainer";
import Loader from "../../Containers/Loader/Loader";
import { ChatContext } from "../../Context/Chat/ChatContextProvider";
import PublicGroupChatRoom from "../../Containers/publicGroupChatRoom/PublicGroupChatRoom";
import { PollContext } from "../../Context/Poll/PollContextProvider";
import SocketPollContainer from "../PollContainer/SocketPollContainer";
import { NotificationContext } from "../../Context/Notification/NotificationContextProvider";
import SocketNotificationContainer from "../NotificationContainer/SocketNotificationContainer";
import InCallPublicChatRoom from "../InCallPublicChatRoom";

export default function Sidebar({ children }) {
  const { activeMenu, isMenuOpen, videocall } = useContext(UIContext);
  const { publicRoomName } = useContext(ChatContext);
  const { user } = useContext(UserContext);
  const { pollState } = useContext(PollContext)
  const { notificationState } = useContext(NotificationContext);

  const onMainPlatform = useMemo(() => (!videocall ? true : videocall.sideLayout), [videocall])


  return (
    // <div className="wrapper">
    <aside className={`sidebar ${isMenuOpen ? "active" : ""}`}>
      {/* <header className="headerBox">
          <Menu />
        </header> */}
      {children}
      {user && user.isChecked ? (
        <>
          {activeMenu === MenuStates.participants && <PrivateChat />}

          {activeMenu === MenuStates.publicChat && (
            <>
              {
                !onMainPlatform ?
                  <InCallPublicChatRoom />
                  :
                  <PublicGroupChatRoom />
              }
            </>
            // <PublicChat room={{ roomId: publicRoomName }} />
            //to change publicRoom from url pass URLParam publicRoom=roomId
          )}
          {activeMenu === MenuStates.polls && (
            <SocketPollContainer id={pollState.currentRoomId} isPollUser={!pollState.isPollAdmin} />
            // can pass videoCall RoomId, which we are using for inCallMessages rightNow
            // to showPoll pass URL Param showPoll=true
            // to showPollAdAdmin pass URL Param pollAdmin=true
          )}
          {activeMenu === MenuStates.notification && (
            <>
              <SocketNotificationContainer
                id={!onMainPlatform ? notificationState.currentRoomId : "platform-notification"}
                isAdmin={!onMainPlatform ? notificationState.isPollAdmin : notificationState.platform_isNotificationAdmin}
                onPlatform={onMainPlatform}
              />
            </>
            // <NotificationContainer
            //   id={notificationState.currentRoomId}
            //   isAdmin={notificationState.isPollAdmin}
            // />
          )}
        </>
      ) : (
        <>
          <Loader />
        </>
      )}
    </aside>
    // </div>
  );
}
