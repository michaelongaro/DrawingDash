import React, { useState, useEffect } from "react";
import Card from "../../ui/Card";

import GallaryItem from "./GallaryItem";

import classes from "./GallaryList.module.css";

const GallaryList = (props) => {
  const [buttonStates, setButtonStates] = useState(["", "", ""]);
  const [drawingDurationContainers, setDrawingDurationContainers] = useState([
    "",
    "",
    "",
  ]);

  useEffect(() => {
    if (props.drawings !== "none") {
      setButtonStates(false);
      setDrawingDurationContainers(false);
    }
  }, [props.drawings]);

  useEffect(() => {
    if (!buttonStates && !drawingDurationContainers) {
      let initStates = ["", "", ""];
      let initStates2 = ["", "", ""];
      if (props.drawings["60"].length === 0) {
        initStates[0] = toggleButton(0, false);
        initStates2[0] = toggleDrawingDurationContainer(0, false);
      }
      if (props.drawings["180"].length === 0) {
        initStates[1] = toggleButton(1, false);
        initStates2[1] = toggleDrawingDurationContainer(1, false);
      }
      if (props.drawings["300"].length === 0) {
        initStates[2] = toggleButton(2, false);
        initStates2[2] = toggleDrawingDurationContainer(2, false);
      }

      setButtonStates(initStates);
      setDrawingDurationContainers(initStates2);
    }
  }, [buttonStates, drawingDurationContainers]);

  // update this in searchCtx
  if (props.drawings === "none") {
    // bruh wtf why does this update... ooo wtf should really use context here instead ofprops me think
    const static_title = props.title;
    return (
      <div
        className={classes.baseFlex}
      >{`No Results for ${static_title}... yet!`}</div>
    );
  }

  function toggleButton(id, directUpdate) {
    const copy = !buttonStates ? ["", "", ""] : [...buttonStates];
    if (copy[id] === "") {
      copy[id] = classes.darken;
    } else {
      copy[id] = "";
    }
    if (directUpdate) {
      setButtonStates(copy);
    } else {
      return copy[id];
    }
  }

  function toggleDrawingDurationContainer(id, directUpdate) {
    const copy = !drawingDurationContainers
      ? ["", "", ""]
      : [...drawingDurationContainers];
    if (copy[id] === "") {
      copy[id] = classes.hide;
    } else {
      copy[id] = "";
    }
    if (directUpdate) {
      setDrawingDurationContainers(copy);
    } else {
      return copy[id];
    }
  }

  return (
    <div className={classes.baseFlex}>
      <div className={classes.buttonContainer}>
        <button
          className={buttonStates[0]}
          onClick={() => {
            toggleButton(0, true);
            toggleDrawingDurationContainer(0, true);
          }}
        >
          1 Minute
        </button>
        <button
          className={buttonStates[1]}
          onClick={() => {
            toggleButton(1, true);
            toggleDrawingDurationContainer(1, true);
          }}
        >
          3 Minutes
        </button>
        <button
          className={buttonStates[2]}
          onClick={() => {
            toggleButton(2, true);
            toggleDrawingDurationContainer(2, true);
          }}
        >
          5 Minutes
        </button>
      </div>
      <Card width={100}>
        <div className={classes.flexListContain}>
          <div className={drawingDurationContainers[0]}>
            {props.drawings["60"].map((drawing) => (
              <GallaryItem key={drawing.index} drawing={drawing} />
            ))}
          </div>
          <div className={drawingDurationContainers[1]}>
            {props.drawings["180"].map((drawing) => (
              <GallaryItem key={drawing.index} drawing={drawing} />
            ))}
          </div>
          <div className={drawingDurationContainers[2]}>
            {props.drawings["300"].map((drawing) => (
              <GallaryItem key={drawing.index} drawing={drawing} />
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default React.memo(GallaryList);
