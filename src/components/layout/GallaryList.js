import React, { useState, useEffect } from "react";
import FiveMinuteIcon from "../../svgs/FiveMinuteIcon";
import OneMinuteIcon from "../../svgs/OneMinuteIcon";
import ThreeMinuteIcon from "../../svgs/ThreeMinuteIcon";
import Card from "../../ui/Card";

import GallaryItem from "./GallaryItem";

import classes from "./GallaryList.module.css";

const GallaryList = ({ drawingIDs, title, margin }) => {
  const [displayedDrawings, setDisplayedDrawings] = useState();
  const [durationStates, setDurationStates] = useState();
  const [availableDurations, setAvailableDurations] = useState();
  const [showButtonColors, setShowButtonColors] = useState();

  const [redOpacity, setRedOpacity] = useState(0);
  const [yellowOpacity, setYellowOpacity] = useState(0);
  const [greenOpacity, setGreenOpacity] = useState(0);

  useEffect(() => {
    if (drawingIDs) {
      setDisplayedDrawings(drawingIDs);
      setAvailableDurations([
        drawingIDs["60"].length !== 0 ? true : false,
        drawingIDs["180"].length !== 0 ? true : false,
        drawingIDs["300"].length !== 0 ? true : false,
      ]);
      if (drawingIDs["60"].length !== 0) {
        setDurationStates([true, false, false]);
        setShowButtonColors([true, false, false]);
        return;
      }
      if (drawingIDs["180"].length !== 0) {
        setDurationStates([false, true, false]);
        setShowButtonColors([false, true, false]);
        return;
      }
      if (drawingIDs["300"].length !== 0) {
        setDurationStates([false, false, true]);
        setShowButtonColors([false, false, true]);
        return;
      }
    }
  }, [drawingIDs]);

  useEffect(() => {
    console.log(showButtonColors);
  }, [showButtonColors]);

  return (
    <>
      {displayedDrawings && durationStates && (
        <div className={classes.baseFlex}>
          <div className={classes.buttonContainer}>
            {/* One Minute Button */}
            <div
              className={classes.durationIconContainer}
              style={{
                position: "relative",

                background:
                  !redOpacity && durationStates[0]
                    ? "linear-gradient(to bottom, #FFFFFF, rgb(255 0 0 / 40%))"
                    : "linear-gradient(to bottom, rgb(194 194 194 / 40%), #FFFFFF)",

                border: "solid red",

                borderWidth: "2px 2px 0 2px",

                cursor: availableDurations[0] ? "pointer" : "default",
                opacity: availableDurations[0] ? "1" : ".5",
              }}
              onMouseEnter={() => {
                if (availableDurations[0]) setRedOpacity(1);
              }}
              onMouseLeave={() => {
                if (!durationStates[0]) setRedOpacity(0);
              }}
              onClick={() => {
                if (availableDurations[0]) {
                  setDurationStates([true, false, false]);
                  setYellowOpacity(0);
                  setGreenOpacity(0);
                }
              }}
            >
              <div
                style={{
                  opacity: redOpacity,
                  border: "solid red",
                  borderWidth: "2px 2px 0 2px",

                  left: "-2px",
                  top: "-2px",
                  width: "188px",
                  height: "66px",
                }}
                className={`${classes.baseButtonFlex} ${classes.durationIconContainer} ${classes.hoverRed}`}
              >
                <OneMinuteIcon dimensions={"3.5em"} />
              </div>

              <OneMinuteIcon dimensions={"3.5em"} />
            </div>

            {/* 3 Minute Button */}
            <div
              className={classes.durationIconContainer}
              style={{
                position: "relative",

                background:
                  !yellowOpacity && durationStates[1]
                    ? "linear-gradient(to bottom, #FFFFFF, rgb(255 255 0 / 40%))"
                    : "linear-gradient(to bottom, rgb(194 194 194 / 40%), #FFFFFF)",

                border: "solid yellow",

                borderWidth: "2px 2px 0 2px",

                cursor: availableDurations[1] ? "pointer" : "default",
                opacity: availableDurations[1] ? "1" : ".5",
              }}
              onMouseEnter={() => {
                if (availableDurations[1]) setYellowOpacity(1);
              }}
              onMouseLeave={() => {
                if (!durationStates[1]) setYellowOpacity(0);
              }}
              onClick={() => {
                if (availableDurations[1]) {
                  setDurationStates([false, true, false]);
                  setRedOpacity(0);
                  setGreenOpacity(0);
                }
              }}
            >
              <div
                style={{
                  opacity: yellowOpacity,
                  border: "solid yellow",
                  borderWidth: "2px 2px 0 2px",

                  left: "-2px",
                  top: "-2px",
                  width: "188px",
                  height: "66px",
                }}
                className={`${classes.baseButtonFlex} ${classes.durationIconContainer} ${classes.hoverYellow}`}
              >
                <ThreeMinuteIcon dimensions={"3.5em"} />
              </div>

              <ThreeMinuteIcon dimensions={"3.5em"} />
            </div>

            {/* 5 Minute Button */}
            <div
              style={{
                position: "relative",

                background:
                  !greenOpacity && durationStates[2]
                    ? "linear-gradient(to bottom, #FFFFFF, rgb(0 255 0 / 40%))"
                    : "linear-gradient(to bottom, rgb(194 194 194 / 40%), #FFFFFF)",

                border: "solid green",
                borderWidth: "2px 2px 0 2px",

                cursor: availableDurations[2] ? "pointer" : "default",
                opacity: availableDurations[2] ? "1" : ".5",
              }}
              className={classes.durationIconContainer}
              onMouseEnter={() => {
                if (availableDurations[2]) setGreenOpacity(1);
              }}
              onMouseLeave={() => {
                if (!durationStates[2]) setGreenOpacity(0);
              }}
              onClick={() => {
                if (availableDurations[2]) {
                  setDurationStates([false, false, true]);
                  setRedOpacity(0);
                  setYellowOpacity(0);
                }
              }}
            >
              <div
                style={{
                  opacity: greenOpacity,
                  border: "solid green",
                  borderWidth: "2px 2px 0 2px",

                  left: "-2px",
                  top: "-2px",
                  width: "188px",
                  height: "66px",
                }}
                className={`${classes.baseButtonFlex} ${classes.durationIconContainer} ${classes.hoverGreen}`}
              >
                <FiveMinuteIcon dimensions={"3.5em"} />
              </div>

              <FiveMinuteIcon dimensions={"3.5em"} />
            </div>
          </div>

          <Card margin={margin}>
            <div
              className={`${durationStates[0] ? "" : classes.hide} ${
                classes.gridListContain
              }`}
            >
              {Object.values(displayedDrawings["60"])
                .flat()
                .map((drawingID, i) => (
                  <GallaryItem
                    key={i}
                    drawingID={drawingID}
                    settings={{
                      width: 100,
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
                classes.gridListContain
              }`}
            >
              {Object.values(displayedDrawings["180"])
                .flat()
                .map((drawingID, i) => (
                  <GallaryItem
                    key={i}
                    drawingID={drawingID}
                    settings={{
                      width: 100,
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
                classes.gridListContain
              }`}
            >
              {Object.values(displayedDrawings["300"])
                .flat()
                .map((drawingID, i) => (
                  <GallaryItem
                    key={i}
                    drawingID={drawingID}
                    settings={{
                      width: 100,
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
          </Card>
        </div>
      )}
    </>
  );
};

export default GallaryList;
