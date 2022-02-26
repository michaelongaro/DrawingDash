import React, { useState, useEffect, useContext } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Card from "../../ui/Card";
import PinnedArtList from "./PinnedArtList";

import classes from "./PinnedArtwork.module.css";
import PinnedContext from "./PinnedContext";

import { getDatabase, get, ref, child } from "firebase/database";
import { app } from "../../util/init-firebase";

const PinnedModal = (props) => {
  const pinnedCtx = useContext(PinnedContext);
  const [loadedDrawings, setLoadedDrawings] = useState([]);
  const [secondsIntoMinutes, setSecondsIntoMinutes] = useState("");

  const { user } = useAuth0();

  useEffect(() => {
    if (props.seconds === 60) {
      setSecondsIntoMinutes(`${1} Minute`);
    } else if (props.seconds === 180) {
      setSecondsIntoMinutes(`${3} Minutes`);
    } else {
      setSecondsIntoMinutes(`${5} Minutes`);
    }

    const dbRef = ref(getDatabase(app));
    const fetchedDrawings = [];

    // should fetch all user profile titles and save their vals (ids) in an array,
    // then loop through it down here and fetch the drawings from main /drawings/id

    get(child(dbRef, `users/${user.sub}/drawings/`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          const fullUserGallary = snapshot.val();

          for (const drawing of Object.values(fullUserGallary)) {
            if (drawing.seconds === props.seconds) {
              fetchedDrawings.push(drawing);
            }
          }
        }
      })
      .then(() => {
        setLoadedDrawings(fetchedDrawings);
        if (props.seconds === 60) {
          pinnedCtx.setDrawings60(fetchedDrawings);
        } else if (props.seconds === 180) {
          pinnedCtx.setDrawings180(fetchedDrawings);
        } else {
          pinnedCtx.setDrawings300(fetchedDrawings);
        }
      });
  }, [props.seconds]);

  return (
    <Card>
      <div className={classes.innerModal}>
        <h3>{secondsIntoMinutes} Drawings</h3>
        <PinnedArtList drawings={loadedDrawings} />
      </div>
    </Card>
  );
};

export default PinnedModal;
