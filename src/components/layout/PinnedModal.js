import React, { useState, useEffect, useContext } from "react";
import { useAuth0 } from "@auth0/auth0-react";

import Card from "../../ui/Card";
import PinnedArtList from "./PinnedArtList";
import PinnedContext from "./PinnedContext";

import { getDatabase, get, ref, child } from "firebase/database";
import { app } from "../../util/init-firebase";

import classes from "./PinnedArtwork.module.css";

const PinnedModal = (props) => {
  const pinnedCtx = useContext(PinnedContext);
  const [loadedDrawings, setLoadedDrawings] = useState([]);

  const { user } = useAuth0();

  useEffect(() => {
    const dbRef = ref(getDatabase(app));
    const fetchedDrawings = [];
    let promises = [];

    // should fetch all user profile titles and save their vals (ids) in an array,
    // then loop through it down here and fetch the drawings from main /drawings/id

    get(child(dbRef, `users/${user.sub}/titles/${props.seconds}`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          for (const drawingID of Object.values(snapshot.val())) {
            fetchedDrawings.push(drawingID["drawingID"]);
          }
          // fetch into a promise.all scenario
          for (const id of fetchedDrawings) {
            promises.push(get(child(dbRef, `drawings/${id}`)));
          }
          return Promise.all(promises);
        }
      })
      .then((results) => {
        let finalFetchedDrawings = [];
        for (const result of results) {
          finalFetchedDrawings.push(result.val());
        }
        setLoadedDrawings(finalFetchedDrawings);

        if (props.seconds === 60) {
          pinnedCtx.setUser60Drawings(finalFetchedDrawings);
        } else if (props.seconds === 180) {
          pinnedCtx.setUser180Drawings(finalFetchedDrawings);
        } else if (props.seconds === 300) {
          pinnedCtx.setUser300Drawings(finalFetchedDrawings);
        }
      });
  }, []);

  return (
    <Card>
      <div className={classes.innerModal}>
        <div className={classes.topControlsContainer}>
          <div className={classes.title}>
            <h3>{`${props.seconds / 60} Minute Drawings`}</h3>
          </div>
          <div className={classes.save}>
            <button
              className={classes.activeButton}
              onClick={() => {
                console.log("was clicked", pinnedCtx.selectedPinnedDrawings);
                pinnedCtx.updateDatabase(pinnedCtx.selectedPinnedDrawings);
                pinnedCtx.setPinnedDrawings(pinnedCtx.selectedPinnedDrawings);
              }}
            >
              Save
            </button>
          </div>
          <div className={classes.exit}>
            <div className={classes.close}></div>
          </div>
        </div>

        <PinnedArtList drawings={loadedDrawings} />
      </div>
    </Card>
  );
};

export default PinnedModal;
