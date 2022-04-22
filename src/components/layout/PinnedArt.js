import React, { useState, useEffect, useRef, useContext } from "react";

import PinnedContext from "./PinnedContext";

import GallaryItem from "./GallaryItem";

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
    pinnedCtx.resetAllAndHighlightNew(`${props.seconds}`, props.idx);
    pinnedCtx.updateSelectedPinnedDrawings(
      props.drawingID,
      props.seconds
    );
  }

  useEffect(() => {
    if (pinnedCtx.highlightedDrawings[props.seconds].length !== 0) {
      setShowHighlighted(
        pinnedCtx.highlightedDrawings[props.seconds][props.idx]
      );
    }
  }, [pinnedCtx.highlightedDrawings]);

  return (
    <div ref={pinRef}>
      <div className={`${classes.baseHoverHighlight} ${showHighlighted}`}>
        <GallaryItem
          drawingID={props.drawingID}
          settings={{
            width: 100,
            forHomepage: false,
            forPinnedShowcase: false,
            forPinnedItem: true,
            skeleHeight: "18em",
            skeleDateWidth: "50%",
            skeleTitleWidth: "50%",
          }}
        />
      </div>
    </div>
  );
};

export default React.memo(PinnedArt);
