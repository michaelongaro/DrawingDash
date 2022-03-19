import React, { useContext, useEffect, useState } from "react";
import anime from "animejs/lib/anime.es.js";
import { useAuth0 } from "@auth0/auth0-react";

import DrawingSelectionContext from "./DrawingSelectionContext";

// import { useAuth0 } from "@auth0/auth0-react";

import classes from "./Canvas.module.css";

const PromptSelection = () => {
  const { isLoading, isAuthenticated } = useAuth0();
  const DSCtx = useContext(DrawingSelectionContext);

  const [showExtraPrompt, setShowExtraPrompt] = useState(classes.hide);
  const [formattedSeconds, setFormattedSeconds] = useState("");
  const [adaptiveBackground, setAdaptiveBackground] = useState("");
  const [stylingButtonClasses, setStylingButtonClasses] = useState([
    classes.pointer,
    classes.pointer,
    classes.pointer,
    classes.pointer,
  ]);

  useEffect(() => {
    if (
      DSCtx.drawingStatuses["60"] &&
      DSCtx.drawingStatuses["180"] &&
      DSCtx.drawingStatuses["300"] &&
      !DSCtx.drawingStatuses["extra"]
    ) {
      setShowExtraPrompt("");
    }

    setStylingButtonClasses([
      DSCtx.drawingStatuses["60"] ? classes.disabled : classes.pointer,
      DSCtx.drawingStatuses["180"] ? classes.disabled : classes.pointer,
      DSCtx.drawingStatuses["300"] ? classes.disabled : classes.pointer,
      DSCtx.drawingStatuses["extra"] ? classes.disabled : classes.pointer,
    ]);
  }, [DSCtx.drawingStatuses]);

  useEffect(() => {
    if (
      showExtraPrompt === "" &&
      DSCtx.extraPrompt.title !== "" &&
      !DSCtx.drawingStatuses["extra"]
    ) {
      if (DSCtx.extraPrompt.seconds === 60) {
        setFormattedSeconds("1 Minute");
        setAdaptiveBackground(classes.redBackground);
      } else if (DSCtx.extraPrompt.seconds === 180) {
        setFormattedSeconds("3 Minutes");
        setAdaptiveBackground(classes.yellowBackground);
      } else {
        setFormattedSeconds("5 Minutes");
        setAdaptiveBackground(classes.greenBackground);
      }

      anime({
        targets: "#extraPrompt",
        translateY: "1.5em",
        loop: false,
        opacity: [0, 1],
        direction: "normal",
        duration: 1500,
        easing: "linear",
      });
    }
  }, [showExtraPrompt, DSCtx.extraPrompt]);

  function updateStatesAndShowNextComponent(seconds, prompt, isExtra = false) {
    if (
      (isExtra && DSCtx.drawingStatuses["extra"]) ||
      (!isExtra && DSCtx.drawingStatuses[seconds])
    ) {
      return;
    }

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
      {!isLoading && isAuthenticated && (
        <div className={classes.timerSelectionsModal}>
          <div>{DSCtx.titleForPromptSelection()}</div>
          <div className={classes.horizContain}>
            <div
              className={`${classes.sidePadding} ${classes.redBackground} ${stylingButtonClasses[0]}`}
              onClick={() => {
                updateStatesAndShowNextComponent(60, DSCtx.dailyPrompts["60"]);
              }}
            >
              <div className={classes.timeBorder}>1 Minute</div>

              <div className={classes.promptTextMargin}>
                {DSCtx.dailyPrompts["60"]}
              </div>
            </div>
            <div
              className={`${classes.sidePadding} ${classes.yellowBackground} ${stylingButtonClasses[1]}`}
              onClick={() => {
                updateStatesAndShowNextComponent(
                  180,
                  DSCtx.dailyPrompts["180"]
                );
              }}
            >
              <div className={classes.timeBorder}>3 Minutes</div>

              <div className={classes.promptTextMargin}>
                {DSCtx.dailyPrompts["180"]}
              </div>
            </div>
            <div
              className={`${classes.sidePadding} ${classes.greenBackground} ${stylingButtonClasses[2]}`}
              onClick={() => {
                updateStatesAndShowNextComponent(
                  300,
                  DSCtx.dailyPrompts["300"]
                );
              }}
            >
              <div className={classes.timeBorder}>5 Minutes</div>

              <div className={classes.promptTextMargin}>
                {DSCtx.dailyPrompts["300"]}
              </div>
            </div>
          </div>

          <div
            id={"extraPrompt"}
            className={showExtraPrompt}
            style={{ maxWidth: "30%" }}
          >
            <div className={classes.horizContain}>
              <div
                className={`${classes.sidePadding} ${adaptiveBackground} ${stylingButtonClasses[3]}`}
                style={{ height: "100%" }}
                onClick={() => {
                  updateStatesAndShowNextComponent(
                    DSCtx.extraPrompt.seconds,
                    DSCtx.extraPrompt.title,
                    true
                  );
                }}
              >
                <div className={classes.timeBorder}>{formattedSeconds}</div>

                <div className={classes.promptTextMargin}>
                  {DSCtx.extraPrompt.title}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PromptSelection;
