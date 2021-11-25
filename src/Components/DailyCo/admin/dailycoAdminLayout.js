import { Component, createRef } from "react";
import ReactTooltip from "react-tooltip";
import { ContentType } from "../../../Containers/MediaModal/MediaModal";
import Menu from "../../../Containers/Menu/Menu";
import { MediaModalContext } from "../../../Context/MediaModal/MediaModalContextProvider";
// import Menu from "../../../Containers/Menu/Menu";
import FooterNotification from "../FooterNotification";
import DailyCoSettings from "../settings/DailyCoSettings";
import AudioTile from "../tiles/AudioTile";
import LiveParticipantTile from "../tiles/LiveParticipantTile";
import VideoTile from "../tiles/VideoTile";

import callingStyles from "./admin_calling.module.css";
import footerStyles from "./admin_footer.module.css";

export default class DailycoAdminLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      countdown: 0,
      countdownInput: "",
      isCountdownRunning: false,
      intervalObj: null,
      videoContainerWidth: 0,
      videoContainerHeight: 0,
    };
    this._videoContainer = createRef();

    window.countdown = 0;
    window.isCountdownRunning = false;
  }

  componentDidMount = () => {
    window.addEventListener("resize", this.onResize);
    this.onResize();
  };

  componentWillUnmount = () => {
    window.removeEventListener("resize", this.onResize);
  };

  componentWillReceiveProps = (newProps) => {
    // console.log(this.props.participants);
    // console.log(newProps.participants);
    this.onResize();
  };

  onResize = () => {
    this.updateVideoContainerSize();
    setTimeout(() => {
      this.updateVideoContainerSize();
    }, 100);
    setTimeout(() => {
      this.updateVideoContainerSize();
    }, 250);
  };

  updateVideoContainerSize = () => {
    if (!this._videoContainer || !this._videoContainer.current) return;

    let videoContainerWidth =
      this._videoContainer.current.getBoundingClientRect().width - 10;
    let videoContainerHeight =
      this._videoContainer.current.getBoundingClientRect().height - 10;
    // console.log(videoContainerWidth + " x " + videoContainerHeight);
    this.setState({ videoContainerWidth, videoContainerHeight });
  };

  startCountdown = (sendMessage = true) => {
    if (this.state.countdown === 0) return;

    let intervalObj = setInterval(() => {
      let countdown = Math.max(this.state.countdown - 1, 0);
      if (!this.state.isCountdownRunning || countdown <= 0) {
        this.stopCountdown(false);
      }
      let countdownInput = this.getFormattedCountdown(countdown);

      window.countdown = countdown;
      this.setState({ countdown, countdownInput });
    }, 1000);

    window.isCountdownRunning = true;
    this.setState({ isCountdownRunning: true, intervalObj });
    if (sendMessage) this.props.sendCountdownStart(this.state.countdown);
  };

  stopCountdown = (sendMessage = true) => {
    if (this.state.intervalObj) clearInterval(this.state.intervalObj);
    let countdownInput = this.getFormattedCountdown(this.state.countdown);
    window.isCountdownRunning = false;
    this.setState({
      isCountdownRunning: false,
      countdownInput,
      intervalObj: null,
    });

    if (sendMessage) this.props.sendCountdownPause();
  };

  padNumString = (num, size) => {
    num = num.toString();
    while (num.length < size) num = "0" + num;
    return num;
  };

  getFormattedCountdown = (countdown) => {
    if (!countdown) return "0:00";
    let minutes = Math.floor(countdown / 60);
    let seconds = countdown % 60;
    return this.padNumString(minutes, 2) + ":" + this.padNumString(seconds, 2);
  };

  handleChange = (event) => {
    console.log(event.target.value);
    let countdown = 0;
    let splitTimeStr = event.target.value.split(":");
    if (splitTimeStr.length >= 2) {
      countdown += parseInt(splitTimeStr[1]);
      countdown += parseInt(splitTimeStr[0]) * 60;
    }

    window.countdown = countdown;
    this.setState({ countdown, countdownInput: event.target.value });
    console.log(countdown);
  };

  // renderLiveParticipant = (session_id, participant, self = false) => {
  //   if (!session_id || !participant) {
  //     return (
  //       <div className="callingBox__translator inactive">
  //         <div className="callingBox__translator-thumb" />
  //         <p className="callingBox__translator-name">Empty Slot</p>
  //       </div>
  //     );
  //   }

  //   return (
  //     <div className="callingBox__translator">
  //       <div
  //         className="callingBox__translator__live"
  //         style={{ cursor: "pointer" }}
  //         onClick={() => {
  //           if (!self) this.props.toggleParticipantAccess();
  //         }}
  //       >
  //         <span>Live</span>
  //       </div>
  //       <div className="callingBox__translator-thumb">
  //         {participant?.user_name?.slice(0, 2).toUpperCase()}
  //       </div>
  //       <p className="callingBox__translator-name">
  //         {participant?.user_name}
  //         {self && "(Me)"}
  //       </p>
  //       {!self && (
  //         <div className="over-buttons over-buttons--center">
  //           <div className="over-buttons__inner">
  //             <button
  //               onClick={() =>
  //                 this.props.setParticipantVideo(session_id, participant)
  //               }
  //             >
  //               <i className="icon-video-btn-filled" />
  //             </button>
  //             <button
  //               onClick={() =>
  //                 this.props.setParticipantAudio(session_id, participant)
  //               }
  //             >
  //               <i className="icon-mic-btn2" />
  //             </button>
  //             <button
  //               onClick={() =>
  //                 this.props.setParticipantScreen(session_id, participant)
  //               }
  //             >
  //               <i className="icon-screen-share1" />
  //             </button>
  //           </div>
  //         </div>
  //       )}
  //     </div>
  //   );
  // };

  getNameAbbreviation = (userName) => {
    if (!userName) return null;

    let abbreviatedName = "";
    let splitName = userName.split(" ");
    for (let i = 0; i < splitName.length && i < 2; i++) {
      if (splitName[i].length > 0)
        abbreviatedName += splitName[i][0].toUpperCase();
    }

    return abbreviatedName;
  };

  renderPendingParticipant = (participant) => {
    // console.log(participant);
    return (
      <div
        className={callingStyles.callingBox__translator}
        key={participant.session_id}
      >
        <div className={callingStyles.callingBox__translator_thumb}>
          {participant &&
            participant.user_name &&
            this.getNameAbbreviation(participant.user_name)}
        </div>
        <p className={callingStyles.callingBox__translator_name}>
          {participant?.user_name}
          {participant.session_id === this.props.session_id && " (Me)"}
        </p>
        <ul className="button-group">
          <li>
            <button
              onClick={() => {
                console.log(participant);
                this.props.toggleParticipantAccess(participant.session_id);
              }}
            >
              <i className="icon-tick" />
            </button>
          </li>
          <li>
            <button
              onClick={() => this.props.cancelRequest(participant.session_id)}
            >
              <i className="icon-close" />
            </button>
          </li>
        </ul>
      </div>
    );
  };

  renderDefaultParticipant = (participant) => {
    return (
      <div
        className={`${callingStyles.callingBox__translator} ${callingStyles.inactive}`}
        key={participant.session_id}
      >
        <div className={callingStyles.callingBox__translator_thumb}>
          {participant &&
            participant.user_name &&
            this.getNameAbbreviation(participant.user_name)}
        </div>
        <p className={callingStyles.callingBox__translator_name}>
          {participant?.user_name}
          {participant.session_id === this.props.session_id && " (Me)"}
        </p>
        <div className="text-center pd-t10">
          <button
            className={callingStyles.callingBox__translator_btn}
            onClick={() => {
              console.log(participant.session_id);
              console.log(participant);
              this.props.toggleParticipantAccess(participant.session_id);
            }}
          >
            Go LIVE
          </button>
        </div>
      </div>
    );
  };

  renderAdminUI() {
    if (!this.props.hasJoinedCall) return;
    let liveParticipants = [];
    let pendingParticipants = [];
    let defaultParticipants = [];

    let participants = { ...this.props.participants };
    //let participantIDs = Object.keys(participants);
    // console.log(participants);

    let adminControls = {
      toggleCam: this.props.setParticipantVideo,
      toggleMic: this.props.setParticipantAudio,
      toggleScreen: this.props.setParticipantScreen,
      toggleAccess: this.props.toggleParticipantAccess,
      cancel: this.props.cancelRequest,
    };

    // liveParticipants.push(
    //   <LiveParticipantTile
    //     session_id={participants.local.session_id}
    //     participant={participants.local}
    //     self={true}
    //     adminControls={adminControls}
    //     callingStyles={callingStyles}
    //   />
    // );

    // console.log(this.props.accessAllowedIDs);
    let accessAllowedLen = this.props.accessAllowedIDs.length;
    let filledSlots = 0;
    for (var i = accessAllowedLen - 1; i >= 0; i--) {
      let session_id = this.props.accessAllowedIDs[i];
      let participant = participants[session_id];
      if (session_id === this.props.session_id)
        participant = participants.local;

      if (
        participant &&
        participant.user_name &&
        !participant.user_name.includes("_$translator")
      ) {
        liveParticipants.push(
          <LiveParticipantTile
            key={participant.session_id}
            session_id={participant.session_id}
            participant={participant}
            self={participant.session_id === this.props.session_id}
            adminControls={adminControls}
            callingStyles={callingStyles}
          />
        );
        filledSlots++;
      }
    }

    for (var i = filledSlots; i < 8; i++) {
      // For empty slots
      liveParticipants.push(
        <LiveParticipantTile
          key={i}
          // session_id={session_id}
          // participant={participant}
          // self={false}
          // adminControls= {adminControls}
          callingStyles={callingStyles}
        />
      );
    }

    for (var i = this.props.pendingRequestIDs.length - 1; i >= 0; i--) {
      let session_id = this.props.pendingRequestIDs[i];
      const participant = participants[session_id];
      // console.log(participant);
      if (
        participant.user_name &&
        !participant.user_name.includes("_$translator")
      )
        pendingParticipants.push(this.renderPendingParticipant(participant));
    }

    Object.keys(participants).forEach((session_id) => {
      // if (session_id === "local") {
      // return;
      // } else
      const participant = participants[session_id];
      if (this.props.accessAllowedIDs.includes(participant.session_id)) {
        return;
      } else if (
        this.props.pendingRequestIDs.includes(participant.session_id)
      ) {
        return;
      }

      if (
        participant.user_name &&
        !participant.user_name.includes("_$translator")
      )
        defaultParticipants.push(this.renderDefaultParticipant(participant));
    });

    return (
      <div className={callingStyles.admin_controls}>
        <h2 className={callingStyles.admin_controls__title}>
          Live Participants
        </h2>
        <div
          className={callingStyles.callingBox__translators}
          style={{ marginBottom: "0.5rem" }}
        >
          {liveParticipants}
        </div>
        <h2 className={callingStyles.admin_controls__title}>
          Participants requesting access
        </h2>
        <div
          className={callingStyles.callingBox__translators}
          style={{ marginBottom: "0.5rem" }}
        >
          {pendingParticipants}
        </div>
        <h2 className={callingStyles.admin_controls__title}>
          All Participants
        </h2>
        <div className={`${callingStyles.callingBox__translators} pd-b0`}>
          {defaultParticipants}
        </div>
      </div>
    );
  }

  calculateVideoTileSize = (totalVideoTiles, screenShare) => {
    if (this.state.videoContainerHeight === 0) {
      return { width: 0, height: 0 };
    }

    let targetAspect = 16.0 / 9.0;
    // if (screenShare) {
    //   targetAspect = 4.0 / 3.0;
    // }
    let tileAreaWidth = this.state.videoContainerWidth;
    let tileAreaHeight = this.state.videoContainerHeight;
    let tileAspect = null;
    let rowCount = 1;
    let colCount = 1;

    // Check which column count will make tile area closest to targetAspect
    for (let cols = 1; cols <= 4; cols++) {
      if (totalVideoTiles < cols) break;

      let rows = Math.ceil(totalVideoTiles / cols);
      let tempTileWidth = this.state.videoContainerWidth / cols;
      let tempTileHeight = this.state.videoContainerHeight / rows;
      let tempTileAspect = tempTileWidth / tempTileHeight;

      if (
        tileAspect === null ||
        Math.abs(tempTileAspect - targetAspect) <
        Math.abs(tileAspect - targetAspect)
      ) {
        tileAreaWidth = tempTileWidth;
        tileAreaHeight = tempTileHeight;
        tileAspect = tempTileAspect;
        rowCount = rows;
        colCount = cols;
      }
    }

    if (tileAspect < targetAspect) {
      return {
        width: tileAreaWidth,
        // minWidth: tileAreaWidth,
        // maxWidth: tileAreaWidth,
        height: tileAreaWidth / targetAspect,
        // minHeight: tileAreaWidth / targetAspect,
        // maxHeight: tileAreaWidth / targetAspect,
      };
    } else {
      return {
        width: tileAreaHeight * targetAspect,
        // minWidth: tileAreaHeight * targetAspect,
        // maxWidth: tileAreaHeight * targetAspect,
        height: tileAreaHeight,
        // minHeight: tileAreaHeight,
        // maxHeight: tileAreaHeight,
      };
    }
  };

  getVideoTiles = () => {
    // const tileWidth = 13.5;
    // const tileHeight = (tileWidth * 3) / 4;

    if (this.props.callEnded) {
      return (
        <div
          className={`${callingStyles.callingBox__inner} ${callingStyles.callingBox__inner10}`}
          style={{ color: "white", fontSize: "2rem" }}
        >
          Video Call Ended
        </div>
      );
    }

    if (!this.props.isRoomActive) {
      return (
        <div
          className={`${callingStyles.callingBox__inner} ${callingStyles.callingBox__inner10}`}
          style={{ color: "white", fontSize: "2rem" }}
        >
          Session is not active
        </div>
      );
    }

    if (!this.props.hasJoinedCall || !this.props.participants) {
      return (
        <div
          className={`${callingStyles.callingBox__inner} ${callingStyles.callingBox__inner10}`}
          style={{ color: "white", fontSize: "2rem" }}
        >
          Please Wait. Joining Call..
        </div>
      );
    }

    let videoTiles = [];
    let participants = { ...this.props.participants };
    let screenShare =
      this.props.isScreenSharing ||
      this.props.screenSharingParticipant.length > 0;

    let participantsWithTile = [];
    Object.values(participants).forEach((participant) => {
      if (
        participant.tracks &&
        participant.tracks.video &&
        participant.tracks.video.state === "playable" &&
        !this.props.accessAllowedIDs.includes(participant.session_id)
      ) {
        participantsWithTile.push(participant);
      }
    });
    this.props.accessAllowedIDs.forEach((participantId) => {
      let participant = participants[participantId];
      if (!participant) {
        if (participantId === this.props.session_id && participants.local)
          participant = participants.local;
        else return;
      }
      participantsWithTile.push(participant);
    });

    // Object.keys(participants).forEach((participantID) => {

    participantsWithTile.forEach((participant, index) => {
      // let participant = participants[participantID];
      let session_id = participant.session_id;
      videoTiles.push(
        <VideoTile
          key={session_id}
          participant={participant}
          tileIndex={index}
          totalVideoTiles={participantsWithTile.length}
          isAudioOn={this.props.isAudioOn}
          videoStyle={callingStyles}
          getTileSize={() =>
            this.calculateVideoTileSize(
              participantsWithTile.length,
              // tileWidth,
              // tileHeight,
              screenShare
            )
          }
          self={session_id === this.props.session_id}
          adminControls={{
            toggleCam: () =>
              this.props.setParticipantVideo(session_id, participant),
            toggleMic: () =>
              this.props.setParticipantAudio(session_id, participant),
            toggleScreen: () =>
              this.props.setParticipantScreen(session_id, participant),
            toggleAccess: () =>
              this.props.toggleParticipantAccess(session_id, participant),
          }}
        />
      );
    });

    let screenShareTileWidth = this.state.videoContainerWidth / 4.0;
    let screenShareTileHeight = (screenShareTileWidth * 9.0) / 16.0;

    if (participantsWithTile.length === 0) screenShareTileHeight = 0;

    return (
      <div
        className={`${callingStyles.callingBox__inner} ${callingStyles.callingBox__inner10}`}
        style={
          screenShare
            ? participantsWithTile.length <= 4
              ? {
                height: `${screenShareTileHeight}px`,
                minHeight: `${screenShareTileHeight}px`,
                flexDirection: "row",
                justifyContent: "start",
              }
              : {
                height: `${2 * screenShareTileHeight}px`,
                minHeight: `${2 * screenShareTileHeight}px`,
                flexDirection: "row",
                flexWrap: "wrap",
                alignItems: "start",
              }
            : {}
        }
        ref={this._videoContainer}
      >
        {videoTiles}
      </div>
    );
  };

  getAudioTiles = () => {
    if (
      this.props.callEnded ||
      !this.props.hasJoinedCall ||
      !this.props.participants
    ) {
      return null;
    }

    let audioTiles = [];
    let participants = { ...this.props.participants };
    let participantsWithTile = [];

    Object.values(participants).forEach((participant) => {
      if (participant.user_name.includes("_$translator"))
        participantsWithTile.unshift(participant);
      else if (
        participant.tracks &&
        participant.tracks.audio &&
        participant.tracks.audio.state === "playable" &&
        (!participant.tracks.video ||
          participant.tracks.video.state !== "playable") &&
        !this.props.accessAllowedIDs.includes(participant.session_id)
      ) {
        participantsWithTile.push(participant);
      }
    });

    participantsWithTile.forEach((participant, index) => {
      let session_id = participant.session_id;
      audioTiles.push(
        <AudioTile
          key={session_id}
          participant={participant}
          tileIndex={index}
          isAudioOn={this.props.isAudioOn}
          self={this.props.session_id === session_id}
          callingStyles={callingStyles}
          adminControls={
            session_id !== this.props.session_id
              ? {
                toggleMic: () =>
                  this.props.setParticipantAudio(session_id, participant),
              }
              : null
          }
        />
      );
    });

    if (participantsWithTile.length === 0) {
      return null;
    }

    return (
      <div
        className={callingStyles.callingBox__translators}
        style={{
          flexWrap: "wrap",
        }}
      >
        {audioTiles}
      </div>
    );
  };

  openPdf = () => {
    let pdfUrl = null;
    if (this.props.publicRoomName.includes("Breakout")) {
      pdfUrl =
        "https://storage.googleapis.com/djzs-bucket/NegotationAcademy/Pdfs/Breakout_Instructions.pdf";
    } else if (this.props.publicRoomName.includes("Plenary")) {
      pdfUrl =
        "https://storage.googleapis.com/djzs-bucket/NegotationAcademy/Pdfs/Plenary_Instructions.pdf";
    } else if (this.props.publicRoomName.includes("Negotiation")) {
      pdfUrl =
        "https://storage.googleapis.com/djzs-bucket/NegotationAcademy/Pdfs/Negotiation_Instructions.pdf";
    }

    console.log(this.props.publicRoomName);
    console.log(pdfUrl);

    if (pdfUrl) {
      if (typeof window.parent.openIframe !== "undefined") {
        window.parent.openIframe("Information", pdfUrl, "pdf");
      }

      console.log(this.props.publicRoomName);
      console.log(pdfUrl);

      if (pdfUrl) {
        if (typeof window.parent.openIframe !== "undefined") {
          window.parent.openIframe("Information", pdfUrl, "pdf");
        }
      }
    }
  };

  showSettings = async () => {
    const { showMediaModal, closeMediaModal, mediaModalStatus, modalDetails } =
      this.context;

    let currDevices = await this.props.callFrame.getInputDevices();
    console.log("currInputDevices", currDevices);

    let devices = await navigator.mediaDevices.enumerateDevices();
    let videoInputDevices = devices.filter(
      (device) => device.kind === "videoinput"
    );
    let audioInputDevices = devices.filter(
      (device) => device.kind === "audioinput"
    );
    let audioOutputDevices = devices.filter(
      (device) => device.kind === "audiooutput"
    );

    console.log("videoInputDevices", videoInputDevices);
    console.log("audioInputDevices", audioInputDevices);
    console.log("audioOutputDevices", audioOutputDevices);

    showMediaModal({
      type: ContentType.Component,
      name: "Settings",
      component: DailyCoSettings,
      data: {
        hasJoinedCall: this.props.hasJoinedCall,
        callFrame: this.props.callFrame,
        videoInputDevices,
        audioInputDevices,
        audioOutputDevices,
        currDevices,
        closeModal: closeMediaModal,
      },
    });
  };

  render() {
    return (
      <>
        {/*  / header box \ */}
        <header className="headerBox pd-l80" style={{ zIndex: 9 }}>
          <div className="headerBox__inner">
            {/* <button
              className="headerBox__menu"
              style={{ marginRight: "0.5rem" }}
            >
              <i className="icon-menu-btn"></i>
            </button> */}
            <div
              className="headerBox__left"
              style={{
                flexGrow: "1",
                // justifyContent: "center",
                // marginLeft: "10rem",
              }}
            >
              {/* <img
                src="assets/images/logo.png"
                className="headerBox__flags"
                style={{ height: "2rem", marginRight: "1rem" }}
              /> */}
              <ul className="headerBox__flags">
                <li>
                  <a href="#" style={{ width: "2rem", height: "2rem" }}>
                    <img src="assets/images/flags/flag1.png" alt="" />
                  </a>
                </li>
                <li>
                  <a href="#" style={{ width: "2rem", height: "2rem" }}>
                    <img src="assets/images/flags/flag2.png" alt="" />
                  </a>
                </li>
                <li>
                  <a href="#" style={{ width: "2rem", height: "2rem" }}>
                    <img src="assets/images/flags/flag3.png" alt="" />
                  </a>
                </li>
                <li>
                  <a href="#" style={{ width: "2rem", height: "2rem" }}>
                    <img src="assets/images/flags/flag4.png" alt="" />
                  </a>
                </li>
              </ul>
              {/*  / breadcrumb \ */}
              <ul className="breadcrumb">
                <li>
                  <a style={{ fontSize: "1.5rem", color: "white" }}>
                    {this.props.publicRoomName}
                  </a>
                </li>
                {/* <li>Participants</li> */}
              </ul>
              {/*  \ breadcrumb / */}
            </div>
            {this.props.isRoomActive ? (
              <button
                className="btn btn-lg btn-primary"
                onClick={() => this.props.EndCallForEveryOne()}
              >
                End Session
                {/* Close Room */}
              </button>
            ) : (
              <button
                className="btn btn-lg btn-primary"
                onClick={() => this.props.startCallForEveryOne()}
              >
                Start Session
                {/* Start Room */}
              </button>
            )}{" "}
          </div>
          {/* <Menu /> */}
        </header>
        {/*  \ header box / */}
        {/* ==== Important 
        <section class="callingBox active-sidebar"> Add class "active-sidebar" along with adding class "active" on sidebar to activate sidebar */}
        {/*  / calling box \ */}
        <section
          className={`${callingStyles.callingBox} ${this.props.showSidebar ? "active-sidebar" : ""
            }`}
        >
          {/* ==== Important  
            <div class="callingBox__body has-shared-video"> Add/Remove class "has-shared-video" on activation/deactivation of share screen */}
          <div className="conference-container">
            {/* <div className="callingBox__body has-shared-video"> */}
            <div className={callingStyles.callingBox__body}>
              {(this.props.screenSharingParticipant.length > 0 ||
                this.props.isScreenSharing) &&
                this.props.isRoomActive &&
                this.props.getScreenTile(callingStyles)}
              {/* / Video Thumbs \ */}
              {this.getVideoTiles()}
              {this.props.isRoomActive && this.getAudioTiles()}
            </div>

            {this.props.isRoomActive && this.renderAdminUI()}
          </div>
          {/*  / footerBox \ */}
          <footer className={`${footerStyles.footerBox} text-center`}>
            <div className={`${footerStyles.footerBox_info_container}`}>
              <button
                // className={footerStyles.icon_btn}
                className="icon-btn mg-r20"
                onClick={this.openPdf}
              >
                <i className="icon-info2" />
              </button>
              <div style={{
                position: "absolute",
                bottom: "3rem",
                left: "0.45rem",
                width: '100%',
              }}>
                <FooterNotification />
              </div>
            </div>
            <ul
              className={footerStyles.footerBox__buttons_list}
              style={{ width: "auto", flexGrow: "1" }}
            >
              {this.props.hasJoinedCall && this.props.isRoomActive && (
                <>
                  {/* <li>
                    <button
                      className="icon-btn"
                      onClick={() => this.showSettings()}
                    >
                      <i className="icon-settings" />
                    </button>
                  </li> */}

                  {!this.props.hasAccess ? (
                    <li
                      onClick={(event) => {
                        this.props.toggleParticipantAccess(
                          this.props.session_id
                        );
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      <button
                        // disabled={this.props.hasRequestedAccess}
                        // className={`${footerStyles.icon_btn} ${footerStyles.icon_btn__nobg}`}
                        className="icon-btn icon-btn--nobg"
                      >
                        <i className="icon-video-btn-filled" />
                      </button>{" "}
                      <span>Go Live</span>
                    </li>
                  ) : (
                    <>
                      <li>
                        <button

                          // className={footerStyles.icon_btn}
                          className="icon-btn video-btn"

                        >
                          <i
                            data-tip
                            data-for="video_tooltip"
                            className={
                              this.props.isVideoOn
                                ? "icon-video-btn-filled"
                                : "icon-video-btn-filled-mute icon-btn--mute"
                            }
                            id="video-button"
                            onClick={(event) => this.props.requestVideoAccess()}
                          />
                          <div className="dropdown_call">
                            {/* <img src={arrowSvg} alt="arrowSvg" /> */}
                            <input type="checkbox" />
                            <i className="icon-angle-down" />
                            <div className="dropdown_call_option_container up">
                              <div onClick={() => this.showSettings()}>
                                <i className="icon-settings" />
                                Open settings
                              </div>
                            </div>
                          </div>
                        </button>
                        <ReactTooltip
                          id="video_tooltip"
                          type="dark"
                          place="top"
                          effect="solid"
                          border={true}
                        >
                          <span>
                            {this.props.isVideoOn
                              ? "Turn Off Camera"
                              : "Turn On Camera"}
                          </span>
                        </ReactTooltip>
                      </li>
                      <li>
                        <button
                          data-tip
                          data-for="screen_tooltip"
                          // className={footerStyles.icon_btn}
                          className="icon-btn"
                          onClick={() => this.props.requestShareAccess()}
                        >
                          <i
                            className={
                              this.props.isScreenSharing
                                ? "icon-screen-share1 icon-btn--active"
                                : "icon-screen-share1"
                            }
                          />
                        </button>
                        <ReactTooltip
                          id="screen_tooltip"
                          type="dark"
                          place="top"
                          effect="solid"
                          border={true}
                        >
                          <span>
                            {this.props.isScreenSharing
                              ? "End Screen Sharing"
                              : "Start Screen Sharing"}
                          </span>
                        </ReactTooltip>
                      </li>
                    </>
                  )}
                  <li>
                    <button
                      data-tip
                      data-for="audio_tooltip"
                      // className={footerStyles.icon_btn}
                      className="icon-btn"
                      onClick={() => this.props.requestAudioAccess()}
                    >
                      <i
                        className={
                          this.props.isAudioOn
                            ? "icon-mic-btn2"
                            : "icon-mic-btn2-mute icon-btn--mute"
                        }
                        id="audio-button"
                      />
                    </button>
                    <ReactTooltip
                      id="audio_tooltip"
                      type="dark"
                      place="top"
                      effect="solid"
                      border={true}
                    >
                      <span>{this.props.isAudioOn ? "Mute" : "Unmute"}</span>
                    </ReactTooltip>
                  </li>

                  <li>
                    <button
                      data-tip
                      data-for="end_call_tooltip"
                      // className={`${footerStyles.icon_btn} ${footerStyles.icon_btn__red}`}
                      className="icon-btn icon-btn--red"
                      onClick={() => {
                        this.props.EndCall();
                        if (
                          typeof window.parent.endBreakoutCall !== "undefined"
                        )
                          window.parent.endBreakoutCall();
                      }}
                    >
                      <i className="icon-end-call" />
                    </button>
                    <ReactTooltip
                      id="end_call_tooltip"
                      type="dark"
                      place="top"
                      effect="solid"
                      border={true}
                    >
                      <span>End Call</span>
                    </ReactTooltip>
                  </li>
                </>
              )}
              {this.props.hasJoinedCall && !this.props.isRoomActive && (
                <>
                  <li>
                    <button
                      data-tip
                      data-for="end_call_tooltip"
                      // className={`${footerStyles.icon_btn} ${footerStyles.icon_btn__red}`}
                      className="icon-btn icon-btn--red"
                      onClick={() => {
                        this.props.EndCall();
                        if (
                          typeof window.parent.endBreakoutCall !== "undefined"
                        )
                          window.parent.endBreakoutCall();
                      }}
                    >
                      <i className="icon-end-call" />
                    </button>
                    <ReactTooltip
                      id="end_call_tooltip"
                      type="dark"
                      place="top"
                      effect="solid"
                      border={true}
                    >
                      <span>End Call</span>
                    </ReactTooltip>
                  </li>
                </>
              )}
            </ul>
            <div
              className="d-flex align-items-center"
              style={{ color: "white" }}
            >
              {this.state.isCountdownRunning ? (
                <>
                  <div className="mg-r10">Time left</div>
                  <p className={`mg-r10 ${footerStyles.footerBox__counter}`}>
                    {this.getFormattedCountdown(this.state.countdown)}
                  </p>
                  <button
                    // className={`${footerStyles.icon_btn} ${footerStyles.icon_btn__red} ${footerStyles.icon_btn__small}`}
                    className="icon-btn icon-btn--red icon-btn--small"
                    onClick={() => this.stopCountdown()}
                  >
                    <i className="icon-pause" />
                  </button>
                </>
              ) : (
                <>
                  <div className="mg-r10">Set a timer</div>
                  <input
                    type="time"
                    className={`mg-r10 ${footerStyles.footerBox__counter}`}
                    value={this.state.countdownInput}
                    onChange={this.handleChange}
                  />
                  <button
                    // className={`mg-r10 ${footerStyles.icon_btn} ${footerStyles.icon_btn__small}`}
                    className="mg-r10 icon-btn icon-btn--small"
                    disabled={this.state.countdown === 0}
                    onClick={() => this.startCountdown()}
                  >
                    <i className="icon-play" />
                  </button>
                </>
              )}
            </div>
          </footer>
          {/*  \ footerBox / */}
        </section>
        {/*  \ calling box / */}
      </>
    );
  }
}

DailycoAdminLayout.contextType = MediaModalContext;