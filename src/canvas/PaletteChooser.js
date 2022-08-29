import React, { useState, useEffect, useContext, useRef } from "react";

import { HexColorPicker } from "react-colorful";
import anime from "animejs/lib/anime.es.js";
import { isEqual } from "lodash";

import DrawingSelectionContext from "./DrawingSelectionContext";

import BackupPaletteIcon from "../svgs/BackupPaletteIcon";

import "./ColorPickerStyles.css";

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
    "#7f4040",
    "#7f4040",
    "#7f4040",
    "#7f4040",
    "#7f4040",
  ]);

  const [colorPickerOpacity, setColorPickerOpacity] = useState([
    false,
    false,
    false,
    false,
    false,
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
      if (!isEqual(colorPickerOpacity, [false, false, false, false, false])) {
        if (
          colorPickerOpacity[0] &&
          !firstColorRef.current.contains(ev.target)
        ) {
          updateColorPickerOpacity(false, 0);
          updateCheckmarkStates(0);
        } else if (
          colorPickerOpacity[1] &&
          !secondColorRef.current.contains(ev.target)
        ) {
          updateColorPickerOpacity(false, 1);
          updateCheckmarkStates(1);
        } else if (
          colorPickerOpacity[2] &&
          !thirdColorRef.current.contains(ev.target)
        ) {
          updateColorPickerOpacity(false, 2);
          updateCheckmarkStates(2);
        } else if (
          colorPickerOpacity[3] &&
          !fourthColorRef.current.contains(ev.target)
        ) {
          updateColorPickerOpacity(false, 3);
          updateCheckmarkStates(3);
        } else if (
          colorPickerOpacity[4] &&
          !fifthColorRef.current.contains(ev.target)
        ) {
          updateColorPickerOpacity(false, 4);
          updateCheckmarkStates(4);
        }
      }
    }

    function mouseHandler(ev) {
      if (!isEqual(colorPickerOpacity, [false, false, false, false, false])) {
        if (
          colorPickerOpacity[0] &&
          !firstColorRef.current.contains(ev.target)
        ) {
          updateColorPickerOpacity(false, 0);
          updateCheckmarkStates(0);
        } else if (
          colorPickerOpacity[1] &&
          !secondColorRef.current.contains(ev.target)
        ) {
          updateColorPickerOpacity(false, 1);
          updateCheckmarkStates(1);
        } else if (
          colorPickerOpacity[2] &&
          !thirdColorRef.current.contains(ev.target)
        ) {
          updateColorPickerOpacity(false, 2);
          updateCheckmarkStates(2);
        } else if (
          colorPickerOpacity[3] &&
          !fourthColorRef.current.contains(ev.target)
        ) {
          updateColorPickerOpacity(false, 3);
          updateCheckmarkStates(3);
        } else if (
          colorPickerOpacity[4] &&
          !fifthColorRef.current.contains(ev.target)
        ) {
          updateColorPickerOpacity(false, 4);
          updateCheckmarkStates(4);
        }
      }
    }

    window.addEventListener("touchstart", touchHandler);
    window.addEventListener("mousedown", mouseHandler);

    return () => {
      window.removeEventListener("touchstart", touchHandler);
      window.removeEventListener("mousedown", mouseHandler);
    };
  }, [colorPickerOpacity]);

  function updateColorPickerOpacity(value, idx) {
    const shallowCopyOpacities = [...colorPickerOpacity];
    shallowCopyOpacities.splice(idx, 1, value);
    setColorPickerOpacity(shallowCopyOpacities);
  }

  function updatePaletteColor(color, idx) {
    const shallowCopyPalettes = [...paletteColors];
    shallowCopyPalettes.splice(idx, 1, color);
    setPaletteColors(shallowCopyPalettes);
  }

  function updateCheckmarkStates(idx) {
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

    const intervalID = setInterval(() => {
      if (window.scrollY === 0) {
        DSCtx.updatePBStates("chooseToDrawBar", true);
        clearInterval(intervalID);
      }
    }, 50);

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
        <div>{`Your Color Palette For`}</div>
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
                  updateColorPickerOpacity(true, 0);
                }}
              >
                <div ref={firstColorRef} className={classes.colorInput}>
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      backgroundColor: paletteColors[0],
                      borderRadius: "50%",
                    }}
                  ></div>
                  <div
                    style={{
                      opacity: colorPickerOpacity[0] ? 1 : 0,
                      pointerEvents: colorPickerOpacity[0] ? "auto" : "none",
                      zIndex: 50,
                      transition: "all 10ms",
                    }}
                  >
                    <HexColorPicker
                      color={paletteColors[0]}
                      onChange={(e) => updatePaletteColor(e, 0)}
                    />
                  </div>
                </div>
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
                  updateColorPickerOpacity(true, 1);
                }}
              >
                <div ref={secondColorRef} className={classes.colorInput}>
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      backgroundColor: paletteColors[1],
                      borderRadius: "50%",
                    }}
                  ></div>
                  <div
                    style={{
                      opacity: colorPickerOpacity[1] ? 1 : 0,
                      pointerEvents: colorPickerOpacity[1] ? "auto" : "none",
                      zIndex: 50,
                      transition: "all 10ms",
                    }}
                  >
                    <HexColorPicker
                      color={paletteColors[1]}
                      onChange={(e) => updatePaletteColor(e, 1)}
                    />
                  </div>
                </div>
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
                  updateColorPickerOpacity(true, 2);
                }}
              >
                <div ref={thirdColorRef} className={classes.colorInput}>
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      backgroundColor: paletteColors[2],
                      borderRadius: "50%",
                    }}
                  ></div>
                  <div
                    style={{
                      opacity: colorPickerOpacity[2] ? 1 : 0,
                      pointerEvents: colorPickerOpacity[2] ? "auto" : "none",
                      zIndex: 50,
                      transition: "all 10ms",
                    }}
                  >
                    <HexColorPicker
                      color={paletteColors[2]}
                      onChange={(e) => updatePaletteColor(e, 2)}
                    />
                  </div>
                </div>
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
                  updateColorPickerOpacity(true, 3);
                }}
              >
                <div ref={fourthColorRef} className={classes.colorInput}>
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      backgroundColor: paletteColors[3],
                      borderRadius: "50%",
                    }}
                  ></div>
                  <div
                    style={{
                      opacity: colorPickerOpacity[3] ? 1 : 0,
                      pointerEvents: colorPickerOpacity[3] ? "auto" : "none",
                      zIndex: 50,
                      transition: "all 10ms",
                    }}
                  >
                    <HexColorPicker
                      color={paletteColors[3]}
                      onChange={(e) => updatePaletteColor(e, 3)}
                    />
                  </div>
                </div>
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
                  updateColorPickerOpacity(true, 4);
                }}
              >
                <div ref={fifthColorRef} className={classes.colorInput}>
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      backgroundColor: paletteColors[4],
                      borderRadius: "50%",
                    }}
                  ></div>
                  <div
                    style={{
                      opacity: colorPickerOpacity[4] ? 1 : 0,
                      pointerEvents: colorPickerOpacity[4] ? "auto" : "none",
                      zIndex: 50,
                      transition: "all 10ms",
                    }}
                  >
                    <HexColorPicker
                      color={paletteColors[4]}
                      onChange={(e) => updatePaletteColor(e, 4)}
                    />
                  </div>
                </div>
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

              const intervalID = setInterval(() => {
                if (window.scrollY === 0) {
                  DSCtx.updatePBStates("selectToChooseBar", false);
                  clearInterval(intervalID);
                }
              }, 50);

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
            disabled={
              !isEqual(statusOfCheckmarks, [true, true, true, true, true])
            }
            onClick={() => {
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
