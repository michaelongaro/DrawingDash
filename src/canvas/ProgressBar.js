import React, { useContext, useState, useEffect } from "react";

import anime from "animejs/lib/anime.es.js";
import { useAuth0 } from "@auth0/auth0-react";
import { isEqual } from "lodash";

import DrawingSelectionContext from "./DrawingSelectionContext";

import classes from "./ProgressBar.module.css";

const ProgressBar = () => {
  const { isLoading, isAuthenticated } = useAuth0();

  const DSCtx = useContext(DrawingSelectionContext);

  const [localPBStates, setLocalPBStates] = useState({
    selectCircle: false,
    chooseCircle: false,
    drawCircle: false,
    selectToChooseBar: false,
    chooseToDrawBar: false,
    resetToSelectBar: false,
  });

  const [cleanupAllStates, setCleanupAllStates] = useState(false);

  useEffect(() => {
    if (cleanupAllStates) {
      DSCtx.resetProgressBar();
    }
  }, [cleanupAllStates]);

  // EXTREMELY MESSY, would love to refactor one day

  useEffect(() => {
    // only check for states if context (current) values are populated
    if (
      !isEqual(DSCtx.PBStates, {
        selectCircle: false,
        chooseCircle: false,
        drawCircle: false,
        selectToChooseBar: false,
        chooseToDrawBar: false,
        resetToSelectBar: false,
      })
    ) {
      if (
        DSCtx.PBStates["resetToSelectBar"] &&
        !localPBStates["resetToSelectBar"]
      ) {
        // moving everything back to default positions

        anime({
          targets: "#draw",
          loop: false,
          width: ["28px", 0],
          minHeight: ["28px", 0],
          direction: "normal",
          duration: 100,
          easing: "easeInSine",
        });

        anime({
          targets: "#drawText",
          loop: false,
          fontSize: ["1.5em", "1.25em"],
          fontWeight: [600, 400],
          color: ["rgb(0, 0, 0)", "rgb(100, 100, 100)"],
          direction: "normal",
          duration: 100,
          easing: "easeInSine",
          complete: () => {
            anime({
              targets: "#animatedGreenPB",
              loop: false,
              width: ["520px", "265px"],
              direction: "normal",
              duration: 200,
              easing: "easeInSine",
              complete: () => {
                anime({
                  targets: "#choose",
                  loop: false,
                  width: ["28px", 0],
                  minHeight: ["28px", 0],
                  direction: "normal",
                  duration: 100,
                  easing: "easeInSine",
                  complete: () => {
                    anime({
                      targets: "#animatedGreenPB",
                      loop: false,
                      width: ["265px", 0],
                      direction: "normal",
                      duration: 200,
                      easing: "easeInSine",
                      complete: () => {
                        console.log("totally finished and resetting");

                        setCleanupAllStates(true);
                        return;
                      },
                    });
                  },
                });
              },
            });
          },
        });
      } else {
        // starting off with showing select prompt screen
        if (DSCtx.PBStates["selectCircle"] && !localPBStates["selectCircle"]) {
          console.log("1");
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
            fontSize: dailyDrawingsAreComplete ? "1.25em" : ["1.25em", "1.5em"],
            fontWeight: dailyDrawingsAreComplete ? 400 : [400, 600],
            color: dailyDrawingsAreComplete
              ? "rgb(100, 100, 100)"
              : ["rgb(100, 100, 100)", "rgb(0, 0, 0)"],
            easing: "easeInSine",
          });
        }

        // moving to choose screen
        if (
          DSCtx.PBStates["selectToChooseBar"] &&
          !localPBStates["selectToChooseBar"]
        ) {
          console.log("2");

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

          // DSCtx.updatePBStates("chooseCircle", true)
        }

        // going back to select prompt screen
        if (
          !DSCtx.PBStates["selectToChooseBar"] &&
          localPBStates["selectToChooseBar"]
        ) {
          console.log("3");

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
          console.log("4");

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
        if (!isEqual(DSCtx.PBStates, localPBStates)) {
          setLocalPBStates(DSCtx.PBStates);
        }
      }
    } else {
      setLocalPBStates(DSCtx.PBStates);
    }
  }, [
    isLoading,
    isAuthenticated,
    DSCtx.drawingStatuses,
    DSCtx.PBStates,
    localPBStates,
  ]);

  return (
    <div className={classes.rectangle}>
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
          style={{ position: "absolute", top: 0, left: "15px" }}
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
