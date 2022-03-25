import React, { useEffect, useState } from "react";

import Card from "../../ui/Card";
import GallaryItem from "./GallaryItem";
import ProfilePicture from "./ProfilePicture";

import { getDatabase, get, ref, child } from "firebase/database";
import { app } from "../../util/init-firebase";

import classes from "./FeaturedLikes.module.css";

const FeaturedLikes = () => {
  const [dailyMostLiked, setDailyMostLiked] = useState(false);
  const [currentDrawing, setCurrentDrawing] = useState(0);
  const [selected, setSelected] = useState([classes.highlighted, "", ""]);
  const dbRef = ref(getDatabase(app));

  useEffect(() => {
    // should have been dealt with in the backend, refactor eventually to
    // just return obj with drawing obj and amount of dailyLikes
    let promises = [];
    let formattedLikes = [];
    get(child(dbRef, "dailyMostLiked"))
      .then((snapshot) => {
        if (snapshot.exists()) {
          for (const drawing of Object.values(snapshot.val())) {
            promises.push(get(child(dbRef, `drawings/${drawing.id}`)));
          }
          return Promise.all(promises);
        }
      })
      .then((results) => {
        for (const idx in results) {
          formattedLikes.push({
            drawing: results[idx].val(),
            title: results[idx].val()["title"],
          });
        }

        setDailyMostLiked(formattedLikes);
      });
  }, []);

  function selectTimer(index) {
    let tempSelected = [...selected];
    tempSelected[currentDrawing] = "";
    tempSelected[index] = classes.highlighted;
    setSelected(tempSelected);
  }

  if (!dailyMostLiked) {
    return null;
  }

  return (
    <div className={classes.marginFlex}>
      <Card width={"70"}>
        <div className={classes.overallContain}>
          <div className={classes.leftSideContain}>
            {/* --------------- 60 ------------------- */}
            <Card width={"90"}>
              <div
                className={`${classes.detailsContain} ${selected[0]} ${classes.greenBackground}`}
                onClick={() => {
                  selectTimer(0);
                  setCurrentDrawing(0);
                }}
              >
                <div className={classes.seconds}>1 Minute</div>
                <div className={classes.gridMetadata}>
                  <div className={classes.profilePicture}>
                    <ProfilePicture
                      user={dailyMostLiked[2].drawing.drawnBy}
                      size="medium"
                    />
                  </div>
                  <div className={classes.title}>{dailyMostLiked[0].title}</div>
                </div>
              </div>
            </Card>

            {/* --------------- 180 ------------------- */}
            <Card width={"90"}>
              <div
                className={`${classes.detailsContain} ${selected[1]} ${classes.yellowBackground}`}
                onClick={() => {
                  selectTimer(1);
                  setCurrentDrawing(1);
                }}
              >
                <div className={classes.seconds}>3 Minutes</div>
                <div className={classes.gridMetadata}>
                  <div className={classes.profilePicture}>
                    <ProfilePicture
                      user={dailyMostLiked[2].drawing.drawnBy}
                      size="medium"
                    />
                  </div>
                  <div className={classes.title}>{dailyMostLiked[1].title}</div>
                </div>
              </div>
            </Card>

            {/* --------------- 300 ------------------- */}
            <Card width={"90"}>
              <div
                className={`${classes.detailsContain} ${selected[2]} ${classes.redBackground}`}
                onClick={() => {
                  selectTimer(2);
                  setCurrentDrawing(2);
                }}
              >
                <div className={classes.seconds}>5 Minutes</div>
                <div className={classes.gridMetadata}>
                  <div className={classes.profilePicture}>
                    <ProfilePicture
                      user={dailyMostLiked[2].drawing.drawnBy}
                      size="medium"
                    />
                  </div>
                  <div className={classes.title}>{dailyMostLiked[2].title}</div>
                </div>
              </div>
            </Card>
          </div>

          {/* ----------- Shown Drawing ----------- */}
          <div className={classes.drawingContainer}>
            <GallaryItem
              drawing={dailyMostLiked[currentDrawing].drawing}
              width={95}
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default FeaturedLikes;
