import React, { useState, useEffect, useRef, useContext } from "react";

import PinnedContext from "./PinnedContext";

import GalleryItem from "../galleries/GalleryItem";

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
    pinnedCtx.setManuallyChangedSelectedDrawing(true);
    pinnedCtx.resetAllAndHighlightNew(`${props.seconds}`, props.idx);
    pinnedCtx.updateSelectedPinnedDrawingIDs(props.drawingID, props.seconds);
  }

  useEffect(() => {
    if (pinnedCtx.highlightedDrawingIDs[props.seconds].length !== 0) {
      setShowHighlighted(
        pinnedCtx.highlightedDrawingIDs[props.seconds][props.idx]
      );
    }
  }, [pinnedCtx.highlightedDrawingIDs]);

  return (
    <div ref={pinRef}>
      <div
        style={{ cursor: "pointer" }}
        className={`${classes.baseHoverHighlight} ${showHighlighted}`}
      >
        <GalleryItem
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
