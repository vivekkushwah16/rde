import React, { Component } from 'react'
import axios from "axios";
import DailyIframe from "@daily-co/daily-js";
import swal from "sweetalert";
import { ToastContainer, toast } from "react-toastify";
import ScreenTile from "../tiles/ScreenTile";
import { Endpoints } from '../../../Constants/EndPoints';
import { UserContext } from '../../../Context/Auth/UserContextProvider';
import SideLayoutDailyco from './SideLayoutDailyco';
const NOTIFICATION_TYPES = {
    NORMAL: "normal",
    INFO: "info",
    ERROR: "error",
    SUCCESS: "success",
    WARN: "warn",
};

class SideDailycoController extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isVideoOn: false,
            isAudioOn: false,
            hasJoinedCall: false,
            // dailyco api
            callFrame: null,
            participants: null,
            // call/room state
            callEnded: false,
            isRoomActive: props.room.callStarted, //false,
            screenSharingParticipant: "",
            initialCountdown: 0,
            isCountdownRunning: false,
        };

        this.name = this.props.name;
        this.roomName = this.props.room.roomName;
        this.docName = this.props.room.docName;
        this.session_id = null;
        this.socket = null;
        this.isJoiningCall = false;
        this.serverlinkTesting = "http://localhost:8080/generateToken";
        this.serverlinkProduction = Endpoints.dailycoToken
        this.timerAccessControl = new Map();
        this.isInit = false; // antzy check
        window.DailycoManager = this;
    }

    componentDidMount() {
        if (
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
    }

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
            if (!this.state.isRoomActive && !this.isAdmin) {
                this.EndCall();
                return;
            }

            console.log("isAdmin", this.isAdmin);

            // get the access token from the server
            try {
                let token = await axios.get(this.serverlinkProduction, {
                    params: {
                        name: self.name + (this.isTranslator ? "_$translator" : ""),
                        admin: self.isAdmin,
                        roomName: self.roomName,
                        temporaryRoom: self.props.temporaryRoom,
                    },
                    withCredentials: true
                });
                console.log("getting response back");
                console.log(token.data);
                self.SetupIframe(token.data); //passing token to the setupIframe function
            } catch (error) {
                console.log(error)
                if (window.parent.connectToVideocallRoom) {
                    window.parent.connectToVideocallRoom(null)
                }
            }

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
            await this.callFrame.join({
                url: `https://digitaljalebi.daily.co/${self.roomName}`,
                token: token,
            });
            await this.callFrame.setNetworkTopology({ topology: "sfu" });
            this.setState({
                callFrame: this.callFrame,
            });
            console.log("You have joined meeting");
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
        this.EndCallViaMenu();
        if (typeof window.parent.closeVideocallRoom != "undefined")
            window.parent.closeVideocallRoom();
        this.props.UIContext.closeVideocallRoom();
        if (typeof window.parent.leavevRoomCallNow !== "undefined")
            window.parent.leavevRoomCallNow();
    };

    EndCallViaMenu() {
        this.removeLisenters();
        if (this.callFrame) this.callFrame.leave();
    }

    //#endregion

    //-----------------------------------------------------Common Events--------------------------------------------------------//
    //#region Common Events
    showEvent(event) {
        if (event.action) {
            switch (event.action) {
                default:
                    console.log(event.action + " : ");
                    break;
            }
        }
    }

    updateLocalAccessLists = (
        serverPendingRequestIDs,
        serverAccessAllowedIDs,
        participants
    ) => {
        if (!participants) participants = this.state.participants;
    };


    updateEvent = async (event) => {
        let participants = this.callFrame.participants();
        this.setState({ participants });

        if (event) {
            if (event.participant && event.participant.local) {
                if (!event.participant.screen)
                    this.setState({
                        isScreenSharing: false,
                    });
            }

            if (event.action) {
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
                        break;
                    case "participant-joined":
                        //#region points noted
                        //add to your list
                        // this is called even before joined meeting is called for already present users
                        //only single participant will be returned in event
                        //#endregion

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

                    break;
                // case "access-status-response":
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
    };

    requestAudioAccess = () => {
        if (!this.state.hasJoinedCall) {
            return;
        }
        this.callFrame.setLocalAudio(!this.callFrame.localAudio());
        this.setState({
            isAudioOn: !this.callFrame.localAudio(),
        });
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
        this.adminToggleShareScreen();
    };
    //#endregion

    //-----------------------------------------------------Admin functions -----------------------------------------------------//
    //#region Admin Function

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

    render() {
        return (
            <>
                <SideLayoutDailyco
                    isCallVisible={this.props.isCallVisible}
                    publicRoomName={this.props.room?.publicRoomName}
                    showSidebar={this.props.showSidebar}
                    getScreenTile={this.getScreenTile}
                    screenSharingParticipant={this.state.screenSharingParticipant}
                    hasJoinedCall={this.state.hasJoinedCall}
                    callEnded={this.state.callEnded}
                    isRoomActive={this.state.isRoomActive}
                    isVideoOn={this.state.isVideoOn}
                    isAudioOn={this.state.isAudioOn}
                    requestVideoAccess={this.requestVideoAccess}
                    requestAudioAccess={this.requestAudioAccess}
                    requestShareAccess={this.requestShareAccess}
                    EndCall={this.EndCall}
                    callFrame={this.callFrame}
                    participants={this.state.participants}
                    initialCountdown={this.state.initialCountdown}
                    isCountdownRunning={this.state.isCountdownRunning}
                    UIContext={this.props.UIContext}
                />
                <ToastContainer limit={3} />
            </>
        );
    }
}

SideDailycoController.contextType = UserContext;
export default SideDailycoController;
