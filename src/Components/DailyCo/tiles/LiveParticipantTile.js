import { Component } from "react";

export default class LiveParticipantTile extends Component {
  constructor(props) {
    super(props);
    this.state = { hover: false };
  }

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

  renderTile = (session_id, participant, self = false) => {
    // Empty slot
    if (!session_id || !participant) {
      return (
        <div
          className={`${this.props.callingStyles.callingBox__translator} ${this.props.callingStyles.inactive}`}
        >
          <div
            className={this.props.callingStyles.callingBox__translator_thumb}
          />
          <p className={this.props.callingStyles.callingBox__translator_name}>
            Empty Slot
          </p>
        </div>
      );
    }

    return (
      <div
        className={this.props.callingStyles.callingBox__translator}
        onMouseEnter={() => this.setState({ hover: true })}
        onMouseLeave={() => this.setState({ hover: false })}
      >
        <div
          className={this.props.callingStyles.callingBox__translator__live}
          style={{ textAlign: "left", paddingLeft: "1rem" }}
          // style={!self ? { cursor: "pointer" } : {}}
        >
          <span>Live</span>
        </div>
        {/* {!self && ( */}
        <button
          className="dots-btn"
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            padding: "0.25rem",
            fontSize: "1.25rem",
            color: "white",
            background: "transparent",
            border: "medium none",
            cursor: "pointer",
          }}
          onClick={() => {
            this.props.adminControls.toggleAccess(session_id);
          }}
        >
          <i className="icon-times" />
        </button>
        {/* )} */}

        <div className={this.props.callingStyles.callingBox__translator_thumb}>
          {participant &&
            participant.user_name &&
            this.getNameAbbreviation(participant.user_name)}
        </div>
        <p className={this.props.callingStyles.callingBox__translator_name}>
          {participant?.user_name}
          {self && " (Me)"}
        </p>
        {!self && this.state.hover && (
          <div
            style={{ height: "60%", marginTop: "20%" }}
            className={`${this.props.callingStyles.over_buttons} ${this.props.callingStyles.over_buttons__center}`}
          >
            <div className={this.props.callingStyles.over_buttons__inner}>
              <button
                onClick={() =>
                  this.props.adminControls.toggleCam(session_id, participant)
                }
              >
                <i
                  className={
                    this.props.participant?.video
                      ? "icon-video-btn-filled"
                      : "icon-video-btn-filled-mute icon-btn--mute"
                  }
                />
              </button>
              <button
                onClick={() =>
                  this.props.adminControls.toggleMic(session_id, participant)
                }
              >
                <i
                  className={
                    this.props.participant?.audio
                      ? "icon-mic-btn2"
                      : "icon-mic-btn2-mute icon-btn--mute"
                  }
                />
              </button>
              <button
                onClick={() =>
                  this.props.adminControls.toggleScreen(session_id, participant)
                }
              >
                <i
                  className={
                    this.props.participant?.screen
                      ? "icon-screen-share1 icon-btn--active"
                      : "icon-screen-share1"
                  }
                />
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  render() {
    const { session_id, participant, self, callingStyles } = this.props;
    return this.renderTile(session_id, participant, self);
  }
}
