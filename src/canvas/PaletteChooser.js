import React, { useState, useEffect, useContext, useRef } from "react";

import anime from "animejs/lib/anime.es.js";
import { isEqual } from "lodash";

import DrawingSelectionContext from "./DrawingSelectionContext";

import BackupPaletteIcon from "../svgs/BackupPaletteIcon";

import classes from "./PaletteChooser.module.css";
import baseClasses from "../index.module.css";

const PaletteChooser = () => {
  const DSCtx = useContext(DrawingSelectionContext);

  const [initComponentWidth, setInitComponentWidth] = useState(1920);
  const [dynamicButtonDimensions, setDynamicButtonDimensions] = useState(1);
  const [dyanmicIconDimensions, setDyanmicIconDimensions] = useState("27em");

  const firstColorRef = useRef(null);
  const secondColorRef = useRef(null);
  const thirdColorRef = useRef(null);
  const fourthColorRef = useRef(null);
  const fifthColorRef = useRef(null);

  const [paletteColors, setPaletteColors] = useState([
    "#FFFFFF",
    "#FFFFFF",
    "#FFFFFF",
    "#FFFFFF",
    "#FFFFFF",
  ]);

  const [visibilityOfOverlays, setVisibilityOfOverlays] = useState([
    true,
    true,
    true,
    true,
    true,
  ]);

  const [statusOfCheckmarks, setStatusOfCheckmarks] = useState([
    false,
    false,
    false,
    false,
    false,
  ]);

  useEffect(() => {
    document.getElementById("root").scrollIntoView({ behavior: "smooth" });

    anime({
      targets: "#paletteChooser",
      loop: false,
      translateX: window.innerWidth,
      opacity: [0, 1],
      direction: "normal",
      duration: 500,
      easing: "easeInSine",
    });
  }, []);

  useEffect(() => {
    // just for initial render
    if (window.innerWidth <= 550) {
      setDynamicButtonDimensions(0.7);
      setDyanmicIconDimensions("20em");
    } else {
      setDynamicButtonDimensions(1);
      setDyanmicIconDimensions("27em");
    }

    function resizeHandler() {
      if (window.innerWidth <= 550) {
        setDynamicButtonDimensions(0.7);
        setDyanmicIconDimensions("20em");
      } else {
        setDynamicButtonDimensions(1);
        setDyanmicIconDimensions("27em");
      }
    }

    window.addEventListener("resize", resizeHandler);
    return () => {
      window.removeEventListener("resize", resizeHandler);
    };
  }, []);

  useEffect(() => {
    setInitComponentWidth(window.innerWidth);
  }, []);

  useEffect(() => {
    function touchHandler(ev) {
      firstColorRef.current.blur();
      secondColorRef.current.blur();
      thirdColorRef.current.blur();
      fourthColorRef.current.blur();
      fifthColorRef.current.blur();
    }

    window.addEventListener("touchmove", touchHandler);
    return () => {
      window.removeEventListener("touchmove", touchHandler);
    };
  }, []);

  function updatePaletteAndCheckmarkStates(event, idx) {
    const shallowCopyPalettes = [...paletteColors];
    shallowCopyPalettes.splice(idx, 1, event.target.value);
    setPaletteColors(shallowCopyPalettes);

    const shallowCheckmarks = [...statusOfCheckmarks];
    shallowCheckmarks.splice(idx, 1, true);
    setStatusOfCheckmarks(shallowCheckmarks);
  }

  function updateOverlayState(idx) {
    const shallowCopyOverlays = [...visibilityOfOverlays];
    shallowCopyOverlays.splice(idx, 1, false);
    setVisibilityOfOverlays(shallowCopyOverlays);
  }

  function moveOntoDrawScreen() {
    document.getElementById("root").scrollIntoView({ behavior: "smooth" });

    DSCtx.setExtendLayoutHeight(true);

    anime({
      targets: "#paletteChooser",
      loop: false,
      translateX: window.innerWidth * 2,
      opacity: [1, 0],
      direction: "normal",
      duration: 500,
      easing: "easeInSine",
      complete: function () {
        DSCtx.setPaletteColors(paletteColors);
        DSCtx.setSeconds(3);
        DSCtx.setShowPaletteChooser(false);
        DSCtx.setShowDrawingScreen(true);
        DSCtx.setStartFromLeft(true);
      },
    });
  }

  return (
    <div
      id={"paletteChooser"}
      style={{
        position: "relative",
        left: `${-1 * initComponentWidth}px`,
        top: "5vh",
        width: "100vw",
      }}
      className={classes.vertContain}
    >
      <div id={"chooseTextContainer"} className={classes.textVert}>
        <div>{`A Color Palette For`}</div>
        <div>{`"${DSCtx.chosenPrompt}"`}</div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
        className={classes.paletteIconContainer}
      >
        {/* containing div for svg and inputs */}
        <div style={{ position: "relative" }}>
          <BackupPaletteIcon dimensions={dyanmicIconDimensions} />
          <div
            style={{
              position: "absolute",
              gap: dynamicButtonDimensions === 1 ? "5.5em" : "7em",
              top: dynamicButtonDimensions === 1 ? "21%" : "12%",
              width: "100%",
              transform: `scale(${dynamicButtonDimensions})`,
              transition: "all 200ms",
            }}
            className={baseClasses.baseVertFlex}
          >
            <div className={classes.horizContain}>
              <div
                className={classes.flexContainer}
                onClick={() => {
                  updateOverlayState(0);
                }}
              >
                <input
                  type="color"
                  ref={firstColorRef}
                  className={classes.colorInput}
                  onBlur={(event) => {
                    updatePaletteAndCheckmarkStates(event, 0);
                  }}
                />
                <div
                  style={{ opacity: visibilityOfOverlays[0] ? 1 : 0 }}
                  className={classes.showOverlay}
                >
                  ?
                </div>
                <div
                  className={classes.circle}
                  style={{
                    background: `${
                      statusOfCheckmarks[0] ? "green" : "#905532"
                    }`,
                    opacity: `${statusOfCheckmarks[0] ? "1" : "0"}`,
                  }}
                >
                  <div
                    style={{
                      borderBottom: `2px solid ${
                        statusOfCheckmarks[0] ? "white" : "#905532"
                      }`,
                      borderRight: `2px solid ${
                        statusOfCheckmarks[0] ? "white" : "#905532"
                      }`,
                    }}
                    className={`${statusOfCheckmarks[0]} ${classes.checkmark}`}
                  ></div>
                </div>
              </div>

              <div
                className={classes.flexContainer}
                onClick={() => {
                  updateOverlayState(1);
                }}
              >
                <input
                  type="color"
                  ref={secondColorRef}
                  className={classes.colorInput}
                  onBlur={(event) => {
                    updatePaletteAndCheckmarkStates(event, 1);
                  }}
                />
                <div
                  style={{ opacity: visibilityOfOverlays[1] ? 1 : 0 }}
                  className={classes.showOverlay}
                >
                  ?
                </div>
                <div
                  className={classes.circle}
                  style={{
                    background: `${
                      statusOfCheckmarks[1] ? "green" : "#905532"
                    }`,
                    opacity: `${statusOfCheckmarks[1] ? "1" : "0"}`,
                  }}
                >
                  <div
                    style={{
                      borderBottom: `2px solid ${
                        statusOfCheckmarks[1] ? "white" : "#905532"
                      }`,
                      borderRight: `2px solid ${
                        statusOfCheckmarks[1] ? "white" : "#905532"
                      }`,
                    }}
                    className={`${statusOfCheckmarks[1]} ${classes.checkmark}`}
                  ></div>
                </div>
              </div>

              <div
                className={classes.flexContainer}
                onClick={() => {
                  updateOverlayState(2);
                }}
              >
                <input
                  type="color"
                  ref={thirdColorRef}
                  className={classes.colorInput}
                  onBlur={(event) => {
                    updatePaletteAndCheckmarkStates(event, 2);
                  }}
                />
                <div
                  style={{ opacity: visibilityOfOverlays[2] ? 1 : 0 }}
                  className={classes.showOverlay}
                >
                  ?
                </div>
                <div
                  className={classes.circle}
                  style={{
                    background: `${
                      statusOfCheckmarks[2] ? "green" : "#905532"
                    }`,
                    opacity: `${statusOfCheckmarks[2] ? "1" : "0"}`,
                  }}
                >
                  <div
                    style={{
                      borderBottom: `2px solid ${
                        statusOfCheckmarks[2] ? "white" : "#905532"
                      }`,
                      borderRight: `2px solid ${
                        statusOfCheckmarks[2] ? "white" : "#905532"
                      }`,
                    }}
                    className={`${statusOfCheckmarks[2]} ${classes.checkmark}`}
                  ></div>
                </div>
              </div>
            </div>
            <div className={classes.horizContain}>
              <div
                className={classes.flexContainer}
                onClick={() => {
                  updateOverlayState(3);
                }}
              >
                <input
                  type="color"
                  ref={fourthColorRef}
                  className={classes.colorInput}
                  onBlur={(event) => {
                    updatePaletteAndCheckmarkStates(event, 3);
                  }}
                />

                <div
                  style={{ opacity: visibilityOfOverlays[3] ? 1 : 0 }}
                  className={classes.showOverlay}
                >
                  ?
                </div>

                <div
                  className={classes.circle}
                  style={{
                    background: `${
                      statusOfCheckmarks[3] ? "green" : "#905532"
                    }`,
                    opacity: `${statusOfCheckmarks[3] ? "1" : "0"}`,
                  }}
                >
                  <div
                    style={{
                      borderBottom: `2px solid ${
                        statusOfCheckmarks[3] ? "white" : "#905532"
                      }`,
                      borderRight: `2px solid ${
                        statusOfCheckmarks[3] ? "white" : "#905532"
                      }`,
                    }}
                    className={`${statusOfCheckmarks[3]} ${classes.checkmark}`}
                  ></div>
                </div>
              </div>

              <div
                className={classes.flexContainer}
                onClick={() => {
                  updateOverlayState(4);
                }}
              >
                <input
                  type="color"
                  ref={fifthColorRef}
                  className={classes.colorInput}
                  onBlur={(event) => {
                    updatePaletteAndCheckmarkStates(event, 4);
                  }}
                />
                <div
                  style={{ opacity: visibilityOfOverlays[4] ? 1 : 0 }}
                  className={classes.showOverlay}
                >
                  ?
                </div>
                <div
                  className={classes.circle}
                  style={{
                    background: `${
                      statusOfCheckmarks[4] ? "green" : "#905532"
                    }`,
                    opacity: `${statusOfCheckmarks[4] ? "1" : "0"}`,
                  }}
                >
                  <div
                    style={{
                      borderBottom: `2px solid ${
                        statusOfCheckmarks[4] ? "white" : "#905532"
                      }`,
                      borderRight: `2px solid ${
                        statusOfCheckmarks[4] ? "white" : "#905532"
                      }`,
                    }}
                    className={`${statusOfCheckmarks[4]} ${classes.checkmark}`}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          style={{ gap: "1.5em", marginTop: "2em" }}
          className={baseClasses.baseFlex}
        >
          <button
            className={baseClasses.activeButton}
            onClick={() => {
              DSCtx.setStartFromLeft(false);

              document
                .getElementById("root")
                .scrollIntoView({ behavior: "smooth" });

              anime({
                targets: "#paletteChooser",
                loop: false,
                translateX: -1 * window.innerWidth,
                opacity: [1, 0],
                direction: "normal",
                duration: 500,
                easing: "easeInSine",
                complete: () => {
                  DSCtx.goBackToPromptSelection();
                  DSCtx.updatePBStates("selectToChooseBar", false);
                },
              });
            }}
          >
            Prev
          </button>
          <button
            className={baseClasses.activeButton}
            disabled={
              !isEqual(statusOfCheckmarks, [true, true, true, true, true])
            }
            onClick={() => {
              DSCtx.updatePBStates("chooseToDrawBar", true);
              moveOntoDrawScreen();
            }}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaletteChooser;
