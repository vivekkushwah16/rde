const productionAPIServerLink = 'https://api.rde.dev.zsservices.com'
const localAPIServerLink = '/api'
let serverURL = productionAPIServerLink
if (window.location.href.includes('localhost')) {
    serverURL = localAPIServerLink
}

export const Endpoints = {
    "root": serverURL + "/",
    "verifyadmin": serverURL + "/verifyadmin",
    "verifyuser": serverURL + '/verifyuser',
    "vcroom": serverURL + '/vcroom',
    "dailycoToken": serverURL + '/generate-videocall-Token',
    "quizresponse": serverURL + '/quizresponse',
    RoomPoints: {
        "addRoomAdmin": serverURL + "/addRoomAdmin",
        "updateRoomAdmin": serverURL + "/updateroomadmin",
        "getRoomAdmin": serverURL + "/getRoomAdmin",
        "setNotification": serverURL + "/setNotification",
        "getNotification": serverURL + "/getNotification",
        "vcAdminCheck": serverURL + "/vcAdminCheck"
    }
}

export const EndpintsReturnCodes = {
    "OK": "OK"
}