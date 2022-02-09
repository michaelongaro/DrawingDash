import React, { useState, useEffect, useContext } from "react";

import WordsContext from "./WordsContext";

import classes from "./PaletteChooser.module.css";

const PaletteChooser = () => {
  const wordsCtx = useContext(WordsContext);

  const [showSecondScreen, setShowSecondScreen] = useState(classes.vertContain);

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

  useEffect(() => {
    let filteredArray = statusOfCheckmarks.filter(function (item, pos) {
      return statusOfCheckmarks.indexOf(item) === pos;
    });

    if (filteredArray.length === 1 && filteredArray[0] === true) {
      setNextDisabled(false);
    }
  }, [statusOfCheckmarks]);

  function updatePaletteAndCheckmarkStates(event, idx) {
    console.log(event.target.value);
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

  return (
    <div className={showSecondScreen}>
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
            onBlur={(event) => {
              updatePaletteAndCheckmarkStates(event, 0);
            }}
          />
          <div className={visibilityOfOverlays[0]}></div>

          <div
            className={classes.circle}
            style={{
              background: `${statusOfCheckmarks[0] ? "green" : "grey"}`,
            }}
          >
            <div
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
            onBlur={(event) => {
              updatePaletteAndCheckmarkStates(event, 1);
            }}
          />
          <div className={visibilityOfOverlays[1]}></div>
          <div
            className={classes.circle}
            style={{
              background: `${statusOfCheckmarks[1] ? "green" : "grey"}`,
            }}
          >
            <div
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
            onBlur={(event) => {
              updatePaletteAndCheckmarkStates(event, 2);
            }}
          />
          <div className={visibilityOfOverlays[2]}></div>
          <div
            className={classes.circle}
            style={{
              background: `${statusOfCheckmarks[2] ? "green" : "grey"}`,
            }}
          >
            <div
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
            onBlur={(event) => {
              updatePaletteAndCheckmarkStates(event, 3);
            }}
          />

          <div className={visibilityOfOverlays[3]}></div>

          <div
            className={classes.circle}
            style={{
              background: `${statusOfCheckmarks[3] ? "green" : "grey"}`,
            }}
          >
            <div
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
            onBlur={(event) => {
              updatePaletteAndCheckmarkStates(event, 4);
            }}
          />
          <div className={visibilityOfOverlays[4]}></div>
          <div
            className={classes.circle}
            style={{
              background: `${statusOfCheckmarks[4] ? "green" : "grey"}`,
            }}
          >
            <div
              className={`${statusOfCheckmarks[4]} ${classes.checkmark}`}
            ></div>
          </div>
        </div>
      </div>
      <div className={classes.flexContainer}>
        <button className={classes.activeButton}>Prev</button>
        <button className={classes.activeButton} disabled={nextDisabled} onClick={() => {
          wordsCtx.setChosenPalette(paletteColors);
          setShowSecondScreen(classes.hide);
        }}>
          Next
        </button>
      </div>
    </div>
  );
};

export default PaletteChooser;
