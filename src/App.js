import Home from "./Pages/Home";
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

function App() {
  return (
    <>

      <Provider store={store}>
        <MediaModalContextProvider>
          <UIContextProvider>
            <ChatContextProvider>
              <PollContextProvider>
                <NotificationContextProvider>
                  <InCallChatContextProvider>
                    <Home />
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
