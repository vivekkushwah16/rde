import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Forms } from "../Components/NegotiationFormComponents/Forms";
import { formsData, formsData1, formsData2, formsData3 } from "../Constants/NegotiationFormData/FormsData";
import { ContentType } from "../Containers/MediaModal/MediaModal";
import { firestore } from "../Firebase";
import { NotificationManager } from "../Managers/NotificationManager";
import { UserContext } from "./Auth/UserContextProvider";
import { MediaModalContext } from "./MediaModal/MediaModalContextProvider";
import RenderPerspective from "../Components/RenderPerspective";


export const UIContext = createContext(null);

export const MenuStates = {
    participants: 1,
    publicChat: 2,
    polls: 3,
    notification: 4,
};

export const DEFAULT_ROOM_NAME = "call-room-test"

export const SCENE_DATA = {
    "avatar": {
        id: "avatar",
        src: "/avatar/index.html",
    },
    "lobby": {
        id: "lobby",
        src: "/3dScene/index.html",
    },
    "library": {
        id: "library",
        src: "/library/index.html",
    }
}

export const PossibleFormData = {
    "form-1": {
        formid: "form-1",
        formsData: formsData1
    },
    "form-2": {
        formid: "form-2",
        formsData: formsData2
    },
    "form-3": {
        formid: "form-3",
        formsData: formsData3
    },
}


export const UIContextProvider = (props) => {
    const [isMenuOpen, toggleMenuOpen] = useState(null); //MenuStates.participants
    const [activeMenu, setActiveMenu] = useState(null); //MenuStates.participants
    const [videocall, setVideocall] = useState(null)
    const [activeForm, setActiveForm] = useState(null)
    const [currentScene, setCurrentScene] = useState(SCENE_DATA.avatar)
    const userColorClassRecord = useRef(localStorage.getItem("participantColor") ? JSON.parse(localStorage.getItem("participantColor")) : {})

    const { showMediaModal, closeMediaModal, mediaModalStatus, modalDetails } = useContext(MediaModalContext)

    useMemo(() => {
        if (!localStorage.getItem('returingUser')) {
            window.localStorage.setItem("returingUser", "true");
            window.localStorage.setItem("tutorialDone", "false");
            window.localStorage.setItem("welcomeVO", "true");
        }
        if (localStorage.getItem('avatarDone') === 'true') {
            setCurrentScene(SCENE_DATA.lobby)
        }
    }, [])

    useEffect(() => {
        window.connectToVideocallRoom = connectToVideocallRoom;
        window.parent.connectToVideocallRoom = connectToVideocallRoom;
        window.parent.switchSceneInformer = updateScene;
        window.parent.openIframe = (iName, iUrl, iType) => {
            showMediaModal({
                type: iType,
                link: iUrl,
                name: iName
            })

            if (typeof window.parent.tutorialThreeCompleteHard !== "undefined")
                window.parent.tutorialThreeCompleteHard();
        };
        window.parent.closeMediaModal = closeMediaModal;
        // setTimeout(() => {
        //     showMediaModal({
        //         type: ContentType.Pdf,
        //         link: 'https://storage.googleapis.com/virtual-event-273009.appspot.com/ILEX/PDF/Charting_Course_High-Impact.pdf',
        //         name: "Charting Course High"
        //     })
        // }, 500)
        window.parent.activateSpecs = (flag) => {
            showMediaModal({ type: ContentType.FullComponent, component: RenderPerspective, data: { flag } })
        }
        setTimeout(() => {
            window.parent.activateSpecs()
        }, 500)

        window.parent.activateForm = (formid) => {
            if (PossibleFormData.hasOwnProperty(formid)) {
                setActiveForm(PossibleFormData[formid])
                showMediaModal({ type: ContentType.Component, component: Forms, data: PossibleFormData[formid] })
            }
        }
        window.parent.closeForm = (formid) => {
            setActiveForm(null)
        }
        // window.parent.activateForm('form-2')
    }, [])

    const getParticipantColorNumber = (id) => {
        // console.log(id)
        let mainObject = userColorClassRecord.current
        if (!mainObject.hasOwnProperty(id)) {
            let val = Math.floor(Math.random() * 3)
            mainObject[id] = val
            localStorage.setItem("participantColor", JSON.stringify(userColorClassRecord.current))
        }
        return mainObject[id]
    }

    const connectToVideocallRoom = (roomId = null, temporaryRoom = false, sideLayout = false) => {
        console.log(roomId, temporaryRoom, sideLayout)
        if (!roomId) {
            // setActiveMenu(MenuStates.participants)
        } else {
            if (typeof window.parent.connectToVideocallRoomInformer != "undefined")
                window.parent.connectToVideocallRoomInformer();
        }
        toggleMenuOpen(null)
        if (roomId) {
            if (sideLayout) {
                if (window.parent.closePrivateChatRoom)
                    window.parent.closePrivateChatRoom()
                setActiveMenu(MenuStates.participants)
            }
            setVideocall({
                roomId: roomId,//"test-ilex-room-1",//roomId,
                temporaryRoom,//temporaryRoom ? 'true' : 'false',
                sideLayout,
            })
            if (!sideLayout)
                if (typeof window.parent.hideInLobby != "undefined")
                    window.parent.hideInLobby()
        } else {
            setVideocall(null)
            if (typeof window.parent.showInLobby != "undefined")
                window.parent.showInLobby()
        }
    }

    const closeVideocallRoom = () => {
        connectToVideocallRoom()
    }

    const updateScene = (sceneId) => {
        if (SCENE_DATA.hasOwnProperty(sceneId)) {

            // if (sceneId == "library") {
            //     if (typeof window.parent.hideInLobby != "undefined")
            //         window.parent.hideInLobby();
            // } else if (sceneId == "lobby") {
            //     if (typeof window.parent.showInLobby != "undefined")
            //         window.parent.showInLobby();
            // }else{
            //     if (typeof window.parent.hideInLobby != "undefined")
            //     window.parent.hideInLobby();
            // }

            if (typeof window.parent.tutorialThreeCompleteHard !== "undefined")
                window.parent.tutorialThreeCompleteHard();
            console.log("switching scene to " + sceneId);
            // setTimeout(() => {
            setCurrentScene(SCENE_DATA[sceneId]);
            // }, 500);

        } else {
            console.error("No such scene exists: " + sceneId)
        }
    }

    const lastVal = useRef(MenuStates.participants)
    const toggleSideMenu = () => {
        // console.log("toggle"
        toggleMenuOpen(prev => !prev)
        setActiveMenu(prev => {
            // console.log(prev)
            if (prev === 0 || prev) {
                lastVal.current = prev
                // console.log("set null")
                return prev
            } else {
                // console.log("set prev")
                return lastVal.current ? lastVal.current : MenuStates.participants
            }
        })
    }

    const openSideMenu = (val = true) => {
        toggleMenuOpen(val)
        setActiveMenu(prev => {
            // console.log(prev)
            if (prev === 0 || prev) {
                lastVal.current = prev
                // console.log("set null")
                return prev
            } else {
                // console.log("set prev")
                return lastVal.current ? lastVal.current : MenuStates.participants
            }
        })
    }

    return (
        <UIContext.Provider value={{ isMenuOpen, toggleMenuOpen, openSideMenu, activeMenu, setActiveMenu, getParticipantColorNumber, videocall, connectToVideocallRoom, updateScene, currentScene, closeVideocallRoom, toggleSideMenu }}>
            {props.children}
        </UIContext.Provider>
    )
}