import { Component, createRef } from "react";
import ReactTooltip from "react-tooltip";
import swal from "sweetalert";
import { ContentType } from "../../../Containers/MediaModal/MediaModal";
import Menu from "../../../Containers/Menu/Menu";
import { MediaModalContext } from "../../../Context/MediaModal/MediaModalContextProvider";
// import Menu from "../../../Containers/Menu/Menu";
import FooterNotification from "../FooterNotification";
import DailyCoSettings from "../settings/DailyCoSettings";
import AudioTile from "../tiles/AudioTile";
import ScreenTile from "../tiles/ScreenTile";
import VideoTile from "../tiles/VideoTile";

import callingStyles from "./participant_calling.module.css";
import footerStyles from "./participant_footer.module.css";

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3,
    slidesToSlide: 3, // optional, default to 1.
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
    slidesToSlide: 2, // optional, default to 1.
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
    slidesToSlide: 1, // optional, default to 1.
  },
};

export default class DailycoParticipantLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      countdown: 0,
      isCountdownRunning: false,
      intervalObj: null,
      videoContainerWidth: 0,
      videoContainerHeight: 0,
      isHandRaised: false,
      fakeVideoTiles: 0,
    };
    this._videoContainer = createRef();
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
    if (newProps.isCountdownRunning !== this.state.isCountdownRunning) {
      if (newProps.isCountdownRunning) {
        let intervalObj = setInterval(() => {
          let countdown = Math.max(this.state.countdown - 1);
          if (!newProps.isCountdownRunning || countdown <= 0) {
            this.stopCountdown();
            // return;
          }
          // console.log(countdown);
          // window.countdown = countdown;
          this.setState({ countdown });
        }, 1000);

        // window.countdown = newProps.initialCountdown;
        this.setState({
          countdown: newProps.initialCountdown,
          isCountdownRunning: true,
          intervalObj,
        });
      } else {
        this.stopCountdown();
      }
    }

    // if(newProps.showSidebar !== this.props.showSidebar)
    // this.updateVideoContainerSize();
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

  stopCountdown = () => {
    console.log("stopCountdown");
    if (this.state.intervalObj) clearInterval(this.state.intervalObj);
    this.setState({ isCountdownRunning: false, intervalObj: null });
  };

  padNumString = (num, size) => {
    num = num.toString();
    while (num.length < size) num = "0" + num;
    return num;
  };

  getFormattedCountdown = () => {
    if (!this.state.countdown) return "0:00";
    let minutes = Math.floor(this.state.countdown / 60);
    let seconds = this.state.countdown % 60;
    return this.padNumString(minutes, 2) + ":" + this.padNumString(seconds, 2);
  };

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

  raiseHand = () => {
    if (this.state.isHandRaised) return;

    // Raise hand right now
    this.props.sendHandRaise();
    this.setState({ isHandRaised: true });

    // Un-raise hand after 15seconds
    setTimeout(() => this.setState({ isHandRaised: false }), 15000);
  };

  calculateVideoTileSize = (totalVideoTiles, screenShare) => {
    if (this.state.videoContainerHeight === 0) {
      return { width: 0, height: 0 };
    }

    let targetAspect = 16.0 / 9.0;
    if (screenShare) {
      targetAspect = 4.0 / 3.0;
    }
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

  giveUpAccess = () => {
    swal({
      title: "Are you sure you want to give up video access?",
      // icon: "success",
      className: "video-swal-modal",
      buttons: {
        accept: "Give Up Access",
        reject: "Cancel",
      },
    }).then((value) => {
      switch (value) {
        case "accept":
          if (this.props.isVideoOn) this.props.requestVideoAccess();
          if (this.props.isScreenSharing) this.props.requestShareAccess();
          this.props.cancelRequest();
          break;
        //   case "cancel":
        //     swal("Request declined");
        //     break;
        default:
          // swal("Request declined");
          break;
      }
    });
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
        if (participantId === this.props.session_id)
          participant = participants.local;
        else return;
      }
      participantsWithTile.push(participant);
    });

    if (participantsWithTile.length > 0) {
      participantsWithTile.forEach((participant, index) => {
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
            cancelRequest={this.giveUpAccess}
          />
        );
      });
    } else {
      return (
        <div
          className={`${callingStyles.callingBox__inner} ${callingStyles.callingBox__inner10}`}
          style={{ color: "white", fontSize: "2rem" }}
        >
          Please wait for the host to start this session
        </div>
      );
    }

    // Object.keys(participants).forEach((participantID) => {
    //   let participant = participants[participantID];
    //   if (
    //     participant &&
    //     participant.tracks &&
    //     participant.tracks.video &&
    //     participant.tracks.video.state === "playable" &&
    //     !this.props.accessAllowedIDs.includes(participant.session_id)
    //   ) {
    //     videoTiles.push(
    //       <VideoTitle
    //         key={participantID}
    //         participant={participant}
    //         totalVideoTiles={totalVideoTiles}
    //         isAudioOn={this.props.isAudioOn}
    //         getTileStyle={() =>
    //           this.getTileStyle(
    //             totalVideoTiles,
    //             tileWidth,
    //             tileHeight,
    //             screenShare
    //           )
    //         }
    //       />
    //     );
    //   }
    // });

    // console.log(videoTiles);

    let screenShareTileHeight = this.state.videoContainerHeight / 4.0;
    let screenShareTileWidth = (screenShareTileHeight * 4.0) / 3.0;

    if (participantsWithTile.length === 0) screenShareTileWidth = 0;

    return (
      <div
        className={`${callingStyles.callingBox__inner} ${callingStyles.callingBox__inner10}`}
        style={
          screenShare
            ? participantsWithTile.length <= 4
              ? {
                width: `${screenShareTileWidth}px`,
                flexDirection: "column",
                justifyContent: "start",
              }
              : {
                width: `${2 * screenShareTileWidth}px`,
                flexDirection: "row",
                alignItems: "start",
                alignContent: "start",
                justifyContent: "start",
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
      return []; //null;
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
        />
      );
    });

    if (participantsWithTile.length === 0) {
      return []; //null;
    }

    return audioTiles;
  };

  getInactiveParticipantTiles = () => {
    if (
      this.props.callEnded ||
      !this.props.hasJoinedCall ||
      !this.props.participants
    ) {
      return null;
    }

    let inactiveTiles = [];
    let participants = { ...this.props.participants };

    let participantsWithTile = [];

    Object.values(participants).forEach((participant) => {
      if (
        (!participant.tracks ||
          !participant.tracks.audio ||
          participant.tracks.audio.state !== "playable") &&
        (!participant.tracks.video ||
          participant.tracks.video.state !== "playable") &&
        !this.props.accessAllowedIDs.includes(participant.session_id)
      ) {
        if (participant.session_id !== this.props.session_id)
          participantsWithTile.push(participant);
      }
    });
    // console.log(participantsWithTile);

    let tilesToShowCount = Math.min(participantsWithTile.length, 6);
    if (
      (!participants.local.tracks ||
        !participants.local.tracks.audio ||
        participants.local.tracks.audio.state !== "playable") &&
      (!participants.local.tracks.video ||
        participants.local.tracks.video.state !== "playable") &&
      !this.props.accessAllowedIDs.includes(this.props.session_id) &&
      !participants.local.user_name.includes("_$translator")
    ) {
      inactiveTiles.push(
        <li key="you">
          <a
            href="#"
            data-tip
            data-for="you_tooltip"
          // onClick={() => this.props.setShowSidebar(!this.props.showSidebar)}
          >
            You
          </a>
          <ReactTooltip
            id="you_tooltip"
            type="dark"
            place="left"
            effect="solid"
            border={true}
          >
            <span>{participants.local.user_name}</span>
          </ReactTooltip>
        </li>
      );
      if (tilesToShowCount === 6) tilesToShowCount--;
    }

    // participantsWithTile.forEach((participant, index) => {
    let tilesShown = 0;
    for (; tilesShown < tilesToShowCount; tilesShown++) {
      let participant = participantsWithTile[tilesShown];
      let session_id = participant.session_id;
      let userName = participant.user_name.replace("_$translator", "");
      let isTranslator = participant.user_name.includes("_$translator");

      if (!isTranslator) {
        inactiveTiles.push(
          <li key={session_id}>
            <a
              href="#"
              data-tip
              data-for={session_id + "_tooltip"}
            // onClick={() => this.props.setShowSidebar(!this.props.showSidebar)}
            >
              {this.getNameAbbreviation(userName)}
            </a>
            <ReactTooltip
              id={session_id + "_tooltip"}
              type="dark"
              place="left"
              effect="solid"
              border={true}
            >
              <span>{userName}</span>
            </ReactTooltip>
          </li>
        );
      }
    }
    // });

    if (tilesShown < tilesToShowCount) {
      inactiveTiles.push(
        <li key="extras">
          <a
            href="#"
            // onClick={() => this.props.setShowSidebar(!this.props.showSidebar)}
            style={{ background: "#505050" }}
          >
            +{tilesToShowCount - tilesShown}
          </a>
        </li>
      );
    }

    if (inactiveTiles.length === 0) {
      return null;
    }

    return inactiveTiles;
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
    let isTranslator = false;
    if (
      this.props.participants &&
      this.props.participants.local &&
      this.props.participants.local.user_name
    )
      isTranslator =
        this.props.participants.local.user_name.includes("_$translator");

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
                  <a style={{ width: "2rem", height: "2rem" }}>
                    <img src="assets/images/flags/flag1.png" alt="" />
                  </a>
                </li>
                <li>
                  <a style={{ width: "2rem", height: "2rem" }}>
                    <img src="assets/images/flags/flag2.png" alt="" />
                  </a>
                </li>
                <li>
                  <a style={{ width: "2rem", height: "2rem" }}>
                    <img src="assets/images/flags/flag3.png" alt="" />
                  </a>
                </li>
                <li>
                  <a style={{ width: "2rem", height: "2rem" }}>
                    <img src="assets/images/flags/flag4.png" alt="" />
                  </a>
                </li>
              </ul>
              {/*  \ headerBox__flags / */}
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
            {/*  / menu box \ */}
            <div className="header-dropdown">
              <a className="header-dropdown__btn" href="#">
                English <i className="icon-angle-down" />
              </a>
              <ul className="header-dropdown__list">
                <li>
                  <a href>English</a>
                </li>
                <li>
                  <a href>Japanese</a>
                </li>
                <li>
                  <a href>Chinese</a>
                </li>
                <li>
                  <a href>Taiwanese</a>
                </li>
              </ul>
            </div>

            {/* <button
              className="footerBox__counter mg-r50"
              style={{ marginLeft: "1rem", color: "white" }}
              onClick={() => {
                this.props.EndCall();
                if (typeof window.parent.endBreakoutCall !== "undefined")
                  window.parent.endBreakoutCall();
              }}
            >
              Back to Lobby
            </button> */}
            {/*  \ menu box / */}
          </div>
          {/* <ul
            className="sidebar__tabs"
          >
            <li>
              <a
                className="active"
                href="#"
                onClick={() =>
                  this.props.setShowSidebar(!this.props.showSidebar)
                }
              >
                <i className="icon-people" /> Participants
              </a>
            </li>
            <li>
              <a
                href="#"
                onClick={() =>
                  this.props.setShowSidebar(!this.props.showSidebar)
                }
              >
                <i className="icon-chat" /> Public Chat
              </a>
            </li>
            <li>
              <a
                href="#"
                onClick={() =>
                  this.props.setShowSidebar(!this.props.showSidebar)
                }
              >
                <i className="icon-polls" /> Polls
              </a>
            </li>
          </ul> */}
          {/* <Menu /> */}
        </header>
        {/*  \ header box / */}
        {/* ==== Important 
        <section class="callingBox active-sidebar"> Add class "active-sidebar" along with adding class "active" on sidebar to activate sidebar */}
        {/*  / calling box \ */}
        <section
          className={`${callingStyles.callingBox} ${this.props.is3D ? callingStyles.callingBox3d : ""
            } ${this.props.showSidebar ? `${callingStyles.active_sidebar}` : ""}`}
        >
          <ul className={callingStyles.callingBox__user_list}>
            {this.getInactiveParticipantTiles()}
          </ul>

          <div
            style={{
              width: "100%",
              height: "10rem",
              backgroundImage: "url('/assets/images/banner.png')",
              backgroundSize: "cover",
              borderRadius: "1rem",
              marginTop: "0.75rem",
              color: "white",
              display: "flex",
              alignItems: "center",
              padding: "0 3rem",
            }}
          >
            <h2>Branding Space</h2>
          </div>

          {/* ==== Important  
            <div class="callingBox__body has-shared-video"> Add/Remove class "has-shared-video" on activation/deactivation of share screen */}
          <div
            className="conference-container"
            style={
              this.props.is3D
                ? {
                  // position: "absolute",
                  overflow: "hidden",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                  height: "100%",
                  margin: "10.9% 0%",
                }
                : { position: "relative", overflow: "hidden" }
            }
          // style={
          //   this.props.is3D
          //     ? { justifyContent: "center", alignItems: "center" }
          //     : {}
          // }
          >
            {this.props.is3D && (
              <div
                style={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  backgroundImage: `url('assets/images/plenaryBG.png')`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  transition: "background-image 2s ease-in-out",
                }}
              ></div>
            )}
            <div
              id="overlayContent"
              style={{
                position: "absolute",
                top: 0,
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
                width: this.props.is3D ? "calc(233vh)" : "100%",
                zIndex: 1,
              }}
            // ref={this._videoContainer}
            >
              <div
                className={`${callingStyles.callingBox__body} ${this.props.screenSharingParticipant.length > 0 ||
                  this.props.isScreenSharing
                  ? `${callingStyles.has_shared_video}`
                  : ""
                  }`}
                style={
                  this.props.is3D
                    ? {
                      // flexDirection: "row",
                      // width: "51.5%",
                      // height: "68.5%",
                      // margin: "7.6% 24.5%",
                      width: "54%",
                      height: "70.9%",
                      margin: "5.9% 22.9%",
                      background: "black",
                      position: "relative"
                    }
                    : {} //{ flexDirection: "row" }
                }
              >
                {/* <div className="callingBox__body"> */}

                {(this.props.screenSharingParticipant.length > 0 ||
                  this.props.isScreenSharing) &&
                  this.props.getScreenTile(callingStyles)}

                {this.getVideoTiles()}

                <div
                  className={callingStyles.callingBox__translators}
                  style={
                    this.props.screenSharingParticipant.length > 0 ||
                      this.props.isScreenSharing
                      ? {
                        display: "flex",
                        position: "absolute",
                        bottom: "0",
                        left: "0",
                        opacity: "0.75",
                        zIndex: "5",
                        flexWrap: "wrap",
                      }
                      : { flexWrap: "wrap" }
                  }
                >
                  {
                    this.props.participants &&
                    // <Carousel
                    //   responsive={responsive}
                    //   // swipeable={true}
                    //   // draggable={true}
                    // >
                    this.getAudioTiles()
                    // </Carousel>
                  }
                </div>
              </div>
            </div>
          </div>
          {/*  / footerBox \ */}
          {/* ${this.props.is3D ? footerStyles.footerBox_grad : ""}  footer class for gradient */}
          <footer
            className={`${footerStyles.footerBox} 
            text-center`}
          >
            <div className={`${footerStyles.footerBox_info_container}`}>
              <button
                // className={footerStyles.icon_btn}
                className="icon-btn mg-r20"
                onClick={() => {
                  let pdfUrl = null;
                  if (this.props.publicRoomName.includes("Breakout")) {
                    pdfUrl =
                      "https://storage.googleapis.com/djzs-bucket/NegotationAcademy/Pdfs/Breakout_Instructions.pdf";
                  } else if (this.props.publicRoomName.includes("Plenary")) {
                    pdfUrl =
                      "https://storage.googleapis.com/djzs-bucket/NegotationAcademy/Pdfs/Plenary_Instructions.pdf";
                  } else if (
                    this.props.publicRoomName.includes("Negotiation")
                  ) {
                    pdfUrl =
                      "https://storage.googleapis.com/djzs-bucket/NegotationAcademy/Pdfs/Negotiation_Instructions.pdf";
                  }

                  console.log(this.props.publicRoomName);
                  console.log(pdfUrl);

                  if (pdfUrl) {
                    if (typeof window.parent.openIframe !== "undefined") {
                      window.parent.openIframe("Information", pdfUrl, "pdf");
                    }
                  }
                }}
              >
                <i className="icon-info2" />
              </button>
              <div style={{
                position: "absolute",
                bottom: "2.57rem",
                left: "4.45rem",
                width: '100%',
              }}>
                <FooterNotification />
              </div>
            </div>

            <ul className={footerStyles.footerBox__buttons_list}>
              {this.props.hasJoinedCall && (
                <>
                  {/* {!isTranslator && (
                    <li>
                      <button
                        className="icon-btn"
                        onClick={() => this.showSettings()}
                        disabled={!this.props.hasJoinedCall}
                      >
                        <i className="icon-settings" />
                      </button>
                    </li>
                  )} */}
                  {!isTranslator &&
                    (!this.props.hasAccess ? (
                      <li
                        onClick={(event) => {
                          if (!this.props.hasRequestedAccess)
                            this.props.requestVideoAccess();
                        }}
                        style={{ cursor: "pointer" }}
                      >
                        <button
                          disabled={this.props.hasRequestedAccess}
                          // className={`${footerStyles.icon_btn} ${footerStyles.icon_btn__nobg}`}
                          className="icon-btn icon-btn--nobg"
                        >
                          <i className="icon-video-btn-filled" />
                        </button>{" "}
                        <span>
                          {this.props.hasRequestedAccess
                            ? "Access Request Sent"
                            : "Request Video Access"}
                        </span>
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
                    ))}
                  <li>
                    <button
                      data-tip
                      data-for="audio_tooltip"
                      // className={footerStyles.icon_btn}
                      className="icon-btn"
                      onClick={(event) => this.props.requestAudioAccess()}
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
                  {!isTranslator && (
                    <li>
                      <button
                        data-tip
                        data-for="hand_tooltip"
                        disabled={this.state.isHandRaised}
                        className="icon-btn"
                        onClick={() => this.raiseHand()}
                      >
                        <i className="icon-raise-hand" />
                      </button>
                      <ReactTooltip
                        id="hand_tooltip"
                        type="dark"
                        place="top"
                        effect="solid"
                        border={true}
                      >
                        <span>Raise Hand</span>
                      </ReactTooltip>
                    </li>
                  )}
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

                    {/* <button
                      className="icon-btn"
                      onClick={() => {
                        this.setState({
                          fakeVideoTiles: this.state.fakeVideoTiles + 1,
                        });
                      }}
                    >
                      <i className="icon-end-call" />
                    </button> */}
                  </li>
                  {/* <li><button disabled class="icon-btn"><i class="icon-mic-btn"></i></button></li>
                    <li><button disabled class="icon-btn"><i class="icon-mic-btn-mute"></i></button></li> */}
                </>
              )}
            </ul>
            <p className={footerStyles.footerBox__counter}>
              {this.getFormattedCountdown()}
            </p>
          </footer>
          {/*  \ footerBox / */}
        </section>
        {/*  \ calling box / */}
      </>
    );
  }
}

DailycoParticipantLayout.contextType = MediaModalContext;
