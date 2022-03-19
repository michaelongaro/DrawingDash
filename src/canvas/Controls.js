import React, { useContext, useState, useEffect } from "react";
import { useCanvas } from "./CanvasContext";

import DrawingSelectionContext from "./DrawingSelectionContext";
import classes from "./Controls.module.css";

const Controls = () => {
  const DSCtx = useContext(DrawingSelectionContext);

  const { changeColor, changeBrushSize, clearCanvas } = useCanvas();
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
    // if (prevClickedColor !== null) {
    //   tempArr[brushID] = classes.show;
    // } else {
    tempArr[prevClickedColor] = classes.hide;
    // console.log("why is this still show", tempArr[prevClickedColor], prevClickedColor, tempArr);
    tempArr[brushID] = classes.show;
    // }
    // console.log("button styles being set to", tempArr, prevClickedColor);
    setButtonStyles(tempArr);
    setPrevClickedColor(brushID);
  }

  function updateSelectedBrushSize(brushID) {
    let tempArr = brushSizeStyles;
    // if (prevBrushSize !== null) {
    //   tempArr[1] = classes.hide;
    // } else {
    tempArr[prevBrushSize] = classes.hide;
    tempArr[brushID] = classes.show;
    // setBrushSizeStyles(tempArr);
    // }
    // console.log("brush styles being set to", tempArr, prevBrushSize);

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
      {/* ///////////////////////////////////////////////////// */}
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
      {/* ///////////////////////////////////////////////////// */}
      <div
        onClick={() => {
          changeColor("white");
          updateSelectedColor(5);
        }}
      >
        {/* <svg viewBox="0 0 185 170" xmlns="http://www.w3.org/2000/svg">
          <title>my vector image</title>
          <rect
            class="selected"
            width="100%"
            height="100%"
            fill="#fff"
            
          />
          <g class="currentLayer">
            <title>Layer 1</title>
            <path
              class=""
              d="m294.62 332.2"
              color="rgb(0, 0, 0)"
              fill="#ecabec"
              marker-end=""
              marker-mid=""
              marker-start=""
              stroke="#222"
              stroke-dashoffset=""
              stroke-linejoin="round"
              stroke-width="2"
            />
            <path
              class=""
              d="m75.835 168.12 10.147-37.733 97.338-116.68-12.025 39.029-95.46 115.38z"
              color="rgb(0, 0, 0)"
              fill="#ecabec"
              marker-end=""
              marker-mid=""
              marker-start=""
              stroke="#222"
              stroke-dashoffset=""
              stroke-linejoin="round"
              stroke-width="2"
            />
            <path
              class=""
              d="m118.93 105.13"
              color="rgb(0, 0, 0)"
              fill="#ecabec"
              marker-end=""
              marker-mid=""
              marker-start=""
              stroke="#222"
              stroke-dashoffset=""
              stroke-linejoin="round"
              stroke-width="2"
            />
            <path
              class=""
              d="m86.333 144.36"
              color="rgb(0, 0, 0)"
              fill="#ecabec"
              marker-end=""
              marker-mid=""
              marker-start=""
              stroke="#222"
              stroke-dashoffset=""
              stroke-linejoin="round"
              stroke-width="2"
            />
            <path
              class=""
              d="m85.228 131.65"
              color="rgb(0, 0, 0)"
              fill="#ecabec"
              marker-end=""
              marker-mid=""
              marker-start=""
              stroke="#222"
              stroke-dashoffset=""
              stroke-linejoin="round"
              stroke-width="2"
            />
            <path
              class=""
              d="m84.675 130.55"
              color="rgb(0, 0, 0)"
              fill="#ecabec"
              marker-end=""
              marker-mid=""
              marker-start=""
              stroke="#222"
              stroke-dashoffset=""
              stroke-linejoin="round"
              stroke-width="2"
            />
            <path
              class=""
              d="m85.78 130.55s-76.796-14.917-77.045-15.182c0.24975 0.26521-7.4851 35.624-7.7348 35.359 0.24975 0.26521 74.283 16.287 74.033 16.022 0.24975 0.26521 10.747-36.199 10.747-36.199z"
              color="rgb(0, 0, 0)"
              fill="#ecabec"
              marker-end=""
              marker-mid=""
              marker-start=""
              stroke="#222"
              stroke-dashoffset=""
              stroke-linejoin="round"
              stroke-width="2"
            />
            <path
              class=""
              d="m8.9846 115.08 99.198-114.08 73.481 12.155-96.685 117.13-75.993-15.204z"
              color="rgb(0, 0, 0)"
              fill="#ecabec"
              marker-end=""
              marker-mid=""
              marker-start=""
              stroke="#222"
              stroke-dashoffset=""
              stroke-linejoin="round"
              stroke-width="2"
            />
          </g>
        </svg> */}

        {/* <EraserIcon /> */}
        {/* <img
          src={"../svgs/eraser.svg"}
          alt="eraser"
          onClick={() => {
            changeColor("white");
            updateSelectedColor(8);
          }}
        ></img> */}
      </div>
      <div>
        <button onClick={clearCanvas}>Clear</button>
      </div>
    </div>
  );
};

export default Controls;
