import React from 'react'
import Lottie from 'react-lottie-player'

export default function IconTutorial({tutorialID}) {

    const continueBtn=()=>{
        tutorialID.current.classList.add("exitScreen");
    };

    return (
        <div id="iconTutorialScreen" ref={tutorialID} className="font screen dfccc exitScreen">
            <div className="vignette"></div>
            <span style={{ fontSize: "1.5rem" }} id="iconTutorialText">Let’s take you through the UI options we have</span>
            <img src="assets/svg/continue.svg" className="myBtn" style={{ width: "auto", height: "8rem", paddingTop: "0.75rem" }}
                id="iconTutorialScreenBtn" onClick={continueBtn} />

            <div id="iconTutorialNetwork"></div>
            <div id="iconTutorialNetworkRound"></div>
            <span id="iconTutorialNetworkText">Menu</span>
            {/* <img src="assets/svg/menu.svg" style={{
                position: "absolute",
                left: "2.1rem",
                top: "2.5rem",
                cursor: "pointer", pointerEvents: "none"
            }} /> */}

            <div id="iconTutorialAgenda"></div>
            <div id="iconTutorialAgendaRound"></div>
            <span id="iconTutorialAgendaText">Agenda</span>
            <img src="assets/svg/agenda_svg.svg" style={{
                position: "absolute",
                left: "2rem",
                bottom: "2.15rem",
                width: "1.75rem",
                cursor: "pointer", pointerEvents: "none"
            }} />

            <div id="iconTutorialSound"></div>
            <div id="iconTutorialSoundRound"></div>
            <span id="iconTutorialSoundText">Sound</span>
            <div style={{ position: "absolute", bottom: "2rem", left: "5.5rem", zIndex: "0", cursor: "pointer", width: "2rem", height: "2rem", pointerEvents: "none" }}>
                <Lottie path={"assets/lottie/Audio.json"} background="transparent" speed={1} style={{ pointerEvents: "none" }}>
                </Lottie>
            </div>

            <div id="iconTutorialMap1"></div>
            <div id="iconTutorialMap1Round"></div>
            <span id="iconTutorialMap1Text">Map</span>
            <div style={{ position: "absolute", bottom: "2.7rem", left: "9rem", zIndex: "0", cursor: "pointer", width: "2rem", height: "2rem", pointerEvents: "none" }}>
                <Lottie path={"assets/lottie/Map.json"} background="transparent" speed={1} style={{ pointerEvents: "none" }}>
                </Lottie>
            </div>

            <div id="iconTutorialMap"></div>
            <div id="iconTutorialMapRound"></div>
            <span id="iconTutorialMapText">Networking Menu</span>
           
        </div>
    )
}
