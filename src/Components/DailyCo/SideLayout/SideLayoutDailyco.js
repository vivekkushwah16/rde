import React, { Component, createRef } from "react";
import ReactTooltip from "react-tooltip";
import swal from "sweetalert";
import { ContentType } from "../../../Containers/MediaModal/MediaModal";
import { MediaModalContext } from "../../../Context/MediaModal/MediaModalContextProvider";
import DailyCoSettings from "../settings/DailyCoSettings";
import AudioTile from "../tiles/AudioTile";
import VideoTile from "../tiles/VideoTile";
import arrowSvg from "../../../Assets/svg/arrow.svg"
import callingStyles from "./participant_calling.module.css";
import footerStyles from "./participant_footer.module.css";
import "../dropDownCall.css"

export default class SideLayoutDailyco extends Component {
    constructor(props) {
        super(props);
        this.state = {
            intervalObj: null,
            videoContainerWidth: 0,
            videoContainerHeight: 0,
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
        let particiapntKey = Object.keys(participants)
        Object.values(participants).forEach((participant, index) => {
            let session_id = participant.session_id;
            videoTiles.push(
                <VideoTile
                    key={session_id}
                    participant={participant}
                    tileIndex={index}
                    totalVideoTiles={particiapntKey.length}
                    isAudioOn={this.props.isAudioOn}
                    videoStyle={callingStyles}
                    getTileSize={() =>
                        this.calculateVideoTileSize(
                            particiapntKey.length,
                            // tileWidth,
                            // tileHeight,
                            screenShare
                        )
                    }
                    self={session_id === this.props.session_id}
                    cancelRequest={this.giveUpAccess}
                />
            );
            // if (
            //     participant.tracks &&
            //     participant.tracks.video &&
            //     participant.tracks.video.state === "playable"
            // ) {
            //     participantsWithTile.push(participant);
            // }
        });

        let screenShareTileHeight = this.state.videoContainerHeight / 4.0;
        let screenShareTileWidth = (screenShareTileHeight * 4.0) / 3.0;
        return (
            <div
                className={`${callingStyles.callingBox__inner} ${callingStyles.callingBox__inner10}`}
                style={
                    screenShare
                        ? particiapntKey.length <= 4
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
                        :
                        (particiapntKey.length >= 4 ? { justifyContent: "unset" } : {})
                }
                ref={this._videoContainer}
            >
                {videoTiles}
            </div>
        );


        // let participantsWithTile = [];
        // Object.values(participants).forEach((participant) => {
        //     if (
        //         participant.tracks &&
        //         participant.tracks.video &&
        //         participant.tracks.video.state === "playable"
        //     ) {
        //         participantsWithTile.push(participant);
        //     }
        // });

        // if (participantsWithTile.length > 0) {
        //     participantsWithTile.forEach((participant, index) => {
        //         let session_id = participant.session_id;
        //         videoTiles.push(
        //             <VideoTile
        //                 key={session_id}
        //                 participant={participant}
        //                 tileIndex={index}
        //                 totalVideoTiles={participantsWithTile.length}
        //                 isAudioOn={this.props.isAudioOn}
        //                 videoStyle={callingStyles}
        //                 getTileSize={() =>
        //                     this.calculateVideoTileSize(
        //                         participantsWithTile.length,
        //                         // tileWidth,
        //                         // tileHeight,
        //                         screenShare
        //                     )
        //                 }
        //                 self={session_id === this.props.session_id}
        //                 cancelRequest={this.giveUpAccess}
        //             />
        //         );
        //     });
        // } else {
        //     return (
        //         <div
        //             className={`${callingStyles.callingBox__inner} ${callingStyles.callingBox__inner10}`}
        //             style={{ color: "white", fontSize: "2rem" }}
        //         >
        //             Please wait for the host to start this session
        //         </div>
        //     );
        // }

        // let screenShareTileHeight = this.state.videoContainerHeight / 4.0;
        // let screenShareTileWidth = (screenShareTileHeight * 4.0) / 3.0;

        // if (participantsWithTile.length === 0) screenShareTileWidth = 0;

        // return (
        //     <div
        //         className={`${callingStyles.callingBox__inner} ${callingStyles.callingBox__inner10}`}
        //         style={
        //             screenShare
        //                 ? participantsWithTile.length <= 4
        //                     ? {
        //                         width: `${screenShareTileWidth}px`,
        //                         flexDirection: "column",
        //                         justifyContent: "start",
        //                     }
        //                     : {
        //                         width: `${2 * screenShareTileWidth}px`,
        //                         flexDirection: "row",
        //                         alignItems: "start",
        //                         alignContent: "start",
        //                         justifyContent: "start",
        //                     }
        //                 : {}
        //         }
        //         ref={this._videoContainer}
        //     >
        //         {videoTiles}
        //     </div>
        // );
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
                    participant.tracks.video.state !== "playable")
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
                    onlyAudio
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
                    participant.tracks.video.state !== "playable")
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

                <section
                    className={`${callingStyles.callingBox} ${this.props.is3D ? callingStyles.callingBox3d : ""
                        } ${this.props.showSidebar ? `${callingStyles.active_sidebar}` : ""} ${!this.props.isCallVisible ? 'd-none' : ''}`}
                    style={this.props.UIContext.isMenuOpen ? { right: "30.625rem" } : { right: "0" }}
                >
                    <div
                        className="conference-container"
                        style={
                            { position: "relative", overflow: "hidden" }
                        }
                    >
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
                        >
                            <div
                                className={`${callingStyles.callingBox__body} ${this.props.screenSharingParticipant.length > 0 ||
                                    this.props.isScreenSharing
                                    ? `${callingStyles.has_shared_video}`
                                    : ""
                                    }`}
                            >

                                {(this.props.screenSharingParticipant.length > 0 ||
                                    this.props.isScreenSharing) &&
                                    this.props.getScreenTile(callingStyles)}

                                {this.getVideoTiles()}

                                {/* <div
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
                                > */}
                                {
                                    this.props.participants &&
                                    this.getAudioTiles()
                                }
                                {/* </div> */}
                            </div>
                        </div>
                    </div>
                    {/*  / footerBox \ */}
                    <footer
                        className={`${footerStyles.footerBox} ${this.props.is3D ? footerStyles.footerBox_grad : ""
                            } text-center`}
                    >
                        <ul className={footerStyles.footerBox__buttons_list}>
                            {this.props.hasJoinedCall && (
                                <>
                                    {/* <li>
                                        <button
                                            className="icon-btn"
                                            onClick={() => this.showSettings()}
                                            disabled={!this.props.hasJoinedCall}
                                        >
                                            <i className="icon-settings" />
                                        </button>
                                    </li> */}
                                    {!isTranslator &&

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
                                                        <div className="dropdown_call_option_container">
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
                                            {/* <li>
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
                                            </li> */}
                                        </>
                                    }
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
                                    {/* {!isTranslator && (
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
                                    )} */}
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
                    </footer>
                    {/*  \ footerBox / */}
                </section>
                {/*  \ calling box / */}
            </>
        );
    }
}

SideLayoutDailyco.contextType = MediaModalContext;
