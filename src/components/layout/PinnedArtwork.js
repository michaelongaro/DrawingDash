import React from "react";
import { useState, useContext, useEffect, useRef } from "react";

import PinnedContext from "./PinnedContext";
import PinnedModal from "./PinnedModal";
import PinnedShowcaseItem from "./PinnedShowcaseItem";

import classes from "./PinnedArtwork.module.css";

const PinnedArtwork = () => {
  const pinnedCtx = useContext(PinnedContext);

  const [show60, setShow60] = useState({ display: "none" });
  const [show180, setShow180] = useState({ display: "none" });
  const [show300, setShow300] = useState({ display: "none" });

  const ref60 = useRef();
  const ref180 = useRef();
  const ref300 = useRef();

  const showModal = {
    position: "absolute",
    left: "15em",
    top: "7em",
    right: "5em",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: "3em",
  };

  useEffect(() => {
    let handler = (event) => {
      if (
        !ref60.current.contains(event.target) &&
        !ref180.current.contains(event.target) &&
        !ref300.current.contains(event.target)
      ) {
        setShow60({ display: "none" });
        setShow180({ display: "none" });
        setShow300({ display: "none" });
        pinnedCtx.resetAllAndHighlightNew("60", -1);
        pinnedCtx.resetAllAndHighlightNew("180", -1);
        pinnedCtx.resetAllAndHighlightNew("300", -1);

      }
    };

    document.addEventListener("mousedown", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
    };
  });

  return (
    <div className={classes.parentContain}>
      <h3>Pinned Artwork</h3>
      <div className={classes.pinnedContain}>
        <div onClick={() => setShow60(showModal)}>
          <div style={show60} ref={ref60}>
            <PinnedModal seconds={60} />
          </div>
          <PinnedShowcaseItem
            drawing={pinnedCtx.pinnedDrawings["60"]}
            timer={"One Minute"}
          />
        </div>

        <div onClick={() => setShow180(showModal)}>
          <div style={show180} ref={ref180}>
            <PinnedModal seconds={180} />
          </div>
          <PinnedShowcaseItem
            drawing={pinnedCtx.pinnedDrawings["180"]}
            timer={"Three Minutes"}
          />
        </div>

        <div onClick={() => setShow300(showModal)}>
          <div style={show300} ref={ref300}>
            <PinnedModal seconds={300} />
          </div>
          <PinnedShowcaseItem
            drawing={pinnedCtx.pinnedDrawings["300"]}
            timer={"Five Minutes"}
          />
        </div>
      </div>
    </div>
  );
};

export default PinnedArtwork;
