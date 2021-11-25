import axios from "axios"
import { Endpoints } from "../Constants/EndPoints"


export function updateRoomNotification(roomName, data, debug = false) {
    return new Promise(async (response, reject) => {
        try {
            // if (debug) {
            //     console.log("start add chatRoomAdmin")
            // }
            let result = await axios.post(Endpoints.RoomPoints.setNotification, {
                roomId: roomName,
                data: data
            })
            // if (debug) {
            //     console.log(result.data)
            // }
            let resultData = result.data
            response(resultData)
        } catch (error) {
            console.error(error)
            reject(error)
        }
    })
}

export function getNotification(roomName, debug = false) {
    return new Promise(async (response, reject) => {
        try {
            // if (debug) {
            //     console.log("start get chatRoomAdmin")
            // }
            let result = await axios.get(Endpoints.RoomPoints.getNotification + `?roomId=${roomName}`)
            // if (debug) {
            //     console.log(result.data)
            // }
            let resultData = result.data
            response(resultData)
        } catch (error) {
            console.error(error)
            reject(error)
        }
    })
}