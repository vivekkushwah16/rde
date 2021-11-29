import React, { Component } from 'react'
import { Endpoints } from '../../../Constants/EndPoints';
import LobbyCall from './LobbyCall';
import axios from 'axios';
import DailyIframe from "@daily-co/daily-js";
import ScreenTile from "./tiles/ScreenTile";

const Default_LobbyCall_Obj = { componentMounted: true }
/**
 * @props.room 
 *  room { callStarted, roomName, docName }
 */
export default class LobbyAudioCall extends Component {

    constructor(props) {
        super(props);
        this.state = {
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
            proximityUserList: {}
        };

        this.name = this.props.name;
        this.roomName = this.props.room.roomName;
        this.session_id = null;
        this.socket = null;
        this.isJoiningCall = false;
        this.serverlinkProduction = Endpoints.dailycoToken
        this.timerAccessControl = new Map();
        this.isInit = false;
    }

    componentDidMount() {
        this.initializeDailyco();

        const ExternalSignalModule = {
            connectToVideocallRoom: window.parent.connectToVideocallRoom,
            closeVideocallRoom: window.parent.closeVideocallRoom,
            leavevRoomCallNow: window.parent.leavevRoomCallNow,
        }
        this.ExternalSignalModule = ExternalSignalModule

        const LobbyCall = Default_LobbyCall_Obj
        LobbyCall.DailycoManager = this;
        LobbyCall.EndCall = this.EndCall;
        LobbyCall.leaveTheCall = this.EndCall;
        LobbyCall.requestVideoAccess = this.requestVideoAccess
        LobbyCall.micToggle = this.requestAudioAccess
        LobbyCall.getSocketName = () => {
            let participants = this.callFrame.participants();
            return participants.local
        }
        LobbyCall.addUserToProximity = (id) => {
            if (!id) {
                return { error: "id is not defined" }
            }
            let participants = this.callFrame.participants();
            if (!this.state.proximityUserList[id] && participants[id]) {
                this.setState(prev => ({
                    ...prev,
                    proximityUserList: { ...prev.proximityUserList, [id]: participants[id] }
                }))
            }
        }
        LobbyCall.updateUser_Proximity = (id, data) => {
            if (!id) {
                return { error: "id is not defined" }
            }
            if (this.state.proximityUserList[id] && data) {
                this.setState(prev => ({
                    ...prev,
                    proximityUserList: { ...prev.proximityUserList, [id]: data }
                }))
            } else {
                // console.error("id is not defined in prul")
            }
        }
        LobbyCall.removeUserFromProximity = (id) => {
            if (!id) {
                return { error: "id is not defined" }
            }

            if (this.state.proximityUserList[id]) {
                this.setState(prev => {
                    let prevoius = prev.proximityUserList
                    delete prevoius[id]
                    return {
                        ...prev,
                        proximityUserList: prevoius
                    }
                })
            }
        }

        this.LobbyCallModule = LobbyCall
        window.parent.LobbyCall = LobbyCall
    }

    componentWillUnmount() {
        window.parent.LobbyCall = { componentMounted: false };
        this.EndCallViaMenu();
    }

    initializeDailyco = async () => {
        try {
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
            this.timerAccessControl.clear();
            var self = this;
            console.devlog(self.name, self.roomName);//--devlog

            if (!this.state.isRoomActive && !this.isAdmin) {
                this.EndCall();
                return;
            }
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

                console.devlog(token.data); //--devlog

                self.SetupIframe(token.data); //passing token to the setupIframe function

            } catch (error) {

                console.devlog(error) //--devlog

                if (this.ExternalSignalModule.connectToVideocallRoom) {
                    this.ExternalSignalModule.connectToVideocallRoom(null)
                }
            }

        } catch (error) {
            if (this.ExternalSignalModule.connectToVideocallRoom) {
                this.ExternalSignalModule.connectToVideocallRoom(null)
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
                .on("error", this.updateEvent);
            await this.callFrame.join({
                url: `https://digitaljalebi.daily.co/${self.roomName}`,
                token: token,
            });
            await this.callFrame.setNetworkTopology({ topology: "sfu" });
            this.setState({
                callFrame: this.callFrame,
            });
            console.devlog("Connected to lobby Call"); //--devlog
        } catch (error) {
            console.devlog(error) //--devlog
            if (this.ExternalSignalModule.connectToVideocallRoom) {
                this.ExternalSignalModule.connectToVideocallRoom(null)
            }
        }
    };

    removeLisenters = () => {
        console.devlog("Removing listeners for lobbtCall");
        if (this.callFrame)
            this.callFrame
                .off("joining-meeting", this.updateEvent)
                .off("joined-meeting", this.updateEvent)
                .off("left-meeting", this.updateEvent)
                .off("participant-joined", this.updateEvent)
                .off("participant-updated", this.updateEvent)
                .off("participant-left", this.updateEvent)
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

        if (typeof this.ExternalSignalModule.closeVideocallRoom != "undefined")
            this.ExternalSignalModule.closeVideocallRoom();
        this.props.UIContext.closeVideocallRoom();
        if (typeof this.ExternalSignalModule.leavevRoomCallNow !== "undefined")
            this.ExternalSignalModule.leavevRoomCallNow();
    };

    EndCallViaMenu() {
        this.removeLisenters();
        if (this.callFrame) this.callFrame.leave();
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
                        break;
                    case "joined-meeting":
                        // if (window.parent.callJoined) {
                        //     window.parent.callJoined(participants.local.user_id)
                        // }
                        this.LobbyCallModule.addUserToProximity("local")
                        if (this.isAdmin) {
                            this.joinedMeetingEvent(event);
                        }
                        this.session_id = event.participants.local.session_id;
                        this.isJoiningCall = false;
                        this.setState({ hasJoinedCall: true });
                        break;
                    case "participant-joined":
                        console.devlog(participants)
                        this.updateLocalAccessLists(null, null, participants);
                        break;
                    case "participant-updated":
                        if (event.participant.local) {
                            this.LobbyCallModule.updateUser_Proximity('local', event.participant)
                        } else {
                            this.LobbyCallModule.updateUser_Proximity(event.participant.user_id, event.participant)
                        }
                        if (event.participant.screen) {
                            if (this.state.screenSharingParticipant.length > 0) {
                            } else {
                                this.setState({
                                    screenSharingParticipant: event.participant.session_id,
                                });
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
                        this.LobbyCallModule.removeUserFromProximity(event.participant.user_id)
                        if (
                            this.state.accessAllowedIDs.includes(event.participant.session_id)
                        ) {
                            let accessAllowedIDs = this.state.accessAllowedIDs.filter(
                                (val) => val !== event.participant.session_id
                            );
                            this.setState({ accessAllowedIDs });
                        }
                        this.updateLocalAccessLists(null, null, participants);
                        break;
                    case "left-meeting":
                        console.devlog("you have been disconnected from the lobby call"); //--

                        this.EndCall();

                    case "error":
                        if (event.errorMsg) {
                            if (event.errorMsg === "Meeting has ended") {
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
                        break;
                }
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

    requestAudioAccess = () => {
        if (!this.state.hasJoinedCall) {
            return;
        }
        this.callFrame.setLocalAudio(!this.callFrame.localAudio());
        this.setState({
            isAudioOn: !this.callFrame.localAudio(),
        });
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
    }

    render() {
        return (
            <>
                <LobbyCall
                    isCallVisible={this.props.isCallVisible}
                    publicRoomName={this.props.room?.publicRoomName}
                    getScreenTile={this.getScreenTile}
                    hasJoinedCall={this.state.hasJoinedCall}
                    callEnded={this.state.callEnded}
                    isRoomActive={this.state.isRoomActive}
                    isAudioOn={this.state.isAudioOn}
                    requestAudioAccess={this.requestAudioAccess}
                    EndCall={this.EndCall}
                    callFrame={this.callFrame}
                    participants={this.state.participants}
                    UIContext={this.props.UIContext}
                    proximityUserList={this.state.proximityUserList}
                />
            </>
        )
    }
}
