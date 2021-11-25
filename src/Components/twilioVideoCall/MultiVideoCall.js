// eslint-disable-next-line no-unused-vars
import React, { Component } from 'react';
import axios from 'axios';
import Video from 'twilio-video';
import { LocalVideoTrack, LocalAudioTrack, createLocalVideoTrack } from "twilio-video";
// import { doc } from 'prettier';
import twilioStyle from './calling.module.css'
import './twilio.css'

export function getInitals(name) {
    let result = ""
    if (name) {
        let nameArr = name.trim().split(" ")
        if (nameArr.length > 0) {
            nameArr.forEach(element => {
                result += element[0]
            });
        } else {
            result = name[0]
        }
        return result.toUpperCase()
    } else {
        return " "
    }

}

class MultiVideoCall extends Component {

    constructor(props) {
        super(props);
        this.state = {
            identity: null,
            roomId: props.room.roomId,
            roomName: props.room.roomName,
            roomIdErr: false,
            previewTracks: null,
            localMediaAvailable: false,
            hasJoinedRoom: false,
            activeRoom: null,
            audioEnabled: false,
            videoEnabled: false,
            screenShared: false,
            remoteScreenShared: false,
            participants: [],
            remoteScreens: [],
            screenTrack: null,
            remoteScreenTrack: null,
            showNotification: false,
            isSlotAvailable: false,//* */
            currentParticipant: null,//* */
            clientIdentity: "",
            showRest: false,
        };

        this.currentLayoutClass = twilioStyle['caller_8'];

        this.callboxMap = {
            2: null,
            3: null,
            4: null,
            5: null,
            6: null,
            7: null,
            8: null,
        }

        this.localMedia = null;
        this.remoteMedia = null;
        this.timerRef = null;
        this.forceExit = false;
        this.setLocalMediaRef = element => {
            this.localMedia = element;
        };

        this.setRemoteMediaRef = element => {
            this.remoteMedia = element;
        };


        this.joinRoom = this.joinRoom.bind(this);
        // this.handleroomIdChange = this.handleroomIdChange.bind(this);
        this.leaveRoom = this.leaveRoom.bind(this);
        this.roomJoined = this.roomJoined.bind(this);
        this.attachLocalParticipantTracks = this.attachLocalParticipantTracks.bind(this);
        this.onCameraButtonClick = this.onCameraButtonClick.bind(this);
        this.onAudioButtonClick = this.onAudioButtonClick.bind(this);
        this.shareScreen = this.shareScreen.bind(this);
        this.handleTrackEnabled = this.handleTrackEnabled.bind(this);
        this.participantConnected = this.participantConnected.bind(this);
        this.participantDisconnected = this.participantDisconnected.bind(this);
        this.trackSubscribed = this.trackSubscribed.bind(this);
        this.trackUnsubscribed = this.trackUnsubscribed.bind(this);
        this.handleParticipantTrackEnabled = this.handleParticipantTrackEnabled.bind(this);
        this.handleParticipantTrackDisabled = this.handleParticipantTrackDisabled.bind(this);
        this.stopLocalScreenShare = this.stopLocalScreenShare.bind(this);
        this.startScreenShare = this.startScreenShare.bind(this);
        this._startScreenCapture = this._startScreenCapture.bind(this);
        this.handleLocalSharedScreen = this.handleLocalSharedScreen.bind(this);
        this.handleRemoteSharedScreen = this.handleRemoteSharedScreen.bind(this);
        this.stopRemoteSharedScreen = this.stopRemoteSharedScreen.bind(this);
        this.openFullscreen = this.openFullscreen.bind(this);
        this.onCallDisconnect = this.onCallDisconnect.bind(this);
        this.showNotification = this.showNotification.bind(this);
    }

    disconnectAndShowPopup = (showCustomMessage = false, message) => {
        console.log(this.state.isSlotAvailable, "///////////////////");
        this.forceExit = false;
        // this.onCallDisconnect();
        if (showCustomMessage) {
            this.props.showInfoPopUp(message)
        } else {
            this.props.showBusyPopup();
        }
    }

    checkSlotAvailable = () => {
        console.log(this.state.isSlotAvailable, "///////////////////");
        console.log(this.state.clientIdentity, this.props.userId)
        if (!this.props.isOfficial) {
            if (!this.state.isSlotAvailable) {
                if (this.state.clientIdentity !== this.props.userId) {
                    this.disconnectAndShowPopup();
                    return false;
                }
            }
        }
        return true;
    }

    checkIfSlotAlreadyTaken = () => {
        var self = this;

        console.log(self.state.isSlotAvailable, "///////////////////");
        console.log(self.state.clientIdentity, self.props.userId);

        if (!this.props.isOfficial) {
            if (!self.state.isSlotAvailable) {
                if (self.state.clientIdentity !== self.props.userId) {
                    self.forceExit = true;
                    self.leaveRoom();
                    self.props.showBusyPopup();
                    return false;
                }
            }
        }
        return true;
    }

    componentWillUnmount() {
        if (this.state.activeRoom) {
            this.state.activeRoom.disconnect();
            this.setState({ hasJoinedRoom: false, localMediaAvailable: false });
        }
    }

    componentDidMount() {
        this.processProps(this.props);
        window.parent.leaveTheCall = this.leaveTheCall.bind(this);

        var url = window.location.href;
        var id = url.split('$')[1];//url.substring(url.lastIndexOf('$') + 1);
        console.log(id);
        if (id != null)
            this.setState({ roomId: id });
        axios.post(
            // 'https://videocall.gallantvirtualworld.com/api/token'
            'https://twiliovideocall.djvirtualevents.com/api/token'
            // 'https://twilioserver-dot-virtualeventdemo.el.r.appspot.com/api/token'
            , { name: this.props.userName }).then(results => {
                if (this.checkSlotAvailable()) {
                    const { identity, token } = results.data;
                    this.setState({ identity, token });
                    this.joinRoom();
                    return;
                }
            });
    }

    componentWillReceiveProps(newProps) {
        if (newProps) {
            // console.log(newProps.liveRooms)
            // console.log(newProps.room);
            // console.log(liveRoom);
            this.processProps(newProps);
        }
    }

    processProps = (newProps) => {
        console.log("updated!!!!");
        var liveRoom = newProps.liveRooms.filter(value => value.id == newProps.room.roomParentId)[0];
        var roomData = liveRoom.slots.filter(value => value.id == newProps.room.roomId)[0]
        var ava = roomData.available;
        var clientIdentity = roomData.userId;
        if (ava) {
            this.setState({
                isSlotAvailable: ava,
                clientIdentity: clientIdentity,
                showRest: false,
            });
        } else {
            this.setState({
                isSlotAvailable: ava,
                clientIdentity: clientIdentity,
            });
        }
    }

    onCallDisconnect() {
        if (this.props.onCallDisconnect) {
            this.props.onCallDisconnect(this.forceExit);
        }
    }

    showNotification(notification) {
        this.setState({ notification });
        this.setState({ showNotification: true });
        setTimeout(() => {
            this.setState({ showNotification: false });
            this.setState({ notification: null });
        }, notification.timeout);
    }


    joinRoom() {
        /*
     Show an error message on room name text field if user tries         joining a room without providing a room name. This is enabled by setting `roomIdErr` to true
       */
        if (!this.checkSlotAvailable()) {
            return;
        }

        if (!this.state.roomId.trim()) {
            this.setState({ roomIdErr: true });
            return;
        }

        console.log("Joining room '" + this.state.roomId + "'...");
        let connectOptions = {
            name: this.state.roomId,
            audio: true,
            video: {
                width: { min: 640, ideal: 640, max: 1280 },
                height: { min: 360, ideal: 360, max: 720 },
                aspectRatio: 1.77,
                frameRate: { max: 30 },
            },
        };

        if (this.state.previewTracks) {
            connectOptions.tracks = this.state.previewTracks;
        }

        var self = this;
        Video.connect(this.state.token, connectOptions).then(this.roomJoined, error => {
            console.log(error);
            // alert('Could not connect to Twilio: ' + error.message);
            self.disconnectAndShowPopup(true, `${error.code === 0 ? 'Camera ' : ''} ${error.message}`);
        });
    }

    roomJoined(room) {
        // Called when a participant joins a room
        console.log("Joined as '" + this.state.identity + "'");
        // console.log(this.state.isSlotAvailable, "///////////////////");
        this.setState({ activeRoom: room, localMediaAvailable: true, hasJoinedRoom: true });
        if (this.state.activeRoom) {
            this.state.activeRoom.localParticipant.videoTracks.forEach(pub => {
                if (pub.track.name != "screen") {
                    pub.track.disable();
                }
            });
            this.state.activeRoom.localParticipant.audioTracks.forEach(pub => {
                pub.track.disable();
            });
            // display local participant tracks
            let previewContainer = this.localMedia;
            if (!previewContainer.querySelector('video')) {
                this.attachLocalParticipantTracks(room.localParticipant, previewContainer);
            }
            var count = 0;
            room.participants.forEach(participant => {
                count++;
                this.participantConnected(participant)
            });

            // Participant joining room
            room.on('participantConnected', participant => this.participantConnected(participant));

            // Detach all participant’s track when they leave a room.
            room.on('participantDisconnected', participant => this.participantLeaveRoom(participant));

            // Once the local participant leaves the room, detach the Tracks
            // of all other participants, including that of the LocalParticipant.
            room.on('disconnected', () => {
                if (this.state.previewTracks) {
                    this.state.previewTracks.forEach(track => {
                        track.stop();
                    });
                }
                // Detach the local media elements
                room.localParticipant.tracks.forEach(publication => {
                    publication.track.stop();
                    const attachedElements = publication.track.detach();
                    attachedElements.forEach(element => element.remove());
                });

                room.participants.forEach(participant => this.participantDisconnected(participant));

                this.state.activeRoom = null;
                this.setState({ hasJoinedRoom: false, localMediaAvailable: false });
                this.onCallDisconnect();
            });

            if (!this.checkIfSlotAlreadyTaken()) {
                return;
            }
            this.props.updateRoomStatus();
            var self = this;
            setTimeout(function () {
                if (!self.checkIfSlotAlreadyTaken()) {
                    return;
                }
            }, 1500);


            if (this.props.isOfficial) {
                this.checUserPresence(room.participants)
            } else {
                if (room.participants.size === 0) {
                    this.props.showPopup();
                }
            }
        }

    }

    checUserPresence = (participants) => {
        //check if not availabe
        if (!this.state.isSlotAvailable && this.state.clientIdentity.length > 0) {
            var self = this;
            var found = false;
            console.log("searching for " + self.state.clientIdentity);
            participants.forEach(participant => {
                if (participant.identity == self.state.clientIdentity) {
                    found = true;
                    console.log(participant.identity);
                }
            });
            if (!found) {
                console.log("user might me disconnected,")
                console.log("ResetSlot")
                if (!self.state.isSlotAvailable) {
                    self.setState({
                        showRest: true
                    })
                    self.props.slotReset()
                } else {
                    console.log("No need to show resetButton");
                }

            } else {
                console.log("user is still here")
            }
        }
    }

    getParticipantClass = (participant, participants) => {
        let list = participants;
        if (Object.keys(this.state.participants).length > Object.keys(list).length) {
            list = this.state.participants
        }
        let keys = Object.keys(list)
        for (let i = 0; i < keys.length; i++) {
            if (participant.sid === list[keys[i]].sid) {
                return `CallBox_${i + 2}`
            }
        }
        return `CallBox_${keys.length + 1}`
    }

    freeParticipantClass = (participant) => {
        let keys = Object.keys(this.callboxMap)
        for (let i = 0; i < keys.length; i++) {
            console.log(participant, this.callboxMap[keys[i]])
            if (this.callboxMap[keys[i]] === participant.sid) {
                this.callboxMap = {
                    ...this.callboxMap,
                    [keys[i]]: null
                }
                return
            }
        }
    }

    getParticipantClassUsingMap = (participant) => {
        let keys = Object.keys(this.callboxMap)
        for (let i = 0; i < keys.length; i++) {
            if (!this.callboxMap[keys[i]]) {
                this.callboxMap = {
                    ...this.callboxMap,
                    [keys[i]]: participant.sid,
                }
                console.log(keys[i], this.callboxMap[keys[i]])
                return `CallBox_${keys[i]}`
            }
        }
        return `CallBox_4`
    }

    participantConnected(participant) {
        console.log(participant);
        const participants = this.state.participants;
        participants.push(participant);
        this.setState({ participants: participants })
        console.log(participants.length)
        if (participants.length > 3) {
            const doc = document.querySelector(`#${twilioStyle['overlayContent']}`)
            if (doc.classList.contains(twilioStyle['caller_4'])) {
                doc.classList.remove(twilioStyle['caller_4'])
            }
            if (!doc.classList.contains(twilioStyle['caller_8'])) {
                doc.classList.add(twilioStyle['caller_8'])
                this.currentLayoutClass = twilioStyle['caller_8']
            }
        }

        const parentDiv = document.createElement('div');
        parentDiv.id = participant.sid;
        parentDiv.classList.add(twilioStyle["callingBox__video"]);
        parentDiv.classList.add(twilioStyle["callbox_d"]);
        parentDiv.classList.add(twilioStyle[this.getParticipantClassUsingMap(participant)]);


        const div = document.createElement('div');
        div.classList.add(twilioStyle["callingBox__video-container"]);

        const span = document.createElement('span')
        span.id = twilioStyle["caller-name"];
        span.classList.add(twilioStyle["callingBox__nameTag"]);

        let colorClass = "userInital--color" + (Math.floor(Math.random()) * 2 + 1)
        span.classList.add(colorClass);
        var name = participant.identity;
        var rgx = new RegExp(/(\p{L}{1})\p{L}+/, 'gu');

        var initials = [...name.matchAll(rgx)] || [];

        initials = (
            (initials.shift()?.[1] || '') + (initials.pop()?.[1] || '')
        ).toUpperCase();

        // if(initials!=="")
        //     span.innerText = initials;
        // else
        span.innerText = getInitals(participant.identity)
        div.appendChild(span);

        const spanName = document.createElement('span')
        spanName.id = twilioStyle["caller-name"];
        spanName.classList.add(twilioStyle["username-bar"]);
        spanName.innerText = participant.identity
        div.appendChild(spanName);

        const button = document.createElement('button')
        button.classList.add(twilioStyle["icon-btn"]);
        const icon = document.createElement('i')
        icon.classList.add(twilioStyle["icon-speaker"]);
        button.appendChild(icon);
        div.appendChild(button);

        const videoDiv = document.createElement('div');
        videoDiv.id = "video";
        videoDiv.classList.add(twilioStyle["callingBox__video-wrapper"]);
        videoDiv.classList.add(twilioStyle["has-video"]);
        div.appendChild(videoDiv);

        parentDiv.appendChild(div);

        this.remoteMedia.appendChild(parentDiv);

        participant.tracks.forEach(publication => {
            if (publication.track) {
                this.trackSubscribed([publication.track], videoDiv);
            }
            publication.on('subscribed', this.handleTrackEnabled);
        });

        participant.on('trackSubscribed', track => {
            if (track.kind == 'video') {
                videoDiv.setAttribute("videoId", track.sid);
            } else {
                videoDiv.setAttribute("audioId", track.sid);
            }
            this.trackSubscribed([track], videoDiv);
        });

        participant.on('trackUnsubscribed', track => {
            this.stopRemoteSharedScreen([track]);
        });
    }


    participantLeaveRoom = (participant) => {

        if (this.state.participants.length > 0) {
            let participants = this.state.participants;
            participants = participants.filter(par => par.sid != participant.sid);
            // console.log(participants);
            if (!this.props.isOfficial && participants.length == 0) {
                this.props.showPopup();
            }
            this.freeParticipantClass(participant)
            this.setState({ participants: participants })
        }

        if (this.props.isOfficial) {
            console.log("Participant '" + participant.identity + "' left the room");
            console.log("Client id => '" + this.state.clientIdentity + " ");

            if (participant.identity === this.state.clientIdentity) {
                //wait for 6 sec check data to reset
                var self = this;
                setTimeout(function () {
                    if (!self.state.isSlotAvailable) {
                        console.log("we should wait for 20 moreSeconds ");
                        self.setState({
                            showRest: true
                        })
                        self.props.slotReset()
                    } else {
                        console.log("No need to show resetButton");
                    }
                }, 8000);
            }
        }
        document.getElementById(participant.sid).remove();
    }

    participantDisconnected = (participant) => {

        if (this.state.participants.length > 0) {
            let participants = this.state.participants;
            participants = participants.filter(par => par.sid != participant.sid);
            this.setState({ participants: participants })
        }
        console.log("Participant '" + participant.identity + "' left the room");
        console.log("Client id => '" + this.state.clientIdentity + " ");
        document.getElementById(participant.sid).remove();
        this.freeParticipantClass(participant)
    }

    trackSubscribed(tracks, container) {
        tracks.forEach(track => {
            if (track.name != "screen") {
                container.appendChild(track.attach());
                if (track.isEnabled) {
                    this.handleParticipantTrackEnabled(track);
                } else {
                    this.handleParticipantTrackDisabled(track);
                }
            }
            else {
                this.handleRemoteSharedScreen([track]);
                this.stopLocalScreenShare();
            }
        });
    }

    attachLocalParticipantTracks(participant, container) {
        let tracks = Array.from(participant.tracks.values());
        tracks.forEach(publication => {
            container.appendChild(publication.track.attach());
        });
    }

    leaveRoom() {
        if (this.state.activeRoom) {
            this.state.activeRoom.disconnect();
            this.setState({ hasJoinedRoom: false, localMediaAvailable: false });
        }
        if (this.props.onCallDisconnect) {
            this.props.onCallDisconnect();
        }
        // if (typeof window.parent.leaveCall !== "undefined")
        //     window.parent.leaveCall();
    }
    leaveTheCall() {
        if (this.state.activeRoom) {
            this.state.activeRoom.disconnect();
            this.setState({ hasJoinedRoom: false, localMediaAvailable: false });
        }
    }
    handleTrackEnabled(track) {
        track.on('enabled', () => this.handleParticipantTrackEnabled(track));
        track.on('disabled', () => this.handleParticipantTrackDisabled(track));
    }

    handleParticipantTrackEnabled(track) {
        if (track.kind == 'video') {
            let video = document.querySelector(`[videoid="${track.sid}"]`);
            video.parentElement.classList.remove(twilioStyle["callingBox__video-container--audio"]);
            video.classList.remove("d-none");
        } if (track.kind == 'audio') {
            let name = document.querySelector(`[audioid="${track.sid}"]`).parentElement.firstChild;
            name.classList.add(twilioStyle["user-speaking"]);
            let button = document.querySelector(`[audioid="${track.sid}"]`).parentElement.childNodes[1];
            button.classList.add(twilioStyle["active"]);
        }
    }

    handleParticipantTrackDisabled(track) {
        if (track.kind == 'video') {
            let video = document.querySelector(`[videoid="${track.sid}"]`);
            video.parentElement.classList.add(twilioStyle["callingBox__video-container--audio"]);
            video.classList.add("d-none");
        } if (track.kind == 'audio') {

            let name = document.querySelector(`[audioid="${track.sid}"]`).parentElement.firstChild;
            name.classList.remove(twilioStyle["user-speaking"]);

            let button = document.querySelector(`[audioid="${track.sid}"]`).parentElement.childNodes[1];
            button.classList.remove(twilioStyle["active"]);
        }
    }

    onCameraButtonClick(event) {
        event.preventDefault();

        if (this.state.activeRoom) {
            if (this.state.videoEnabled) {
                this.state.activeRoom.localParticipant.videoTracks.forEach(pub => {
                    if (pub.track.name != "screen") {
                        pub.track.disable();
                    }
                });
            } else {
                this.state.activeRoom.localParticipant.videoTracks.forEach(pub => {
                    if (pub.track.name != "screen") {
                        pub.track.enable();
                    }
                });
            }
            this.setState({ videoEnabled: !this.state.videoEnabled });
        }
    }

    onAudioButtonClick(event) {
        event.preventDefault();
        if (this.state.activeRoom) {
            if (this.state.audioEnabled) {
                this.state.activeRoom.localParticipant.audioTracks.forEach(pub => {
                    pub.track.disable();
                });
            } else {
                this.state.activeRoom.localParticipant.audioTracks.forEach(pub => {
                    pub.track.enable();
                });
            }
            this.setState({ audioEnabled: !this.state.audioEnabled });
        }
    }

    shareScreen(event) {
        event.preventDefault();
        if (this.state.activeRoom) {
            if (this.state.screenTrack == null) {
                this.startScreenShare();
            } else {
                this.stopLocalScreenShare();
            }
        }
    }

    _startScreenCapture() {
        if (navigator.getDisplayMedia) {
            return navigator.getDisplayMedia({ video: true });
        } else if (navigator.mediaDevices.getDisplayMedia) {
            return navigator.mediaDevices.getDisplayMedia({ video: true });
        } else {
            return navigator.mediaDevices.getUserMedia({ video: { mediaSource: 'screen' } });
        }
    }

    startScreenShare() {
        const that = this;

        if (this.state.remoteScreens.length > 0) {
            //Show Notification screen already shared
            console.log("Already Shared");
            this.showNotification({ line1: "You can't Share Screen right now.", line2: "Someone is already sharing.", timeout: 10000 });
            return;
        }


        this._startScreenCapture().then((stream) => {
            const audioTracks = stream.getAudioTracks().map(track => new LocalAudioTrack(track));
            const videoTracks = stream.getVideoTracks().map(track => {
                return new LocalVideoTrack(track, { name: "screen" });
            });
            const tracks = audioTracks.concat(videoTracks);
            that.handleLocalSharedScreen(tracks);
            stream.getTracks()[0].onended = () => that.stopLocalScreenShare();
            this.openWhiteboardLayout()
        });

    }

    openWhiteboardLayout = () => {
        const doc = document.querySelector(`#${twilioStyle['overlayContent']}`)
        const callerClass = twilioStyle['caller_whiteboard']
        if (doc.classList.contains(this.currentLayoutClass)) {
            doc.classList.remove(this.currentLayoutClass)
        }
        doc.classList.add(callerClass)
    }
    closeWhiteboardLayout = () => {
        const doc = document.querySelector(`#${twilioStyle['overlayContent']}`)
        const callerClass = twilioStyle['caller_whiteboard']
        if (doc.classList.contains(callerClass)) {
            doc.classList.remove(callerClass)
        }
        doc.classList.add(this.currentLayoutClass)
    }

    stopRemoteSharedScreen(tracks) {
        let remoteScreens = this.state.remoteScreens;

        tracks.forEach(track => {
            track.detach().forEach(element => element.remove());
            remoteScreens = remoteScreens.filter(remoteScreen => track.id != remoteScreen.id);
        });
        this.closeWhiteboardLayout();
        this.setState({ remoteScreens: remoteScreens });
        this.setState({ remoteScreenShared: false });


    }

    handleRemoteSharedScreen(tracks) {
        const remoteScreens = this.state.remoteScreens;

        tracks.forEach(track => {
            document.getElementById('screen-share').appendChild(track.attach());
            remoteScreens.push(track);
        })
        this.openWhiteboardLayout()
        this.setState({ remoteScreens: remoteScreens });
        this.setState({ remoteScreenShared: true });
        this.setState({ showWhiteborad: false });

    }

    handleLocalSharedScreen(tracks) {
        this.setState({ screenTrack: tracks });
        this.state.activeRoom.localParticipant.publishTracks(tracks);
        this.setState({ screenShared: true });
        tracks.forEach(track => {
            document.getElementById('screen-share').appendChild(track.attach());
        })
    }

    stopLocalScreenShare() {
        try {
            if (this.state.activeRoom && this.state.screenTrack && this.state.screenShared) {
                this.state.activeRoom.localParticipant.unpublishTracks(this.state.screenTrack);
                this.state.screenTrack.forEach(track => {
                    track.stop();
                    track.detach().forEach(element => element.remove())
                });
                this.closeWhiteboardLayout();
                this.setState({ screenTrack: null });
                this.setState({ screenShared: false });
            }
        } catch (e) {
            console.error(e);
        }
    }

    trackUnsubscribed(track) {
        track.detach().forEach(element => element.remove());
    }

    openFullscreen() {
        let elem = document.getElementById("screen-share").children[1];

        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.mozRequestFullScreen) { /* Firefox */
            elem.mozRequestFullScreen();
        } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
            elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) { /* IE/Edge */
            elem.msRequestFullscreen();
        }
    }


    render() {

        const participants = this.state.participants;
        const length = participants.length + 1;
        let view = "auto";

        if (length <= 1) {
            view = "auto";
        } else if (length <= 4) {
            view = "auto auto"
        } else if (length <= 6) {
            view = "auto auto auto"
        } else if (length <= 8) {
            view = "auto auto auto auto"
        }

        let remoteShared = this.state.remoteScreens.length > 0;

        return (
            <>
                <section className={twilioStyle.callingBox} style={!this.props.showCall ? { display: 'none' } : {}}>
                    <div id={twilioStyle.overlayContent}
                        className={twilioStyle.caller_8}
                        ref={this.setRemoteMediaRef}
                    >
                        <div className={`${twilioStyle.callingBox__video} ${twilioStyle.CallBox_1} ${twilioStyle.callbox_d}`} style={{ display: 'block' }}>
                            <div className={`${twilioStyle['callingBox__video-container']} ${this.state.videoEnabled ? " " : twilioStyle['callingBox__video-container--audio']}`}>
                                <span className={`${twilioStyle.callingBox__nameTag} ${this.state.audioEnabled ? twilioStyle["user-speaking"] : ""} `}> {this.context.displayName ? getInitals(this.context.displayName) : 'You'}</span>
                                <span className={twilioStyle["username-bar"]}>
                                    You
                                </span>
                                <div className={`${twilioStyle['callingBox__video-wrapper']} ${twilioStyle['has-video']}  ${this.state.videoEnabled ? "" : "d-none"}`}
                                    id={twilioStyle['local-media']} ref={this.setLocalMediaRef}>

                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={`${twilioStyle.callingBox__buttons} ${twilioStyle.callingBox__buttons__gradient}`}>
                        <ul className={twilioStyle["callingBox__buttons-list"]}>
                            <li>
                                <button className={twilioStyle["icon-btn"]} onClick={this.onCameraButtonClick} style={!this.state.videoEnabled ? { backgroundColor: "rgb(150 150 150)" } : { backgroundColor: "rgb(111 111 111)" }}>
                                    <i className={this.state.videoEnabled ? 'icon-video-btn' : 'icon-video-btn-mute'}></i>
                                </button>
                            </li>
                            {
                                this.state.activeRoom &&
                                <li >
                                    <button className={`${twilioStyle['icon-btn']} ${twilioStyle["icon-btn--red"]}`} onClick={this.leaveRoom}>
                                        <i class="icon-end-call"></i>
                                    </button>
                                </li>
                            }
                            <li>
                                <button className={twilioStyle[`icon-btn`]} onClick={this.onAudioButtonClick} style={!this.state.audioEnabled ? { backgroundColor: "rgb(150 150 150)" } : { backgroundColor: "rgb(111 111 111)" }}>
                                    <i className={this.state.audioEnabled ? 'icon-mic-btn' : 'icon-mic-btn-mute'}></i>
                                </button>
                            </li>
                        </ul>
                    </div>

                </section>
            </>
        );
    }


    handleWhiteBoardButton = (e, value) => {
        e.preventDefault()
        this.setState({
            showWhiteborad: value
        })

        const doc = document.querySelector(`#${twilioStyle['overlayContent']}`)
        if (doc.classList.contains(twilioStyle['caller_4'])) {
            doc.classList.remove(twilioStyle['caller_4'])
        }

        const callerClass = 'caller_whiteboard'
        if (value) {
            if (doc.classList.contains(this.currentLayoutClass)) {
                doc.classList.remove(this.currentLayoutClass)
            }
            doc.classList.add(callerClass)
        } else {
            if (doc.classList.contains(callerClass)) {
                doc.classList.remove(callerClass)
            }
            doc.classList.add(this.currentLayoutClass)
        }
    }

}

export default MultiVideoCall;

