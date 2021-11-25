import React from 'react'
import { useEffect, useRef, useState } from 'react';
import Lottie from 'react-lottie-player'
import $ from 'jquery';
import "./map.css";

export default function Map({ sceneId }) {

    const map = useRef(null);
    const enterSubMapMenu = useRef(null);
    const mapSegments = useRef(null);
    const mapMenu = useRef(null);
    const lastSegmentSelected = useRef(0);
    const [mapLottieSegments, setMapSegments] = useState([0, 31]);
    const [mapLottiePlay, setMapLottiePlay] = useState(false);

    useEffect(() => {
        $("#mapBtn").mouseover(function () {
            setMapSegments([0, 31]);
            setMapLottiePlay(true);

        });
        $("#mapBtn").mouseout(function () {
            setMapSegments([31, 60]);
            setMapLottiePlay(true);
        });
    }, [])
    useEffect(() => {
        if (sceneId == "lobby") {
            mapSegmentSelected(0);
        }else if (sceneId == "library") {
            mapSegmentSelected(6);
        }
    }, [sceneId])
    

    const openMap = () => {
        if (map.current)
            map.current.classList.add("active");
        // playSoundOneShot("secondaryBtn.wav");
    }
    const closeMap = () => {
        if (map.current)
            map.current.classList.remove("active");
        // playSoundOneShot("secondaryBtn.wav");
    }
    const mapEnterScene = () => {
        console.log(sceneId);
        if (sceneId == "lobby") {
            if (lastSegmentSelected.current == 0) {
                //MainArea
                if (typeof window.parent.teleportMyPlayer !== "undefined")
                    window.parent.teleportMyPlayer(25, 4);
            } else if (lastSegmentSelected.current == 1) {
                //Lounge
                if (typeof window.parent.teleportMyPlayer !== "undefined")
                    window.parent.teleportMyPlayer(30, 25);
            } else if (lastSegmentSelected.current == 2) {
                //Bar
                if (typeof window.parent.teleportMyPlayer !== "undefined")
                    window.parent.teleportMyPlayer(30, -19);
            } else if (lastSegmentSelected.current == 3) {
                //Plenary
                if (typeof window.parent.connectToVideocallRoom !== "undefined") //REACT_CHANGES
                    window.parent.connectToVideocallRoom("zs1");
            } else if (lastSegmentSelected.current == 4) {
                //Breakout
                if (typeof window.parent.connectToVideocallRoom !== "undefined") //REACT_CHANGES
                    window.parent.connectToVideocallRoom("zs4");
            } else if (lastSegmentSelected.current == 5) {
                //Negotiation
                if (typeof window.parent.connectToVideocallRoom !== "undefined") //REACT_CHANGES
                    window.parent.connectToVideocallRoom("zs3");
            } else if (lastSegmentSelected.current == 6) {
                //Library
                if (typeof window.parent.switchScene !== "undefined") //REACT_CHANGES
                    window.parent.switchScene("library");
            }
        } else if (sceneId == "library") {
            if (lastSegmentSelected.current == 0) {
                //MainArea
                window.localStorage.setItem("lobbySpawning", "mainArea");
                if (typeof window.parent.switchScene !== "undefined") //REACT_CHANGES
                    window.parent.switchScene("lobby");
            } else if (lastSegmentSelected.current == 1) {
                //Lounge
                window.localStorage.setItem("lobbySpawning", "lounge");
                if (typeof window.parent.switchScene !== "undefined") //REACT_CHANGES
                    window.parent.switchScene("lobby");
            } else if (lastSegmentSelected.current == 2) {
                //Bar
                window.localStorage.setItem("lobbySpawning", "bar");
                if (typeof window.parent.switchScene !== "undefined") //REACT_CHANGES
                    window.parent.switchScene("lobby");
            } else if (lastSegmentSelected.current == 3) {
                //Plenary
                if (typeof window.parent.connectToVideocallRoom !== "undefined") //REACT_CHANGES
                    window.parent.connectToVideocallRoom("zs1");
            } else if (lastSegmentSelected.current == 4) {
                //Breakout
                if (typeof window.parent.connectToVideocallRoom !== "undefined") //REACT_CHANGES
                    window.parent.connectToVideocallRoom("zs4");
            } else if (lastSegmentSelected.current == 5) {
                //Negotiation
                if (typeof window.parent.connectToVideocallRoom !== "undefined") //REACT_CHANGES
                    window.parent.connectToVideocallRoom("zs3");
            } else if (lastSegmentSelected.current == 6) {
                //Library
            }
        }
        closeMap();

    }
    const mapSegmentSelected = (z) => {

        if (lastSegmentSelected.current != null) {
            if (mapMenu.current)
                mapMenu.current.children[lastSegmentSelected.current].classList.remove("activeSubMenu");
            mapSegments.current.children[lastSegmentSelected.current].classList.remove("activateOpacity");
        }
        // if (currentSceneNo == z) {
        //     // enterMenuText.innerHTML = "You are here";
        //     if(enterSubMapMenu.current)
        //         enterSubMapMenu.current.classList.add("inactive");
        // }
        // else {
        if (enterSubMapMenu.current)
            enterSubMapMenu.current.classList.remove("inactive");
        // }
        if (mapSegments.current)
            mapSegments.current.children[z].classList.add("activateOpacity");
        if (mapMenu.current)
            mapMenu.current.children[z].classList.add("activeSubMenu");
        lastSegmentSelected.current = z;
    }

    return (
        <>
            <div id="mapBtn" className={"myBtn"} onClick={openMap}
                style={{ position: "absolute", bottom: "2.7rem", left: "9rem", zIndex: "0", cursor: "pointer", width: "2rem", height: "2rem" }}>
                <Lottie id="mapLottie" play={mapLottiePlay} segments={mapLottieSegments} path={"assets/lottie/Map.json"} speed={2} loop={false}
                    style={{ pointerEvents: "none" }} />

            </div>

            <div id="map" ref={map}>
                <div id="mapChild">
                    <span className={"introHeadingText"}>
                        <img src="assets/images/goBack.svg" id="crossMapBtn" className="myBtn" onClick={closeMap} />
                        Experience <br />Map<span className={"introSubHeadingText"} ></span></span>

                    <img src={"assets/images/NA_Map/mapTile.png"} id="mapTile" />
                    <div id="mapSegments" ref={mapSegments}>
                        <img className={"activateOpacity"} src={"assets/images/NA_Map/1.png"}
                            style={{ position: "absolute", width: "100%", opacity: "0", transition: "500ms" }} />
                        <img src={"assets/images/NA_Map/2.png"} style={{ position: "absolute", width: "100%", opacity: "0", transition: "500ms" }} />
                        <img src={"assets/images/NA_Map/3.png"} style={{ position: "absolute", width: "100%", opacity: "0", transition: "500ms" }} />
                        <img src={"assets/images/NA_Map/4.png"} style={{ position: "absolute", width: "100%", opacity: "0", transition: "500ms" }} />
                        <img src={"assets/images/NA_Map/5.png"} style={{ position: "absolute", width: "100%", opacity: "0", transition: "500ms" }} />
                        <img src={"assets/images/NA_Map/6.png"} style={{ position: "absolute", width: "100%", opacity: "0", transition: "500ms" }} />
                        <img src={"assets/images/NA_Map/7.png"} style={{ position: "absolute", width: "100%", opacity: "0", transition: "500ms" }} />
                    </div>


                    <div id="mapMenu" ref={mapMenu}>
                        <div className={"subMapMenu activeSubMenu"} onClick={() => { mapSegmentSelected("0") }}>
                            <div className="circleMap"></div>
                            <span className="mapText" >Main Area</span>
                        </div>
                        <div className="subMapMenu" onClick={() => { mapSegmentSelected("1") }}>
                            <div className="circleMap"></div>
                            <span className="mapText">Lounge</span>
                        </div>
                        <div className="subMapMenu" onClick={() => { mapSegmentSelected("2") }}>
                            <div className="circleMap" ></div>
                            <span className="mapText">Bar</span>
                        </div>
                        <div className="subMapMenu" onClick={() => { mapSegmentSelected("3") }}>
                            <div className="circleMap" ></div>
                            <span className="mapText">Plenary</span>
                        </div>
                        <div className="subMapMenu" onClick={() => { mapSegmentSelected("4") }}>
                            <div className="circleMap"></div>
                            <span className="mapText">Negotiation Rooms</span>
                        </div>
                        <div className="subMapMenu" onClick={() => { mapSegmentSelected("5") }}>
                            <div className="circleMap" ></div>
                            <span className="mapText">Breakout Rooms</span>
                        </div>
                        <div className="subMapMenu" onClick={() => { mapSegmentSelected("6") }}>
                            <div className="circleMap" ></div>
                            <span className="mapText">Library</span>
                        </div>
                        <div id="enterSubMapMenu" ref={enterSubMapMenu} className="inactive" onClick={mapEnterScene}>
                            <img style={{ height: "4.5rem" }} src="assets/svg/enter.svg" />

                        </div>

                    </div>


                </div>
            </div>
        </>
    )
}
