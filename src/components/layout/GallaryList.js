import React, { useState, useEffect, useContext } from "react";

import { isEqual } from "lodash";

import SearchContext from "./SearchContext";
import Card from "../../ui/Card";

import GallaryItem from "./GallaryItem";

import FiveMinuteIcon from "../../svgs/FiveMinuteIcon";
import OneMinuteIcon from "../../svgs/OneMinuteIcon";
import ThreeMinuteIcon from "../../svgs/ThreeMinuteIcon";

import classes from "./GallaryList.module.css";
import baseClasses from "../../index.module.css";
import MagnifyingGlassIcon from "../../svgs/MagnifyingGlassIcon";

const GallaryList = ({ drawingIDs, title, margin, databasePath, forModal }) => {
  const searchCtx = useContext(SearchContext);

  const [showEmptyResults, setShowEmptyResults] = useState(false);

  // const [displayedDrawings, setDisplayedDrawings] = useState({
  //   60: [],
  //   180: [],
  //   300: [],
  // });
  const [durationStates, setDurationStates] = useState([false, false, false]);
  const [availableDurations, setAvailableDurations] = useState([
    false,
    false,
    false,
  ]);
  const [showButtonColors, setShowButtonColors] = useState();
  const [pageSelectorButtons, setPageSelectorButtons] = useState([]);
  const [renderGallaryList, setRenderGallaryList] = useState(false);

  const [redOpacity, setRedOpacity] = useState(0);
  const [yellowOpacity, setYellowOpacity] = useState(0);
  const [greenOpacity, setGreenOpacity] = useState(0);

  const [skeletonRatio, setSkeletonRatio] = useState(1);

  // will prob want to change the 60 below to be empty then have logic down below to handle
  const [currentlyShownDuration, setCurrentlyShownDuration] = useState();

  let idx = databasePath === "" ? 0 : 1;

  useEffect(() => {
    if (drawingIDs) {
      if (isEqual(drawingIDs, { 60: [], 180: [], 300: [] })) {
        console.log("showing Empty");
        setShowEmptyResults(true);
        // setRenderGallaryList(true);
      } else if (!isEqual(drawingIDs, { 60: [], 180: [], 300: [] })) {
        // hiding empty results if they are currently being shown
        setShowEmptyResults(false);

        setAvailableDurations([
          drawingIDs["60"].length !== 0 ? true : false,
          drawingIDs["180"].length !== 0 ? true : false,
          drawingIDs["300"].length !== 0 ? true : false,
        ]);

        if (forModal) {
          setSkeletonRatio(4.341);
        } else if (idx === 1) {
          setSkeletonRatio(6.275);
        } else if (idx === 0) {
          setSkeletonRatio(3.5);
        }

        // used if want to load a different page other than the default order (60->180->300)
        if (searchCtx.pageSelectorDetails["durationToManuallyLoad"][idx]) {
          setDurationStates(
            searchCtx.manuallyLoadDurations(databasePath === "" ? 0 : 1)
          );
          setShowButtonColors(
            searchCtx.manuallyLoadDurations(databasePath === "" ? 0 : 1)
          );
          setCurrentlyShownDuration(
            searchCtx.pageSelectorDetails["durationToManuallyLoad"][idx]
          );

          return;
        } else {
          console.log("reloading the old fashioned way, nothing fancy");
          if (drawingIDs["60"].length !== 0) {
            setDurationStates([true, false, false]);
            setShowButtonColors([true, false, false]);
            setCurrentlyShownDuration("60");

            return;
          }
          if (drawingIDs["180"].length !== 0) {
            setDurationStates([false, true, false]);
            setShowButtonColors([false, true, false]);
            setCurrentlyShownDuration("180");

            return;
          }
          if (drawingIDs["300"].length !== 0) {
            setDurationStates([false, false, true]);
            setShowButtonColors([false, false, true]);
            setCurrentlyShownDuration("300");

            return;
          }
        }
      }
    }
  }, [drawingIDs]);

  return (
    <>
      {drawingIDs && (
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
                  searchCtx.updatePageSelectorDetails(
                    "durationToManuallyLoad",
                    "60",
                    idx
                  );

                  setCurrentlyShownDuration("60");
                  searchCtx.updatePageSelectorDetails(
                    "currentPageNumber",
                    1,
                    idx
                  );
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
                  searchCtx.updatePageSelectorDetails(
                    "durationToManuallyLoad",
                    "180",
                    idx
                  );
                  setCurrentlyShownDuration("180");
                  searchCtx.updatePageSelectorDetails(
                    "currentPageNumber",
                    1,
                    idx
                  );
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
                  searchCtx.updatePageSelectorDetails(
                    "durationToManuallyLoad",
                    "300",
                    idx
                  );
                  setCurrentlyShownDuration("300");
                  searchCtx.updatePageSelectorDetails(
                    "currentPageNumber",
                    1,
                    idx
                  );
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
              {Object.values(drawingIDs["60"])
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
                      widthRatio: skeletonRatio,
                      heightRatio: skeletonRatio,
                    }}
                  />
                ))}
            </div>

            <div
              className={`${durationStates[1] ? "" : classes.hide} ${
                classes.gridListContain
              }`}
            >
              {Object.values(drawingIDs["180"])
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
                      widthRatio: skeletonRatio,
                      heightRatio: skeletonRatio,
                    }}
                  />
                ))}
            </div>

            <div
              className={`${durationStates[2] ? "" : classes.hide} ${
                classes.gridListContain
              }`}
            >
              {Object.values(drawingIDs["300"])
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
                      widthRatio: skeletonRatio,
                      heightRatio: skeletonRatio,
                    }}
                  />
                ))}
            </div>

            {showEmptyResults && (
              <div
                style={{ gap: "1em", minWidth: "85vw", minHeight: "350px" }}
                className={baseClasses.baseVertFlex}
              >
                <MagnifyingGlassIcon dimensions={"4.5em"} color={"black"} />
                <div style={{ fontSize: "20px" }}>No drawings found for:</div>
                <div style={{ fontSize: "25px" }}>"{title}"</div>
              </div>
            )}
          </Card>

          {/* page swap buttons */}
          {/* note: will need to calculate width of page above and then have breakpoints for how many
              images to fetch  */}
          <div
            style={{ position: "relative", right: 0, bottom: 0, gap: "1em" }}
            className={baseClasses.baseFlex}
          >
            {currentlyShownDuration &&
              Array(
                Math.floor(
                  (searchCtx.pageSelectorDetails["totalDrawingsByDuration"][
                    idx
                  ][currentlyShownDuration] +
                    6 -
                    1) /
                    6
                )
              )
                .fill("")
                .map((val, i) => (
                  <button
                    style={{
                      backgroundColor:
                        searchCtx.pageSelectorDetails["currentPageNumber"][
                          idx
                        ] ===
                        i + 1
                          ? "#c2c2c2"
                          : "#fff",
                    }}
                    className={classes.pageSelectorButton}
                    // replace 6 with the max allowed per page
                    onClick={() => {
                      searchCtx.getGallary(6 * i, 6 * (i + 1), 6, databasePath);
                      searchCtx.updatePageSelectorDetails(
                        "currentPageNumber",
                        i + 1,
                        idx
                      );
                    }}
                  >
                    {i + 1}
                  </button>
                ))}
          </div>
        </div>
      )}
    </>
  );
};

export default GallaryList;
