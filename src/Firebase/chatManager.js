import firebase, { database } from ".";
import { AppString } from "./constant";

export const user_ActiveStatus = (user, nodeAddress = AppString.USER_STATUS) => {
    let isOfflineForDatabase = {
        StateMode: 'offline',
    };
    let isOnlineForDatabase = {
        StateMode: 'online',
    };
    let userStatusDatabaseRef = database.ref('/chat/' + nodeAddress + '/' + user.uid);
    let onDisconnectRef = userStatusDatabaseRef.onDisconnect()
    onDisconnectRef.remove().then(() => {
        userStatusDatabaseRef.set({
            ...isOnlineForDatabase,
            name: user.displayName ?? "",
            id: user.uid,
        });
    });
}

export async function getUserDetails(user) {
    return new Promise((res, rej) => {
        let email = user.email
        email = email.replace(/[&\/\\#,+$~%.'":*?<>{}]/g, '');
        email = email.toLowerCase();
        let userRef = database.ref(`/user/${email}`)
        userRef.once("value", async (snapshot) => {
            if (snapshot.exists()) {
                res(snapshot.val())
            } else {
                throw ({ code: "NotFound", message: "" })
            }
        }, err => {
            console.log(err)
            rej(err)
        });
    })
}
export async function UpdateUserTable(user) {
    return new Promise((res, rej) => {
        let userRef = database.ref(`/chat/${AppString.USERS_DOC_REALTIME_DB}/${user.uid}`)
        userRef.once("value", async (snapshot) => {
            let userData = {
                userName: user.displayName,
                fullName: user.displayName,
                name: user.displayName,
                id: user.uid,
                email: user.email,
            }
            if (user.photoURL) {
                userData = {
                    ...userData,
                    profile_picture: user.photoURL,
                }
            } else {
                userData = {
                    ...userData,
                    profile_picture: AppString.DEFAULT_AVATAR,
                }
            }
            await userRef.set(userData);

            // if (!snapshot.exists()) {

            // } else {
            //     //Check Default Image Is Their or not
            //     if (user.photoURL) {
            //         await userRef.update({ profile_picture: user.photoURL });
            //     } else {
            //         await userRef.update({ profile_picture: AppString.DEFAULT_AVATAR });
            //     }
            // }
            res()
        }, err => {
            console.log(err)
            rej(err)
        });
    })
}

export async function getOnlineUsers(roomName, callback) {
    let userRef = database.ref(`/chat/${roomName}`)//${AppString.USER_STATUS}`)
    userRef.on("value", async (snapshot) => {
        if (snapshot.exists()) {
            if (callback) {
                callback(snapshot.val())
            }
        } else {
            if (callback) {
                callback([], { code: "NotFound" })
            }
        }
    }, err => {
        if (callback) {
            callback([], err)
        }
    })
}

export async function getAllParticipants(callback) {
    let userRef = database.ref(`/chat/${AppString.USERS_DOC_REALTIME_DB}`).orderByChild("email")
    userRef.on("value", async (snapshot) => {
        if (snapshot.exists()) {
            let result = {}
            let count = 1;
            snapshot.forEach((child) => {
                // console.log(child.key);
                // console.log(child.val());
                result[`${count}-${child.key}`] = child.val()
                count++;
            })
            // console.log(result)
            if (callback) {
                callback(result)
            }
        } else {
            if (callback) {
                callback([], { code: "NotFound" })
            }
        }
    }, err => {
        if (callback) {
            callback([], err)
        }
    })
}

function cleanEmail(val) {
    val = val.replace(/[&\/\\#,+$~%.'":*?<>{}]/g, '');
    return val.toLowerCase();
}

export function getRoomIdWithUser(currentUserId, otherUserId) {
    currentUserId = cleanEmail(currentUserId)
    otherUserId = cleanEmail(otherUserId)
    let id = ""
    if (currentUserId > otherUserId) {
        id = currentUserId + "+" + otherUserId
    } else {
        id = otherUserId + "+" + currentUserId
    }
    return id
}

export async function getOldMessagesFromRoom(roomId) {
    return new Promise((response, reject) => {
        let userRef = database.ref(`/chat/messages/${roomId}`)
        userRef.on("value", async (snapshot) => {
            if (snapshot.exists()) {
                response(snapshot.val())
            } else {
                response([])
            }
        }, err => {
            reject(err)
        })
    })
}

export function attachNewMessagesListener(refVar, roomId, callback) {
    let userRef = database.ref(`/chat/${AppString.ROOM_MESSAGES}/${roomId}`)
    refVar = userRef.on("child_added", async (snapshot) => {
        if (snapshot.exists()) {
            if (callback) {
                callback(snapshot.val())
            }
        } else {
            if (callback) {
                callback([], { code: "NotFound" })
            }
        }
    }, err => {
        if (callback) {
            callback([], err)
        }
    })
}

export function sendMessage1on1(currentUserName, currentUid, otherUserUid, otherUserName, roomId, message) {
    //update your roomList with current roomName
    const roomListRef = database.ref(`/chat/${AppString.ROOMS_LIST}/${currentUid}`)
    roomListRef.update({
        [roomId]: true
    })
    //update members in MembersNode
    // const memberNodeRef = database.ref(`/chat/${AppString.MEMBERS_LIST}/${roomId}`)
    // memberNodeRef.update({
    //     [currentUid]: true,
    //     [otherUserUid]: true
    // })
    //add message in MessagesNode - {  }
    const messageNodeRef = database.ref(`/chat/${AppString.ROOM_MESSAGES}/${roomId}`).push()
    messageNodeRef.set({
        name: currentUserName,
        id: currentUid,
        createdAt: firebase.database.ServerValue.TIMESTAMP,
        message: message,
        room: roomId,
    })
    //update chatRoom meta data under roomMetadataNode
    let chatMetaData = {
        message: message,
        room: roomId,
        createdAt: firebase.database.ServerValue.TIMESTAMP,
        name: currentUserName,
        id: currentUid,
        [currentUid]: currentUserName,
        [otherUserUid]: otherUserName,
        participants: [currentUid, otherUserUid]
    }
    const currentUserRoomMetadataNodeRef = database.ref(`/chat/${AppString.ROOM_METADATA}/${currentUid}/${roomId}`)
    currentUserRoomMetadataNodeRef.update(chatMetaData)

    const otherUserRoomMetadataNodeRef = database.ref(`/chat/${AppString.ROOM_METADATA}/${otherUserUid}/${roomId}`)
    otherUserRoomMetadataNodeRef.update(chatMetaData)

    //add notification to other usernode and remove current userNotification if any
    const currentUserNotificationNode = database.ref(`/chat/${AppString.USER_NOTIFICATION}/${currentUid}/${otherUserUid}`)
    currentUserNotificationNode.remove()

    const otherUserNotificationNode = database.ref(`/chat/${AppString.USER_NOTIFICATION}/${otherUserUid}/${currentUid}`)
    otherUserNotificationNode.update({
        count: firebase.database.ServerValue.increment(1),
        message: message,
        roomId: roomId,
        createdAt: firebase.database.ServerValue.TIMESTAMP,
        name: currentUserName,
        id: currentUid
    })
}

export function attachNotificationListener(refVar, userId, callback) {
    let userRef = database.ref(`/chat/${AppString.USER_NOTIFICATION}/${userId}`)
    refVar = userRef
    userRef.on("value", async (snapshot) => {
        if (snapshot.exists()) {
            if (callback) {
                callback(snapshot.val())
            }
        } else {
            if (callback) {
                callback([], { code: "NotFound", message: "No notification found" })
            }
        }
    }, err => {
        if (callback) {
            callback([], err)
        }
    })
}

export function removeNotification(userId, otherUserUid) {
    let userRef = database.ref(`/chat/${AppString.USER_NOTIFICATION}/${userId}/${otherUserUid}`)
    userRef.remove()
}

export function attachTypingIndicator(roomId, otherUserId, refVar, callback) {
    let userRef = database.ref(`/chat/${AppString.ROOM_TYPING_INDICATOR}/${roomId}/${otherUserId}`)
    refVar = userRef
    userRef.on("value", async (snapshot) => {
        if (snapshot.exists()) {
            if (callback) {
                callback(snapshot.val())
            }
        } else {
            if (callback) {
                callback([], { code: "noStatus", message: "No Typing Status found" })
            }
        }
    }, err => {
        if (callback) {
            callback([], err)
        }
    })
}

export function singalTypingIndicator(roomId, userId, value) {
    let userRef = database.ref(`/chat/${AppString.ROOM_TYPING_INDICATOR}/${roomId}/`)
    userRef.update({
        [userId]: value
    })

}

export function attachOnDisconnectForTyping(refVar, roomId, userId) {
    let userRef = database.ref(`/chat/${AppString.ROOM_TYPING_INDICATOR}/${roomId}/`)
    let disconnectRef = userRef.onDisconnect()
    disconnectRef.update({
        [userId]: false
    });
    refVar = disconnectRef
}

export function getUserInteractedRoom(refVar, userId, callback) {
    let userRef = database.ref(`/chat/${AppString.ROOM_METADATA}/${userId}`).orderByChild(`createdAt`);
    refVar = userRef
    userRef.on("value", async (snapshot) => {
        // console.log(userId)
        // console.log(snapshot.val())

        // let result = {}
        // let count = 1;
        // snapshot.forEach((child) => {
        //     console.log(child.key);
        //     console.log(child.val());
        //     result[`${count}-${child.key}`] = child.val()
        //     count++;
        // })

        if (snapshot.exists()) {
            if (callback) {
                callback(snapshot.val())
            }
        } else {
            if (callback) {
                callback([], { code: "noStatus", message: "No Typing Status found" })
            }
        }
    }, err => {
        if (callback) {
            callback([], err)
        }
    })
}

export const userOnlinePresence = (user, roomId, listenerRef) => {
    let isOnlineForDatabase = {
        StateMode: 'online',
    };
    let userStatusDatabaseRef = database.ref(`/chat/${AppString.INCALL_UserPresence}/${roomId}/${user.uid}`);
    let onDisconnectRef = userStatusDatabaseRef.onDisconnect()
    listenerRef = onDisconnectRef;
    onDisconnectRef.remove().then(() => {
        userStatusDatabaseRef.set({
            ...isOnlineForDatabase,
            name: user.displayName ?? "",
            id: user.uid,
        });
    });
}

export const goOfflineInRoom = (user, roomId) => {
    let userStatusDatabaseRef = database.ref(`/chat/${AppString.INCALL_UserPresence}/${roomId}/${user.uid}`);
    userStatusDatabaseRef.remove()

}

export const getOnlinPresentUserInRoom = (roomId, refVar, callback) => {
    let userRef = database.ref(`/chat/${AppString.INCALL_UserPresence}/${roomId}`)
    refVar = userRef
    userRef.on("value", async (snapshot) => {
        if (snapshot.exists()) {
            if (callback) {
                callback(snapshot.val())
            }
        } else {
            if (callback) {
                callback([], { code: "NotFound", message: "No notification found" })
            }
        }
    }, err => {
        if (callback) {
            callback([], err)
        }
    })
}