import React, { useEffect, useContext, useState, useRef, Component } from 'react'
import { UIContext } from '../../Context/UIContextProvider'
import "./threeDScene.css";
import "./sidePanel.css";
import "./tutorial.css";
import $ from 'jquery';
import IconTutorial from '../IconTutorial';
import NavTutorial from '../NavTutorial';
import Lottie from 'react-lottie-player'
import Map from '../Map';
import { UserContext } from '../../Context/Auth/UserContextProvider';
import MultiVideoCall from '../../Components/twilioVideoCall/MultiVideoCall';
import { ChatContext } from '../../Context/Chat/ChatContextProvider';
import FooterNotification from '../../Components/DailyCo/FooterNotification'
// import "./index.jsx";

export default function ThreeDScene() {
    const { currentScene, isMenuOpen, videocall } = useContext(UIContext)
    const { user } = useContext(UserContext)
    const { incallChatActive, setupInCallChat } = useContext(ChatContext)

    const [vCallSrc, setVCallSrc] = useState("");
    const [vCallDisplay, setVCallDisplay] = useState(false);
    const [inVideoCall, setInVideoCall] = useState(false);
    const [watermarkVisibility, setWatermarkVisibility] = useState(true);
    const [bgAudioSrc, setBgAudioSrc] = useState("assets/sounds/lobby_bg.mp3");
    const canBGScorePlay = useRef(false)
    const listenerAttached = useRef(false)
    const tutorialID = useRef(null)
    const welcomeAudio = useRef(null)
    const backgroundAudio = useRef(null)
    const soundState = useRef(true)
    const [soundLottieSegments, setSoundSegments] = useState([0, 31]);
    const [soundLottiePlay, setSoundLottiePlay] = useState(false);

    useEffect(() => {
        // window.localStorage.setItem("welcomeVO", "true");
        if (typeof (Storage) !== "undefined") {
            soundState.current = window.localStorage.getItem("soundVnA") == "false" ? false : true;

            if (!soundState.current) {
                mutePage();
                setSoundSegments([0, 31]);
                setSoundLottiePlay(true);
                window.localStorage.setItem("soundVnA", "false");
            }
            else {
                unmutePage();
                setSoundSegments([31, 60]);
                setSoundLottiePlay(true);
                window.localStorage.setItem("soundVnA", "true");
            }
        }

        window.parent.leaveCall = () => {
            // setVCallDisplay(false);
            // setVCallSrc("");
            if (typeof window.parent.setupInCallChat !== "undefined")
                window.parent.setupInCallChat(false);
        };
        // window.parent.sideChatButtonvCall=()=>{
        //     setVCallDisplay("block");
        // };
        window.parent.startCall = (id) => {
            console.log("room id: " + id);
            // setVCallSrc("/build/index.html?$" + id + "$");
            if (typeof window.parent.setupInCallChat !== "undefined")
                window.parent.setupInCallChat(true, "" + id);
        };
        window.parent.connectToVideocallRoomInformer = () => {
            console.log("INFORMER::::connecting to Videocall");
            muteSound();
        };
        window.parent.closeVideocallRoom = () => {
            console.log("INFORMER::::closing Videocall");
            // unmuteSound();
        };
        window.parent.joinvRoomInformer = () => {
            setWatermarkVisibility(false);
            console.log("INFORMER::::joining a vRoom");
            soundState.current=false;
            muteSound();
            setInVideoCall(true);
        };
        window.parent.leftvRoomInformer = () => {
            setWatermarkVisibility(true);
            console.log("INFORMER::::leaving a vRoom");
            // unmuteSound();
            setInVideoCall(false);
        };
        window.parent.loadingComplete = () => {
            setTimeout(() => {
                if (window.localStorage.getItem("welcomeVO") == "true") {
                    window.localStorage.setItem("welcomeVO", "false");
                    if (welcomeAudio.current)
                        welcomeAudio.current.play();
                    if (backgroundAudio.current)
                        backgroundAudio.current.play();
                }
                
                
            }, 1000);
        }
    }, []);

    useEffect(() => {
        if (currentScene.id == "lobby")
            setBgAudioSrc("assets/sounds/lobby_bg.mp3");
        else if (currentScene.id == "library")
            setBgAudioSrc("assets/sounds/library_bg.mp3");
        
        if(canBGScorePlay.current&&window.localStorage.getItem("welcomeVO") == "false")
            if(backgroundAudio.current)
                backgroundAudio.current.play();
        if (!soundState.current) 
            mutePage();
        else
            unmutePage();


        if (currentScene.id !== 'avatar' && !listenerAttached.current) {
            listenerAttached.current = true
            var $side_menu_trigger = $('#nav-trigger'),
                $content_wrapper = $('.main-content'),
                $navigation = $('header');

            //open-close lateral menu clicking on the menu icon
            $side_menu_trigger.on('click', function (event) {
                event.preventDefault();
                $side_menu_trigger.toggleClass('is-clicked');
                $navigation.toggleClass('menu-open');
                $content_wrapper.toggleClass('menu-open').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function () {
                    // firefox transitions break when parent overflow is changed, so we need to wait for the end of the trasition to give the body an overflow hidden
                    $('body').toggleClass('overflow-hidden');
                });
                $('#side-nav').toggleClass('menu-open');

                //check if transitions are not supported - i.e. in IE9
                if ($('html').hasClass('no-csstransitions')) {
                    $('body').toggleClass('overflow-hidden');
                }

            });

            //close lateral menu clicking outside the menu itself
            $content_wrapper.on('click', function (event) {
                if (!$(event.target).is('#menu-trigger, #menu-trigger span')) {
                    $side_menu_trigger.removeClass('is-clicked');
                    $navigation.removeClass('menu-open');
                    $content_wrapper.removeClass('menu-open').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function () {
                        $('body').removeClass('overflow-hidden');
                    });
                    $('#side-nav').removeClass('menu-open');
                    //check if transitions are not supported
                    if ($('html').hasClass('no-csstransitions')) {
                        $('body').removeClass('overflow-hidden');
                    }

                }
            });

            //open (or close) submenu items in the lateral menu. Close all the other open submenu items.
            $('.item-has-children').children('a').on('click', function (event) {
                event.preventDefault();
                $(this).toggleClass('submenu-open').next('.sub-menu').slideToggle(200).end().parent('.item-has-children').siblings('.item-has-children').children('a').removeClass('submenu-open').next('.sub-menu').slideUp(200);
            });
        }
    }, [currentScene])


    const muteSound = () => {
        // if (soundState.current) {
            mutePage();
            setSoundSegments([0, 31]);
            setSoundLottiePlay(true);
        // }
    }

    const unmuteSound = () => {
        // if (soundState.current) {
        //     unmutePage();
        //     setSoundSegments([31, 60]);
        //     setSoundLottiePlay(true);
        // }
    }

    const soundToggle = () => {
        soundState.current = !soundState.current;
        if (typeof window.parent.volumeSetKrdo !== "undefined")
            window.parent.volumeSetKrdo(soundState.current ? 1 : 0);
        
        if (!soundState.current) {
            mutePage();
            setSoundSegments([0, 31]);
            setSoundLottiePlay(true);
            window.localStorage.setItem("soundVnA", "false");
        }
        else {
            unmutePage();
            setSoundSegments([31, 60]);
            setSoundLottiePlay(true);
            window.localStorage.setItem("soundVnA", "true");
        }
    }

    const mutePage = () => {
        welcomeAudio.current.volume = 0;
        backgroundAudio.current.volume = 0;
    }

    const unmutePage = () => {
        welcomeAudio.current.volume = 1;
        backgroundAudio.current.volume = 0.1;
    }
    const playAudio = (e) => {
        if(canBGScorePlay.current&&window.localStorage.getItem("welcomeVO") == "false")
            e.target.play();
        // e.target.volume=0.1;
    }
    const openFAQ = (() => {
        if (typeof window.parent.openIframe !== "undefined")
            window.parent.openIframe('FAQs', 'https://storage.googleapis.com/djzs-bucket/NegotationAcademy/Pdfs/Virtual%20Negotiation%20Academy%20-%20Agenda.pdf', 'pdf');
    });

    const openSurveyForm = (() => {
        if (typeof window.parent.openIframe !== "undefined")
            window.parent.openIframe('Survey Form', '/surveyForm/index.html', 'iframe');
    });

    const agendaClick = (() => {
        if (typeof window.parent.openIframe !== "undefined")
            window.parent.openIframe("-", "https://storage.googleapis.com/djzs-bucket/NegotationAcademy/Pdfs/Virtual%20Negotiation%20Academy%20-%20Agenda.pdf", "pdf");
    });

    const connectToRoom = ((name) => {
        if (typeof window.parent.connectToVideocallRoom !== "undefined") //REACT_CHANGES
            window.parent.connectToVideocallRoom(name);
    });

    const sideMenuClick = (() => {
        //playSoundOneShot("secondaryBtn.wav");
        var $side_menu_trigger = $('#nav-trigger'),
        $content_wrapper = $('.main-content'),
        $navigation = $('header');
        $side_menu_trigger.toggleClass('is-clicked');
        $navigation.toggleClass('menu-open');
        $content_wrapper.toggleClass('menu-open').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function () {
            // firefox transitions break when parent overflow is changed, so we need to wait for the end of the trasition to give the body an overflow hidden
            $('body').toggleClass('overflow-hidden');
        });
        $('#side-nav').toggleClass('menu-open');

        //check if transitions are not supported - i.e. in IE9
        if ($('html').hasClass('no-csstransitions')) {
            $('body').toggleClass('overflow-hidden');
        }
    });

    const logoutKrdo = (() => {
        window.location = "https://idm.dev.zsservices.com/DJ/IdentityManager/app/Web/Logout.aspx?returnUrl=https%3A%2F%2Fnegotiation-academy.dev.zsservices.com";
    });

    const welcomeBtn = (() => {
        var welcomeScreen = document.getElementById("welcomeScreen");
        welcomeScreen.classList.add("gayab");
        // var iconTutorialScreen = document.getElementById("iconTutorialScreen");
        if (window.localStorage.getItem("welcomeVO") == "true") {
            setTimeout(function () {
                tutorialID.current.classList.add("animateTutorial");
                tutorialID.current.classList.remove("exitScreen");
            }, 100);
        }else{
            canBGScorePlay.current=true;
            if (backgroundAudio.current)
                backgroundAudio.current.play();
        }
    });

    const mainAreaBtn = () => {
        if (currentScene.id == "library") {
                window.localStorage.setItem("lobbySpawning","library");   
            if (typeof window.parent.switchScene !== "undefined")
                window.parent.switchScene("lobby");
        }else if (currentScene.id == "lobby"){
            if (typeof window.parent.teleportMyPlayer !== "undefined")
            window.parent.teleportMyPlayer(25, 4);
        }
    };

    const endCall = () => {
        if (typeof window.EndCall !== "undefined")
            window.EndCall();
    }

    return (
        <>
            {
                currentScene &&
                <div className="contentCntr">
                    <audio 
                    src={bgAudioSrc} 
                    ref={backgroundAudio} loop={true} 
                    onCanPlayThrough={playAudio}
                    ></audio>
                    <audio src={"assets/sounds/welcomeAudio.mp3"} ref={welcomeAudio} loop={false}></audio>

                    {/* Left Side Menu */}
                    <div className="sceneContainer" style={isMenuOpen ? { position: "relative" } : { position: "relative", width: '100vw' }}>
                        {/* {
                            user && incallChatActive && incallChatActive.status &&
                            <MultiVideoCall
                                showCall={vCallDisplay}
                                userName={user.displayName}
                                userId={user.uid}
                                room={{ "roomId": incallChatActive.roomId, "roomName": "InCallRoom", "roomParentId": 1 }}
                                onCallDisconnect={() => {
                                    console.log('call has been disconnected')
                                    setupInCallChat(false)
                                    setVCallDisplay(false)
                                    if(typeof window.parent.leavevRoomCallNow!=="undefined")
                                        window.parent.leavevRoomCallNow();
                                }}
                                // ref={this.videoCall}

                                updateRoomStatus={() => {
                                    console.log('updateRoomStatus')
                                }}
                                isOfficial={false}
                                liveRooms={[{ "id": 1, "name": "InCallRoom", "slots": [{ "id": incallChatActive.roomId, "available": true, "name": "InCallRoom", "userId": "", "adminID": [""] }] }]}
                                slotReset={() => {
                                    console.log('reset slot')
                                }}
                                showPopup={() => {
                                    console.log('showPopup')
                                }}
                                showBusyPopup={() => {
                                    console.log('showBusyPopup')
                                }}
                                showInfoPopUp={() => {
                                    console.log('showInfoPopUp')
                                }}
                            ></MultiVideoCall>
                        } */}
                        {/* <div className="sceneContainer" style={{ position: "relative" }}> */}
                        <iframe src={currentScene.src} title="scene" />
                        {/* <iframe src={vCallSrc} id="vCall" style={{ display: vCallDisplay }}></iframe> */}

                        {
                        <>
                        <header id="sideMenuHeader" style={{ display: currentScene.id != "avatar"&&!inVideoCall ? "block" : "none" }}>
                            <h1 id="site-title">
                            </h1>
                            <div id="nav-trigger" role="button">
                                <div className={"line l-01"}></div>
                                <div className={"line l-02"}></div>
                                <div className={"line l-03"}></div>
                            </div>

                        </header>

                        <nav id="side-nav" className="open-sans-font" style={{ display: currentScene.id != "avatar"&& !inVideoCall ? "block" : "none" }}>
                            <ul className="navigation">
                                <ul className="sub-menu" style={{ display: "block" }}>
                                    <li>
                                        <a href="#0" className="sidePanelBtn" onClick={() => { endCall(); mainAreaBtn(); sideMenuClick(); }}>Main Area</a>

                                    </li>
                                    <li><a href="#0" className="sidePanelBtn"
                                        onClick={() => { connectToRoom("zs1"); sideMenuClick(); }}
                                    >Plenary</a></li>
                                    <li><a href="#0" id="breakoutSideBtn" className="sidePanelBtn"
                                        onClick={() => { connectToRoom("zs3"); sideMenuClick(); }}
                                    >Breakout Room</a></li>
                                    <li><a href="#0" id="negotiationSideBtn" className="sidePanelBtn"
                                        onClick={() => { connectToRoom("zs4"); sideMenuClick(); }}
                                    >Negotiation Room</a></li>
                                    {
                                        currentScene.id!="library"&&
                                        <li><a href="#0" id="negotiationSideBtn" className="sidePanelBtn"
                                            onClick={() => { endCall(); window.parent.switchScene("library"); sideMenuClick(); }}
                                        >Library</a></li>
                                    }
                                    <li style={{ paddingTop: "1rem", opacity: "0.5" }}>_____________________</li>
                                    <li><a href="#0" id="negotiationSideBtn" className="sidePanelBtn"
                                        onClick={() => { endCall(); window.parent.switchScene("avatar"); sideMenuClick(); }}
                                    >Edit Your Avatar</a></li>
                                    {/* <li><a href="#0" className="sidePanelBtn"
                                        onClick={() => { openSurveyForm(); sideMenuClick(); }}
                                    >Survey Form</a></li> */}
                                    <li>
                                        <a href={"mailto:immersivedesign@zs.com"} className="sidePanelBtn">Contact Us</a>
                                    </li>
                                    <li><a href="#0" className="sidePanelBtn"
                                        onClick={() => { openFAQ(); sideMenuClick(); }}
                                    >FAQs</a></li>




                                    {/* <li><a href="#0" className="sidePanelBtn" onClick={logoutKrdo}>Logout</a></li> */}

                                </ul>
                                <img src="/assets/svg/logout.svg" className="myBtn" style={{ paddingBottom: "20px", width: "60%", marginBottom: "10px" }} onClick={logoutKrdo}></img>
                            </ul>
                        </nav>
                        </>
                        }
                        {
                            currentScene.id != "avatar" &&
                            <>
                                <img id="calender" className="myBtn " src="/assets/svg/agenda_svg.svg" onClick={agendaClick}></img>
                                {
                                    <div id="soundBtn" className="myBtn" onClick={soundToggle}
                                        style={{ position: "absolute", bottom: "2rem", left: "5.5rem", zIndex: "0", cursor: "pointer", width: "2rem", height: "2rem" }}>
                                        <Lottie id="soundLottie" path={"assets/lottie/Audio.json"} play={soundLottiePlay} segments={soundLottieSegments} loop={false}
                                            style={{ pointerEvents: "none" }} />

                                    </div>
                                }
                                {
                                    !inVideoCall&&
                                    <Map sceneId={currentScene.id} />
                                }
                                {
                                    !videocall &&
                                    <div style={{
                                        position: "absolute",
                                        bottom: "1.5rem",
                                        left: "12rem",
                                        zIndex: "0",
                                        cursor: "pointer",
                                        height: "2rem",
                                    }}>
                                        <FooterNotification />
                                    </div>
                                }

                                <span id="watermark" className="font" style={{ display: watermarkVisibility ? "block" : "none" }}>Negotiation
                                    Academy a <u>ZS Virtual Experience™</u></span>
                                <NavTutorial />
                                <IconTutorial tutorialID={tutorialID} />
                                <div id="welcomeScreen">
                                    <img src="/assets/images/welcomeScreen.png" />
                                    <img src="/assets/images/enterBtn.png" onClick={welcomeBtn} id="welcomeBtn" />
                                </div>
                            </>
                        }
                    </div>
                    {/* audio button & Agenda Button*/}
                    {/* audio */}
                </div>
            }
        </>
    )
}
