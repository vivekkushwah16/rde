import axios from "axios"
import { ERR_CODE_NOTLOGGEDIN } from "../Constants/Codes"
import { EndpintsReturnCodes, Endpoints } from "../Constants/EndPoints"

const checkForUser = () => {
    return new Promise(async (response, reject) => {
        try {
            // console.log("start")
            let result = await axios.get(Endpoints.verifyuser, { withCredentials: true })
            let resultData = result.data
            if (resultData.code === EndpintsReturnCodes.OK) {
                response(resultData.user)
            } else {
                response(null)
            }
        } catch (error) {
            console.error(error)
            if (error?.response?.data?.message) {
                console.log(error.response.data.message)
                localStorage.clear()
                if (!window.location.href.includes('localhost'))
                    window.open(error.response.data.message, "_self")
            }
            reject(error)
        }
    })
}

const IDM = {
    checkForUser,
}
export default IDM