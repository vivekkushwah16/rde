import React, { useContext, useEffect, useRef, useState } from 'react'
import { HandRaiseVideoCallContext } from '../../../Context/Chat/ChatContextProvider';
import { NotificationContext } from '../../../Context/Notification/NotificationContextProvider'
import notificationCss from "./notification.module.css"

const Notification_TIMER = 10 * 1000;

export default function FooterNotification() {
    const { notificationState } = useContext(NotificationContext)
    const { handRaise } = useContext(HandRaiseVideoCallContext)
    const [activeNotification, setActiveNotification] = useState(null)
    const timerRef = useRef(null)
    // const setNewNotification = (val) => {
    //     // console.log(val.publishedat)
    //     let timeSinceNotification = Math.abs(new Date().getTime() - new Date(val.publishedat).getTime())
    //     // console.log(timeSinceNotification)
    //     if (timeSinceNotification < Notification_TIMER) {
    //         if (timerRef.current) {
    //             clearTimeout(timerRef.current)
    //         }
    //         setActiveNotification(val)
    //         setTimeout(() => {
    //             setActiveNotification(null)
    //         }, Math.abs(Notification_TIMER - timeSinceNotification))
    //     }
    // }

    // const checkForNotification = (not) => {
    //     let val = Object.values(not)
    //     if (val.length > 0) {
    //         if (activeNotification) {
    //             if (activeNotification.id !== val[val.length - 1].id && val[val.length - 1].ispublished) {
    //                 setNewNotification(val[val.length - 1])
    //             }
    //         } else {
    //             setNewNotification(val[val.length - 1])
    //         }
    //     }
    // }

    // useEffect(() => {
    //     if (notificationState.notifications) {
    //         checkForNotification(notificationState.notifications)
    //     }
    // }, [notificationState.notifications])

    // useEffect(() => {
    //     if (notificationState.platform_notifications) {
    //         checkForNotification(notificationState.platform_notifications)
    //     }
    // }, [notificationState.platform_notifications])

    useEffect(() => {
        setActiveNotification(notificationState.flashNotification)
        console.log(notificationState.flashNotification)
    }, [notificationState.flashNotification])

    return (
        <>
            {
                activeNotification &&
                <div className={`${notificationCss.footer_notification}`}>
                    <div className={`${notificationCss.blink}`}>
                    </div>
                    <p>
                        {activeNotification.message}
                    </p>
                </div>
            }
            {
                !activeNotification && handRaise?.active &&
                <div className={`${notificationCss.footer_notification}`}>
                    <h2>
                        ✋
                    </h2>
                    <p>
                        {` ${handRaise?.active?.name} ${handRaise?.active?.name !== 'You' ? 'has' : 'have'} raised hand`}
                    </p>
                </div>
            }
        </>
    )
}
