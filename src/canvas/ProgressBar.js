import React, { useContext, useState, useEffect } from "react";
import DrawingSelectionContext from "./DrawingSelectionContext";

import classes from "./ProgressBar.module.css";

const ProgressBar = () => {
  const DSCtx = useContext(DrawingSelectionContext);

  const [firstCheckpointStyles, setFirstCheckpointStyles] = useState(classes.active);
  const [secondCheckpointStyles, setSecondCheckpointStyles] = useState(classes.inactive);
  const [thirdCheckpointStyles, setThirdCheckpointStyles] = useState(classes.inactive);

  useEffect(() => {
    if (DSCtx.showPromptSelection) {
      setFirstCheckpointStyles(classes.active);
    } else {
      setFirstCheckpointStyles(classes.inactive);
    }
    if (DSCtx.showPaletteChooser) {
      setSecondCheckpointStyles(classes.active);
    } else {
      setSecondCheckpointStyles(classes.inactive);
    }
    if (DSCtx.showDrawingScreen) {
      setThirdCheckpointStyles(classes.active);
    } else {
      setThirdCheckpointStyles(classes.inactive);
    }
  }, [DSCtx.showPromptSelection, DSCtx.showPaletteChooser, DSCtx.showDrawingScreen]);

  return (
    <div className={classes.rectangle}>
      <div className={classes.circle}>
        <div className={firstCheckpointStyles}>Select</div>
      </div>
      <div className={classes.circle}>
        <div className={secondCheckpointStyles}>Choose</div>
      </div>
      <div className={classes.circle}>
        <div className={thirdCheckpointStyles}>Draw</div>
      </div>
    </div>
  );
};

export default ProgressBar;
