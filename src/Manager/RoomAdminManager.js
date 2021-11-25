import axios from "axios"
import { Endpoints } from "../Constants/EndPoints"

export function addChatRoomAdmin(roomName, adminList, debug = false) {
    return new Promise(async (response, reject) => {
        try {
            if (debug) {
                // console.log("start add chatRoomAdmin")
            }
            let result = await axios.post(Endpoints.RoomPoints.addRoomAdmin, {
                roomId: roomName,
                adminList: adminList
            })
            if (debug) {
                // console.log(result.data)
            }
            let resultData = result.data
            response(resultData)
        } catch (error) {
            console.error(error)
            reject(error)
        }
    })
}

export function updateChatRoomAdmin(roomName, adminList, debug = false) {
    return new Promise(async (response, reject) => {
        try {
            if (debug) {
                // console.log("start add chatRoomAdmin")
            }
            let result = await axios.post(Endpoints.RoomPoints.updateRoomAdmin, {
                roomId: roomName,
                adminList: adminList
            })
            if (debug) {
                // console.log(result.data)
            }
            let resultData = result.data
            response(resultData)
        } catch (error) {
            console.error(error)
            reject(error)
        }
    })
}

export function getChatRoomAdmin(roomName, debug = false) {
    return new Promise(async (response, reject) => {
        try {
            if (debug) {
                // console.log("start get chatRoomAdmin")
            }
            let result = await axios.get(Endpoints.RoomPoints.getRoomAdmin + `?roomId=${roomName}`)
            if (debug) {
                // console.log(result.data)
            }
            let resultData = result.data
            response(resultData)
        } catch (error) {
            console.error(error)
            reject(error)
        }
    })
}