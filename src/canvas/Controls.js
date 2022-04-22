import React, { useContext, useState, useEffect } from "react";
import { useCanvas } from "./CanvasContext";

import DrawingSelectionContext from "./DrawingSelectionContext";
import classes from "./Controls.module.css";
import EraserIcon from "../svgs/EraserIcon";

const Controls = () => {
  const DSCtx = useContext(DrawingSelectionContext);

  const { changeColor, changeBrushSize, toggleFloodFill, clearCanvas } =
    useCanvas();
  const [buttonStyles, setButtonStyles] = useState([
    classes.hide,
    classes.hide,
    classes.hide,
    classes.hide,
    classes.hide,
    classes.hide,
  ]);
  const [prevClickedColor, setPrevClickedColor] = useState(0);

  const [brushSizeStyles, setBrushSizeStyles] = useState([
    classes.hide,
    classes.hide,
    classes.hide,
  ]);
  const [prevBrushSize, setPrevBrushSize] = useState(1);

  const [tempDisable, setTempDisable] = useState(true);

  useEffect(() => {
    let tempPaletteColors = DSCtx.paletteColors;
    tempPaletteColors[5] = "#FFFFFF";
    DSCtx.setPaletteColors(tempPaletteColors);
  }, []);

  useEffect(() => {
    if (DSCtx.seconds === 0) {
      setTempDisable(false);
      changeColor(DSCtx.paletteColors[0]);
      updateSelectedColor(0);
      changeBrushSize(8);
      updateSelectedBrushSize(1);
    }
  }, [DSCtx.seconds]);

  function updateSelectedColor(brushID) {
    let tempArr = buttonStyles;

    tempArr[prevClickedColor] = classes.hide;
    tempArr[brushID] = classes.show;

    setButtonStyles(tempArr);
    setPrevClickedColor(brushID);
  }

  function updateSelectedBrushSize(brushID) {
    let tempArr = brushSizeStyles;

    tempArr[prevBrushSize] = classes.hide;
    tempArr[brushID] = classes.show;

    setBrushSizeStyles(tempArr);
    setPrevBrushSize(brushID);
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
          }}
        >
          <div
            className={`${classes.innerBrushBorder} ${classes.largeFilled} ${brushSizeStyles[2]}`}
          ></div>
        </button>
      </div>
      {/* //////////////////// Start of Eraser/Paint Bucket ///////////////////////////// */}
      <div>
        <button
          className={classes.outerColor}
          style={{ backgroundColor: DSCtx.paletteColors[1] }}
          disabled={tempDisable}
          onClick={() => {
            toggleFloodFill();
          }}
        >
          <div className={`${classes.innerBorder} ${buttonStyles[1]}`}></div>
        </button>

        {/* <button
          className={classes.outerColor}
          style={{ backgroundColor: DSCtx.paletteColors[5] }}
          disabled={tempDisable}
          onClick={() => {
            changeColor(DSCtx.paletteColors[5]);
            updateSelectedColor(5);
          }}
        >
          <div className={`${classes.innerBorder} ${buttonStyles[5]}`}></div>
        </button> */}

        <div
          onClick={() => {
            changeColor(DSCtx.paletteColors[5]);
            updateSelectedColor(5);
          }}
        >
          <EraserIcon />
        </div>

        <button onClick={clearCanvas}>Clear</button>
      </div>
    </div>
  );
};

export default Controls;
