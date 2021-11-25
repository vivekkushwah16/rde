import React, { useContext, useEffect, useState } from "react";
import { POLL_STATES } from "../../Constants/PollStates";
import { PollUser } from "../../Components/Poll";
import { UserContext } from "../../Context/Auth/UserContextProvider";
import { PollManager } from "../../Managers/PollManager";

import "./PollContainer.css";
import PollAdminUI from "./PollAdminUI";

export default function SocketPollContainer(props) {
    const { id: eventId, isPollUser } = props;
    const { user } = useContext(UserContext);

    return (
        <>
            {!isPollUser ? (
                <PollAdminUI eventId={eventId} />
            ) : (
                <PollUser
                    eventId={eventId}
                />
            )}
        </>
    );
}