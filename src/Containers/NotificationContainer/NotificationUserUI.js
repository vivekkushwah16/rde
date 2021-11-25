import React, { useContext, useEffect, useState } from 'react'
import { NotificationContext } from '../../Context/Notification/NotificationContextProvider';

export default function NotificationUserUI({ onPlatform }) {
    const { notificationState, updateLastSeenNotification } = useContext(NotificationContext);
    const [loading, setLoading] = useState(false);
    let notificationValues = Object.values(notificationState[onPlatform ? "platform_notifications" : "notifications"]).reverse()
    const [lastNotification, setLastNotification] = useState(null)

    useEffect(() => {
        if (notificationState[onPlatform ? "platform_lastSeenNotification" : "lastSeenNotification"]) {
            setLastNotification(notificationState[onPlatform ? "platform_lastSeenNotification" : "lastSeenNotification"])
        }
    }, [])

    useEffect(() => {
        if (notificationValues.length > 0) {
            updateLastSeenNotification(notificationValues[0], onPlatform)
        }
    }, [notificationState[onPlatform ? "platform_notifications" : "notifications"]])

    return (
        <div className="communityBox__body">
            <div className="poll-form-container">
                {loading && <div style={{ marginTop: "1rem" }}>Please wait...</div>}

                {notificationState[onPlatform ? "platform_notifications" : "notifications"] && (
                    notificationValues.length > 0 ? (
                        notificationValues.map((data, index) => (
                            <div key={data.id} className="poll-form poll-form-data">
                                <p
                                    style={{
                                        paddingTop: "10px",
                                        marginBottom: "10px",
                                        fontWeight: `${lastNotification ? (new Date(lastNotification.publishedat).getTime() < new Date(data.publishedat).getTime() ? '600' : '400') : '600'}`,
                                    }}
                                >
                                    {data.message}
                                </p>
                                <div className="not-time-container">
                                    {
                                        data.publishedat &&
                                        <p style={{ marginTop: '5px' }}> {new Date(data.publishedat).toLocaleString()} </p>
                                    }
                                </div>
                            </div>
                        ))
                    )
                        : (
                            <p
                                style={{
                                    paddingTop: "10px",
                                    marginBottom: "10px",
                                    fontWeight: 600,
                                }}
                            >
                                {'No notifications yet.'}
                            </p>
                        )
                )
                }
            </div>
        </div>
    )
}
