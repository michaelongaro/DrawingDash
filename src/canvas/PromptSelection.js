import React, { useContext, useEffect, useState } from "react";
import anime from "animejs/lib/anime.es.js";
import { useAuth0 } from "@auth0/auth0-react";

import DrawingSelectionContext from "./DrawingSelectionContext";

// import { useAuth0 } from "@auth0/auth0-react";

import classes from "./Canvas.module.css";

const PromptSelection = () => {
  const { isLoading, isAuthenticated } = useAuth0();
  const DSCtx = useContext(DrawingSelectionContext);
  const [extraPrompt, setExtraPrompt] = useState("");
  const [dailyPrompts, setDailyPrompts] = useState({
    60: "",
    180: "",
    300: "",
  });
  const [showExtraPrompt, setShowExtraPrompt] = useState(classes.hide);

  const [completedDrawingStatuses, setCompletedDrawingStatuses] = useState({
    60: false,
    180: false,
    300: false,
    extra: false,
  });

  const [statusesAreSaved, setStatusesAreSaved] = useState(false);

  console.log(completedDrawingStatuses);

  useEffect(() => {
    if ((!isLoading, isAuthenticated)) {
      // if (
      //   DSCtx.drawingStatuses !== null &&
      //   DSCtx.dailyPrompts !== null &&
      //   DSCtx.uniquePrompt !== null
      // ) {
      //   DSCtx.setDrawingStatuses(null);
      //   DSCtx.setDailyPrompts(null);
      //   DSCtx.setUniquePrompt(null);
      // }

      DSCtx.getCompletedDrawingStatuses();
      DSCtx.getDailyPrompts();
      DSCtx.getUniquePrompt();
    }
  }, [isLoading, isAuthenticated]);

  // useEffect(() => {
  //   return () => {
  //     // cleanup resetting ctx values to null
  //     DSCtx.setDrawingStatuses(null);
  //     DSCtx.setDailyPrompts(null);
  //     DSCtx.setUniquePrompt(null);
  //   };
  // }, []);

  useEffect(() => {
    if (DSCtx.drawingStatuses !== null) {
      setCompletedDrawingStatuses(DSCtx.drawingStatuses);
      setStatusesAreSaved(true);
    }
  }, [DSCtx.drawingStatuses]);

  useEffect(() => {
    if (DSCtx.dailyPrompts !== null) {
      setDailyPrompts(DSCtx.dailyPrompts);
    }
  }, [DSCtx.dailyPrompts]);

  useEffect(() => {
    if (statusesAreSaved && DSCtx.uniquePrompt !== null) {
      if (
        DSCtx.drawingStatuses["60"] &&
        DSCtx.drawingStatuses["180"] &&
        DSCtx.drawingStatuses["300"] &&
        !DSCtx.drawingStatuses["extra"]
      ) {
        setExtraPrompt(DSCtx.uniquePrompt());
        setShowExtraPrompt("");
      }

      // if (!DSCtx.drawingStatuses["extra"]) {
      //   setShowExtraPrompt("");
      // }
    }
  }, [statusesAreSaved, DSCtx.uniquePrompt]);

  useEffect(() => {
    if (showExtraPrompt === "") {
      anime({
        targets: "#extraPrompt",
        translateY: "3em",
        loop: false,
        direction: "normal",
        duration: 1500,
        easing: "linear",
      });
    }
  }, [showExtraPrompt]);

  // READ THIS:
  // should find way to genuinely center the options, currenlty if one word is larger than others
  // then it skews it... or just figure out another way to make it look natural

  function updateStatesAndShowNextComponent(seconds, prompt) {
    DSCtx.setDrawingTime(seconds);
    DSCtx.setChosenPrompt(prompt);
    DSCtx.setShowPaletteChooser(true);
    DSCtx.setShowDrawingScreen(false);
    DSCtx.setShowEndOverlay(false);
    DSCtx.setShowEndOutline(false);
    DSCtx.setShowPromptSelection(false);
  }

  return (
    <>
      {isAuthenticated && (
        <div className={classes.timerSelectionsModal}>
          <div>{DSCtx.titleForPromptSelection()}</div>
          <div className={classes.horizContain}>
            <div className={`${classes.sidePadding} ${classes.redBackground}`}>
              <div className={classes.timeBorder}>1 Minute</div>
              <button
                disabled={completedDrawingStatuses["60"]}
                onClick={() => {
                  updateStatesAndShowNextComponent(60, dailyPrompts["60"]);
                }}
              >
                {dailyPrompts["60"]}
              </button>
            </div>
            <div
              className={`${classes.sidePadding} ${classes.yellowBackground}`}
            >
              <div className={classes.timeBorder}>3 Minutes</div>

              <button
                disabled={completedDrawingStatuses["180"]}
                onClick={() => {
                  updateStatesAndShowNextComponent(180, dailyPrompts["180"]);
                }}
              >
                {dailyPrompts["180"]}
              </button>
            </div>
            <div
              className={`${classes.sidePadding} ${classes.greenBackground}`}
            >
              <div className={classes.timeBorder}>5 Minutes</div>

              <button
                disabled={completedDrawingStatuses["300"]}
                onClick={() => {
                  updateStatesAndShowNextComponent(300, dailyPrompts["300"]);
                }}
              >
                {dailyPrompts["300"]}
              </button>
            </div>
          </div>

          <div id={"extraPrompt"} className={showExtraPrompt}>
            <div
              className={`${classes.sidePadding} ${classes.greenBackground}`}
            >
              <div className={classes.timeBorder}>{extraPrompt.seconds}</div>

              <button
                disabled={completedDrawingStatuses["extra"]}
                onClick={() => {
                  updateStatesAndShowNextComponent("extra", extraPrompt.title);
                }}
              >
                {extraPrompt.title}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PromptSelection;
