import React, { useContext, useState, useEffect } from "react";
import { useCanvas } from "./CanvasContext";

import DrawingSelectionContext from "./DrawingSelectionContext";
import classes from "./Controls.module.css";
import EraserIcon from "../svgs/EraserIcon";
import GarbageIcon from "../svgs/GarbageIcon";
import PaintBucketIcon from "../svgs/PaintBucketIcon";
import PencilIcon from "../svgs/PencilIcon";

const Controls = () => {
  const DSCtx = useContext(DrawingSelectionContext);

  const {
    canvasRef,
    changeColor,
    changeBrushSize,
    toggleFloodFill,
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

  // brush states
  const [brushSizeStyles, setBrushSizeStyles] = useState([
    classes.hide,
    classes.hide,
    classes.hide,
  ]);
  const [prevBrushSize, setPrevBrushSize] = useState(1);

  // tool states
  const [toolStatuses, setToolStatuses] = useState([true, false, false]);
  const [currToolIdx, setCurrToolIdx] = useState(0);
  const [colorIdToReselect, setColorIdToReselect] = useState();

  useEffect(() => {
    if (DSCtx.seconds === 0) {
      setTempDisable(false);
      changeColor(DSCtx.paletteColors[0]);
      DSCtx.setCurrentColor(DSCtx.paletteColors[0]);
      updateSelectedColor(0);
      changeBrushSize(8);
      updateSelectedBrushSize(1);
    }
  }, [DSCtx.seconds]);

  useEffect(() => {
    let tempPaletteColors = DSCtx.paletteColors;
    tempPaletteColors[5] = "#FFFFFF";
    DSCtx.setPaletteColors(tempPaletteColors);
  }, []);

  useEffect(() => {
    document.addEventListener("wheel", updateCursorSize);

    return () => {
      document.removeEventListener("wheel", updateCursorSize);
    };
  }, [currentCursorSize]);

  useEffect(() => {
    console.log(currentCursorSize);
  }, [currentCursorSize]);

  function updateSelectedColor(brushID) {
    let tempArr = buttonStyles;

    tempArr[prevClickedColor] = classes.hide;
    tempArr[brushID] = classes.show;

    setButtonStyles(tempArr);

    if (brushID === 5) {
      setColorIdToReselect(prevClickedColor);
      return;
    }
    setPrevClickedColor(brushID);
  }

  function updateSelectedBrushSize(brushID) {
    let tempArr = brushSizeStyles;

    tempArr[prevBrushSize] = classes.hide;
    tempArr[brushID] = classes.show;

    setBrushSizeStyles(tempArr);
    setPrevBrushSize(brushID);
  }

  function updateCursorSize(e) {
    if (canvasRef.current.contains(e.target)) {
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
        DSCtx.setCurrentCursorSize(5);
        return;
      }

      if (currentCursorSize === 5 && e.deltaY > 0) {
        changeBrushSize(3);
        updateSelectedBrushSize(0);
        setCurrentCursorSize(2);
        DSCtx.setCurrentCursorSize(2);
        return;
      }

      if (currentCursorSize === 5 && e.deltaY < 0) {
        changeBrushSize(15);
        updateSelectedBrushSize(2);
        setCurrentCursorSize(8);
        DSCtx.setCurrentCursorSize(8);
        return;
      }

      if (currentCursorSize === 8 && e.deltaY > 0) {
        changeBrushSize(8);
        updateSelectedBrushSize(1);
        setCurrentCursorSize(5);
        DSCtx.setCurrentCursorSize(5);
        return;
      }
    }
  }

  function changeTool(idx) {
    if (idx !== currToolIdx) {
      // going from eraser to draw/paint bucket
      if ((idx === 0 || idx === 1) && currToolIdx === 2) {
        changeColor(DSCtx.paletteColors[colorIdToReselect]);
        DSCtx.setCurrentColor(DSCtx.paletteColors[colorIdToReselect]);
        updateSelectedColor(colorIdToReselect);
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

  function updateSelectedTool(idx) {
    let tempToolStatuses = [false, false, false];
    tempToolStatuses[idx] = true;
    setToolStatuses(tempToolStatuses);
  }

  return (
    // eventually make this into a loop, is entirely possible and looks terrible as is
    <div className={classes.contain}>
      <div>
        <button
          className={classes.outerColor}
          style={{ backgroundColor: DSCtx.paletteColors[0] }}
          disabled={tempDisable}
          onClick={() => {
            changeColor(DSCtx.paletteColors[0]);
            DSCtx.setCurrentColor(DSCtx.paletteColors[0]);

            updateSelectedColor(0);
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

            updateSelectedColor(1);
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

            updateSelectedColor(2);
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

            updateSelectedColor(3);
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

            updateSelectedColor(4);
          }}
        >
          <div className={`${classes.innerBorder} ${buttonStyles[4]}`}></div>
        </button>
      </div>
      {/* ////////////////////// Start of Brush Sizes /////////////////////////////// */}
      <div>
        <button
          className={`${classes.rounded} ${classes.small}`}
          disabled={tempDisable}
          onClick={() => {
            changeBrushSize(3);
            updateSelectedBrushSize(0);
            setCurrentCursorSize(2);
            DSCtx.setCurrentCursorSize(2);
          }}
        >
          <div
            className={`${classes.innerBrushBorder} ${classes.smallFilled} ${brushSizeStyles[0]}`}
          ></div>
        </button>
        <button
          className={`${classes.rounded} ${classes.medium}`}
          disabled={tempDisable}
          onClick={() => {
            changeBrushSize(8);
            updateSelectedBrushSize(1);
            setCurrentCursorSize(5);
            DSCtx.setCurrentCursorSize(5);
          }}
        >
          <div
            className={`${classes.innerBrushBorder} ${classes.mediumFilled} ${brushSizeStyles[1]}`}
          ></div>
        </button>
        <button
          className={`${classes.rounded} ${classes.large}`}
          disabled={tempDisable}
          onClick={() => {
            changeBrushSize(15);
            updateSelectedBrushSize(2);
            setCurrentCursorSize(8);
            DSCtx.setCurrentCursorSize(8);
          }}
        >
          <div
            className={`${classes.innerBrushBorder} ${classes.largeFilled} ${brushSizeStyles[2]}`}
          ></div>
        </button>
      </div>
      {/* //////////////////// Start of Paint Bucket Tool / Eraser Tool ///////////////////////////// */}
      <div className={classes.tools}>
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
          <PencilIcon />
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
          <PaintBucketIcon currentColor={DSCtx.currentColor} />
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
          <EraserIcon />
        </div>

        <div onClick={clearCanvas} style={{ marginLeft: "2em" }}>
          <GarbageIcon />
        </div>
      </div>
    </div>
  );
};

export default Controls;
