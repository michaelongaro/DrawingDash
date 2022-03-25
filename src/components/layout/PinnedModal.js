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

        pinnedCtx.updateDrawings(finalFetchedDrawings, props.seconds);
      });
  }, [props.seconds]);

  return (
    <Card>
      <div className={classes.innerModal}>
        {/* add save and exit buttons here */}
        <h3>{`${props.seconds / 60} Minute Drawings`}</h3>
        <PinnedArtList drawings={loadedDrawings} />
      </div>
    </Card>
  );
};

export default PinnedModal;
