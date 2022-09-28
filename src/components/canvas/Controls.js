import React, { useContext, useState, useEffect } from "react";

import { useCanvas } from "./CanvasContext";

import DrawingSelectionContext from "./DrawingSelectionContext";
import classes from "./Controls.module.css";
import GarbageIcon from "../../svgs/GarbageIcon";
import Paintbrush from "../../svgs/Paintbrush";
import PaintBucketIcon from "../../svgs/PaintBucketIcon";
import RedoIcon from "../../svgs/RedoIcon";

import baseClasses from "../../index.module.css";

const Controls = () => {
  const DSCtx = useContext(DrawingSelectionContext);

  const {
    canvasRef,
    changeColor,
    undo,
    changeBrushSize,
    toggleFloodFill,
    prevNumSnapshots,
    floodFillStatus,
    clearCanvas,
  } = useCanvas();

  // misc states
  const [currentCursorSize, setCurrentCursorSize] = useState(5);
  const [tempDisable, setTempDisable] = useState(true);

  // button states
  const [buttonStyles, setButtonStyles] = useState([
    classes.hide,
    classes.hide,
    classes.hide,
    classes.hide,
    classes.hide,
    classes.hide,
  ]);
  const [prevClickedColor, setPrevClickedColor] = useState(0);

  // brush size state
  const [brushSizeStyles, setBrushSizeStyles] = useState([false, false, false]);

  // tool states
  const [toolStatuses, setToolStatuses] = useState([true, false, false]);
  const [currToolIdx, setCurrToolIdx] = useState(0);
  const [colorIdToReselect, setColorIdToReselect] = useState();

  useEffect(() => {
    if (DSCtx.seconds === 0) {
      setTempDisable(false);
      changeColor(DSCtx.paletteColors[0]);
      DSCtx.setCurrentColor(DSCtx.paletteColors[0]);
      updateSelectedColor(0, false);
      changeBrushSize(8);
      updateSelectedBrushSize(1);
    } else if (DSCtx.seconds > 0) {
      DSCtx.setCurrentColor("#FFFFFF");
    }
  }, [DSCtx.seconds]);

  useEffect(() => {
    let tempPaletteColors = DSCtx.paletteColors;
    tempPaletteColors[5] = "#FFFFFF";
    DSCtx.setPaletteColors(tempPaletteColors);
    DSCtx.setCurrentCursorSize(8);
  }, []);

  useEffect(() => {
    function updateCursorSize(e) {
      if (canvasRef.current.contains(e.target)) {
        // don't update if paint bucket is currently being selected
        if (!floodFillStatus) {
          if (
            (currentCursorSize === 2 && e.deltaY > 0) ||
            (currentCursorSize === 8 && e.deltaY < 0)
          ) {
            return;
          }

          if (currentCursorSize === 2 && e.deltaY < 0) {
            changeBrushSize(8);
            updateSelectedBrushSize(1);
            setCurrentCursorSize(5);
            DSCtx.setCurrentCursorSize(8);
            return;
          }

          if (currentCursorSize === 5 && e.deltaY > 0) {
            changeBrushSize(4);
            updateSelectedBrushSize(0);
            setCurrentCursorSize(2);
            DSCtx.setCurrentCursorSize(4);
            return;
          }

          if (currentCursorSize === 5 && e.deltaY < 0) {
            changeBrushSize(16);
            updateSelectedBrushSize(2);
            setCurrentCursorSize(8);
            DSCtx.setCurrentCursorSize(16);
            return;
          }

          if (currentCursorSize === 8 && e.deltaY > 0) {
            changeBrushSize(8);
            updateSelectedBrushSize(1);
            setCurrentCursorSize(5);
            DSCtx.setCurrentCursorSize(8);
            return;
          }
        }
      }
    }

    document.addEventListener("wheel", updateCursorSize);

    return () => {
      document.removeEventListener("wheel", updateCursorSize);
    };
  }, [currentCursorSize, floodFillStatus, DSCtx.seconds]);

  function updateSelectedColor(brushID, updateCurrentlySelectedTool) {
    if (DSCtx.seconds === 0) {
      let tempArr = buttonStyles;

      tempArr[prevClickedColor] = classes.hide;
      tempArr[brushID] = classes.show;

      setButtonStyles(tempArr);

      // reselecting the pencil icon when directly clicking on a color while on eraser tool
      if (updateCurrentlySelectedTool && currToolIdx !== 1) {
        updateSelectedTool(0);

        setCurrToolIdx(0);
      }

      if (brushID !== 5) {
        document.documentElement.style.setProperty(
          "--dark-animated-gradient-color",
          hexToRgbA(DSCtx.paletteColors[brushID], 0.9)
        );
        document.documentElement.style.setProperty(
          "--light-animated-gradient-color",
          hexToRgbA(DSCtx.paletteColors[brushID], 0.5)
        );
      } else if (brushID === 5) {
        setColorIdToReselect(prevClickedColor);
        document.documentElement.style.setProperty(
          "--dark-animated-gradient-color",
          "rgba(230, 230, 230, .9)"
        );
        document.documentElement.style.setProperty(
          "--light-animated-gradient-color",
          "rgba(230, 230, 230, .5)"
        );
        return;
      }
      setPrevClickedColor(brushID);
    }
  }

  function updateSelectedBrushSize(brushID) {
    if (DSCtx.seconds === 0) {
      let tempArr = [false, false, false];

      tempArr[brushID] = true;

      setBrushSizeStyles(tempArr);
    }
  }

  function changeTool(idx) {
    if (DSCtx.seconds === 0) {
      if (idx !== currToolIdx) {
        // going from eraser to draw/paint bucket
        if ((idx === 0 || idx === 1) && currToolIdx === 2) {
          changeColor(DSCtx.paletteColors[colorIdToReselect]);
          DSCtx.setCurrentColor(DSCtx.paletteColors[colorIdToReselect]);
          updateSelectedColor(colorIdToReselect, false);
        }

        // going to or from paint bucket
        if (idx === 1 || currToolIdx === 1) toggleFloodFill();

        // going to draw
        if (idx === 0) {
          changeColor(DSCtx.paletteColors[prevClickedColor]);
          DSCtx.setCurrentColor(DSCtx.paletteColors[prevClickedColor]);
        }

        // going to eraser
        if (idx === 2) {
          changeColor(DSCtx.paletteColors[5]);
          DSCtx.setCurrentColor(DSCtx.paletteColors[5]);
          updateSelectedColor(5);
        }

        updateSelectedTool(idx);

        setCurrToolIdx(idx);
      }
    }
  }

  function updateSelectedTool(idx) {
    if (DSCtx.seconds === 0) {
      let tempToolStatuses = [false, false, false];
      tempToolStatuses[idx] = true;
      setToolStatuses(tempToolStatuses);
    }
  }

  function hexToRgbA(hex, a) {
    let c;
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
      c = hex.substring(1).split("");
      if (c.length === 3) {
        c = [c[0], c[0], c[1], c[1], c[2], c[2]];
      }
      c = "0x" + c.join("");
      return (
        "rgba(" +
        [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(",") +
        `,${a})`
      );
    }
    throw new Error("Bad Hex");
  }

  return (
    // eventually make this into a loop, is entirely possible and looks terrible as is
    <div className={classes.contain}>
      <div className={`${classes.colors} ${classes.subControlFlex}`}>
        <button
          className={classes.outerColor}
          style={{ backgroundColor: DSCtx.paletteColors[0] }}
          disabled={tempDisable}
          onClick={() => {
            changeColor(DSCtx.paletteColors[0]);
            DSCtx.setCurrentColor(DSCtx.paletteColors[0]);

            updateSelectedColor(0, true);
          }}
        >
          <div className={`${classes.innerBorder} ${buttonStyles[0]}`}></div>
        </button>
        <button
          className={classes.outerColor}
          style={{ backgroundColor: DSCtx.paletteColors[1] }}
          disabled={tempDisable}
          onClick={() => {
            changeColor(DSCtx.paletteColors[1]);
            DSCtx.setCurrentColor(DSCtx.paletteColors[1]);

            updateSelectedColor(1, true);
          }}
        >
          <div className={`${classes.innerBorder} ${buttonStyles[1]}`}></div>
        </button>
        <button
          className={classes.outerColor}
          style={{ backgroundColor: DSCtx.paletteColors[2] }}
          disabled={tempDisable}
          onClick={() => {
            changeColor(DSCtx.paletteColors[2]);
            DSCtx.setCurrentColor(DSCtx.paletteColors[2]);

            updateSelectedColor(2, true);
          }}
        >
          <div className={`${classes.innerBorder} ${buttonStyles[2]}`}></div>
        </button>
        <button
          className={classes.outerColor}
          style={{ backgroundColor: DSCtx.paletteColors[3] }}
          disabled={tempDisable}
          onClick={() => {
            changeColor(DSCtx.paletteColors[3]);
            DSCtx.setCurrentColor(DSCtx.paletteColors[3]);

            updateSelectedColor(3, true);
          }}
        >
          <div className={`${classes.innerBorder} ${buttonStyles[3]}`}></div>
        </button>
        <button
          className={classes.outerColor}
          style={{ backgroundColor: DSCtx.paletteColors[4] }}
          disabled={tempDisable}
          onClick={() => {
            changeColor(DSCtx.paletteColors[4]);
            DSCtx.setCurrentColor(DSCtx.paletteColors[4]);

            updateSelectedColor(4, true);
          }}
        >
          <div className={`${classes.innerBorder} ${buttonStyles[4]}`}></div>
        </button>
      </div>
      {/* ////////////////////// Start of Brush Sizes /////////////////////////////// */}
      <div className={`${classes.sizes} ${classes.subControlFlex}`}>
        <button
          className={`${classes.rounded} ${classes.small}`}
          disabled={tempDisable}
          onClick={() => {
            changeBrushSize(4);
            updateSelectedBrushSize(0);
            setCurrentCursorSize(2);
            DSCtx.setCurrentCursorSize(4);
          }}
        >
          <div
            className={`${classes.innerBrushBorder} ${classes.smallFilled} ${
              brushSizeStyles[0] ? classes.show : classes.hide
            }`}
          ></div>
        </button>
        <button
          className={`${classes.rounded} ${classes.medium}`}
          disabled={tempDisable}
          onClick={() => {
            changeBrushSize(8);
            updateSelectedBrushSize(1);
            setCurrentCursorSize(5);
            DSCtx.setCurrentCursorSize(8);
          }}
        >
          <div
            className={`${classes.innerBrushBorder} ${classes.mediumFilled} ${
              brushSizeStyles[1] ? classes.show : classes.hide
            }`}
          ></div>
        </button>
        <button
          className={`${classes.rounded} ${classes.large}`}
          disabled={tempDisable}
          onClick={() => {
            changeBrushSize(16);
            updateSelectedBrushSize(2);
            setCurrentCursorSize(8);
            DSCtx.setCurrentCursorSize(16);
          }}
        >
          <div
            className={`${classes.innerBrushBorder} ${classes.largeFilled} ${
              brushSizeStyles[2] ? classes.show : classes.hide
            }`}
          ></div>
        </button>
      </div>
      {/* //////////////////// Start of Paint Bucket Tool / Eraser Tool ///////////////////////////// */}
      <div className={`${classes.tools} ${classes.subControlFlex}`}>
        <div
          style={{
            backgroundColor: toolStatuses[0] ? "#f7c17a" : "",
            borderColor: toolStatuses[0] ? "white" : "#c4c4c4",
            filter: toolStatuses[0] ? "brightness(1)" : "",
            borderWidth: toolStatuses[0] ? "4px" : "2px",
            borderRadius: "1em",
            padding: ".25em",
            borderStyle: "solid",
          }}
          onClick={() => changeTool(0)}
        >
          <Paintbrush
            dimensions={"100%"}
            currentColor={DSCtx.currentColor}
            eraser={false}
          />
        </div>

        <div
          style={{
            backgroundColor: toolStatuses[1] ? "#f7c17a" : "",
            borderColor: toolStatuses[1] ? "white" : "#c4c4c4",
            filter: toolStatuses[1] ? "brightness(1)" : "",
            borderWidth: toolStatuses[1] ? "4px" : "2px",
            borderRadius: "1em",
            padding: ".25em",
            borderStyle: "solid",
          }}
          onClick={() => changeTool(1)}
        >
          <PaintBucketIcon
            dimensions={"100%"}
            currentColor={DSCtx.currentColor}
          />
        </div>

        <div
          style={{
            backgroundColor: toolStatuses[2] ? "#f7c17a" : "",
            borderColor: toolStatuses[2] ? "white" : "#c4c4c4",
            filter: toolStatuses[2] ? "brightness(1)" : "",
            borderWidth: toolStatuses[2] ? "4px" : "2px",
            borderRadius: "1em",
            padding: ".25em",
            borderStyle: "solid",
          }}
          onClick={() => changeTool(2)}
        >
          <Paintbrush
            dimensions={"100%"}
            currentColor={"#FFFFFF"}
            eraser={true}
          />
        </div>

        <div
          onClick={() => {
            // don't allow modifications to canvas after drawing has been completed
            if (DSCtx.drawingTime > 0) {
              undo();
            }
          }}
          style={{
            marginLeft: "1em",
            transform: "rotateY(180deg)",
            opacity: prevNumSnapshots > 0 ? 1 : 0.5,
            pointerEvents: prevNumSnapshots > 0 ? "auto" : "none",
          }}
          className={`${classes.undo} ${baseClasses.baseFlex}`}
        >
          <RedoIcon dimensions={"80%"} color={"#dbdbdb"} />
        </div>

        <div
          onClick={() => {
            // don't allow modifications to canvas after drawing has been completed
            if (DSCtx.drawingTime > 0) {
              clearCanvas(true);
            }
          }}
          className={baseClasses.baseFlex}
        >
          <GarbageIcon dimensions={"80%"} />
        </div>
      </div>
    </div>
  );
};

export default Controls;
