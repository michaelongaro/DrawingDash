import React, { useContext, useEffect, useState } from "react";

import DrawingSelectionContext from "./DrawingSelectionContext";

import classes from "./Canvas.module.css";
import ProgressBar from "./ProgressBar";
import PaletteChooser from "./PaletteChooser";
import PromptSelection from "./PromptSelection";
import DrawingScreen from "./DrawingScreen";

export function Canvas() {
  const DSCtx = useContext(DrawingSelectionContext);

  useEffect(() => {
    DSCtx.resetSelections();
  }, []);

  function renderCurrentScreen() {
    if (
      DSCtx.showPromptSelection &&
      !DSCtx.showPaletteChooser &&
      !DSCtx.showDrawingScreen
    ) {
      return <PromptSelection />;
    } else if (
      !DSCtx.showPromptSelection &&
      DSCtx.showPaletteChooser &&
      !DSCtx.showDrawingScreen
    ) {
      return <PaletteChooser />;
    } else if (
      !DSCtx.showPromptSelection &&
      !DSCtx.showPaletteChooser &&
      DSCtx.showDrawingScreen
    ) {
      return <DrawingScreen />;
    }
  }

  return (
    <div className={classes.flexContain}>
      <ProgressBar />

      {renderCurrentScreen()}
    </div>
  );
}
