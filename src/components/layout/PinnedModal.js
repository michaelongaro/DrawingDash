import React, { useState, useEffect, useContext } from "react";
import { useAuth0 } from "@auth0/auth0-react";

import Card from "../../ui/Card";
import PinnedArtList from "./PinnedArtList";
import PinnedContext from "./PinnedContext";

import { getDatabase, get, ref, child } from "firebase/database";
import { app } from "../../util/init-firebase";

import OneMinuteIcon from "../../svgs/OneMinuteIcon";
import ThreeMinuteIcon from "../../svgs/ThreeMinuteIcon";
import FiveMinuteIcon from "../../svgs/FiveMinuteIcon";

import classes from "./PinnedArtwork.module.css";
import baseClasses from "../../index.module.css";
import { AnimatePresence, motion } from "framer-motion";

const PinnedModal = React.forwardRef((props, modalRef) => {
  const pinnedCtx = useContext(PinnedContext);

  const [loadedDrawingIDs, setLoadedDrawingIDs] = useState(null);
  const [durationIcon, setDurationIcon] = useState();

  const { user } = useAuth0();

  useEffect(() => {
    const dbRef = ref(getDatabase(app));
    const fetchedDrawingIDs = [];

    pinnedCtx.setManuallyChangedSelectedDrawing(false);

    // should fetch all user profile titles and save their vals (ids) in an array,
    // then loop through it down here and fetch the drawings from main /drawings/id

    get(child(dbRef, `users/${user.sub}/titles/${props.seconds}`)).then(
      (snapshot) => {
        if (snapshot.exists()) {
          console.log(snapshot.val());
          for (const drawingID of Object.values(snapshot.val())) {
            console.log(Object.values(snapshot.val()));
            // stores all drawingIDs for a given title in fetchedDrawingIDs
            console.log(Object.values(drawingID["drawingID"]));

            fetchedDrawingIDs.push(Object.values(drawingID["drawingID"]));
          }
        }
        setLoadedDrawingIDs(fetchedDrawingIDs.flat());

        if (props.seconds === 60) {
          setDurationIcon(<OneMinuteIcon dimensions="3em" />);
          pinnedCtx.setUser60DrawingIDs(fetchedDrawingIDs.flat());
        } else if (props.seconds === 180) {
          setDurationIcon(<ThreeMinuteIcon dimensions="3em" />);
          pinnedCtx.setUser180DrawingIDs(fetchedDrawingIDs.flat());
        } else if (props.seconds === 300) {
          setDurationIcon(<FiveMinuteIcon dimensions="3em" />);
          pinnedCtx.setUser300DrawingIDs(fetchedDrawingIDs.flat());
        }
      }
    );
  }, []);

  const variants = {
    open: { opacity: 1, scale: 1 },
    closed: { opacity: 0, scale: 0 },
  };

  return (
    <div
      // hmm maybe use framer motion here to do the fade in/out?
      style={{
        minWidth: "50vw",
        // width: loadedDrawingIDs
        //   ? loadedDrawingIDs.length === 0
        //     ? ""
        //     : "80%"
        //   : "80%",
        // height: loadedDrawingIDs
        //   ? loadedDrawingIDs.length === 0
        //     ? ""
        //     : "90vh"
        //   : "90vh",
        width: "80%",
        height: "90vh",
        boxShadow: "0 4px 8px rgb(0 0 0 / 20%)",
        borderRadius: "1em",
      }}
      // className={classes.card}
      ref={modalRef}
    >
      <div
        style={{
          height: "100%",
          paddingTop: "1em",
          justifyContent: "normal",
        }}
        className={classes.innerModal}
      >
        <div className={classes.topControlsContainer}>
          <div className={classes.save}>
            <button
              className={baseClasses.activeButton}
              disabled={!pinnedCtx.manuallyChangedSelectedDrawing}
              onClick={() => {
                pinnedCtx.updateDatabase(pinnedCtx.selectedPinnedDrawingIDs);
                pinnedCtx.setPinnedDrawingIDs(
                  pinnedCtx.selectedPinnedDrawingIDs
                );
                pinnedCtx.setShow60({ display: "none" });
                pinnedCtx.setShow180({ display: "none" });
                pinnedCtx.setShow300({ display: "none" });
                pinnedCtx.resetAllAndHighlightNewInit();
              }}
            >
              Save
            </button>
          </div>
          <div className={classes.title}>
            {durationIcon}
            <h3>{`${props.seconds / 60} Minute Drawings`}</h3>
          </div>
          <div className={classes.exit}>
            <button
              className={baseClasses.baseClose}
              onClick={() => {
                pinnedCtx.setShow60({ display: "none" });
                pinnedCtx.setShow180({ display: "none" });
                pinnedCtx.setShow300({ display: "none" });
                pinnedCtx.resetAllAndHighlightNewInit();
              }}
            ></button>
          </div>
        </div>

        {loadedDrawingIDs && (
          <div
            style={{ height: "85%", width: "90%" }}
            className={classes.gallaryList}
          >
            <PinnedArtList
              drawingIDs={loadedDrawingIDs}
              seconds={props.seconds}
            />
          </div>
        )}
      </div>
    </div>
    //     </motion.div>
    //   )}
    // </AnimatePresence>
  );
});

export default PinnedModal;
