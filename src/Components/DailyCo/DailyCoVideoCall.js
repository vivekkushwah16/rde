import { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../../Context/Auth/UserContextProvider";
import { UIContext } from "../../Context/UIContextProvider";
import Loader from "../../Containers/Loader/Loader";
import {
  checkDailycoRoomStatus,
  checkForDailycoAdmin,
  getDailycoRoomDetails,
} from "../../Firebase";
import DailycoController from "../../Components/DailyCo/dailycoController";
import swal from "sweetalert";
import { HandRaiseVideoCallContext } from "../../Context/Chat/ChatContextProvider";
import axios from "axios";
import { Endpoints } from "../../Constants/EndPoints";
import SideDailycoController from "./SideLayout";
import LobbyAudioCall from "./LobbyAudioCall";

export default function DailyCoVideoCall({ callData }) {
  const { roomId, temporaryRoom, sideLayout } = callData
  const { isMenuOpen, connectToVideocallRoom } = useContext(UIContext);
  const { user } = useContext(UserContext);
  const [isCallVisible, setIsCallVisible] = useState(true)
  const [DBRVideoCall, setDBRVideoCall] = useState({
    room: null,
    // {
    //   "docName": "BreakoutA",
    //   "roomName": "zs4",
    //   "callStarted": true,
    //   "publicRoomName": "Breakout Room 1"
    // }
  });

  useEffect(() => {
    window.parent.showCall = () => {
      setIsCallVisible(true);
    };
    return () => {
      window.parent.showCall = null
    }
  }, [])


  useEffect(() => {
    if (user && roomId) {
      setDBRVideoCall({ room: null })
      if (sideLayout) {
        setDBRVideoCall({
          room: {
            "docName": roomId,
            "roomName": roomId,
            "callStarted": true,
            "publicRoomName": roomId,
          }
        })
      } else {
        axios.get(`${Endpoints.vcroom}?roomId=${roomId}`, { withCredentials: true }).then(response => {
          let responseData = response.data
          console.log(responseData)
          if (responseData.code === 'done') {
            let data = responseData.data
            let neededData = {
              "docName": data.roomname,
              "roomName": data.roomid,
              "callStarted": data.callstarted,
              "publicRoomName": data.roomname,
              bannerurl: data.bannerurl,
            }
            setDBRVideoCall({
              room: neededData
            })
          } else {
            connectToVideocallRoom(null)
            console.error("No Such room exists")
          }
        })
      }
    }
  }, [user, roomId]);

  return (
    <>

      {DBRVideoCall.room && (
        <HandRaiseVideoCallContext.Consumer>
          {
            value => (
              <UIContext.Consumer>
                {
                  v => (
                    <>
                      {
                        sideLayout ?
                          <SideDailycoController
                            name={user.displayName ? user.displayName : user.email.split("@")[0]}
                            room={DBRVideoCall.room}
                            UIContext={v}
                            isCallVisible={isCallVisible}
                            temporaryRoom={temporaryRoom}
                          />
                          :
                          <DailycoController
                            name={user.displayName ? user.displayName : user.email.split("@")[0]}
                            room={DBRVideoCall.room}
                            autoInitalize={true}
                            showSidebar={isMenuOpen}
                            HandRaiseVideoCallContext={value}
                            UIContext={v}
                            is3D={DBRVideoCall.room.roomName === 'zs1'}
                          />
                      }
                    </>
                  )
                }
              </UIContext.Consumer>
            )
          }
        </HandRaiseVideoCallContext.Consumer>
      )}
    </>
  );
}
