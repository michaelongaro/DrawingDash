import React, { useContext, useEffect, useState } from "react";

import DrawingSelectionContext from "./DrawingSelectionContext";

import ProgressBar from "./ProgressBar";
import PaletteChooser from "./PaletteChooser";
import PromptSelection from "./PromptSelection";
import DrawingScreen from "./DrawingScreen";

import baseClasses from "../../index.module.css";

export function Canvas() {
  const DSCtx = useContext(DrawingSelectionContext);

  const [showProgressBar, setShowProgressBar] = useState(false);

  useEffect(() => {
    // used because when transitioning to page, was small gap where
    // progress bar showed at bottom of screen (before the {currentScreen}
    // was chosen/rendered)
    let timeoutID = setTimeout(() => setShowProgressBar(true), 200);

    DSCtx.setShowPromptSelection(true);

    return () => {
      clearTimeout(timeoutID);

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
    // style={{ height: "1500px" }}
    <div className={baseClasses.baseVertFlex}>
      {showProgressBar && <ProgressBar />}
      {renderCurrentScreen()}
    </div>
  );
}
