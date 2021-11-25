import { BACKSTAGE_COLLECTION, NOTIFICATION_COLLECTION } from "../Constants/CollectionConstants";
import firebase, { firestore } from "../Firebase/index";

export const NotificationManager = {
  addNotification: (notificaton, eventId, userId) => {
    return new Promise(async (res, rej) => {
      try {
        let docRef = firestore
          .collection(NOTIFICATION_COLLECTION)
          .doc(eventId.toLowerCase());
        await docRef.set({
          ...notificaton,
          eventId: eventId,
          userId: userId,
          timestamp: firebase.firestore.Timestamp.now(),
        });
        res();
      } catch (error) {
        rej(error);
      }
    });
  },

  publishNotification: (id, data) => {
    return new Promise(async (res, rej) => {
      try {
        const ref = firestore.collection(NOTIFICATION_COLLECTION);
        await ref.doc(id.toLowerCase()).update(data);
        res("success");
      } catch (error) {
        rej(error);
      }
    });
  },
  getNotification: (eventId, callback = () => console.log("noFunFound")) => {
    const ref = firestore
      .collection(NOTIFICATION_COLLECTION)
      .where("eventId", "==", eventId);
    ref.onSnapshot(
      (query) => {
        if (query.empty) {
          callback([]);
        }
        let _data = query.docs.map((doc) => {
          let record = { id: doc.id, ...doc.data() };
          return record;
        });
        callback(_data);
      },
      (err) => {
        callback(null, err);
      }
    );
  },
};
