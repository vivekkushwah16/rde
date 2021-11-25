import React, { useEffect } from 'react'
import { useRef } from 'react'
import Lottie from 'react-lottie-player'

export default function NavTutorial() {

    const clickAndDrag = useRef(null)
    const clickAndMove = useRef(null)
    const arrowKeys = useRef(null)
    const tutorialDone = useRef(false)
    const timeout = useRef(null)

    useEffect(() => {
        window.parent.tutorialStart = () => {
            if (clickAndDrag.current.classList.contains("exitScreen"));
            clickAndDrag.current.classList.remove("exitScreen");
        };
        window.parent.tutorialOneComplete = () => {
            if (tutorialDone.current)
                return;
            if (!clickAndDrag.current.classList.contains("exitScreen"));
            clickAndDrag.current.classList.add("exitScreen");
            if (timeout.current)
                clearTimeout(timeout.current);
            timeout.current = setTimeout(() => {
                if (clickAndMove.current.classList.contains("exitScreen"));
                clickAndMove.current.classList.remove("exitScreen");
            }, 1000);
        };
        window.parent.tutorialTwoComplete = () => {
            if (tutorialDone.current)
                return;
            if (timeout.current)
                clearTimeout(timeout.current);
            if (!clickAndDrag.current.classList.contains("exitScreen"));
            clickAndDrag.current.classList.add("exitScreen");
            if (!clickAndMove.current.classList.contains("exitScreen"));
            clickAndMove.current.classList.add("exitScreen");
            timeout.current = setTimeout(() => {
                if (arrowKeys.current.classList.contains("exitScreen"));
                arrowKeys.current.classList.remove("exitScreen");
            }, 1000);
        };
        window.parent.tutorialThreeComplete = () => {
            console.log('Tutorial Complete!');
            if (tutorialDone.current)
                return;
            if (timeout.current)
                clearTimeout(timeout.current);
            tutorialDone.current = true;
            if (clickAndDrag.current !== null)
                if (!clickAndDrag.current.classList.contains("exitScreen"));
            clickAndDrag.current.classList.add("exitScreen");
            if (clickAndMove.current !== null)
                if (!clickAndMove.current.classList.contains("exitScreen"));
            clickAndMove.current.classList.add("exitScreen");
            if (arrowKeys.current !== null)
                if (!arrowKeys.current.classList.contains("exitScreen"));
            arrowKeys.current.classList.add("exitScreen");
            timeout.current = setTimeout(() => {
                if (clickAndDrag.current)
                    if (!clickAndDrag.current.classList.contains("exitScreen"));
                clickAndDrag.current.classList.add("exitScreen");
                if (clickAndMove.current && !clickAndMove.current.classList.contains("exitScreen"));
                clickAndMove.current.classList.add("exitScreen");
                if (arrowKeys.current && !arrowKeys.current.classList.contains("exitScreen"));
                arrowKeys.current.classList.add("exitScreen");
            }, 1100);
        };
        window.parent.tutorialThreeCompleteHard = () => {
            console.log('Tutorial Complete!');
            if (timeout.current)
                clearTimeout(timeout.current);
            // if(tutorialDone!=null)
            // if(tutorialDone.current==true)
            //     return;
            // console.log(clickAndDrag.current);

            var cnd = document.getElementById("clickAndDrag");
            if (cnd) {
                if (!cnd.classList.contains("exitScreen"));
                cnd.classList.add("exitScreen");
            }
            var cnm = document.getElementById("clickAndMove");
            if (cnm) {
                if (!cnm.classList.contains("exitScreen"));
                cnm.classList.add("exitScreen");
            }
            var ak = document.getElementById("arrowKeys");
            if (ak) {
                if (!ak.classList.contains("exitScreen"));
                ak.classList.add("exitScreen");
            }
            // if(clickAndDrag.current!==null&&clickAndDrag.current!=="null"&&clickAndDrag.current!=="undefined")
            //     if (!clickAndDrag.current.classList.contains("exitScreen"));
            //         clickAndDrag.current.classList.add("exitScreen");
            // if (clickAndMove.current!==null)
            //     if(!clickAndMove.current.classList.contains("exitScreen"));
            //         clickAndMove.current.classList.add("exitScreen");
            // if (arrowKeys.current!==null)
            //     if(!arrowKeys.current.classList.contains("exitScreen"));
            //         arrowKeys.current.classList.add("exitScreen");

            if (tutorialDone != null)
                tutorialDone.current = true;
            // setTimeout(() => {
            //     if(clickAndDrag.current)
            //     if (!clickAndDrag.current.classList.contains("exitScreen"));
            //     clickAndDrag.current.classList.add("exitScreen");
            //     if (clickAndMove.current&&!clickAndMove.current.classList.contains("exitScreen"));
            //     clickAndMove.current.classList.add("exitScreen");
            //     if (arrowKeys.current&&!arrowKeys.current.classList.contains("exitScreen"));
            //     arrowKeys.current.classList.add("exitScreen");
            // }, 1100);
        };
    }, [])

    return (
        <>
            <div id="clickAndDrag" ref={clickAndDrag} className="dfccc exitScreen" style={{ transition: "1000ms" }}>
                <div style={{ position: "absolute", bottom: "2.5rem", flexDirection: "column" }} className="dfccc">
                    <Lottie path={"assets/lottie/Drag.json"} style={{ height: "5rem" }} play={true} loop={true} />
                    <span className='font' style={{ color: "white" }}>Click and drag your mouse to explore</span>
                </div>
            </div>
            <div id="clickAndMove" ref={clickAndMove} className="dfccc exitScreen" style={{ transition: "1000ms" }}>
                <div style={{ position: "absolute", bottom: "2.5rem", flexDirection: "column" }} className="dfccc">
                    <Lottie path={"assets/lottie/Click.json"} style={{ height: "3rem", margin: "1rem" }} play={true} loop={true} />
                    <span className='font' style={{ color: "white" }}>Click on the floor to navigate</span>
                </div>
            </div>
            <div id="arrowKeys" ref={arrowKeys} className="dfccc exitScreen" style={{ transition: "1000ms" }}>
                <div style={{ position: "absolute", bottom: "2.5rem", flexDirection: "column" }} className="dfccc">
                    <img style={{ width: "13rem", margin: "1rem" }} src="/assets/svg/keys.svg" />
                    <span className='font' style={{ color: "white" }}>Use WASD keys to move around</span>
                </div>
            </div>
        </>
    )
}
