import React, { Component, createRef } from "react";
import AudioTile from "./tiles/AudioTile";
import VideoTile from "./tiles/VideoTile";
import callingStyles from "./participant_calling.module.css";
import footerStyles from "./participant_footer.module.css";
import "../dropDownCall.css"

export default class LobbyCall extends Component {
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
        this.setState({ videoContainerWidth, videoContainerHeight });
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
        // let participants = { ...this.props.participants };
        let participants = { ...this.props.proximityUserList };
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
                        )
                    }
                    self={session_id === this.props.session_id}
                    cancelRequest={this.giveUpAccess}
                />
            );
        });

        return (
            <div
                className={`${callingStyles.callingBox__inner} ${callingStyles.callingBox__inner10}`}
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
        // let participants = { ...this.props.participants };
        let participants = { ...this.props.proximityUserList };

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


    render() {

        return (
            <>
                {/* {this.getVideoTiles()} */}
                {
                    this.props.participants &&
                    this.getAudioTiles()
                }
            </>
        );
    }
}
