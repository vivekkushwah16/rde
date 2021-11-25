import { io, Socket } from "socket.io-client";
import { Endpoints } from "../Constants/EndPoints";

const LocalURL = "http://127.0.0.1:9000/"
const prodURL = 'https://api.rde.dev.zsservices.com'
let URL = prodURL;
if (window.location.href.includes('localhost')) {
    URL = LocalURL
}

export const USER_STATUS_VIDEOCALL = {
    "pending": "pending",
    "approved": "approved",
    "cancelled": "cancelled"
}

export const SOCKET_EVENT_NAMES = {
    "session": "session",
    "connect_error": "connect_error",
    "connect": "connect",
    "disconnect": "disconnect",
    "users": "users",
    "userpermissions": "userpermissions",
    "user connected": "user connected",
    "user disconnected": "user disconnected",
    "allParticipants": "allParticipants",
    "private message": "private message",
    "JoinToRoom": "JoinToRoom",
    "disconnectFromRoom": "disconnectFromRoom",
    "public messages": "public messages",
    "getPublicRoomMessages": "getPublicRoomMessages",
    "getPrivateRoomMessages": "getPrivateRoomMessages",
    "recentMessagesList": "recentMessagesList",
    "typingIndication": "typingIndication",
    "markAsSeen": "markAsSeen",
    "roomDetails": "roomDetails",
    "inCallMessaegs": "inCallMessages",
    "getRoomMembersDetails": "getRoomMembersDetails",
    "joinVideoCallRoom": "joinVideoCallRoom",
    "leftVideoCallRoom": "leftVideoCallRoom",
}

export const PRIVATE_MESSAGES_OPERTAION_TYPE = {
    "realAll": "readAll",
    "newMessages": "newMessages",
    "oldMessages": "oldMessages",
}

export const ADMIN_TYPE = {
    "globalAdmin": "globalAdmin",
    "roomAdmin": "roomAdmin",
    "facilitatorAdmin": "facilitatorAdmin",
    "translatorAdmin": "translatorAdmin",
}

export const PLATFORM_NOTIFICATION_ROOM = "platform-notification"

let subscriberFunctionList = []
let socketInstance = null

const initalizeSocket = (user, sessionid) => {
    // if (socketInstance) {
    //     return socketInstance
    // }

    // we do not want to connect immediately, we will connect after we set name, userid and sessionId
    const socket = io(URL, { autoConnect: false });

    //check fot session Id if user has already connect once with the server earlier
    let socketAuth = { name: user.displayName, userid: user.uid, sessionid };
    // const sessionID = localStorage.getItem("socket_sessionID");
    // if (sessionID) {
    //     socketAuth = {
    //         ...socketAuth,
    //         sessionID
    //     };
    // }
    socket.auth = socketAuth

    //connect with socket after all auth attributes are set
    console.log(socket.auth, "Ready to connect!!")
    socket.connect();
    socketInstance = socket;
    // console.log("Requested to connect!!")

    socket.on(SOCKET_EVENT_NAMES.userpermissions, permissions => {
        socket.auth = { ...socket.auth, permissions };
    })

    socket.on(SOCKET_EVENT_NAMES.connect, () => {
        // console.log("CONTECENADSASD", subscriberFunctionList)
        subscriberFunctionList.forEach(fun => fun(socketInstance))
    })

    //for listening to all the event(just for debugging in dev phase)
    // socket.onAny((event, ...args) => {
    //     if (event !== "playerMoved")
    //         console.log(event, args);
    // });

    //emitted by the server to share sessionId, after connection has been established.
    // socket.on(SOCKET_EVENT_NAMES.session, ({ sessionID, userid }) => {
    //     if (userid === user.uid && sessionID !== socketAuth.sessionID) {
    //         // attach the session ID to the next reconnection attempts
    //         socket.auth = { ...socketAuth, sessionID };
    //         // store it in the localStorage
    //         localStorage.setItem("socket_sessionID", sessionID);
    //     }
    // });

    socket.io.on("reconnect_attempt", () => {
        // console.log("reconnect_attempt");
    });

    socket.io.on("reconnect", () => {
        // console.log("reconnect");
    });
    window.socketRef = socket
    return socket
}

const joinRoom = (socket, roomName, isVideoCallRoom = false, eventName, eventHandler) => {
    socket.emit("JoinToRoom", roomName, isVideoCallRoom, (data) => {
        // console.log(data)
    });
    if (eventName)
        socket.on(eventName, eventHandler)
}

const leaaveRoom = (socket, roomName, isVideoCallRoom = false, eventName, eventHandler) => {
    socket.emit("disconnectFromRoom", roomName, isVideoCallRoom, (data) => {
        // console.log(data)
    });
    if (eventName)
        socket.off(eventName, eventHandler)
}

const subscribe_GetSocket = (functionRef) => {
    subscriberFunctionList.push(functionRef)
    if (socketInstance) {
        functionRef(socketInstance)
    }
}

/**
 * SocketManager contain base socket functions like initalize, joinRoom and leaveRoom. for get instane of socket call Initalize function.
 */
const SocketManager = {
    initalizeSocket,
    subscribe_GetSocket,
    joinRoom,
    leaaveRoom
}
window.SocketManager = SocketManager
export default SocketManager