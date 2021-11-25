import React, { Component } from "react";
import axios from "axios";
import DailyIframe from "@daily-co/daily-js";
import swal from "sweetalert";
import { ToastContainer, toast, Zoom } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./react-toastify.css";
// import ReactTooltip from "react-tooltip";
import { firestore } from "../../Firebase";
import { AppString } from "../../Firebase/constant";
// import { isFirefox, isMobileOnly } from "react-device-detect";
import DailycoParticipantLayout from "./participant/dailycoParticipantLayout";
import DailycoAdminLayout from "./admin/dailycoAdminLayout";
import ScreenTile from "./tiles/ScreenTile";
import ding from "./ding2_mild_V2.ogg";
// import Sidebar from "../../Containers/Sidebar/Sidebar";
import SocketManager, {
  ADMIN_TYPE,
  SOCKET_EVENT_NAMES,
  USER_STATUS_VIDEOCALL,
} from "../../Manager/Socket";
import { UserContext } from "../../Context/Auth/UserContextProvider";
import { OPERATION_TYPE } from "../../Constants/VideoCallConstants";
import { Endpoints } from "../../Constants/EndPoints";

const NOTIFICATION_TYPES = {
  NORMAL: "normal",
  INFO: "info",
  ERROR: "error",
  SUCCESS: "success",
  WARN: "warn",
};

class DailycoController extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // user specific states
      isVideoOn: false,
      isAudioOn: false,
      isScreenSharing: false,
      hasAccess: false,
      hasRequestedAccess: false,
      hasJoinedCall: false,
      // dailyco api
      callFrame: null,
      participants: null,
      // call/room state
      callEnded: false,
      isRoomActive: props.room.callStarted, //false,
      initialCountdown: 0,
      isCountdownRunning: false,
      screenSharingParticipant: "",
      pendingRequestIDs: [],
      accessAllowedIDs: [],
      serverPendingRequestIDs: [],
      serverAccessAllowedIDs: [],
    };

    this.name = this.props.name;
    this.isAdmin = null; //this.props.isAdmin;
    this.isTranslator = null; //this.props.isAdmin;
    this.roomName = this.props.room.roomName;
    this.docName = this.props.room.docName;
    this.session_id = null;

    this.socket = null;

    this.isJoiningCall = false; // prevents multiple dailyco initializations when connection is in progress

    this.serverlinkTesting = "http://localhost:8080/generateToken";
    this.serverlinkProduction = Endpoints.dailycoToken
    // "https://vidconserver.virtualeventdemo.com/generateToken";

    // this.LiveParticipantListFromDailyco = new Map(); // antzy check

    this.timerAccessControl = new Map();
    this.isInit = false; // antzy check
    this.requestAccessTime = 30000;
    // this.canSendAccessList = false; // antzy check

    window.DailycoManager = this;

    // antzy check
    // const urlParams = new URLSearchParams(window.location.search);
    // this.is3D = urlParams.get("is3D") === "true";
  }

  componentDidMount() {
    if (
      this.props.autoInitalize &&
      !this.isJoiningCall &&
      !this.state.hasJoinedCall
    ) {
      this.initializeDailyco();
    }
    window.EndCall = this.EndCall;
  }

  componentWillUnmount() {
    console.log("unmounting call");
    window.DailycoManager = null;
    this.EndCallViaMenu();
    this.closeSocket();
  }

  //-----------------------------------------------------Firebase Function--------------------------------------------------------//
  //#region List function
  // antzy check
  // suscribeToVideoCallStatus = () => {
  //   this.statusLisenter = firestore
  //     .collection(AppString.Dailyco_Col)
  //     .doc(this.docName)
  //     .onSnapshot((doc) => {
  //       if (doc.data()) {
  //         console.log("Firebase Current data: ", doc.data());
  //         this.setState({
  //           isRoomActive: doc.data().callStarted,
  //         });
  //       }
  //     });
  // };
  // unsuscribeToVideoCallStatus = () => {
  //   if (this.statusLisenter) {
  //     this.statusLisenter();
  //   }
  // };

  //#endregion

  //-----------------------------------------------------List Function--------------------------------------------------------//
  //#region List function

  // addParticipant(participant) {
  //   //check if it local user then no need to add participant to list
  //   if (!participant.local) {
  //     this.LiveParticipantListFromDailyco.set(
  //       participant.session_id,
  //       participant
  //     );
  //     // console.log(this.LiveParticipantListFromDailyco);
  //   }
  // }

  // removeParticipant(participant) {
  //   //check if it local user then no need to update list
  //   if (!participant.local) {
  //     this.LiveParticipantListFromDailyco.delete(participant.session_id);
  //     if (participant.session_id === this.state.screenSharingParticipant) {
  //       //this was the person sharing screen remove it from screenSharing Participant
  //       this.setState({ screenSharingParticipant: "" });
  //     }
  //     console.log(this.LiveParticipantListFromDailyco);
  //   }
  // }

  // isParticipantUpdated(newParticipantData, session_id) {
  //   if (this.LiveParticipantListFromDailyco.has(session_id)) {
  //     let oldParticipantData =
  //       this.LiveParticipantListFromDailyco.get(session_id);
  //     if (
  //       oldParticipantData.audio === newParticipantData.audio &&
  //       oldParticipantData.screen === newParticipantData.screen &&
  //       oldParticipantData.video === newParticipantData.video
  //     ) {
  //       console.log("Same Participant data is Duplicated!!");
  //       return false;
  //     } else {
  //       console.log("Same Participant data is updated!!");
  //       console.log(oldParticipantData);
  //       console.log(newParticipantData);
  //       this.LiveParticipantListFromDailyco.set(session_id, newParticipantData);
  //       return true;
  //     }
  //   } else {
  //     return false;
  //   }
  // }

  changeOrder(participant) {
    let participantID = participant.session_id;
    if (this.state.accessAllowedIDs.includes(participantID)) {
      if (participant.video || participant.audio || participant.screen) {
        let accessAllowedIDs = this.state.accessAllowedIDs.filter(
          (val) => val !== participantID
        );
        accessAllowedIDs.push(participantID);
        this.setState({ accessAllowedIDs });
      }
    }
  }
  //#endregion

  //-----------------------------------------------------Dailyframe Function--------------------------------------------------//
  //#region Dailyframe Function

  initializeDailyco = async () => {
    try {
      console.log("Dailyco called ");
      this.isJoiningCall = true;
      // this.suscribeToVideoCallStatus();
      if (this.state.callEnded) {
        this.setState({
          isVideoOn: false,
          isAudioOn: false,
          isScreenSharing: false,
          hasAccess: false,
          hasJoinedCall: false,
          callEnded: false,
        });
      }

      this.setState({
        pendingRequestIDs: [],
        accessAllowedIDs: [],
        participants: {},
      });
      // this.showAccessControls = [];
      this.timerAccessControl.clear();
      // this.LiveParticipantListFromDailyco.clear();

      var self = this;
      console.log(self.name, self.isAdmin, self.roomName);

      // get the access token from the server
      let adminCheckResponse = await axios.get(
        Endpoints.RoomPoints.vcAdminCheck,
        {
          params: { roomId: self.roomName },
          withCredentials: true,
        }
      );
      if (
        adminCheckResponse.data.isRoomAdmin &&
        adminCheckResponse.data.adminType === ADMIN_TYPE.roomAdmin &&
        adminCheckResponse.data.roomId === this.roomName
      ) {
        this.isAdmin = true;
      } else {
        this.isAdmin = false;
      }

      if (adminCheckResponse.data.adminType === ADMIN_TYPE.translatorAdmin) {
        this.isTranslator = true;
      }

      if (!this.state.isRoomActive && !this.isAdmin) {
        // swal({
        //   title: "Session is not active",
        //   // icon: "success",
        //   className: "video-swal-modal",
        //   button: "Okay",
        // });

        this.EndCall();
        return;
      }

      console.log("isAdmin", this.isAdmin);
      console.log(adminCheckResponse.data);

      // get the access token from the server
      let token = await axios.get(this.serverlinkProduction, {
        params: {
          name: self.name + (this.isTranslator ? "_$translator" : ""),
          admin: self.isAdmin,
          roomName: self.roomName,
        },
        withCredentials: true
      });

      console.log("getting response back");
      console.log(token.data);
      self.SetupIframe(token.data); //passing token to the setupIframe function
    } catch (error) {
      if (window.parent.connectToVideocallRoom) {
        window.parent.connectToVideocallRoom(null)
      }
    }
  };

  SetupIframe = async (token) => {
    try {
      var self = this;
      if (token === undefined || token === null) return;

      this.callFrame = DailyIframe.createCallObject({
        dailyConfig: {
          experimentalChromeVideoMuteLightOff: true,
        },
      });

      this.callFrame
        .on("joining-meeting", this.updateEvent)
        .on("joined-meeting", this.updateEvent)
        .on("left-meeting", this.updateEvent)
        .on("participant-joined", this.updateEvent)
        .on("participant-updated", this.updateEvent)
        .on("participant-left", this.updateEvent)
        .on("app-message", this.requestEvent)
        .on("error", this.updateEvent);

      // console.log(`https://digitaljalebi.daily.co/${self.roomName}?t=${token}`);

      await this.callFrame.join({
        url: `https://digitaljalebi.daily.co/${self.roomName}`,
        token: token,
      });

      await this.callFrame.setNetworkTopology({ topology: "sfu" });

      this.setState({
        // hasJoinedCall: true,
        callFrame: this.callFrame,
      });
      console.log("You have joined meeting");

      // this.connectSocket();

      if (this.isAdmin) {
        // Wait for all participant-joined events finish calling (~5s)
        // setTimeout(() => {
        //   this.requestAccessStatus();
        //   console.log("requestAccessStatus");
        // }, 5000);
        // Do not allow admin to send access list till his own is updated from participants(~10s)
        // antzy check
        // setTimeout(() => {
        //   this.canSendAccessList = true;
        //   console.log("canSendAccessList");
        // }, 10000);
      }
    } catch (error) {
      if (window.parent.connectToVideocallRoom) {
        window.parent.connectToVideocallRoom(null)
      }
    }
  };

  removeLisenters = () => {
    console.log("CALLING REMOVE LISTENER!!!");
    if (this.callFrame)
      this.callFrame
        .off("joining-meeting", this.updateEvent)
        .off("joined-meeting", this.updateEvent)
        .off("left-meeting", this.updateEvent)
        .off("participant-joined", this.updateEvent)
        .off("participant-updated", this.updateEvent)
        .off("participant-left", this.updateEvent)
        .off("app-message", this.requestEvent)
        .off("error", this.updateEvent);
  };

  EndCall = () => {
    this.setState({
      isVideoOn: false,
      isAudioOn: false,
      isScreenSharing: false,
      hasAccess: false,
      hasJoinedCall: false,
      callEnded: true,
    });
    this.timerAccessControl.clear();

    if (!this.isAdmin && !this.state.isRoomActive) {
      swal({
        title: "Session is not active",
        // icon: "success",
        className: "video-swal-modal",
        button: "Okay",
      });
    } else {
      this.showNotification(
        "Call has been ended",
        NOTIFICATION_TYPES.INFO,
        10000
      );
    }

    this.EndCallViaMenu();

    if (typeof window.parent.closeVideocallRoom != "undefined")
      window.parent.closeVideocallRoom();
    //
    this.props.UIContext.closeVideocallRoom();
  };

  EndCallViaMenu() {
    this.removeLisenters();
    if (this.callFrame) this.callFrame.leave();
    this.closeSocket();
  }

  //#endregion

  //-----------------------------------------------------Common Events--------------------------------------------------------//
  //#region Common Events
  showEvent(event) {
    // console.log("-------------Show video call event----------");
    if (event.action) {
      switch (event.action) {
        default:
          console.log(event.action + " : ");
          // console.log(event);
          break;
      }
    }
    // console.log("----------------XX-----------------------");
  }

  updateEvent = async (event) => {
    let participants = this.callFrame.participants();
    this.setState({ participants });

    if (event) {
      // let participants = event.participants;

      // Have I stopped sharing screen?
      if (event.participant && event.participant.local) {
        if (!event.participant.screen)
          this.setState({
            isScreenSharing: false,
          });
      }

      if (event.action) {
        // console.log("-------------video call event----------");
        // console.log(event)
        switch (event.action) {
          case "joining-meeting":
            //#region points noted
            //can show user the UI changes according to this //no major data is returned in event
            //#endregion
            // console.log("joining meeting : ");
            // console.log(event);
            break;
          case "joined-meeting":
            //#region points noted
            //when finaly call has been joined
            // return all participants along with local participant unique- userid, sessionid
            // at this time take your seesion id save it to the firebase --X
            // add a lisenter so that everytime from same room if added or removed you will be notified
            //#endregion
            if (this.isAdmin) {
              this.joinedMeetingEvent(event); // antzy check
            }
            // console.log("joined meeting : ");
            // console.log(event);
            this.session_id = event.participants.local.session_id;

            this.isJoiningCall = false;
            this.setState({ hasJoinedCall: true });

            this.connectSocket(this.session_id);
            break;
          case "participant-joined":
            //#region points noted
            //add to your list
            // this is called even before joined meeting is called for already present users
            //only single participant will be returned in event
            //#endregion
            // console.log(event.action + " : ");
            // console.log(event);

            // this.addParticipant(event.participant);
            // this.showNotification(
            //   event.participant.user_name + " joined the call"
            // );

            // Send access list to a newly joined participant
            // if (this.canSendAccessList) {
            //   this.sendAccessList(
            //     event.participant.session_id,
            //     this.state.accessAllowedIDs
            //   );
            // }

            if (this.isAdmin) {
              if (window.isCountdownRunning && window.countdown) {
                let session_id = event.participant.session_id;
                setTimeout(() => {
                  this.sendCountdownStart(window.countdown, session_id);
                }, 5000);
              }
            }

            // to update our access-allowed and pending lists from new participants list
            this.updateLocalAccessLists(null, null, participants);
            break;
          case "participant-updated":
            //#region points noted
            //change in UI -- if needed
            // it will not add it as new user but it will update the existing one
            //#endregion
            // if (
            //   !this.isParticipantUpdated(
            //     event.participant,
            //     event.participant.session_id
            //   )
            // ) {
            //   return;
            // }
            // console.log(event.action + " : ");
            // console.log(event);

            if (event.participant.screen) {
              if (this.state.screenSharingParticipant.length > 0) {
                // console.log(this.ScreenSharingParticipant);
              } else {
                this.setState({
                  screenSharingParticipant: event.participant.session_id,
                });

                // if (this.session_id === event.participant.session_id) {
                //   this.showNotification("You started screen-sharing");
                // } else {
                //   this.showNotification(
                //     event.participant.user_name + " started screen-sharing"
                //   );
                // }
              }
            } else {
              if (this.state.screenSharingParticipant.length > 0) {
                if (
                  event.participant.session_id ===
                  this.state.screenSharingParticipant
                ) {
                  this.setState({ screenSharingParticipant: "" });
                }
              }
            }

            if (this.isAdmin) this.changeOrder(event.participant);
            break;
          case "participant-left":
            //#region points noted
            //remove from your list
            // from admin access remove the user info from the firestore (this can be last step as a clean up)
            //only single participant will be returned in event
            //#endregion
            // if(this.isAdmin)
            // {
            //     this.removeParticipantFromFirebase(event.participant);
            // }
            // console.log(event.action + " : ");
            // console.log(event);

            // this.removeParticipant(event.participant);

            let activeUserNumber = Object.keys(participants).length;
            if (activeUserNumber > 1) {
              // this.showNotification(
              //   event.participant.user_name + " left the call"
              // );
            } else {
              this.showNotification("Everybody left the call");
            }

            // if user who left had access, then revoke it
            if (
              this.state.accessAllowedIDs.includes(event.participant.session_id)
            ) {
              let accessAllowedIDs = this.state.accessAllowedIDs.filter(
                (val) => val !== event.participant.session_id
              );
              this.setState({ accessAllowedIDs });

              // Send access list to a newly joined participant
              // if (this.canSendAccessList) {
              //   this.sendAccessList(null, accessAllowedIDs);
              // }
            }

            // to update our access-allowed and pending lists from new participants list
            this.updateLocalAccessLists(null, null, participants);
            break;
          case "left-meeting":
            console.log("you have been disconnected from the call");

            this.EndCall();

          case "error":
            if (event.errorMsg) {
              if (event.errorMsg === "Meeting has ended") {
                // console.log("Secodn check, you have been disconnected from the call");
                if (!this.state.callEnded) {
                  this.setState({
                    isVideoOn: false,
                    isAudioOn: false,
                    isScreenSharing: false,
                    hasAccess: false,
                    hasJoinedCall: false,
                    callEnded: true,
                  });
                }
              }
            }
          default:
            // console.log(event.action + " : ");
            // console.log(event);
            break;
        }
        // console.log("---------------------------------------");
      }
    }

    let tmp_isScreenSharing = false,
      tmp_isVideoOn = false,
      tmp_isAudioOn = false;
    if (participants.local) {
      //check for local ScreenShare
      if (participants.local.screen && !this.state.isScreenSharing) {
        tmp_isScreenSharing = true;
      } else if (!participants.local.screen && this.state.isScreenSharing) {
        tmp_isScreenSharing = false;
      } else {
        tmp_isScreenSharing = participants.local.screen;
      }
      //check for video access
      if (this.callFrame.localVideo()) {
        tmp_isVideoOn = true;
      } else {
        tmp_isVideoOn = false;
      }
      //check for audio access
      if (this.callFrame.localAudio()) {
        tmp_isAudioOn = true;
      } else {
        tmp_isAudioOn = false;
      }
      this.setState({
        isScreenSharing: tmp_isScreenSharing,
        isVideoOn: tmp_isVideoOn,
        isAudioOn: tmp_isAudioOn,
      });
    }
  };

  // When a message is received through dailyco data channel
  requestEvent = async (event) => {
    // console.log("received request event: ");
    // console.log(event);

    const fromId = event.fromId;
    const type = event.data.type;
    const value = event.data.value;

    if (this.isAdmin) {
      switch (type) {
        case "access-request": // request for access from a participant
          // console.log("access-request");
          // if (this.state.accessAllowedIDs.includes(fromId)) {
          //   this.setAccess(fromId, true);
          // } else {
          //   // console.log("pending request");
          //   if (!this.state.pendingRequestIDs.includes(fromId)) {
          //     // console.log("pending request added");
          //     let pendingRequestIDs = [...this.state.pendingRequestIDs, fromId];
          //     this.setState({ pendingRequestIDs });
          //     this.updateEvent(event);

          //     // if (this.LiveParticipantListFromDailyco.has(fromId)) {
          //     //   let userName =
          //     //     this.LiveParticipantListFromDailyco.get(fromId).user_name;
          //     //   this.showNotification(
          //     //     userName + " has requested access",
          //     //     NOTIFICATION_TYPES.INFO,
          //     //     8000
          //     //   );
          //     // }
          //     if (this.state.participants[fromId]) {
          //       let userName = this.state.participants[fromId].user_name;
          //       this.showNotification(
          //         userName + " has requested access",
          //         NOTIFICATION_TYPES.INFO,
          //         8000
          //       );
          //     }

          //     // Can we remove self and use this directly?
          //     var self = this;
          //     setTimeout(() => {
          //       if (self.state.pendingRequestIDs.includes(fromId)) {
          //         let pendingRequestIDs = self.state.pendingRequestIDs.filter(
          //           (val) => val !== fromId
          //         );
          //         self.setState({ pendingRequestIDs });
          //         self.updateEvent(event);
          //       }
          //     }, self.requestAccessTime);
          //   } else {
          //     // Are we trying to move it to the end of the pendingRequestIDs list?
          //     let pendingRequestIDs = this.state.pendingRequestIDs.filter(
          //       (val) => val !== fromId
          //     );
          //     pendingRequestIDs.push(fromId);
          //     this.setState({ pendingRequestIDs });
          //     this.updateEvent(event);
          //     // if (this.LiveParticipantListFromDailyco.has(fromId)) {
          //     //   let userName =
          //     //     this.LiveParticipantListFromDailyco.get(fromId).user_name;
          //     //   this.showNotification(
          //     //     userName + " has requested access",
          //     //     NOTIFICATION_TYPES.INFO,
          //     //     8000
          //     //   );
          //     // }
          //     if (this.state.participants[fromId]) {
          //       let userName = this.state.participants[fromId].user_name;
          //       this.showNotification(
          //         userName + " has requested access",
          //         NOTIFICATION_TYPES.INFO,
          //         8000
          //       );
          //     }
          //   }
          // }
          break;
        // case "access-status-response":
        //   console.log(value);
        //   switch (value) {
        //     case "has-access":
        //       if (!this.state.accessAllowedIDs.includes(fromId)) {
        //         let accessAllowedIDs = [...this.state.accessAllowedIDs, fromId];
        //         this.setState({ accessAllowedIDs });
        //         console.log(fromId);
        //       }
        //       break;
        //     case "requested-access":
        //       if (!this.state.pendingRequestIDs.includes(fromId)) {
        //         let pendingRequestIDs = [
        //           ...this.state.pendingRequestIDs,
        //           fromId,
        //         ];
        //         this.setState({ pendingRequestIDs });
        //         console.log(fromId);
        //       }
        //       break;
        //     case "no-access":
        //       break;
        //   }
        //   break;
      }
    } else {
      //not admin?
      switch (type) {
        case "countdown":
          console.log("Countdown!!!!!!!!!!!!!!!!");
          if (event.data.action === "start") {
            let initialCountdown = value;
            console.log("Countdown started");
            console.log(initialCountdown);
            this.setState({ initialCountdown, isCountdownRunning: true });
          } else if (event.data.action === "pause") {
            this.setState({ isCountdownRunning: false });
          }
          break;
        // case "access-status-request":
        //   console.log("access-status-request");
        //   this.sendAccessStatus();
        //   break;
        // case "access-list":
        //   console.log(value);
        //   if (this.state.accessAllowedIDs) {
        //     if (value) {
        //       let playDing = false;
        //       for (let i = 0; i < value.length; i++) {
        //         if (!this.state.accessAllowedIDs.includes(value[i])) {
        //           playDing = true;
        //           break;
        //         }
        //       }

        //       if (playDing) {
        //         // alert("Playing ding");
        //         new Audio(ding).play();
        //       }
        //     }
        //   } else if (value && value.length > 0) {
        //     new Audio(ding).play();
        //   }

        //   this.setState({ accessAllowedIDs: value });
        //   console.log("access-list");
        //   console.log(value);
        //   break;
      }

      if (event.data.allowed === true) {
        // swal({
        //   title: "You Have Been Granted Access By The Host",
        //   icon: "success",
        //   className: "video-swal-modal",
        //   button: "Okay",
        // });
        // this.showNotification(
        //   "You have been granted access by the host",
        //   NOTIFICATION_TYPES.SUCCESS,
        //   10000
        // );
        // this.setState({
        //   isVideoOn: false,
        //   isAudioOn: false,
        //   isScreenSharing: false,
        //   hasAccess: true,
        //   hasRequestedAccess: false,
        // });
      } else if (event.data.allowed === false) {
        if (this.state.hasAccess) {
          // swal({
          //   title: "Your Access Request Has Been Revoked By Host",
          //   icon: "info",
          //   className: "video-swal-modal",
          //   button: "Okay",
          // });
          // this.showNotification(
          //   "Your access has been revoked by host",
          //   NOTIFICATION_TYPES.WARN,
          //   10000
          // );
          // if (this.state.isScreenSharing) {
          //   this.callFrame.stopScreenShare();
          //   this.setState({
          //     isVideoOn: false,
          //     isAudioOn: false,
          //     isScreenSharing: false,
          //     hasAccess: false,
          //     isScreenSharing: false,
          //   });
          //   return;
          // }
        } else {
          // this.showNotification(
          //   "Your access request has been rejected by host",
          //   NOTIFICATION_TYPES.WARN,
          //   10000
          // );
        }
        // this.setState({
        //   hasAccess: false,
        //   hasRequestedAccess: false,
        // });
      }

      if (event.data.video === true) {
        swal({
          title: "Host has requested you to turn on video",
          // icon: "success",
          className: "video-swal-modal",
          buttons: {
            accept: "Turn On Video",
            reject: "Decline Request",
          },
        }).then((value) => {
          switch (value) {
            case "accept":
              this.requestVideoAccess();
              break;
            //   case "cancel":
            //     swal("Request declined");
            //     break;
            default:
              // swal("Request declined");
              break;
          }
        });
      } else if (event.data.video === false) {
        if (this.callFrame.localVideo()) {
          this.callFrame.setLocalVideo(false);
          this.setState({
            isVideoOn: false,
          });
        }
        // else {
        //     this.requestVideoAccess();
        // }
      }

      if (event.data.audio === true) {
        swal({
          title: "Host has requested you to turn on audio",
          // icon: "success",
          className: "video-swal-modal",
          buttons: {
            accept: "Turn On Audio",
            reject: "Decline Request",
          },
        }).then((value) => {
          switch (value) {
            case "accept":
              this.requestAudioAccess();
              break;
            //   case "cancel":
            //     swal("Request declined");
            //     break;
            default:
              // swal("Request declined");
              break;
          }
        });
      } else if (event.data.audio === false) {
        if (this.callFrame.localAudio()) {
          this.callFrame.setLocalAudio(false);
          this.setState({
            isAudioOn: false,
          });
        }
      }

      if (event.data.screen === true) {
        swal({
          title: "Host has requested you to turn on screen sharing",
          // icon: "success",
          className: "video-swal-modal",
          buttons: {
            accept: "Turn On Screen Sharing",
            reject: "Decline Request",
          },
        }).then((value) => {
          switch (value) {
            case "accept":
              this.requestShareAccess();
              break;
            //   case "cancel":
            //     swal("Request declined");
            //     break;
            default:
              // swal("Request declined");
              break;
          }
        });
      } else if (event.data.screen === false) {
        this.callFrame.stopScreenShare();
        this.setState({
          isScreenSharing: false,
        });
      }
    }

    if (type === "raise-hand") {
      console.log("raise-hand");
      let userName = null;
      if (
        this.state.participants.local.session_id !== fromId &&
        this.state.participants[fromId]
      ) {
        userName = this.state.participants[fromId].user_name;
      }
      // if (userName)
      //   this.showNotification(
      //     "✋ " + userName + " has raised hand",
      //     NOTIFICATION_TYPES.NORMAL,
      //     8000
      //   );
      if (event.data.id) {
        this.props.HandRaiseVideoCallContext.addIdToHandRaise(
          event.data.id,
          userName,
          8000
        );
      }
    }
  };

  sendAccessRequest() {
    if (!this.state.hasJoinedCall || this.isAdmin) {
      return;
    }
    // console.log("Request sent!!");
    // this.callFrame.sendAppMessage({ type: "access-request" });
    this.requestAccessSocket();
  }

  // requestAccessStatus() {
  //   if (!this.isAdmin) {
  //     return;
  //   }

  //   console.log("requestAccessStatus");

  //   this.callFrame.sendAppMessage({
  //     type: "access-status-request",
  //   });
  // }

  // sendAccessStatus() {
  //   if (!this.state.hasJoinedCall || this.isAdmin) {
  //     return;
  //   }
  //   // console.log("Request sent!!");
  //   if (this.state.hasAccess) {
  //     this.callFrame.sendAppMessage({
  //       type: "access-status-response",
  //       value: "has-access",
  //     });
  //     console.log("has-access");
  //   } else if (this.state.hasRequestedAccess) {
  //     this.callFrame.sendAppMessage({
  //       type: "access-status-response",
  //       value: "requested-access",
  //     });
  //     console.log("requested-access");
  //   } else {
  //     this.callFrame.sendAppMessage({
  //       type: "access-status-response",
  //       value: "no-access",
  //     });
  //     console.log("no-access");
  //   }
  // }

  // sendAccessList = (participantId, accessAllowedIDs) => {
  //   if (!this.state.hasJoinedCall || !this.isAdmin) {
  //     return;
  //   }

  //   if (participantId) {
  //     console.log("Sending accessAllowedIDs to " + participantId);
  //     console.log(accessAllowedIDs);
  //     this.callFrame.sendAppMessage(
  //       {
  //         type: "access-list",
  //         value: accessAllowedIDs,
  //       },
  //       participantId
  //     );
  //   } else {
  //     console.log("Sending accessAllowedIDs to all");
  //     console.log(accessAllowedIDs);
  //     this.callFrame.sendAppMessage({
  //       type: "access-list",
  //       value: accessAllowedIDs,
  //     });
  //   }
  // };

  sendCountdownStart = (countdown, participantId = null) => {
    if (!this.state.hasJoinedCall || !this.isAdmin) {
      return;
    }
    if (!participantId) {
      console.log(`Sending countdown ${countdown} to all`);
      this.callFrame.sendAppMessage({
        type: "countdown",
        action: "start",
        value: countdown,
      });
    } else {
      console.log(`Sending countdown ${countdown} to ${participantId}`);
      this.callFrame.sendAppMessage(
        {
          type: "countdown",
          action: "start",
          value: countdown,
        },
        participantId
      );
    }
  };

  sendCountdownPause = () => {
    if (!this.state.hasJoinedCall || !this.isAdmin) {
      return;
    }
    this.callFrame.sendAppMessage({ type: "countdown", action: "pause" });
  };

  sendHandRaise = () => {
    if (!this.state.hasJoinedCall || this.isAdmin) {
      return;
    }
    this.callFrame.sendAppMessage({
      type: "raise-hand",
      id: this.context.user.uid,
    });
    // this.showNotification("✋ You have raised hand", NOTIFICATION_TYPES.NORMAL);
    this.props.HandRaiseVideoCallContext.addIdToHandRaise(
      this.context.user.uid,
      'You',
      8000
    );
  };
  //#endregion

  //-----------------------------------------------------Request Access functions --------------------------------------------//
  //#region Request Access Function

  checkActiveCamerasLimit() {
    var maxCameraLimit = 8;
    var participants = this.callFrame.participants();
    var activeCameraCount = 0;
    Object.keys(participants).forEach((session_id) => {
      if (participants[session_id].video) {
        activeCameraCount++;
      }
    });
    console.log(activeCameraCount);
    if (activeCameraCount < maxCameraLimit) return true;
    else {
      return false;
    }
  }

  requestVideoAccess = () => {
    console.log(this.state);
    if (!this.state.hasJoinedCall) {
      return;
    }

    if (this.isAdmin) {
      if (this.callFrame.localVideo() || this.checkActiveCamerasLimit()) {
        this.callFrame.setLocalVideo(!this.callFrame.localVideo());
        this.setState({
          isVideoOn: !this.callFrame.localVideo(),
        });
      } else {
        swal({
          title: "Unable to turn on camera.",
          text: "Maximum limit of 8 active cameras has been reached. Please revoke camera access from an active participant to turn on camera.",
          icon: "warning",
          className: "video-swal-modal",
          button: "Okay",
        });
      }
    } else {
      if (this.callFrame.localVideo()) {
        this.callFrame.setLocalVideo(false);
        this.setState({
          isVideoOn: false,
        });
      } else {
        if (this.state.hasAccess) {
          if (this.checkActiveCamerasLimit()) {
            this.callFrame.setLocalVideo(true);
            this.setState({
              isVideoOn: true,
            });
          } else {
            swal({
              title: "Unable to turn on camera.",
              text: "Maximum limit of 8 active cameras has been reached.",
              icon: "warning",
              className: "video-swal-modal",
              button: "Okay",
            });
          }
        } else {
          if (!this.state.hasRequestedAccess) {
            var self = this;
            // setTimeout(function () {
            //   self.setState({
            //     hasRequestedAccess: false,
            //   });
            // }, self.requestAccessTime);
            self.setState({
              hasRequestedAccess: true,
            });
            this.sendAccessRequest();
          }
        }
      }
    }
  };

  requestAudioAccess = () => {
    if (!this.state.hasJoinedCall) {
      return;
    }
    // if (this.isAdmin) {
    this.callFrame.setLocalAudio(!this.callFrame.localAudio());
    this.setState({
      isAudioOn: !this.callFrame.localAudio(),
    });
    // } else {
    //   if (this.callFrame.localAudio()) {
    //     this.setState({
    //       isAudioOn: false,
    //     });
    //     this.callFrame.setLocalAudio(false);
    //   } else {
    //     if (this.state.hasAccess) {
    //       this.setState({
    //         isAudioOn: true,
    //       });
    //       this.callFrame.setLocalAudio(true);
    //     } else {
    //       swal(
    //         "Send Access Request!!",
    //         "Want To Send Access Request To The Host",
    //         "success"
    //       ).then((value) => {
    //         this.sendAccessRequest();
    //       });
    //     }
    //   }
    // }
  };

  adminToggleShareScreen = async () => {
    if (!this.state.isScreenSharing) {
      this.callFrame.startScreenShare();
      this.setState({
        isScreenSharing: true,
      });
    } else {
      // console.log("admin share off!");
      this.callFrame.stopScreenShare();
      this.setState({
        isScreenSharing: false,
      });
    }
  };

  startScreenShareWithCustomTrack = async () => {
    let screenStream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: true,
    });
    this.callFrame.startScreenShare({
      // mediaStream: new MediaStream(screenStream.getAudioTracks()),
      mediaStream: screenStream,
    });
  };

  requestShareAccess = () => {
    if (!this.state.hasJoinedCall) {
      return;
    }

    //if somebody is already sharing the screen
    if (!this.state.isScreenSharing) {
      if (this.state.screenSharingParticipant.length > 0) {
        // if (
        //   this.LiveParticipantListFromDailyco.has(
        //     this.state.screenSharingParticipant
        //   )
        // ) {
        if (this.state.participants[this.state.screenSharingParticipant]) {
          var participant =
            this.state.participants[this.state.screenSharingParticipant];
          this.showNotification(
            participant.user_name + " is already sharing screen",
            NOTIFICATION_TYPES.ERROR
          );

          // swal({
          //   title: "Unable to share screen",
          //   text: participant.user_name + " is already sharing screen",
          //   icon: "warning",
          //   // className: "video-swal-modal",
          //   button: "Okay",
          // });
        } else {
          // console.log(this.state.screenSharingParticipant);
          this.showNotification(
            "Someone is already sharing screen",
            NOTIFICATION_TYPES.ERROR
          );
          // swal({
          //   title: "Unable to share screen",
          //   text: "Someone is already sharing screen",
          //   icon: "warning",
          //   // className: "video-swal-modal",
          //   button: "Okay",
          // });
        }
        // console.log("somebody is sharong the screem!!");
        return;
      }
    }

    if (this.isAdmin) {
      this.adminToggleShareScreen();
    } else {
      if (this.state.isScreenSharing) {
        // console.log("isShare is oFF");
        this.setState({
          isScreenSharing: false,
        });
        this.callFrame.stopScreenShare();
      } else {
        if (this.state.hasAccess) {
          this.setState({
            isScreenSharing: true,
          });

          this.callFrame.startScreenShare({ audio: true });
          // this.startScreenShareWithCustomTrack();
        } else if (window.confirm("Request host to turn on screen sharing?")) {
          this.sendAccessRequest();
        }
      }
    }
  };
  //#endregion

  //-----------------------------------------------------Admin functions -----------------------------------------------------//
  //#region Admin Function
  setAccess(participantID, isAllowed) {
    if (!this.isAdmin) {
      return;
    }

    console.log("Set access for " + participantID + " to " + isAllowed);

    // Remove from pending requests list
    // if (this.state.pendingRequestIDs.includes(participantID)) {
    //   let pendingRequestIDs = this.state.pendingRequestIDs.filter(
    //     (val) => val !== participantID
    //   );
    //   this.setState({ pendingRequestIDs });
    // }

    let accessAllowedIDs = null;
    if (isAllowed) {
      // update UI
      // if (!this.state.accessAllowedIDs.includes(participantID)) {
      //   accessAllowedIDs = [...this.state.accessAllowedIDs, participantID];
      //   this.setState({ accessAllowedIDs });
      // }
      // this.callFrame.sendAppMessage({ allowed: true }, participantID);
      // this.updateEvent();
    } else {
      //change UI
      // if (this.state.accessAllowedIDs.includes(participantID)) {
      //   accessAllowedIDs = this.state.accessAllowedIDs.filter(
      //     (val) => val !== participantID
      //   );
      //   this.setState({ accessAllowedIDs });
      // }

      this.callFrame.updateParticipant(participantID, {
        setVideo: false,
        setAudio: false,
      });
      // this.callFrame.sendAppMessage({ allowed: false }, participantID);
    }

    // if (accessAllowedIDs && this.canSendAccessList) {
    //   this.sendAccessList(null, accessAllowedIDs);
    // }
  }

  toggleParticipantAccess = (participantID) => {
    if (!this.state.accessAllowedIDs.includes(participantID)) {
      // this.setAccess(participantID, true);
      this.giveAccessSocket(participantID);
      console.log("giving access");
    } else {
      // this.setAccess(participantID, false);
      this.revokeAccessSocket(participantID);
      this.callFrame.updateParticipant(participantID, {
        setVideo: false,
        // setAudio: false,
      });
      console.log("taking back access");
    }
  };

  setParticipantVideo = (participantID, participant) => {
    if (!this.isAdmin) return;

    if (this.state.accessAllowedIDs.includes(participantID)) {
      if (participant.video)
        this.callFrame.sendAppMessage({ video: false }, participantID);
      else this.callFrame.sendAppMessage({ video: true }, participantID);
      // this.updateEvent();
    }
  };

  setParticipantAudio = (participantID, participant) => {
    if (!this.isAdmin) return;

    // if (this.state.accessAllowedIDs.includes(participantID)) {
    if (participant.audio)
      this.callFrame.sendAppMessage({ audio: false }, participantID);
    else this.callFrame.sendAppMessage({ audio: true }, participantID);
    // this.updateEvent();
    // }
  };

  setParticipantScreen = (participantID, participant) => {
    if (!this.isAdmin) return;

    if (this.state.accessAllowedIDs.includes(participantID)) {
      if (participant.screen)
        this.callFrame.sendAppMessage({ screen: false }, participantID);
      else this.callFrame.sendAppMessage({ screen: true }, participantID);
      // this.updateEvent();
    }
  };

  ejectParticipant = (participantID) => {
    if (this.state.accessAllowedIDs.includes(participantID)) {
      let accessAllowedIDs = this.state.accessAllowedIDs.filter(
        (val) => val !== participantID
      );
      this.setState({ accessAllowedIDs });
    }
    this.callFrame.updateParticipant(participantID, { eject: true });
    // this.removeParticipant(participantID);
  };

  cancelRequest = (participantID) => {
    // this.setAccess(participantID, false);
    this.cancelAccessRequestSocket(participantID);
  };

  // If admin joins and someone is already sharing screen or has video access or is admin, add to access allowed ID
  initAccessAllowedIDs = async (event) => {
    if (!this.isAdmin) return;

    let participants = this.callFrame.participants();

    Object.keys(participants).forEach((participantId) => {
      if (participantId === "local") {
        return;
      }
      if (
        participants[participantId].video ||
        // participants[participantId].audio ||
        participants[participantId].screen ||
        participants[participantId].owner
      ) {
        if (!this.accessAllowedIDs.includes(participantId)) {
          let accessAllowedIDs = [
            ...this.state.accessAllowedIDs,
            participantId,
          ];
          this.setState({ accessAllowedIDs });
        }
      }
    });
    this.updateEvent(event);
  };
  //#endregion

  //-----------------------------------------------------Admin Events --------------------------------------------------------//
  //#region Admin Events
  joinedMeetingEvent(event) {
    if (!this.isInit && this.isAdmin) {
      this.isInit = true;
      this.initAccessAllowedIDs(event);
    }
    this.showEvent(event);
  }
  //#endregion

  //-----------------------------------------------------Render Functions ----------------------------------------------------//
  //#region render Functions

  renderVideoConferenceUI() {
    if (this.state.hasJoinedCall) {
      let participant = this.callFrame.participants();
      let activeUserNumber = Object.keys(participant).length;
      if (activeUserNumber > 1) {
        return (
          <div className="videoConference-section">
            {this.renderParticipantList()}
          </div>
        );
      } else {
        return <div className="uiMessgaes">Waiting For Others To Join....</div>;
      }
    } else if (this.state.callEnded) {
      return (
        <>
          <div className="uiMessgaes">
            {this.state.isRoomActive
              ? `You Have Been Disconnected`
              : `Video Call Ended`}
          </div>
          <div id="controlsParent">
            {this.state.isRoomActive ? (
              <button
                className="rejoinButton"
                onClick={(event) => this.initializeDailyco()}
              >
                Rejoin{" "}
              </button>
            ) : null}
            {/* <button className="rejoinButton" onClick={(event) => this.goToLobby(event)} >GoToLobby </button> */}
          </div>
        </>
      );
    } else {
      return <div className="uiMessgaes">Please Wait. Joining Call..</div>;
    }
  }

  showNotification(message, type = NOTIFICATION_TYPES.NORMAL, time = 4000) {
    // toast.dismiss();
    let toastPosition;
    if (window.screen.width < 700) {
      toastPosition = toast.POSITION.TOP_LEFT;
    } else {
      toastPosition = toast.POSITION.BOTTOM_LEFT;
    }

    let toastifyOptions = {
      position: toastPosition, //"bottom-right",
      autoClose: time,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: false,
      progress: undefined,
      // transition: Zoom,
    };

    if (!type || type === NOTIFICATION_TYPES.NORMAL) {
      this.toastId = toast(message, toastifyOptions);
    } else if (type === NOTIFICATION_TYPES.INFO) {
      this.toastId = toast.info(message, toastifyOptions);
    } else if (type === NOTIFICATION_TYPES.SUCCESS) {
      this.toastId = toast.success(message, toastifyOptions);
    } else if (type === NOTIFICATION_TYPES.WARN) {
      this.toastId = toast.warn(message, toastifyOptions);
    } else if (type === NOTIFICATION_TYPES.ERROR) {
      this.toastId = toast.error(message, toastifyOptions);
    }
  }
  //#endregion

  //-----------------------------------------------------Socket Functions ----------------------------------------------------//
  //#region render Socket

  // connect to socket and provide it your sessionid aka participantId
  connectSocket = (sessionid) => {
    if (this.socket !== null) return;

    const { user } = this.context;
    // if socket hasn't been created yet and user is valid
    if (user && user.isChecked && !this.socket) {
      // connect with socket
      console.log("connect with socket");
      // let socket = SocketManager.initalizeSocket(user, sessionid);
      SocketManager.subscribe_GetSocket((socket) => {
        console.log("Connected with socket", socket);
        socket.auth = {
          ...socket.auth,
          sessionid,
        };
        //if invalid userName or userid is passed
        socket.on(SOCKET_EVENT_NAMES.connect_error, (err) => {
          if (err.message === "invalid username") {
            console.error(err);
            swal({
              title: "Unable to create socket connection",
              icon: "error",
              className: "video-swal-modal",
              button: "Okay",
            });
            return;
          }
        });

        this.socket = socket;
        console.log(socket.id);
        console.log("Successfully Connected with Backend via socket");

        // Join public socket room for this video call room
        this.joinSocketRoom(this.roomName, true);

        // subscribe to various rooms events
        socket.on(
          `${this.roomName}:${OPERATION_TYPE.Ready}`,
          this.handleReadySocket
        );
        socket.on(
          `${this.roomName}:${OPERATION_TYPE.error}`,
          this.handleErrorSocket
        );
        socket.on(
          `${this.roomName}:${OPERATION_TYPE.updateCallStartedStatus}`,
          this.handleCallStartedStatus
        );

        if (this.isAdmin) {
          // subscribe to admin room access list so both pending and approved access items are received
          this.socket.on(
            `${this.roomName}:${OPERATION_TYPE.accesslist}`,
            this.handleAccessListSocket
          );
          // when a participant requests access
          this.socket.on(
            `${this.roomName}:${OPERATION_TYPE.RequestAccess}`,
            this.handleRequestAccessSocket
          );
          // when a participant or another admin cancels a request
          this.socket.on(
            `${this.roomName}:${OPERATION_TYPE.CancelAccessRequest}`,
            this.handleCancelAccessRequestSocket
          );

          // join the admin room
          this.joinSocketRoom(`${this.roomName}:admin`, false);
        } else {
          this.socket.on(
            `${this.roomName}:${OPERATION_TYPE.accesslist}`,
            this.handleAccessListSocket
          );

          this.socket.on(
            `${this.roomName}:${OPERATION_TYPE.CancelAccessRequest}`,
            this.handleCancelAccessRequestSocket
          );

          // join your own personal sessionId room
          // this.joinRoom(this.session_id, false);
        }

        socket.on(SOCKET_EVENT_NAMES.disconnect, (reason) => {
          if (reason === "io server disconnect") {
            console.error(reason);
            console.err(
              "the disconnection was initiated by the server, you need to reconnect manually"
            );
            socket.connect();
          }
        });

        // // on connection socket event
        // socket.on(SOCKET_EVENT_NAMES.connect, () => {

        // });
      });
    }
  };

  // socket.emit functions
  joinSocketRoom = (roomId, isVideoCallRoom) => {
    this.socket.emit(
      SOCKET_EVENT_NAMES.JoinToRoom,
      roomId,
      isVideoCallRoom,
      (data) => {
        console.log(`Join room ${roomId} response`, data);
      },
      this.session_id
    );
  };

  requestAccessSocket = () => {
    console.log("SENDING ACCESS REQUEST");
    if (!this.isAdmin) {
      this.socket.emit(
        `${this.roomName}:${OPERATION_TYPE.RequestAccess}`,
        this.session_id
      );

      this.setState({ hasRequestedAccess: true });

      // After some time(30s?), automatically cancel access request
      // setTimeout(() => {
      //   this.cancelAccessRequestSocket();
      // }, this.requestAccessTime);
    }
  };

  cancelAccessRequestSocket = (sessionid) => {
    console.log("Cancelling request", sessionid);
    if (this.isAdmin) {
      if (sessionid) {
        // let emailId = this.state.serverPendingRequestIDs[sessionid];
        this.socket.emit(
          `${this.roomName}:${OPERATION_TYPE.CancelAccessRequest}`,
          sessionid
        );
        console.log("Cancelled request", sessionid);
      }
    } else {
      this.socket.emit(
        `${this.roomName}:${OPERATION_TYPE.CancelAccessRequest}`
      );

      this.setState({ hasRequestedAccess: false, hasAccess: false });
    }
  };

  giveAccessSocket = (sessionid) => {
    if (!this.isAdmin || !sessionid) return;

    if (this.state.accessAllowedIDs.length < 8) {
      this.socket.emit(
        `${this.roomName}:${OPERATION_TYPE.GiveAccess}`,
        sessionid
      );
    } else {
      swal({
        title: "Unable to give access",
        text: "Maximum limit of 8 live participants has been reached. Please revoke access from a live participant first.",
        icon: "warning",
        className: "video-swal-modal",
        button: "Okay",
      });
    }
  };

  revokeAccessSocket = (sessionid) => {
    if (this.isAdmin && sessionid && this.socket) {
      // let emailId = this.state.serverAccessAllowedIDs[sessionid];
      // if (emailId) {
      this.socket.emit(
        `${this.roomName}:${OPERATION_TYPE.RevokeAccess}`,
        sessionid
      );
      // }
    }
  };

  getAccessListSocket = () => {
    if (this.socket) {
      this.socket.emit(`${this.roomName}:${OPERATION_TYPE.GetAccessList}`);
    } else {
      setTimeout(() => {
        this.getAccessListSocket();
      }, 500);
    }
  };

  setStartCallStatus = (shouldStartCall) => {
    if (this.isAdmin && this.socket) {
      this.socket.emit(
        `${this.roomName}:${OPERATION_TYPE.updateCallStartedStatus}`,
        shouldStartCall
      );
    }
  };

  // socket.on functions
  handleReadySocket = (data) => {
    console.log("Ready data", data);
    this.getAccessListSocket();
  };

  handleAccessListSocket = (data) => {
    console.log("User access list", data);
    this.updateAccessListsFromServerData(data);
  };

  handleRequestAccessSocket = (data) => {
    console.log("Request access data", data);
    let fromId = data.vcsessionid;
    if (!fromId) return;

    let serverPendingRequestIDs = this.state.serverPendingRequestIDs;
    serverPendingRequestIDs = [...serverPendingRequestIDs, fromId];
    this.setState({ serverPendingRequestIDs });

    this.updateLocalAccessLists(serverPendingRequestIDs);

    if (this.state.participants[fromId]) {
      let userName = this.state.participants[fromId].user_name;
      this.showNotification(
        userName + " has requested access",
        NOTIFICATION_TYPES.INFO,
        8000
      );
    }
  };

  handleCancelAccessRequestSocket = (data) => {
    if (this.isAdmin) {
      console.log("Cancel access request data", data);
      let fromId = data.vcsessionid;
      if (!fromId) return;

      let serverPendingRequestIDs = this.state.serverPendingRequestIDs;
      serverPendingRequestIDs = serverPendingRequestIDs.filter(
        (reqID) => reqID !== fromId
      );
      this.setState({ serverPendingRequestIDs });

      this.updateLocalAccessLists(serverPendingRequestIDs);
    } else {
      // Cancel event is also sent to the original request sender
      this.showNotification(
        "Your access request has been rejected by host",
        NOTIFICATION_TYPES.WARN,
        10000
      );
      this.setState({
        hasAccess: false,
        hasRequestedAccess: false,
      });
    }
  };

  handleErrorSocket = (data) => {
    console.log("Error data", data);
  };

  handleCallStartedStatus = (isCallStarted) => {
    console.log("Call Started Status", isCallStarted);

    this.setState({ isRoomActive: isCallStarted });
    if (!isCallStarted && !this.isAdmin) {
      this.EndCall();
    }
  };

  removeListenersSocket = () => {
    if (this.socket) {
      let socket = this.socket;
      socket.off(SOCKET_EVENT_NAMES.connect_error);
      socket.off(SOCKET_EVENT_NAMES.connect);
      socket.off(SOCKET_EVENT_NAMES.disconnect);
      socket.off(SOCKET_EVENT_NAMES.users);
      socket.off(SOCKET_EVENT_NAMES["user disconnected"]);
      socket.off(SOCKET_EVENT_NAMES["user connected"]);
      socket.off(SOCKET_EVENT_NAMES["private message"]);
      socket.off(SOCKET_EVENT_NAMES["public messages"]);
    }
  };

  closeSocket = () => {
    // console.log("xxxxxxxxxxxxxxxxxxxxxxx")
    // this.removeListenersSocket();
    // if (this.socket && this.socket.connected) this.socket.disconnect();
    //leave socket rooms
    // console.log('--------end-----------')
    // console.log(this)
    // console.log(this.socket)
    // console.log(this.roomName)
    // console.log(this.isAdmin)
    // console.log('--------end-----------')

    if (this.socket && this.roomName) {
      SocketManager.leaaveRoom(this.socket, this.roomName, true);
      if (this.isAdmin) {
        let roomName = `${this.roomName}:admin`;
        SocketManager.leaaveRoom(this.socket, roomName);
      }
    }

    this.socket = null;
    this.isAdmin = null;
  };

  updateAccessListsFromServerData = (serverData) => {
    let serverPendingRequestIDs = serverData.pendinglist || []; //this.state.serverPendingRequestIDs;
    let serverAccessAllowedIDs = serverData.accesslist || []; //this.state.serverAccessAllowedIDs;

    this.setState({
      serverPendingRequestIDs,
      serverAccessAllowedIDs,
    });

    console.log(serverPendingRequestIDs);
    console.log(serverAccessAllowedIDs);

    this.updateLocalAccessLists(
      serverPendingRequestIDs,
      serverAccessAllowedIDs
    );
  };

  updateLocalAccessLists = (
    serverPendingRequestIDs,
    serverAccessAllowedIDs,
    participants
  ) => {
    if (!serverPendingRequestIDs)
      serverPendingRequestIDs = this.state.serverPendingRequestIDs;
    if (!serverAccessAllowedIDs)
      serverAccessAllowedIDs = this.state.serverAccessAllowedIDs;
    if (!participants) participants = this.state.participants;

    // Only keep those session IDs from server which are present in call
    let pendingRequestIDs = serverPendingRequestIDs.filter(
      (val) => participants[val] || this.session_id === val
    );
    let accessAllowedIDs = serverAccessAllowedIDs.filter(
      (val) => participants[val] || this.session_id === val
    );
    console.log(pendingRequestIDs);
    console.log(accessAllowedIDs);

    this.triggerAccessEvents(pendingRequestIDs, accessAllowedIDs);

    this.setState({
      pendingRequestIDs,
      accessAllowedIDs,
    });
  };

  triggerAccessEvents = (pendingRequestIDs, accessAllowedIDs) => {
    // New access notification sound
    let playDing = false;
    for (let i = 0; i < accessAllowedIDs.length; i++) {
      if (!this.state.accessAllowedIDs.includes(accessAllowedIDs[i])) {
        playDing = true;
        break;
      }
    }
    if (playDing) {
      let audio = new Audio(ding);
      audio.volume = 0.2;
      audio.play();
      // new Audio(ding).play();
    }

    // HANDLE THIS IN SOCKET SERVER?
    // Access granted notification and state update
    console.log("-----------------------------");
    console.log("this.session_id", this.session_id);
    console.log("this.state.hasAccess", this.state.hasAccess);
    console.log("this.state.accessAllowedIDs", this.state.accessAllowedIDs);
    console.log("accessAllowedIDs", accessAllowedIDs);

    if (
      // !this.state.accessAllowedIDs.includes(this.session_id) &&
      !this.state.hasAccess &&
      accessAllowedIDs.includes(this.session_id)
    ) {
      if (!this.isAdmin) {
        this.showNotification(
          "You have been granted access by the host",
          NOTIFICATION_TYPES.SUCCESS,
          10000
        );
      }

      this.setState({
        isVideoOn: false,
        // isAudioOn: false,
        isScreenSharing: false,
        hasAccess: true,
        hasRequestedAccess: false,
      });
    }

    // HANDLE THIS IN SOCKET SERVER?
    // Access revoked notification and state update
    if (
      // this.state.accessAllowedIDs.includes(this.session_id) &&
      this.state.hasAccess &&
      !accessAllowedIDs.includes(this.session_id)
    ) {
      if (!this.isAdmin) {
        this.showNotification(
          "Your access has been revoked by host",
          NOTIFICATION_TYPES.WARN,
          10000
        );
      }

      if (this.state.isScreenSharing) this.callFrame.stopScreenShare();

      this.setState({
        isVideoOn: false,
        isAudioOn: false,
        isScreenSharing: false,
        hasAccess: false,
        hasRequestedAccess: false,
      });
    }
  };

  //#endregion

  getScreenTile = (screenStyle) => {
    if (!this.state.hasJoinedCall || !this.callFrame) return null;

    let participants = this.state.participants;
    if (this.state.isScreenSharing) {
      return (
        <ScreenTile
          // key={this.ScreenSharingParticipant}
          participant={participants.local}
          isAdmin={this.isAdmin}
          screenStyle={screenStyle}
        />
      );
    } else {
      if (
        this.state.screenSharingParticipant.length === 0 ||
        !participants[this.state.screenSharingParticipant]
      ) {
        return null;
      }

      return (
        <ScreenTile
          // key={this.state.screenSharingParticipant}
          participant={participants[this.state.screenSharingParticipant]}
          isAdmin={this.isAdmin}
          screenStyle={screenStyle}
        />
      );
    }
  };

  // getDummyUserLayout = () => {
  //   let videoTiles = [];
  //   for (let i = 0; i < 8; i++) {
  //     videoTiles.push(
  //       <div className={`callingBox__video CallBox_${i + 1} callbox_d`}>
  //         <div className="nouser">
  //           <img alt="NoUser" src="/assets/images/user.png"></img>
  //           <div>No User</div>
  //         </div>
  //       </div>
  //     );
  //   }
  //   return videoTiles;
  // };
  //#endregion

  render() {
    return (
      <>
        {/* <aside className={`sidebar ${this.props.showSidebar ? "active" : ""}`}>
          <div className="sidebar__body">
            <Sidebar />
          </div>
        </aside> */}
        <div className="contentCntr">
          {this.isAdmin !== null &&
            (this.isAdmin ? (
              <DailycoAdminLayout
                publicRoomName={this.props.room?.publicRoomName}
                showSidebar={this.props.showSidebar}
                // setShowSidebar={(val) => this.setState({ showSidebar: val })}
                session_id={this.session_id}
                getScreenTile={this.getScreenTile}
                screenSharingParticipant={this.state.screenSharingParticipant}
                hasJoinedCall={this.state.hasJoinedCall}
                callEnded={this.state.callEnded}
                isRoomActive={this.state.isRoomActive}
                hasRequestedAccess={this.state.hasRequestedAccess} // ??
                hasAccess={this.state.hasAccess} // ??
                isVideoOn={this.state.isVideoOn}
                isAudioOn={this.state.isAudioOn}
                isScreenSharing={this.state.isScreenSharing}
                requestVideoAccess={this.requestVideoAccess}
                requestAudioAccess={this.requestAudioAccess}
                requestShareAccess={this.requestShareAccess}
                EndCall={this.EndCall}
                callFrame={this.callFrame}
                participants={this.state.participants}
                // initialCountdown={this.state.initialCountdown} // ??
                // isCountdownRunning={this.state.isCountdownRunning} // ??
                is3D={this.props.is3D} // ??
                accessAllowedIDs={this.state.accessAllowedIDs}
                // admin props:
                pendingRequestIDs={this.state.pendingRequestIDs}
                setParticipantVideo={this.setParticipantVideo}
                setParticipantAudio={this.setParticipantAudio}
                setParticipantScreen={this.setParticipantScreen}
                toggleParticipantAccess={this.toggleParticipantAccess}
                EndCallForEveryOne={() => this.setStartCallStatus(false)}
                startCallForEveryOne={() => this.setStartCallStatus(true)}
                sendCountdownStart={this.sendCountdownStart}
                sendCountdownPause={this.sendCountdownPause}
                cancelRequest={this.cancelRequest}
              />
            ) : (
              <DailycoParticipantLayout
                publicRoomName={this.props.room?.publicRoomName}
                showSidebar={this.props.showSidebar}
                session_id={this.session_id}
                // setShowSidebar={(val) => this.setState({ showSidebar: val })}
                getScreenTile={this.getScreenTile}
                screenSharingParticipant={this.state.screenSharingParticipant}
                hasJoinedCall={this.state.hasJoinedCall}
                callEnded={this.state.callEnded}
                isRoomActive={this.state.isRoomActive}
                hasRequestedAccess={this.state.hasRequestedAccess}
                hasAccess={this.state.hasAccess}
                isVideoOn={this.state.isVideoOn}
                isAudioOn={this.state.isAudioOn}
                isScreenSharing={this.state.isScreenSharing}
                requestVideoAccess={this.requestVideoAccess}
                requestAudioAccess={this.requestAudioAccess}
                requestShareAccess={this.requestShareAccess}
                EndCall={this.EndCall}
                callFrame={this.callFrame}
                participants={this.state.participants}
                initialCountdown={this.state.initialCountdown}
                isCountdownRunning={this.state.isCountdownRunning}
                is3D={this.props.is3D}
                accessAllowedIDs={this.state.accessAllowedIDs}
                sendHandRaise={this.sendHandRaise}
                cancelRequest={this.cancelRequest}
              />
            ))}
        </div>
        <ToastContainer limit={3} />
      </>
    );
  }
}

DailycoController.contextType = UserContext;
export default DailycoController;
