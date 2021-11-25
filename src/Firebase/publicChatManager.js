import firebase, { database as realDB } from ".";
import { AppString } from "./constant";

const generatePushID = (function () {
    // Modeled after base64 web-safe chars, but ordered by ASCII.
    var PUSH_CHARS = '-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz';

    // Timestamp of last push, used to prevent local collisions if you push twice in one ms.
    var lastPushTime = 0;

    // We generate 72-bits of randomness which get turned into 12 characters and appended to the
    // timestamp to prevent collisions with other clients.  We store the last characters we
    // generated because in the event of a collision, we'll use those same characters except
    // "incremented" by one.
    var lastRandChars = [];

    return function () {
        var now = new Date().getTime();
        var duplicateTime = (now === lastPushTime);
        lastPushTime = now;

        var timeStampChars = new Array(8);
        for (var i = 7; i >= 0; i--) {
            timeStampChars[i] = PUSH_CHARS.charAt(now % 64);
            // NOTE: Can't use << here because javascript will convert to int and lose the upper bits.
            now = Math.floor(now / 64);
        }
        if (now !== 0) throw new Error('We should have converted the entire timestamp.');

        var id = timeStampChars.join('');

        if (!duplicateTime) {
            for (i = 0; i < 12; i++) {
                lastRandChars[i] = Math.floor(Math.random() * 64);
            }
        } else {
            // If the timestamp hasn't changed since last push, use the same random number, except incremented by 1.
            for (i = 11; i >= 0 && lastRandChars[i] === 63; i--) {
                lastRandChars[i] = 0;
            }
            lastRandChars[i]++;
        }
        for (i = 0; i < 12; i++) {
            id += PUSH_CHARS.charAt(lastRandChars[i]);
        }
        if (id.length != 20) throw new Error('Length should be 20.');

        return id;
    };
})();

export const getMessageVideoChat = (roomId, page, limit = 20, offset = 0) => {
    return new Promise(async (res, rej) => {
        try {
            let path = `chat/${AppString.ROOM_MESSAGES}/${roomId}/`
            // console.log(path)
            var msgRef = realDB.ref(path).orderByChild('createdAt',).limitToLast(page * limit + limit)
            const snapshot = await msgRef.once('value')
            if (!snapshot.exists()) {
                let error = { code: 'NoMsg', message: 'no message ' }
                throw (error)
            }
            let arr = []
            snapshot.forEach(function (child) {
                arr.push(child.val())
            });
            // console.log(arr, arr.length, page * limit, page * limit + limit);
            // console.log(offset)
            arr = arr.reverse();
            arr = arr.slice((page * limit) + offset, (page * limit) + limit + offset);
            arr = arr.reverse();
            // arr = arr.slice(0, limit);
            // console.log(arr)
            res(arr)
        } catch (error) {
            rej(error)
        }
    })
} 

export const getMessageListenerVideoChat = (roomId, callback) => {
    try {
        let path = `chat/${AppString.ROOM_MESSAGES}/${roomId}/`
        var msgRef = realDB.ref(path).orderByChild('createdAt').limitToLast(1)
        msgRef.on('child_added', (data) => {
            if (callback) {
                callback(null, data.val())
            }
        });
    } catch (error) {
        if (callback) {
            callback(error)
        }
    }
}

export const sendMessageVideoChat = (message) => {
    return new Promise(async (res, rej) => {
        try {
            let uniquerId = generatePushID()
            const newMessage = {
                ...message,
                createdAt: firebase.database.ServerValue.TIMESTAMP,
                msgKey: uniquerId,
            }
            var msgRef = realDB.ref(`chat/${AppString.ROOM_MESSAGES}/${message.room}/${uniquerId}`)
            await msgRef.set(newMessage)

            const currentRoomMetadataNodeRef = realDB.ref(`/chat/${AppString.ROOM_METADATA}/${message.room}`)
            currentRoomMetadataNodeRef.update(newMessage)
            res()
        } catch (error) {
            rej(error)
        }
    })
}

export function attachPublicChatListener(refVar, roomId, callback) {
    let userRef = realDB.ref(`/chat/${AppString.ROOM_METADATA}/${roomId}`)
    refVar = userRef
    userRef.on("value", async (snapshot) => {
        if (snapshot.exists()) {
            if (callback) {
                callback(snapshot.val())
            }
        } else {
            if (callback) {
                callback([], { code: "NotFound", message: "No Chat found" })
            }
        }
    }, err => {
        if (callback) {
            callback([], err)
        }
    })
}