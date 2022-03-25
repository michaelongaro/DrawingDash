import React, { useState, useEffect, useRef, useContext } from "react";
import Card from "../../ui/Card";

import PinnedContext from "./PinnedContext";

import classes from "./PinnedArt.module.css";

const PinnedArt = (props) => {
  const pinnedCtx = useContext(PinnedContext);
  const pinRef = useRef(null);

  const [showHighlighted, setShowHighlighted] = useState("");

  useEffect(() => {
    pinRef.current.addEventListener("click", updateContext);

    let cleanupPinRef = pinRef.current;
    return () => {
      cleanupPinRef.removeEventListener("click", updateContext);
    };
  }, []);

  function updateContext() {
    // console.log("called in reg");
    pinnedCtx.resetAllAndHighlightNew(props.drawing.seconds, props.idx);
    pinnedCtx.setPinnedDrawing(props.drawing, props.drawing.seconds);
    // still need to add the "save" and "exit" buttons to top right of modal, but in meantime
    // figure out why isn't highlighting/saving
  }

  useEffect(() => {
    if (pinnedCtx.highlightedDrawings[props.drawing.seconds].length !== 0) {
      setShowHighlighted(
        pinnedCtx.highlightedDrawings[props.drawing.seconds][props.idx]
      );
    }
  }, [pinnedCtx.highlightedDrawings]);

  // should probably swap this out with a modularized version of gallaryitem,
  // with ability to not show userDrawn
  return (
    <div ref={pinRef}>
      <div className={`${classes.baseHoverHighlight} ${showHighlighted}`}>
        <Card>
          <img src={props.drawing.image} alt={props.drawing.title} />
          <div className={classes.bottomContain}>
            <div>{props.drawing.title}</div>
            <div>{props.drawing.date}</div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PinnedArt;
