import React, { useContext } from "react";
import { ChatContext } from "../../Context/Chat/ChatContextProvider";
import { MenuStates, UIContext } from "../../Context/UIContextProvider";

export default function Menu({ platformMenu }) {
  const { activeMenu, setActiveMenu, hidePoll, isMenuOpen, toggleMenuOpen } =
    useContext(UIContext);
  const {
    publicNotification,
    setPublicNotification,
    pollNotification,
    setPollNotification,
    privateNotification, setPrivateNotification
  } = useContext(ChatContext);

  const hideMenu = () => {
    if (!platformMenu) {
      toggleMenuOpen(false)
    }
  }

  return (
    <ul className="sidebar__tabs">
      {/* Participants */}
      <li
        onClick={() => {
          setPrivateNotification(false)
          if (activeMenu !== MenuStates.participants)
            setActiveMenu(MenuStates.participants);
          else hideMenu(null);
        }}
      >
        <a
          className={activeMenu === MenuStates.participants ? "active" : ""}
          href="#"
        >
          <i className={`${privateNotification ? "menu-notification" : ''} icon-Participant`}></i> Participants
        </a>
      </li>
      {/* Room Chat */}
      <li
        onClick={() => {
          setPublicNotification(false);
          if (activeMenu !== MenuStates.publicChat)
            setActiveMenu(MenuStates.publicChat);
          else hideMenu(null);
        }}
      >
        <a
          className={`${activeMenu === MenuStates.publicChat ? "active" : ""}`}
          href="#"
        >
          <i
            className={`${publicNotification ? "menu-notification" : ""
              } icon-chat`}
          ></i>
          {platformMenu ? 'Public Chat' : 'Room Chat'}
        </a>
      </li>
      {
        !platformMenu &&
        <>
          {/* Polls */}
          <li
            onClick={() => {
              if (activeMenu !== MenuStates.polls)
                setActiveMenu(MenuStates.polls);
              else hideMenu(null);
              setPollNotification(false);
            }}
          >
            <a
              className={activeMenu === MenuStates.polls ? "active" : ""}
              href="#"
            >
              <i
                className={`icon-poll ${pollNotification ? "menu-notification" : ""
                  }`}
              ></i>{" "}
              Polls
            </a>
          </li>
        </>
      }
      {/* Notifications */}
      <li
        onClick={() => {
          if (activeMenu !== MenuStates.notification)
            setActiveMenu(MenuStates.notification);
          else hideMenu(null);
        }}
      >
        <a
          className={activeMenu === MenuStates.notification ? "active" : ""}
          href="#"
        >
          <i className="icon-bell"></i>
          Notifications
        </a>
      </li>
    </ul>
  );
}
