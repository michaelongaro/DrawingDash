import React from "react";

import PinnedArt from "./PinnedArt";

import classes from "./GallaryList.module.css";

const PinnedArtList = (props) => {
  if (props.drawingIDs.length === 0) {
    return <div className={classes.centerMiddle}>No Drawings Found</div>;
  } else {
    return (
      <div className={classes.listContain}>
        {props.drawingIDs.map((drawingID, i) => (
          <PinnedArt
            key={i}
            drawingID={drawingID}
            idx={i}
            seconds={props.seconds}
          />
        ))}
      </div>
    );
  }
};

export default React.memo(PinnedArtList);
