import React, { useState, useEffect, useContext } from "react";

import anime from "animejs/lib/anime.es.js";
import DrawingSelectionContext from "./DrawingSelectionContext";
import BackupPaletteIcon from "../svgs/BackupPaletteIcon";

import classes from "./PaletteChooser.module.css";
import baseClasses from "../index.module.css";
import { isEqual } from "lodash";

const PaletteChooser = () => {
  const DSCtx = useContext(DrawingSelectionContext);

  const [initComponentWidth, setInitComponentWidth] = useState(1920);
  const [dynamicButtonDimensions, setDynamicButtonDimensions] = useState(1);
  const [dyanmicIconDimensions, setDyanmicIconDimensions] = useState("30em");

  const [reactToNextTouchStart, setReactToNextTouchStart] = useState(false);
  const [currentlySelectedColorPicker, setCurrentlySelectedColorPicker] =
    useState(null);
  const [currentlySelectedColorEvent, setCurrentlySelectedColorEvent] =
    useState(null);

  const [paletteColors, setPaletteColors] = useState([
    "#FFFFFF",
    "#FFFFFF",
    "#FFFFFF",
    "#FFFFFF",
    "#FFFFFF",
  ]);

  const [visibilityOfOverlays, setVisibilityOfOverlays] = useState([
    classes.showOverlay,
    classes.showOverlay,
    classes.showOverlay,
    classes.showOverlay,
    classes.showOverlay,
  ]);

  const [statusOfCheckmarks, setStatusOfCheckmarks] = useState([
    false,
    false,
    false,
    false,
    false,
  ]);

  const [nextDisabled, setNextDisabled] = useState(true);

  // useEffect(() => {
  //   let filteredArray = statusOfCheckmarks.filter(function (item, pos) {
  //     return statusOfCheckmarks.indexOf(item) === pos;
  //   });

  //   if (filteredArray.length === 1 && filteredArray[0] === true) {
  //     setNextDisabled(false);
  //   }
  // }, [statusOfCheckmarks]);

  useEffect(() => {
    anime({
      targets: "#paletteChooser",
      loop: false,
      translateX: window.innerWidth,
      opacity: [0, 1],
      direction: "normal",
      duration: 500,
      easing: "easeInSine",
      complete: () => {
        document.getElementById("root").scrollIntoView({ behavior: "smooth" });
      },
    });
  }, []);

  useEffect(() => {
    // just for initial render
    if (window.innerWidth <= 550) {
      setDynamicButtonDimensions(0.7);
      setDyanmicIconDimensions("20em");
    } else {
      setDynamicButtonDimensions(1);
      setDyanmicIconDimensions("30em");
    }

    function resizeHandler() {
      if (window.innerWidth <= 550) {
        setDynamicButtonDimensions(0.7);
        setDyanmicIconDimensions("20em");
      } else {
        setDynamicButtonDimensions(1);
        setDyanmicIconDimensions("30em");
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
      if (
        reactToNextTouchStart &&
        currentlySelectedColorEvent !== null &&
        currentlySelectedColorEvent
      ) {
        updatePaletteAndCheckmarkStates(
          currentlySelectedColorEvent,
          currentlySelectedColorPicker
        );
        setReactToNextTouchStart(false);
        setCurrentlySelectedColorEvent(null);
        setCurrentlySelectedColorPicker(null);
      }
    }

    window.addEventListener("touchstart", touchHandler);
    return () => {
      window.removeEventListener("touchstart", touchHandler);
    };
  }, [
    reactToNextTouchStart,
    currentlySelectedColorPicker,
    currentlySelectedColorEvent,
  ]);

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
    shallowCopyOverlays.splice(idx, 1, classes.hide);
    setVisibilityOfOverlays(shallowCopyOverlays);
  }

  function moveOntoDrawScreen() {
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
              gap: "7em",
              top: dynamicButtonDimensions === 1 ? "21%" : "12%",
              width: "100%",
              transform: `scale(${dynamicButtonDimensions})`,
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
                  className={classes.colorInput}
                  onTouchStart={(ev) => {
                    setCurrentlySelectedColorEvent(ev);
                    setCurrentlySelectedColorPicker(0);
                    setReactToNextTouchStart(true);
                  }}
                  onBlur={(event) => {
                    updatePaletteAndCheckmarkStates(event, 0);
                  }}
                />
                <div className={visibilityOfOverlays[0]}>?</div>
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
                  className={classes.colorInput}
                  onTouchStart={(ev) => {
                    setCurrentlySelectedColorEvent(ev);
                    setCurrentlySelectedColorPicker(1);
                    setReactToNextTouchStart(true);
                  }}
                  onBlur={(event) => {
                    updatePaletteAndCheckmarkStates(event, 1);
                  }}
                />
                <div className={visibilityOfOverlays[1]}>?</div>
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
                  className={classes.colorInput}
                  onTouchStart={(ev) => {
                    setCurrentlySelectedColorEvent(ev);
                    setCurrentlySelectedColorPicker(2);
                    setReactToNextTouchStart(true);
                  }}
                  onBlur={(event) => {
                    updatePaletteAndCheckmarkStates(event, 2);
                  }}
                />
                <div className={visibilityOfOverlays[2]}>?</div>
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
                  className={classes.colorInput}
                  onTouchStart={(ev) => {
                    setCurrentlySelectedColorEvent(ev);
                    setCurrentlySelectedColorPicker(3);
                    setReactToNextTouchStart(true);
                  }}
                  onBlur={(event) => {
                    updatePaletteAndCheckmarkStates(event, 3);
                  }}
                />

                <div className={visibilityOfOverlays[3]}>?</div>

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
                  className={classes.colorInput}
                  onTouchStart={(ev) => {
                    setCurrentlySelectedColorEvent(ev);
                    setCurrentlySelectedColorPicker(4);
                    setReactToNextTouchStart(true);
                  }}
                  onBlur={(event) => {
                    updatePaletteAndCheckmarkStates(event, 4);
                  }}
                />
                <div className={visibilityOfOverlays[4]}>?</div>
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
              DSCtx.updatePBStates("selectToChooseBar", false);
              DSCtx.setStartFromLeft(false);

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
                },
              });
            }}
          >
            Prev
          </button>
          <button
            className={baseClasses.activeButton}
            //nextDisabled
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
