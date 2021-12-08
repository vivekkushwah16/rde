import { useContext, useEffect } from "react";
import DailyCoVideoCall from "../../Components/DailyCo/DailyCoVideoCall";
import { Forms } from "../../Components/NegotiationFormComponents/Forms";
import MediaModal from "../../Containers/MediaModal/MediaModal";
import Menu from "../../Containers/Menu/Menu";
import Sidebar from "../../Containers/Sidebar/Sidebar";
import ThreeDScene from "../../Containers/ThreeDScene";
import { UserContext } from "../../Context/Auth/UserContextProvider";
import { UIContext } from "../../Context/UIContextProvider";
import { formsData } from "../../Constants/NegotiationFormData/FormsData";
import axios from "axios";
import { Endpoints } from "../../Constants/EndPoints";
import LobbyAudioCall from "../../Components/DailyCo/LobbyAudioCall";


export default function Home() {
  const { videocall, currentScene, toggleSideMenu, isMenuOpen } = useContext(UIContext)
  const { user } = useContext(UserContext)

  return (
    <>
      <MediaModal />
      <div className="wrapper">

        {
          currentScene.id !== 'avatar' &&
          <Sidebar>
            <header className={`headerBox`}>
              <div className={`sidebar_ctrl_btn ${isMenuOpen ? '' : 'sidebar_ctrl_btn_closed'}`} onClick={toggleSideMenu}>
                <i className="icon-angle-right" />
              </div>
              <Menu platformMenu={!videocall ? true : videocall.sideLayout} />
            </header>
          </Sidebar>
        }
        {
          videocall &&
          <DailyCoVideoCall callData={videocall} />
        }
        {
          // for spatial calls, lobby calls
          user && !videocall &&
          <UIContext.Consumer>
            {
              v =>
                <LobbyAudioCall
                  name={user.displayName ? user.displayName : user.email.split("@")[0]}
                  room={
                    {
                      "docName": "BreakoutA",
                      "roomName": "rde_platform",
                      "callStarted": true,
                      "publicRoomName": "Lobby Room"
                    }
                  }
                  UIContext={v}
                  isCallVisible={true}
                  temporaryRoom={true}
                />
            }
          </UIContext.Consumer>
        }
        {/* <Forms formsData={formsData} formid={1} /> */}
        {/* <ThreeDScene /> */}
        {
          <div id={"debugger"} style={{ zIndex: "999", position: "absolute", top: "5px", left: "5px", backgroundColor: "gray", maxWidth: "30%", display: "none" }}>

          </div>
        }
      </div>
    </>
  );
}
