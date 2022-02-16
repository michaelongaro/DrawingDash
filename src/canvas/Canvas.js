import React, { useContext, useEffect, useState } from "react";

import DrawingSelectionContext from "./DrawingSelectionContext";

import classes from "./Canvas.module.css";
import ProgressBar from "./ProgressBar";
import PaletteChooser from "./PaletteChooser";
import PromptSelection from "./PromptSelection";
import DrawingScreen from "./DrawingScreen";

export function Canvas() {
  const DSCtx = useContext(DrawingSelectionContext);
  // do not delete this!
  // will have to set any FIRST time just initializing statements in this file for the context
  // such AS: having clean sweep for the context whenever somebody comes back onto this page again,
  // probably make it into a function
  useEffect(() => {
    DSCtx.resetSelections();
    // console.log(DSCtx.pushTimeout, "should be empty");
  }, []);

  // const [showPromptSelection, setShowPromptSelection] = useState(true);
  // const [showPaletteChooser, setShowPaletteChooser] = useState(false);
  // const [showDrawingScreen, setShowDrawingScreen] = useState(false);

  // might need to have this but with empty inside, just "react" to new states in the ctx.
  // useEffect(() => {
  //   if (DSCtx.showPromptSelection) {
  //     setShowPromptSelection("");
  //   } else {
  //     setShowPromptSelection(classes.hide);
  //   }

  //   if (DSCtx.showPaletteChooser) {
  //     setShowPaletteChooser("");
  //   } else {
  //     setShowPaletteChooser(classes.hide);
  //   }

  //   if (DSCtx.showDrawingScreen) {
  //     setShowDrawingScreen("");
  //   } else {
  //     setShowDrawingScreen(classes.hide);
  //   }
  // }, [
  //   DSCtx.showPromptSelection,
  //   DSCtx.showPaletteChooser,
  //   DSCtx.showDrawingScreen,
  // ]);

  function renderCurrentScreen() {
    // console.log(DSCtx.showPromptSelection && !DSCtx.showPaletteChooser && !DSCtx.showDrawingScreen);
    if (DSCtx.showPromptSelection && !DSCtx.showPaletteChooser && !DSCtx.showDrawingScreen) {
        return <PromptSelection />
      } else if (!DSCtx.showPromptSelection && DSCtx.showPaletteChooser && !DSCtx.showDrawingScreen) {
        return <PaletteChooser />
      } else if (!DSCtx.showPromptSelection && !DSCtx.showPaletteChooser && DSCtx.showDrawingScreen) {
        return <DrawingScreen />
      }

  }

  return (
    <div className={classes.flexContain}>
      <ProgressBar />

      {renderCurrentScreen()}
      
      {/* <div className={showPromptSelection}>
        <PromptSelection />
      </div>

      <div className={showPaletteChooser}>
        <PaletteChooser />
      </div>

      <div className={showDrawingScreen}>
        <DrawingScreen />
      </div> */}
    </div>
  );
}
