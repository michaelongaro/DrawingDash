import React, { useContext, useState, useEffect, useRef } from "react";

import anime from "animejs/lib/anime.es.js";
import { useAuth0 } from "@auth0/auth0-react";
import { isEqual } from "lodash";
import { debounce } from "debounce";

import DrawingSelectionContext from "./DrawingSelectionContext";

import classes from "./ProgressBar.module.css";
import baseClasses from "../index.module.css";

const ProgressBar = () => {
  const { isLoading, isAuthenticated } = useAuth0();

  const DSCtx = useContext(DrawingSelectionContext);

  const rectangleRef = useRef(null);
  const selectTextRef = useRef(null);

  const [selectMoved, setSelectMoved] = useState(false);
  const [selectOffset, setSelectOffset] = useState(0);

  const [chooseMoved, setChooseMoved] = useState(false);
  const [chooseOffset, setChooseOffset] = useState(0);

  const [initInnerHeight, setInitInnerHeight] = useState(0);

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
    // just for initial render
    setSelectOffset(
      rectangleRef.current.getBoundingClientRect().width / 2 -
        selectTextRef.current.getBoundingClientRect().width / 2
    );

    function resizeHandler() {
      setSelectOffset(
        rectangleRef.current.getBoundingClientRect().width / 2 -
          selectTextRef.current.getBoundingClientRect().width / 2 +
          7
      ); // 7 is offset for text size changing from font size increase
    }

    window.addEventListener("resize", resizeHandler);
    return () => {
      window.removeEventListener("resize", resizeHandler);
    };
  }, []);

  useEffect(() => {
    // just for initial render
    if (document.getElementById("chooseTextContainer") !== null) {
      setChooseOffset(
        document.getElementById("chooseTextContainer").getBoundingClientRect()
          .top -
          169 -
          15
      );

      setInitInnerHeight(window.innerHeight);
    }

    function resizeHandler() {
      if (document.getElementById("chooseTextContainer") !== null) {
        // don't respond to viewport changes when mobile addressbar shows/hides
        // ignore restriction if on desktop
        if (
          (matchMedia("(hover: none), (pointer: coarse)").matches &&
            window.innerHeight === initInnerHeight) ||
          matchMedia("(hover: hover), (pointer: pointer)").matches
        )
          setChooseOffset(
            document
              .getElementById("chooseTextContainer")
              .getBoundingClientRect().top -
              169 -
              15
          );
      }
    }

    window.addEventListener("resize", resizeHandler);
    return () => {
      window.removeEventListener("resize", resizeHandler);
    };
  }, [initInnerHeight]);

  useEffect(() => {
    if (cleanupAllStates) {
      DSCtx.resetProgressBar();
      setCleanupAllStates(false);
    }
  }, [cleanupAllStates]);

  // easiest way to refactor, store all of these anime js functions
  // in their own files and then call them here (with same structure)

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
              width: ["95%", "50%"],
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
                      width: ["50%", 0],
                      direction: "normal",
                      duration: 200,
                      easing: "easeInSine",
                      complete: () => {
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

            left: [
              "-13px",
              `${
                rectangleRef.current.getBoundingClientRect().width / 2 -
                selectTextRef.current.getBoundingClientRect().width / 2
              }px`,
            ],
            top: ["20px", "140px"],

            // fontSize: ["1.25em", "1.5em"],
            scale: [1, 1.25],
            fontWeight: [400, 600],
            color: ["rgb(100, 100, 100)", "rgb(0, 0, 0)"],
            easing: "easeInSine",
            complete: () => {
              setSelectMoved(true);
            },
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
            left: -13,
            top: 20,
            // fontSize: ["1.5em", "1.25em"],
            scale: [1.25, 1],
            fontWeight: [600, 400],
            color: ["rgb(0, 0, 0)", "rgb(100, 100, 100)"],
            easing: "easeInSine",
            complete: function () {
              setSelectMoved(false);

              setChooseOffset(
                document
                  .getElementById("chooseTextContainer")
                  .getBoundingClientRect().top -
                  169 -
                  15
              );

              anime({
                targets: "#chooseText",
                loop: false,
                direction: "normal",
                duration: 500,
                top: [
                  20,
                  `${
                    document
                      .getElementById("chooseTextContainer")
                      .getBoundingClientRect().top -
                    169 -
                    15
                  }`,
                ],
                fontSize: ["1.25em", "1.5em"],
                fontWeight: [400, 600],
                color: ["rgb(100, 100, 100)", "rgb(0, 0, 0)"],
                easing: "easeInSine",
                complete: () => {
                  setChooseMoved(true);
                },
              });
            },
          });

          anime({
            targets: "#animatedGreenPB",
            loop: false,
            width: [0, "50%"],
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
                width: ["50%", 0],
                direction: "normal",
                duration: 350,
                easing: "easeInSine",
              });
            },
          });

          anime({
            targets: "#chooseText",
            loop: false,
            direction: "normal",
            duration: 500,
            top: 20,
            fontSize: ["1.5em", "1.25em"],
            fontWeight: [600, 400],
            color: ["rgb(0, 0, 0)", "rgb(100, 100, 100)"],
            easing: "easeInSine",
            complete: function () {
              setChooseMoved(false);

              anime({
                targets: "#selectText",
                loop: false,
                direction: "normal",
                duration: 500,

                left: [
                  "-13px",
                  `${
                    rectangleRef.current.getBoundingClientRect().width / 2 -
                    selectTextRef.current.getBoundingClientRect().width / 2
                  }px`,
                ],
                top: ["20px", "140px"],

                // fontSize: ["1.25em", "1.5em"],
                scale: [1, 1.25],
                fontWeight: [400, 600],
                color: ["rgb(100, 100, 100)", "rgb(0, 0, 0)"],
                easing: "easeInSine",
                complete: () => {
                  setSelectMoved(true);
                },
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
            width: ["50%", "95%"],
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
            top: 20,
            fontSize: ["1.5em", "1.25em"],
            fontWeight: [600, 400],
            color: ["rgb(0, 0, 0)", "rgb(100, 100, 100)"],
            easing: "easeInSine",
            complete: function () {
              setChooseMoved(false);

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
      // go back to default PB state when "prompts coming soon"
      // container is showing
      if (DSCtx.revertSelectCircle) {
        // resetting states to init
        anime({
          targets: "#select",
          loop: false,
          width: ["28px", 0],
          minHeight: ["28px", 0],
          direction: "normal",
          duration: 100,
          easing: "easeInSine",
        });

        anime({
          targets: "#selectText",
          loop: false,
          direction: "normal",
          duration: 150,

          left: [
            `${
              rectangleRef.current.getBoundingClientRect().width / 2 -
              selectTextRef.current.getBoundingClientRect().width / 2
            }px`,
            "-13px",
          ],
          top: ["140px", "20px"],

          // fontSize: ["1.5em", "1.25em"],
          scale: [1.25, 1],
          fontWeight: [600, 400],
          color: ["rgb(0, 0, 0)", "rgb(100, 100, 100)"],
          easing: "easeInSine",
          complete: () => {
            setSelectMoved(false);
          },
        });

        DSCtx.setRevertSelectCircle(false);
      }
      setLocalPBStates(DSCtx.PBStates);
    }
  }, [
    isLoading,
    isAuthenticated,
    DSCtx.revertSelectCircle,
    DSCtx.PBStates,
    localPBStates,
  ]);

  return (
    <div ref={rectangleRef} className={classes.rectangle}>
      {/* select circle */}
      <div className={classes.circle}>
        <div className={`${classes.circleContainer} ${baseClasses.baseFlex}`}>
          <div id="select" className={classes.completedCircleSkeleton}></div>
        </div>

        <div
          id="animatedGreenPB"
          className={classes.completedProgressSkeleton}
          style={{ position: "absolute", top: 0, left: "15px" }}
        ></div>

        <div
          id="selectText"
          ref={selectTextRef}
          style={
            selectMoved
              ? {
                  position: "absolute",

                  left: `${selectOffset}px`,
                  top: "140px",
                }
              : { position: "absolute", left: -13, top: 20 }
          }
          className={classes.inactive}
        >
          Select
        </div>
      </div>

      {/* choose circle */}
      <div className={classes.circle}>
        <div className={`${classes.circleContainer} ${baseClasses.baseFlex}`}>
          <div id="choose" className={classes.completedCircleSkeleton}></div>
        </div>

        <div
          style={
            chooseMoved
              ? {
                  position: "absolute",
                  top: `${chooseOffset}px`,
                }
              : { position: "absolute", top: 20 }
          }
          id="chooseText"
          className={classes.inactive}
        >
          Choose
        </div>
      </div>

      {/* draw circle */}
      <div className={classes.circle}>
        <div className={`${classes.circleContainer} ${baseClasses.baseFlex}`}>
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
