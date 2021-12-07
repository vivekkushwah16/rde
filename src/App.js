// import Home from "./Pages/Home";
import { UIContextProvider } from "./Context/UIContextProvider";
import ChatContextProvider from "./Context/Chat/ChatContextProvider";
import { Provider } from "react-redux";
import { store } from "./Redux/store";
import "./App.css";
import "./swal.css";
import PollContextProvider from "./Context/Poll/PollContextProvider";
import NotificationContextProvider from "./Context/Notification/NotificationContextProvider";
import MediaModalContextProvider from "./Context/MediaModal/MediaModalContextProvider";
import InCallChatContextProvider from "./Context/InCallChat/InCallChatContextProvider";
import { useEffect, useMemo } from "react";
import Enrollment from "./Components/Enrollment";
import ViewEmail from "./Components/ViewEmail";
import Office from "./Components/Office";
import HcpOffice from "./Components/HcpOffice";
import PatientsHome from "./Components/PatientsHome";
import RenderSlides from "./Components/RenderSlides";
import PersPective from "./Components/Perspective.js";
import blurBanner from "./Assets/Images/perspective/blurBanner.png"
import banner from "./Assets/Images/perspective/image2.jpg"

function App() {
  useMemo(() => {
    window.console.devlog = (...args) => {
      if (process.env.NODE_ENV !== "production") {
        window.console.log(...args)
      } else {
        if (window.showDevlog)
          window.console.log(...args)
      }
    }
  }, [])
  return (
    <>

      <Provider store={store}>
        <MediaModalContextProvider>
          <UIContextProvider>
            <ChatContextProvider>
              <PollContextProvider>
                <NotificationContextProvider>
                  <InCallChatContextProvider>
                    {/* <Home /> */}
                    {/* <Enrollment /> */}
                    {/* <ViewEmail /> */}
                    {/* <Office /> */}
                    {/* <HcpOffice /> */}
                    {/* <PatientsHome /> */}
                    {/* <RenderSlides /> */}
                    <PersPective x="430" y="100" maskID="glass" blurBanner={blurBanner} banner={banner}/>
                  </InCallChatContextProvider>
                </NotificationContextProvider>
              </PollContextProvider>
            </ChatContextProvider>
          </UIContextProvider>
        </MediaModalContextProvider>
      </Provider>
    </>
  );
}

export default App;
