import React, { useState, useEffect } from "react";
import Card from "../../ui/Card";

import GallaryItem from "./GallaryItem";

import classes from "./GallaryList.module.css";

const GallaryList = (props) => {
  const [displayedDrawings, setDisplayedDrawings] = useState(props.drawings);
  const [buttonStates, setButtonStates] = useState(["", "", ""]);
  const [filteredDrawings, setFilteredDrawings] = useState({
    "60": true,
    "180": true,
    "300": true,
  });

  useEffect(() => {
    if (props.drawings !== "none") {
      let initStates = ["", "", ""];
      if (props.drawings["60"].length === 0) {
        initStates[0] = toggleButton(0, false);
      }
      if (props.drawings["180"].length === 0) {
        initStates[1] = toggleButton(1, false);
      }
      if (props.drawings["300"].length === 0) {
        initStates[2] = toggleButton(2, false);
      }

      setButtonStates(initStates);
      setDisplayedDrawings(props.drawings);
    }
  }, [props.drawings]);

  function updateDisplayedDrawings(duration) {
    let updatedDurationValue = filteredDrawings[duration]
      ? []
      : props.drawings[duration];

    let tempDisplayed = { ...displayedDrawings };
    tempDisplayed[duration] = updatedDurationValue;
    setDisplayedDrawings(tempDisplayed);

    updateFilteredDrawings(duration);
  }

  function updateFilteredDrawings(duration) {
    const tempFilteredDrawings = { ...filteredDrawings };
    tempFilteredDrawings[duration] = !tempFilteredDrawings[duration];
    setFilteredDrawings(tempFilteredDrawings);
  }

  if (props.drawings === "none") {
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

  return (
    <div className={classes.baseFlex}>
      <div className={classes.buttonContainer}>
        <button
          className={buttonStates[0]}
          onClick={() => {
            toggleButton(0, true);
            updateDisplayedDrawings("60");
          }}
        >
          1 Minute
        </button>
        <button
          className={buttonStates[1]}
          onClick={() => {
            toggleButton(1, true);
            updateDisplayedDrawings("180");
          }}
        >
          3 Minutes
        </button>
        <button
          className={buttonStates[2]}
          onClick={() => {
            toggleButton(2, true);
            updateDisplayedDrawings("300");
          }}
        >
          5 Minutes
        </button>
      </div>

      <Card width={100}>
        <div className={classes.flexListContain}>
          {Object.values(displayedDrawings)
            .flat()
            .map((drawing) => (
              <GallaryItem key={drawing.index} drawing={drawing} width={30} />
            ))}
        </div>
      </Card>
    </div>
  );
};

export default React.memo(GallaryList);
