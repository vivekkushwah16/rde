import React, { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../../Context/Auth/UserContextProvider";
import { NotificationManager } from "../../Managers/NotificationManager";

export default function PollContainer(props) {
  const { id: eventId, isPollUser } = props;

  const timerRef = useRef(null)
  const { user } = useContext(UserContext);

  const [pollNotification, setPollNotification] = useState({});
  const [pollNotificationForm, setPollNotificationForm] = useState({
    notification: "",
    published: false,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getPollNotification();
  }, []);

  const getPollNotification = () => {
    setLoading(true);
    NotificationManager.getNotification(eventId, (data, err) => {
      if (err) {
        setLoading(false);
        // console.log(err)
        return;
      }
      setPollNotification(data[0]);
      setLoading(false);
    });
  };

  const handleNotificationSubmit = async (type, id, updatedData) => {
    // handling save button
    if (type === "save") {
      return new Promise(async (res, rej) => {
        try {
          await NotificationManager.addNotification(
            pollNotificationForm,
            eventId,
            user.uid
          );
          // updating saved form data array
          getPollNotification();
          setPollNotificationForm({
            notification: "",
            published: pollNotificationForm.published
          });
          setPollNotification({
            notification: "",
            published: false,
          });
          res();
        } catch (error) {
          rej(error);
        }
      });
    }
    if (type === "publish") {
      const result = await NotificationManager.publishNotification(id, {
        published: updatedData,
      }).then(() => {
        if (timerRef.current) {
          clearTimeout(timerRef.current)
        }
        timerRef.current = setTimeout(() => {
          handleNotificationSubmit(
            "publish",
            pollNotification?.id,
            false
          )
        }, 1000)
      });
      if (result === "success") {
        setPollNotification({ ...pollNotification, published: updatedData });
      }
    }
  };
  return (
    <>
      {!isPollUser && (
        <div className="communityBox__body">
          <div className="poll-form-container">
            {/* Feedback form start */}
            <div className="poll-form">
              <input
                autoFocus
                type="text"
                placeholder="Write text here..."
                value={pollNotificationForm.notification}
                onChange={(e) =>
                  setPollNotificationForm({
                    notification: e.target.value,
                    published: false,
                  })
                }
                required
              />

              <button
                className="poll-btn"
                onClick={() => handleNotificationSubmit("save")}
                style={{ border: "1px solid black", alignSelf: "center" }}
              >
                Save
              </button>
            </div>
            {/* End of feedback form */}
          </div>
          {loading && <div style={{ marginTop: "1rem" }}>Please wait...</div>}

          <div className="poll-form poll-form-data">
            <p
              style={{
                paddingTop: "10px",
                marginBottom: "25px",
                fontWeight: 600,
              }}
            >
              {pollNotification?.notification}
            </p>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <button
                className="poll-btn"
                onClick={() => {
                  console.log(pollNotification, pollNotification?.published)
                  if (!pollNotification?.published) {

                    handleNotificationSubmit(
                      "publish",
                      pollNotification?.id,
                      true
                    )

                  } else {

                  }
                }}
                style={{
                  border: "1px solid black",
                  fontWeight: "700",
                }}
              >
                {pollNotification?.published ? "Pushing notification" : "Push notification"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
