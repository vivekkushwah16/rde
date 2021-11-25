import axios from "axios";
import React, { useContext, useEffect, useMemo, useState } from "react";
import classes from "../../Assets/css/NegotiationFormStyle/ScoreCard.module.css";
import { Endpoints } from "../../Constants/EndPoints";
import { UserContext } from "../../Context/Auth/UserContextProvider";

const saveFormDataInDB = (userid, data) => {
  axios
    .post(
      Endpoints.quizresponse,
      {
        userid: userid,
        data: JSON.stringify(data),
      },
      { withCredentials: true }
    )
    .then((res) => console.log(res));
};

function ScoreCard({ data }) {
  const { user } = useContext(UserContext);
  let per = useMemo(() => {
    let correct = 0
    data.forEach(element => {
      if (element.check) {
        correct++
      }
    });
    return Math.floor((correct / data.length) * 100)
  }, [data])

  // useEffect(() => {
  //   let _data = {}
  //   data.map(item => _data[item.id] = item)
  //   saveFormDataInDB(user.uid, _data)
  // }, [])

  return (
    <>
      <div className={classes["FormContainer"]}>
        <div className={classes.scoreWrapper}>
          <div className={classes.showScore}>
            <div className={classes.ScoreContent}>
              <div className={classes.headingScore}>
                <h1>Your Score</h1>
              </div>
              <h1>{per}%</h1>
            </div>
            <div className={classes.ScoreInPer}>
              <h1>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Tenetur, suscipit.</h1>
            </div>
          </div>
          <div className={classes.CorrectQuesWrapper}>
            {data.map((item) => <div key={item.id} className={classes.allQues}>
              <h1>question {item.id}</h1>
              <h1 className={item.check ? classes.correct : classes.Incorrect}>{item.check ? "Correct" : "Incorrect"}</h1>
            </div>)}
          </div>
        </div>
      </div>
    </>
  );
}

export default ScoreCard;
