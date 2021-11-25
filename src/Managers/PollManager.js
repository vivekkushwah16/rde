import {
  POLLRESPONSE_COLLECTION,
  POLL_COLLECTION,
} from "../Constants/CollectionConstants";
import { POLL_STATES } from "../Constants/PollStates";
import firebase, { firestore } from "../Firebase/index";

var uniqid = require("uniqid");
let pollListenerRef = null;
export const PollManager = {
  addPollQuestion: (type, form, eventId) => {
    return new Promise(async (res, rej) => {
      try {
        // let id = uniqid("poll-");
        let docRef = firestore.collection(POLL_COLLECTION).doc();
        let options = [];
        form.option1 &&
          options.push({
            id: 0,
            value: form.option1,
            response: 0,
          });
        form.option2 &&
          options.push({
            id: 1,
            value: form.option2,
            response: 0,
          });
        form.option3 &&
          options.push({
            id: 2,
            value: form.option3,
            response: 0,
          });
        form.option4 &&
          options.push({
            id: 3,
            value: form.option4,
            response: 0,
          });

        if (type === "feedback") {
          await docRef.set({
            feedbacks: [],
            question: form.question,
            //   index: index,
            eventId: eventId,
            state: POLL_STATES.hide,
            totalResponse: 0,
            timestamp: firebase.firestore.Timestamp.now(),
            //   id,
          });
        }

        if (type === "multiple") {
          await docRef.set({
            options: options,
            question: form.question,
            //   index: index,
            eventId: eventId,
            state: POLL_STATES.hide,
            totalResponse: 0,
            timestamp: firebase.firestore.Timestamp.now(),
            //   id,
          });
        }

        res();
      } catch (error) {
        rej(error);
      }
    });
  },

  removePollQuestion: (id) => {
    return new Promise(async (res, rej) => {
      try {
        const ref = firestore.collection(POLL_COLLECTION);
        await ref.doc(id).delete();
        res("success");
      } catch (error) {
        rej(error);
      }
    });
  },
  publishPollQuestion: (id, data) => {
    return new Promise(async (res, rej) => {
      try {
        const ref = firestore.collection(POLL_COLLECTION);
        await ref.doc(id).update(data);
        res("success");
      } catch (error) {
        rej(error);
      }
    });
  },

  getPollResponse: (pollId, userId) => {
    return new Promise(async (res, rej) => {
      try {
        const ref = firestore
          .collection(POLLRESPONSE_COLLECTION)
          .doc(`${userId}+${pollId}`);
        const doc = await ref.get();
        if (doc.exists) {
          res(doc.data().option);
        } else {
          res(null);
        }
      } catch (error) {
        rej(error);
      }
    });
  },
  attachPollNotificationListener: (eventId, callback = () => console.log("noFunFound")) => {
    const ref = firestore
      .collection(POLL_COLLECTION)
      .where("eventId", "==", eventId);
    pollListenerRef = ref.onSnapshot(
      (query) => {

        if (query.empty) {
          callback([]);
        }
        query.docChanges().forEach(change => {
          if (change.type === 'added') {
            callback({ id: change.doc.id, ...change.doc.data(), doctype: change.type });
          }
          if (change.type === 'modified') {
            callback({ id: change.doc.id, ...change.doc.data(), doctype: change.type });
          }
        });
      },
      (err) => {
        callback(null, err);
      }
    );
  },
  attachPollListener: (eventId, callback = () => console.log("noFunFound")) => {
    const ref = firestore
      .collection(POLL_COLLECTION)
      .where("eventId", "==", eventId);
    pollListenerRef = ref.onSnapshot(
      (query) => {

        if (query.empty) {
          callback([]);
        }
        // query.docChanges().forEach(change => {
        //   if (change.type === 'modified') {
        //     console.log(change.doc.data(), change.doc.id);
        //     callback({ id: change.doc.id, ...change.doc.data() });
        //   }
        // });

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
  removePollListener: () => {
    if (pollListenerRef) {
      pollListenerRef();
    }
  },
  addResponse: (eventId, pollId, userId, userName, option, type) => {
    return new Promise(async (res, rej) => {
      try {
        const pollRef = firestore.collection(POLL_COLLECTION).doc(pollId);
        const responseRef = firestore
          .collection(POLLRESPONSE_COLLECTION)
          .doc(`${userId}+${pollId}`);
        let id = uniqid("response-");
        await firestore.runTransaction(async (transcation) => {
          let doc = await transcation.get(pollRef);
          let responseDoc = await transcation.get(responseRef);
          if (responseDoc.exists) {
            let err = {
              code: "AlreadyResponded",
              message: "Already responded to the current poll.",
            };
            throw err;
          }
          if (!doc.exists) {
            let err = {
              code: "NotValidId",
              message: "No Poll Found",
            };
            throw err;
          }
          if (type === "feedback") {

            let feedbackData = {
              userId: userId,
              userName: userName,
              date: new Date().getTime(),
              feedback: option,
            };

            let feedbacks = doc.data().feedbacks;
            feedbacks.push(feedbackData);
            transcation.update(pollRef, {
              feedbacks: feedbacks,
              totalResponse: firebase.firestore.FieldValue.increment(1),
            });
          }
          if (type === "multiple") {
            let _option = { ...option };
            delete _option.response;

            transcation.set(responseRef, {
              id: id,
              targetId: pollId,
              user: userId,
              userName: userName,
              eventId: eventId,
              timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
              date: new Date().getTime(),
              option: _option,
            });

            const options = doc.data().options;

            options[option.id] = {
              ...options[option.id],
              response: parseInt(options[option.id].response) + 1,
            };
            transcation.update(pollRef, {
              options: options,
              totalResponse: firebase.firestore.FieldValue.increment(1),
            });
          }
        });
        res();
      } catch (error) {
        rej(error);
      }
    });
  },
  changeAllPollState: (eventId, state = POLL_STATES.hide) => {
    return new Promise(async (res, rej) => {
      try {
        const pollColl = firestore.collection(POLL_COLLECTION);
        const docRef = firestore
          .collection(POLL_COLLECTION)
          .where("eventId", "==", eventId);
        await firestore.runTransaction(async (transcation) => {
          let query = await transcation.get(docRef);
          if (query.empty) {
            let er = { code: "EmptyPoll", message: "No Poll Found" };
            throw er;
          }
          const docIds = query.docs.map((doc) => doc.id);
          for (let i = 0; i < docIds.length; i++) {
            await pollColl.doc(docIds[i]).update({
              state,
            });
          }
        });
        res();
      } catch (error) {
        rej(error);
      }
    });
  },
};
