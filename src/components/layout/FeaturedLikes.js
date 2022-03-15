import React, { useEffect, useState } from "react";

import GallaryItem from "./GallaryItem";
import ProfilePicture from "./ProfilePicture";

import { getDatabase, get, ref, child } from "firebase/database";
import { app } from "../../util/init-firebase";

import classes from "./FeaturedLikes.module.css";

const FeaturedLikes = () => {
  const [dailyMostLiked, setDailyMostLiked] = useState();
  const [currentDrawing, setCurrentDrawing] = useState(0);
  const [selected, setSelected] = useState([classes.highlighted, "", ""]);

  useEffect(() => {
    const dbRef = ref(getDatabase(app));

    get(child(dbRef, "dailyMostLiked")).then((snapshot) => {
      setDailyMostLiked(Object.values(snapshot.val()));
    });
  }, []);

  function selectTimer(index) {
    let tempSelected = [...selected];
    tempSelected[currentDrawing] = "";
    tempSelected[index] = classes.highlighted;
    setSelected(tempSelected);
  }

  return (
    <div className={classes.overallContain}>
      <div className={classes.leftSideContain}>
      
        {/* --------------- 60 ------------------- */}
        <div
          className={`${classes.detailsContain} ${selected[0]}`}
          onClick={() => {
            selectTimer(0);
            setCurrentDrawing(0);
          }}
        >
          <div className={classes.seconds}>1 Minute</div>
          <div className={classes.imageDetails}>
            <div className={classes.profilePic}>
              <ProfilePicture user={dailyMostLiked[2].drawnBy} size="medium" />
            </div>
            <div className={classes.title}>{dailyMostLiked[0].title}</div>
          </div>
        </div>

        {/* --------------- 180 ------------------- */}
        <div
          className={`${classes.detailsContain} ${selected[1]}`}
          onClick={() => {
            selectTimer(1);
            setCurrentDrawing(1);
          }}
        >
          <div className={classes.seconds}>3 Minutes</div>
          <div className={classes.imageDetails}>
            <div className={classes.profilePic}>
              <ProfilePicture user={dailyMostLiked[2].drawnBy} size="medium" />
            </div>
            <div className={classes.title}>{dailyMostLiked[1].title}</div>
          </div>
        </div>

        {/* --------------- 300 ------------------- */}
        <div
          className={`${classes.detailsContain} ${selected[2]}`}
          onClick={() => {
            selectTimer(2);
            setCurrentDrawing(2);
          }}
        >
          <div className={classes.seconds}>5 Minutes</div>
          <div className={classes.imageDetails}>
            <div className={classes.profilePic}>
              <ProfilePicture user={dailyMostLiked[2].drawnBy} size="medium" />
            </div>
            <div className={classes.title}>{dailyMostLiked[2].title}</div>
          </div>
        </div>

        <div className={classes.drawingContainer}>
          <GallaryItem drawing={dailyMostLiked[currentDrawing]} />
        </div>
      </div>
    </div>
  );
};

export default FeaturedLikes;
