import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/database';
import 'firebase/analytics';
import 'firebase/functions';
import { AppString } from './constant';

const firebaseConfig = {
  apiKey: "AIzaSyCneEInwQf9s42gCzrX1ybhEvqO8Z1FcjM",
  authDomain: "broad-expo-rent-dj.firebaseapp.com",
  databaseURL: "https://broad-expo-rent-dj.firebaseio.com",
  projectId: "broad-expo-rent-dj",
  storageBucket: "broad-expo-rent-dj.appspot.com",
  messagingSenderId: "60481384412",
  appId: "1:60481384412:web:d39202acf4d3a9df266919",
  measurementId: "G-N8YN11228Z"
};

firebase.initializeApp(firebaseConfig);

export default firebase;
export const firestore = firebase.firestore();
export const database = firebase.database();
export const analytics = firebase.analytics();
export const auth = firebase.auth();


export function login(name, password) {
  auth.signInWithEmailAndPassword(name, password).then((userCred) => {
    console.log(userCred)
  })
    .catch((err) => console.log(err))
    .finally((a) => console.log(a, "finaly"))
}

export function updateName(user, name) {
  if (!user.displayName) {
    user.updateProfile({
      displayName: name
    })
  }
}





//#region dailyco functions

export const checkForDailycoAdmin = (userToken, roomId) => {
  return new Promise(async (res, rej) => {
    try {
      console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
      const videoCallDoc = await firestore
        .collection(AppString.Dailyco_Col)
        .doc(roomId)
        .get();
      let docData = videoCallDoc.data();
      if (!docData || !docData.admins.includes(userToken.uid)) {
        rej({
          code: "NoAdmin",
          messsage: "this user is not a admin",
        });
      }
      delete docData.users;
      delete docData.admins;
      delete docData.callStarted;

      res(docData);
    } catch (error) {
      rej(error);
    }
  });
};

export const checkForDailycoMember = async (userToken) => {
  const dailycoRoomDocs = await firestore
    .collection(AppString.Dailyco_Col)
    .where("members", "array-contains", userToken.uid)
    .get();
  if (dailycoRoomDocs.empty) {
    throw "No room found for user";
  }

  for (let i = 0; i < dailycoRoomDocs.docs.length; i++) {
    if (dailycoRoomDocs.docs[i].id.includes("Breakout")) {
      return dailycoRoomDocs.docs[i].id;
    }
  }

  throw "No room found for user";
};

export const getDailycoRoomDetails = (roomId) => {
  return new Promise(async (res, rej) => {
    try {
      const videoCallDoc = await firestore
        .collection(AppString.Dailyco_Col)
        .doc(roomId)
        .get();

      let data = videoCallDoc.data();
      console.log(data);
      if (!data) {
        console.log("NoVideoRoomFound");
        rej({
          code: "NoVideoRoom",
          messsage: "NoVideoRoomFound",
        });
      }
      res(data);
    } catch (error) {
      rej(error);
    }
  });
};

export const checkDailycoRoomStatus = (room) => {
  return new Promise(async (res, rej) => {
    try {
      const videoCallDoc = await firestore
        .collection(AppString.Dailyco_Col)
        .doc(room)
        .get();
      if (!videoCallDoc.exists) {
        rej({
          code: "NoVideoRoom",
          messsage: "NoVideoRoomFound",
        });
      }
      console.log(videoCallDoc.data());
      res(videoCallDoc.data().callStarted);
    } catch (error) {
      rej(error);
    }
  });
};

  //#endregion