import React, { useState, useEffect, useContext } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Card from "../../ui/Card";
import PinnedArtList from "./PinnedArtList";

import classes from "./PinnedArtwork.module.css";
import PinnedContext from "./PinnedContext";

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

    fetch(
      `https://drawing-dash-41f14-default-rtdb.firebaseio.com/${user.sub}.json`
    )
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        const drawings = [];
        for (const key in data) {
          if (Object.keys(data[key]).length > 1) {
            if (data[key].time === props.seconds) {
              const drawing = {
                id: key,
                ...data[key],
              };
              drawings.push(drawing);
            }
          }
        }

        setLoadedDrawings(drawings);
        if (props.seconds === 60) {
          pinnedCtx.setDrawings60(drawings);
        } else if (props.seconds === 180) {
          pinnedCtx.setDrawings180(drawings);
        } else {
          pinnedCtx.setDrawings300(drawings);
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
