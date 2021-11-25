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
        {/* <Forms formsData={formsData} formid={1} /> */}
        <ThreeDScene />
        {
          <div id={"debugger"} style={{ zIndex: "999", position: "absolute", top: "5px", left: "5px", backgroundColor: "gray", maxWidth: "30%", display: "none" }}>

          </div>
        }
      </div>
    </>
  );
}
