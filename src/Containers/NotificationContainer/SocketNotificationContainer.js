import React, { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../../Context/Auth/UserContextProvider";
import { NotificationManager } from "../../Managers/NotificationManager";
import NotificationAdminUI from "./NotificationAdminUI";
import NotificationUserUI from "./NotificationUserUI";

export default function SocketNotificationContainer(props) {
    const { id: eventId, isAdmin, onPlatform } = props;

    return (
        <>
            {isAdmin ? (
                <NotificationAdminUI eventId={eventId} onPlatform={onPlatform} />
            ) : (
                <NotificationUserUI eventId={eventId} onPlatform={onPlatform} />
            )}
        </>
    );
}
