import React, { useState, useEffect } from "react";
import Card from "../../ui/Card";

import GallaryItem from "./GallaryItem";

import classes from "./GallaryList.module.css";

const GallaryList = (props) => {
  const [displayedDrawings, setDisplayedDrawings] = useState(props.drawingIDs);
  // can do right here
  const [buttonDisabledStates, setButtonDisabledStates] = useState([
    [
      props.drawingIDs["60"].length === 0 ? true : false,
      props.drawingIDs["180"].length === 0 ? true : false,
      props.drawingIDs["300"].length === 0 ? true : false,
    ],
  ]);
  const [durationStates, setDurationStates] = useState([false, false, false]);

  useEffect(() => {
    if (props.drawingIDs["60"].length !== 0) {
      setDurationStates([true, false, false]);
      return;
    }
    if (props.drawingIDs["180"].length !== 0) {
      setDurationStates([false, true, false]);
      return;
    }
    if (props.drawingIDs["300"].length !== 0) {
      setDurationStates([false, false, true]);
      return;
    }
  }, [props.drawingIDs]);

  function getButtonBackground(index) {
    if (buttonDisabledStates[index]) {
      return "gray";
    } else {
      if (!durationStates[index]) {
        // ughhhh THINK before you type dude, could go two ways
        // have color always, just how much opacity there is on it
        // or have a grayish thing and then color on the available ones to switch to
        // either way probably have a gradient no matter what
        return "grey";
      }
      if (index === 0) {
        return "red";
      }
      if (index === 1) {
        return "yellow";
      }
      if (index === 2) {
        return "green";
      }
    }
  }

  return (
    <div className={classes.baseFlex}>
      <div className={classes.buttonContainer}>
        <div
          className={`${durationStates[0] ? "" : classes.darken} ${
            classes.durationIconContainer
          }`}
          style={{
            backgroundColor: durationStates[0] ? "red" : "grey",
            cursor: durationStates[0] ? "pointer" : "default",
          }}
          onClick={() => {
            if (durationStates[0]) setDurationStates([true, false, false]);
          }}
        >
          1 Minute
        </div>
        <div
          className={`${durationStates[1] ? "" : classes.darken} ${
            classes.durationIconContainer
          }`}
          style={{
            backgroundColor: durationStates[1] ? "yellow" : "grey",
            cursor: durationStates[1] ? "pointer" : "default",
          }}
          onClick={() => {
            if (durationStates[1]) setDurationStates([false, true, false]);
          }}
        >
          3 Minutes
        </div>
        <div
          className={`${durationStates[2] ? "" : classes.darken} ${
            classes.durationIconContainer
          }`}
          style={{
            backgroundColor: durationStates[2] ? "green" : "grey",
            cursor: durationStates[2] ? "pointer" : "default",
          }}
          onClick={() => {
            if (durationStates[2]) setDurationStates([false, false, true]);
          }}
        >
          5 Minutes
        </div>
      </div>

      <Card margin={props.margin}>
        <div className={classes.flexListContain}>
          <div
            className={`${durationStates[0] ? "" : classes.hide} ${
              classes.flexListContain
            }`}
          >
            {Object.values(displayedDrawings["60"])
              .flat()
              .map((drawingID, i) => (
                <GallaryItem
                  key={i}
                  drawingID={drawingID}
                  settings={{
                    width: 30,
                    forHomepage: false,
                    forPinnedShowcase: false,
                    forPinnedItem: false,
                    skeleHeight: "10em",
                    skeleDateWidth: "6em",
                    skeleTitleWidth: "6em",
                  }}
                />
              ))}
          </div>

          <div
            className={`${durationStates[1] ? "" : classes.hide} ${
              classes.flexListContain
            }`}
          >
            {Object.values(displayedDrawings["180"])
              .flat()
              .map((drawingID, i) => (
                <GallaryItem
                  key={i}
                  drawingID={drawingID}
                  settings={{
                    width: 30,
                    forHomepage: false,
                    forPinnedShowcase: false,
                    forPinnedItem: false,
                    skeleHeight: "10em",
                    skeleDateWidth: "6em",
                    skeleTitleWidth: "6em",
                  }}
                />
              ))}
          </div>

          <div
            className={`${durationStates[2] ? "" : classes.hide} ${
              classes.flexListContain
            }`}
          >
            {Object.values(displayedDrawings["300"])
              .flat()
              .map((drawingID, i) => (
                <GallaryItem
                  key={i}
                  drawingID={drawingID}
                  settings={{
                    width: 30,
                    forHomepage: false,
                    forPinnedShowcase: false,
                    forPinnedItem: false,
                    skeleHeight: "10em",
                    skeleDateWidth: "6em",
                    skeleTitleWidth: "6em",
                  }}
                />
              ))}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default React.memo(GallaryList);
