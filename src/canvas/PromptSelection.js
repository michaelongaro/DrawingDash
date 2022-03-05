import React, { useContext, useEffect, useState } from "react";

import RandomWords from "../components/layout/RandomWords";
import DrawingSelectionContext from "./DrawingSelectionContext";

import classes from "./Canvas.module.css";

const PromptSelection = () => {
  const DSCtx = useContext(DrawingSelectionContext);

  useEffect(() => {
    if (DSCtx.buttonAvailabilty === [false, false, false]) {
      DSCtx.setFetchNewWords(true);
    }
  }, []);

  //add useeffect to show randomwords when they are all done loading i guess?


  // READ THIS:
  // should find way to genuinely center the options, currenlty if one word is larger than others
  // then it skews it... or just figure out another way to make it look natural

  function updateStatesAndShowNextComponent(seconds, idx) {
    const shallowButtonAvailability = [...DSCtx.buttonAvailabilty];
    shallowButtonAvailability.splice(idx, 1, false);
    DSCtx.setButtonAvailabilty(shallowButtonAvailability);

    DSCtx.setDrawingTime(seconds);
    DSCtx.setShowPaletteChooser(true);
    DSCtx.setShowDrawingScreen(false);
    DSCtx.setShowEndOverlay(false);
    DSCtx.setShowEndOutline(false);
    DSCtx.setShowPromptSelection(false);
  }

  return (
    <div className={classes.timerSelectionsModal}>
      <div>{DSCtx.titleForPromptSelection()}</div>
      <div className={classes.horizContain}>
        <div className={`${classes.sidePadding} ${classes.redBackground}`}>
          <div
            className={classes.timeBorder}
          >
            1 Minute
          </div>
          <button
            disabled={!DSCtx.buttonAvailabilty[0]}
            onClick={() => {
              updateStatesAndShowNextComponent(60, 0);
            }}
          >
            <RandomWords time={60} />
          </button>
        </div>
        <div className={`${classes.sidePadding} ${classes.yellowBackground}`}>
          <div
            className={classes.timeBorder}
          >
            3 Minutes
          </div>

          <button
            disabled={!DSCtx.buttonAvailabilty[1]}
            onClick={() => {
              updateStatesAndShowNextComponent(180, 1);
            }}
          >
            <RandomWords time={180} />
          </button>
        </div>
        <div className={`${classes.sidePadding} ${classes.greenBackground}`}>
          <div
            className={classes.timeBorder}
          >
            5 Minutes
          </div>

          <button
            disabled={!DSCtx.buttonAvailabilty[2]}
            onClick={() => {
              updateStatesAndShowNextComponent(300, 2);
            }}
          >
            <RandomWords time={300} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PromptSelection;
