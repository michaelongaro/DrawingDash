import React, { useContext, useState, useRef, useEffect } from "react";

import anime from "animejs/lib/anime.es.js";
import { useAuth0 } from "@auth0/auth0-react";

import DrawingSelectionContext from "./DrawingSelectionContext";

import classes from "./ProgressBar.module.css";

const ProgressBar = () => {
  const { isLoading, isAuthenticated } = useAuth0();

  const DSCtx = useContext(DrawingSelectionContext);

  const [firstCheckpointStyles, setFirstCheckpointStyles] = useState(
    classes.active
  );
  const [secondCheckpointStyles, setSecondCheckpointStyles] = useState(
    classes.inactive
  );
  const [thirdCheckpointStyles, setThirdCheckpointStyles] = useState(
    classes.inactive
  );

  const progressBarRef = useRef(null);

  const [localPBStates, setLocalPBStates] = useState({
    selectCircle: false,
    chooseCircle: false,
    drawCircle: false,
    selectToChooseBar: false,
    chooseToDrawBar: false,
    resetToSelectBar: false,
  });

  useEffect(() => {
    console.log(DSCtx.PBStates);
    // starting off with showing select prompt screen
    if (DSCtx.PBStates["selectCircle"] && !localPBStates["selectCircle"]) {
      let dailyDrawingsAreComplete;

      if (!isLoading && isAuthenticated) {
        dailyDrawingsAreComplete =
          DSCtx.drawingStatuses["60"] &&
          DSCtx.drawingStatuses["180"] &&
          DSCtx.drawingStatuses["300"] &&
          DSCtx.drawingStatuses["extra"];
      } else if (!isLoading && !isAuthenticated) {
        dailyDrawingsAreComplete =
          DSCtx.drawingStatuses["60"] &&
          DSCtx.drawingStatuses["180"] &&
          DSCtx.drawingStatuses["300"];
      }

      anime({
        targets: "#select",
        loop: false,
        width: [0, "28px"],
        minHeight: [0, "28px"],
        direction: "normal",
        duration: 300,
        easing: "easeInSine",
      });

      anime({
        targets: "#selectText",
        loop: false,
        direction: "normal",
        delay: 150,
        duration: 500,
        translateX: dailyDrawingsAreComplete ? 0 : [0, "265px"],
        translateY: dailyDrawingsAreComplete ? 0 : [0, "175px"],
        fontSize: ["1.25em", "1.5em"],
        fontWeight: [400, 600],
        color: ["rgb(100, 100, 100)", "rgb(0, 0, 0)"],
        easing: "easeInSine",
      });
    }

    // moving to choose screen
    if (
      DSCtx.PBStates["selectToChooseBar"] &&
      !localPBStates["selectToChooseBar"]
    ) {
      anime({
        targets: "#selectText",
        loop: false,
        direction: "normal",
        duration: 500,
        translateX: ["265px", 0],
        translateY: ["175px", 0],
        fontSize: ["1.5em", "1.25em"],
        fontWeight: [600, 400],
        color: ["rgb(0, 0, 0)", "rgb(100, 100, 100)"],
        easing: "easeInSine",
        complete: function () {
          anime({
            targets: "#chooseText",
            loop: false,
            direction: "normal",
            duration: 500,
            translateY: [0, "50px"],
            fontSize: ["1.25em", "1.5em"],
            fontWeight: [400, 600],
            color: ["rgb(100, 100, 100)", "rgb(0, 0, 0)"],
            easing: "easeInSine",
          });
        },
      });

      anime({
        targets: "#animatedGreenPB",
        loop: false,
        width: [0, "265px"],
        direction: "normal",
        duration: 350,
        easing: "easeInSine",
        complete: function () {
          anime({
            targets: "#choose",
            loop: false,
            width: [0, "28px"],
            minHeight: [0, "28px"],
            direction: "normal",
            duration: 300,
            easing: "easeInSine",
          });
        },
      });
    }

    // going back to select prompt screen
    if (
      !DSCtx.PBStates["selectToChooseBar"] &&
      localPBStates["selectToChooseBar"]
    ) {
      anime({
        targets: "#choose",
        loop: false,
        width: ["28px", 0],
        minHeight: ["28px", 0],
        direction: "normal",
        duration: 300,
        easing: "easeInSine",
        complete: function () {
          anime({
            targets: "#animatedGreenPB",
            loop: false,
            width: ["265px", 0],
            direction: "normal",
            duration: 350,
            easing: "easeInSine",
          });
        },
      });

      // do this right after
      anime({
        targets: "#chooseText",
        loop: false,
        direction: "normal",
        duration: 500,
        translateY: ["50px", 0],
        fontSize: ["1.5em", "1.25em"],
        fontWeight: [600, 400],
        color: ["rgb(0, 0, 0)", "rgb(100, 100, 100)"],
        easing: "easeInSine",
        complete: function () {
          anime({
            targets: "#selectText",
            loop: false,
            direction: "normal",
            duration: 500,
            translateX: [0, "265px"],
            translateY: [0, "175px"],
            fontSize: ["1.25em", "1.5em"],
            fontWeight: [400, 600],
            color: ["rgb(100, 100, 100)", "rgb(0, 0, 0)"],
            easing: "easeInSine",
          });
        },
      });
    }

    // moving to draw screen
    if (
      DSCtx.PBStates["chooseToDrawBar"] &&
      !localPBStates["chooseToDrawBar"]
    ) {
      anime({
        targets: "#animatedGreenPB",
        loop: false,
        width: ["265px", "520px"],
        direction: "normal",
        duration: 350,
        easing: "easeInSine",
        complete: function () {
          anime({
            targets: "#draw",
            loop: false,
            width: [0, "28px"],
            minHeight: [0, "28px"],
            direction: "normal",
            duration: 300,
            easing: "easeInSine",
          });
        },
      });

      anime({
        targets: "#chooseText",
        loop: false,
        direction: "normal",
        duration: 500,
        translateY: ["70px", 0],
        fontSize: ["1.5em", "1.25em"],
        fontWeight: [600, 400],
        color: ["rgb(0, 0, 0)", "rgb(100, 100, 100)"],
        easing: "easeInSine",
        complete: function () {
          anime({
            targets: "#drawText",
            loop: false,
            direction: "normal",
            duration: 500,
            fontSize: ["1.25em", "1.5em"],
            fontWeight: [400, 600],
            color: ["rgb(100, 100, 100)", "rgb(0, 0, 0)"],
            easing: "easeInSine",
          });
        },
      });
    }

    // moving everything back to default positions
    if (
      DSCtx.PBStates["resetToSelectBar"] &&
      !localPBStates["resetToSelectBar"]
    ) {
      // scroll progressBar into view when reset button is clicked
      progressBarRef.current.scrollIntoView({ behavior: "smooth" });

      anime({
        targets: "#draw",
        loop: false,
        width: ["28px", 0],
        minHeight: ["28px", 0],
        direction: "normal",
        duration: 50,
        easing: "easeInSine",
        complete: () => {
          anime({
            targets: "#animatedGreenPB",
            loop: false,
            width: ["520px", "265px"],
            direction: "normal",
            duration: 100,
            easing: "easeInSine",
            complete: () => {
              anime({
                targets: "#choose",
                loop: false,
                width: ["28px", 0],
                minHeight: ["28px", 0],
                direction: "normal",
                duration: 50,
                easing: "easeInSine",
                complete: () => {
                  anime({
                    targets: "#animatedGreenPB",
                    loop: false,
                    width: ["265px", 0],
                    direction: "normal",
                    duration: 100,
                    easing: "easeInSine",
                    complete: () => {
                      DSCtx.resetProgressBar();
                      setLocalPBStates({
                        selectCircle: false,
                        chooseCircle: false,
                        drawCircle: false,
                        selectToChooseBar: false,
                        chooseToDrawBar: false,
                        resetToSelectBar: false,
                      });
                    },
                  });
                },
              });
            },
          });
        },
      });
    }

    setLocalPBStates(DSCtx.PBStates);
  }, [isLoading, isAuthenticated, DSCtx.drawingStatuses, DSCtx.PBStates]);

  // useEffect(() => {
  //   if (DSCtx.showPromptSelection) {
  //     setFirstCheckpointStyles(classes.active);
  //   } else {
  //     setFirstCheckpointStyles(classes.inactive);
  //   }
  //   if (DSCtx.showPaletteChooser) {
  //     setSecondCheckpointStyles(classes.active);
  //   } else {
  //     setSecondCheckpointStyles(classes.inactive);
  //   }
  //   if (DSCtx.showDrawingScreen) {
  //     setThirdCheckpointStyles(classes.active);
  //   } else {
  //     setThirdCheckpointStyles(classes.inactive);
  //   }
  // }, [
  //   DSCtx.showPromptSelection,
  //   DSCtx.showPaletteChooser,
  //   DSCtx.showDrawingScreen,
  // ]);

  return (
    <div ref={progressBarRef} className={classes.rectangle}>
      {/* select circle */}
      <div className={classes.circle}>
        <div
          style={{ width: "28px", minHeight: "28px" }}
          className={classes.baseFlex}
        >
          <div id="select" className={classes.completedCircleSkeleton}></div>
        </div>

        <div
          id="animatedGreenPB"
          className={classes.completedProgressSkeleton}
          style={{ position: "absolute", top: 130, left: 700 }}
        ></div>

        <div id="selectText" className={classes.inactive}>
          Select
        </div>
      </div>

      {/* choose circle */}
      <div className={classes.circle}>
        <div
          style={{ width: "28px", minHeight: "28px" }}
          className={classes.baseFlex}
        >
          <div id="choose" className={classes.completedCircleSkeleton}></div>
        </div>

        <div id="chooseText" className={classes.inactive}>
          Choose
        </div>
      </div>

      {/* draw circle */}
      <div className={classes.circle}>
        <div
          style={{ width: "28px", minHeight: "28px" }}
          className={classes.baseFlex}
        >
          <div id="draw" className={classes.completedCircleSkeleton}></div>
        </div>
        <div id="drawText" className={classes.inactive}>
          Draw
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
