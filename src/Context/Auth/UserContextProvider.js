import React, { createContext, useState, useEffect, useRef } from 'react'
import { auth, login, updateName } from '../../Firebase';
import { UpdateUserTable, user_ActiveStatus } from '../../Firebase/chatManager';
import { AppString } from '../../Firebase/constant';
import IDM from '../../Manager/IDM';
import { addChatRoomAdmin, getChatRoomAdmin, updateChatRoomAdmin } from '../../Manager/RoomAdminManager';
import { getNotification, updateRoomNotification } from '../../Manager/RoomNotification';

export const UserContext = createContext();

export default function UserContextProvider(props) {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('userAuth')));

    const userCheck = async () => {
        try {
            const return_user = await IDM.checkForUser()
            if (return_user) {
                let __user = {
                    displayName: return_user.unique_name,
                    sub: return_user.sub,
                    email: return_user.email,
                    role: return_user.role,
                    uid: return_user.email,
                }
                localStorage.setItem('userAuth', JSON.stringify(__user))
                //set user
                setUser({ ...__user, isChecked: true })

                // const myEventFun = (data) => {
                //     console.log(data)
                // }
                // SocketManager.joinRoom(socketRef.current, "platform", "update", myEventFun)

                // setTimeout(() => {
                //     // addChatRoomAdmin("platformAdmin", ["anant@digitaljalebi.com"], true)
                //     // updateChatRoomAdmin("platformAdmin", ["shubham@digitaljalebi.com"], true)
                //     // getChatRoomAdmin("platformAdmin", true)
                //     // getNotification("platformAdmin", true)
                //     updateRoomNotification("platform", {
                //         roomId: "platform",
                //         notification: "Please join us in the negotiation room rather than Teams!",
                //         published: "false",
                //     }, true)
                // }, 500)


            } else {
                console.log("Not logged In")
                localStorage.removeItem('userAuth')
                localStorage.clear()
                setUser(null)
            }
        } catch (error) {
            console.log("Not logged In")
            localStorage.removeItem('userAuth')
            setUser(null)
        }
    }

    useEffect(() => {
        window.parent.loginUser = (email, password) => {
            login(email, password)
        }
        userCheck()
        // auth.onAuthStateChanged(async (user) => {
        //     if (user) {
        //         console.log(user.email, user.displayName)
        //         localStorage.setItem('userAuth', JSON.stringify(user))
        //         await UpdateUserTable(user)
        //         const urlQuery = new URLSearchParams(window.location.search);
        //         let publicRoomURl = urlQuery.get("publicRoom");
        //         if (publicRoomURl) {
        //             user_ActiveStatus(user, `${publicRoomURl}-userStatus`)
        //             user_ActiveStatus(user)
        //         } else {
        //             user_ActiveStatus(user)
        //             user_ActiveStatus(user, AppString.USERINCALL_STATUS)

        //         }
        //         setUser({ ...user, isChecked: true })
        //         // updateName(user,"testUser2")
        //     } else {
        //         localStorage.removeItem('userAuth')
        //         setUser(null)
        //         // login("shubham@dj.com", "up14y7434")
        //         // login("testuser1@chat.com","up14y7434")
        //         // login("testuser2@chat.com","up14y7434")
        //         //window.parent.loginUser("testuser1@chat.com","up14y7434")
        //     }
        // });

    }, [])


    return (
        <UserContext.Provider value={{ user }}>
            {props.children}
        </UserContext.Provider>
    )
}
