import React, { useContext, useEffect, useState } from "react";

import DrawingSelectionContext from "./DrawingSelectionContext";

import ProgressBar from "./ProgressBar";
import PaletteChooser from "./PaletteChooser";
import PromptSelection from "./PromptSelection";
import DrawingScreen from "./DrawingScreen";

import classes from "./Canvas.module.css";

export function Canvas() {
  const DSCtx = useContext(DrawingSelectionContext);

  useEffect(() => {
    return () => {
      // resetting all context data
      DSCtx.setStartFromLeft(true);
      DSCtx.resetProgressBar();
      DSCtx.resetSelections();
    };
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
