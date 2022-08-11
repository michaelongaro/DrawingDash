import React, { useState, useEffect, useContext } from "react";

import { isEqual } from "lodash";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

import SearchContext from "./SearchContext";
import Card from "../../ui/Card";

import GallaryItem from "./GallaryItem";
import PageSelector from "./PageSelector";

import FiveMinuteIcon from "../../svgs/FiveMinuteIcon";
import OneMinuteIcon from "../../svgs/OneMinuteIcon";
import ThreeMinuteIcon from "../../svgs/ThreeMinuteIcon";
import MagnifyingGlassIcon from "../../svgs/MagnifyingGlassIcon";

import classes from "./GallaryList.module.css";
import baseClasses from "../../index.module.css";

const GallaryList = ({
  drawingIDs,
  title = null,
  margin = null,
  databasePath = null,
  idx = null,
  forModal = null,
  forDailyFeatured = false,
}) => {
  const searchCtx = useContext(SearchContext);

  const location = useLocation();

  const [showEmptyResults, setShowEmptyResults] = useState(false);

  const [durationStates, setDurationStates] = useState([false, false, false]);
  const [availableDurations, setAvailableDurations] = useState([
    false,
    false,
    false,
  ]);

  const [redOpacity, setRedOpacity] = useState(0);
  const [yellowOpacity, setYellowOpacity] = useState(0);
  const [greenOpacity, setGreenOpacity] = useState(0);

  const [skeletonRatio, setSkeletonRatio] = useState(1);

  const [minMobileWidthReached, setMinMobileWidthReached] = useState(false);

  // will prob want to change the 60 below to be empty then have logic down below to handle
  const [currentlyShownDuration, setCurrentlyShownDuration] = useState();

  useEffect(() => {
    return () => {
      searchCtx.resetPageSelectorDetails(idx);
    };
  }, []);

  useEffect(() => {
    console.log("gallList ids", drawingIDs);
    if (drawingIDs) {
      if (isEqual(drawingIDs, { 60: [], 180: [], 300: [] })) {
        setShowEmptyResults(true);
      } else if (!isEqual(drawingIDs, { 60: [], 180: [], 300: [] })) {
        // hiding empty results if they are currently being shown
        setShowEmptyResults(false);

        setAvailableDurations([
          drawingIDs["60"].length !== 0 ? true : false,
          drawingIDs["180"].length !== 0 ? true : false,
          drawingIDs["300"].length !== 0 ? true : false,
        ]);

        updateDurationOpacities();

        if (forModal) {
          setSkeletonRatio(4.341);
        } else if (idx === 1 || idx === 2) {
          setSkeletonRatio(6.275);
        } else if (idx === 0) {
          setSkeletonRatio(3.5);
        } else if (idx === -1) {
          // ratio for featured drawings/maybe could use idx === 0
        }

        // used if want to load a different page other than the default order (60->180->300)
        if (searchCtx.pageSelectorDetails["durationToManuallyLoad"][idx]) {
          setDurationStates(searchCtx.manuallyLoadDurations(idx));
          setCurrentlyShownDuration(
            searchCtx.pageSelectorDetails["durationToManuallyLoad"][idx]
          );

          return;
        } else {
          if (drawingIDs["60"].length !== 0) {
            setDurationStates([true, false, false]);
            setCurrentlyShownDuration("60");

            return;
          }
          if (drawingIDs["180"].length !== 0) {
            setDurationStates([false, true, false]);
            setCurrentlyShownDuration("180");

            return;
          }
          if (drawingIDs["300"].length !== 0) {
            setDurationStates([false, false, true]);
            setCurrentlyShownDuration("300");

            return;
          }
        }
      }
    }
  }, [drawingIDs]);

  useEffect(() => {
    // just for initial render
    if (window.innerWidth <= 500) {
      setMinMobileWidthReached(true);
    } else {
      setMinMobileWidthReached(false);
    }

    function resizeHandler() {
      if (window.innerWidth <= 500) {
        setMinMobileWidthReached(true);
      } else {
        setMinMobileWidthReached(false);
      }
    }
    window.addEventListener("resize", resizeHandler);
    return () => {
      window.removeEventListener("resize", resizeHandler);
    };
  }, []);

  useEffect(() => {
    if (showEmptyResults) {
      disableAllDurationTabs();
    }
  }, [showEmptyResults]);

  function disableAllDurationTabs() {
    setDurationStates([false, false, false]);
    setAvailableDurations([false, false, false]);
    setRedOpacity(0);
    setYellowOpacity(0);
    setGreenOpacity(0);
  }

  function updateDurationOpacities() {
    if (searchCtx.pageSelectorDetails["durationToManuallyLoad"][idx]) {
      if (
        drawingIDs[searchCtx.pageSelectorDetails["durationToManuallyLoad"][idx]]
          .length !== 0
      ) {
        if (
          searchCtx.pageSelectorDetails["durationToManuallyLoad"][idx] === "60"
        ) {
          setRedOpacity(1);
          setYellowOpacity(0);
          setGreenOpacity(0);
        } else if (
          searchCtx.pageSelectorDetails["durationToManuallyLoad"][idx] === "180"
        ) {
          setRedOpacity(0);
          setYellowOpacity(1);
          setGreenOpacity(0);
        } else if (
          searchCtx.pageSelectorDetails["durationToManuallyLoad"][idx] === "300"
        ) {
          setRedOpacity(0);
          setYellowOpacity(0);
          setGreenOpacity(1);
        }
      }
    } else {
      let continueChecking = true;
      // setting duration tab color (filled in/empty)
      if (drawingIDs["60"].length !== 0) {
        setRedOpacity(1);
        continueChecking = false;
      } else {
        setRedOpacity(0);
      }
      if (continueChecking && drawingIDs["180"].length !== 0) {
        setYellowOpacity(1);
        continueChecking = false;
      } else {
        setYellowOpacity(0);
      }

      if (continueChecking && drawingIDs["300"].length !== 0) {
        setGreenOpacity(1);
        continueChecking = false;
      } else {
        setGreenOpacity(0);
      }
    }
  }

  return (
    <>
      {drawingIDs && (
        <div
          style={{ marginTop: forDailyFeatured ? 0 : "3em" }}
          className={classes.baseFlex}
        >
          <div className={classes.buttonContainer}>
            {/* One Minute Button */}
            <div
              className={classes.durationIconContainer}
              style={{
                position: "relative",

                background:
                  redOpacity === 0 && durationStates[0]
                    ? "linear-gradient(to bottom, #FFFFFF, rgb(255 0 0 / 70%))"
                    : "linear-gradient(to bottom, rgb(194 194 194 / 70%), #FFFFFF)",

                border: "solid red",

                borderWidth: "2px 2px 0 2px",

                cursor: availableDurations[0] ? "pointer" : "default",
                opacity: availableDurations[0] ? "1" : ".2",
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

                  searchCtx.getGallary(0, 6, 6, idx, databasePath);
                }
              }}
            >
              <div
                style={{
                  opacity: redOpacity,
                  border: "solid red",
                  borderWidth: "2px 2px 0 2px",
                }}
                className={`${classes.durationButtonPositioning} ${classes.baseButtonFlex} ${classes.durationIconContainer} ${classes.hoverRed}`}
              >
                <OneMinuteIcon
                  dimensions={minMobileWidthReached ? "3em" : "3.5em"}
                />
              </div>

              <OneMinuteIcon
                dimensions={minMobileWidthReached ? "3em" : "3.5em"}
              />
            </div>

            {/* 3 Minute Button */}
            <div
              className={classes.durationIconContainer}
              style={{
                position: "relative",

                background:
                  yellowOpacity === 0 && durationStates[1]
                    ? "linear-gradient(to bottom, #FFFFFF, rgb(255 255 0 / 70%))"
                    : "linear-gradient(to bottom, rgb(194 194 194 / 70%), #FFFFFF)",

                border: "solid yellow",

                borderWidth: "2px 2px 0 2px",

                cursor: availableDurations[1] ? "pointer" : "default",
                opacity: availableDurations[1] ? "1" : ".2",
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

                  searchCtx.getGallary(0, 6, 6, idx, databasePath);
                }
              }}
            >
              <div
                style={{
                  opacity: yellowOpacity,
                  border: "solid yellow",
                  borderWidth: "2px 2px 0 2px",
                }}
                className={`${classes.durationButtonPositioning} ${classes.baseButtonFlex} ${classes.durationIconContainer} ${classes.hoverYellow}`}
              >
                <ThreeMinuteIcon
                  dimensions={minMobileWidthReached ? "3em" : "3.5em"}
                />
              </div>

              <ThreeMinuteIcon
                dimensions={minMobileWidthReached ? "3em" : "3.5em"}
              />
            </div>

            {/* 5 Minute Button */}
            <div
              style={{
                position: "relative",

                background:
                  greenOpacity === 0 && durationStates[2]
                    ? "linear-gradient(to bottom, #FFFFFF, rgb(0 255 0 / 70%))"
                    : "linear-gradient(to bottom, rgb(194 194 194 / 70%), #FFFFFF)",

                border: "solid green",
                borderWidth: "2px 2px 0 2px",

                cursor: availableDurations[2] ? "pointer" : "default",
                opacity: availableDurations[2] ? "1" : ".2",
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

                  searchCtx.getGallary(0, 6, 6, idx, databasePath);
                }
              }}
            >
              <div
                style={{
                  opacity: greenOpacity,
                  border: "solid green",
                  borderWidth: "2px 2px 0 2px",
                }}
                className={`${classes.durationButtonPositioning} ${classes.baseButtonFlex} ${classes.durationIconContainer} ${classes.hoverGreen}`}
              >
                <FiveMinuteIcon
                  dimensions={minMobileWidthReached ? "3em" : "3.5em"}
                />
              </div>

              <FiveMinuteIcon
                dimensions={minMobileWidthReached ? "3em" : "3.5em"}
              />
            </div>
          </div>

          <Card
            width={forDailyFeatured || forModal ? "100" : "90"}
            margin={margin}
          >
            {durationStates[0] && (
              <div
                style={{
                  gridTemplateColumns: forDailyFeatured
                    ? "repeat(1, minmax(210px, 3fr))"
                    : "undefined",
                }}
                className={classes.gridListContain}
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
                      idx={idx}
                      dbPath={databasePath}
                      openedFromUserModal={forModal}
                    />
                  ))}
              </div>
            )}

            {durationStates[1] && (
              <div
                style={{
                  gridTemplateColumns: forDailyFeatured
                    ? "repeat(1, minmax(210px, 3fr))"
                    : "undefined",
                }}
                className={classes.gridListContain}
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
                      idx={idx}
                      dbPath={databasePath}
                      openedFromUserModal={forModal}
                    />
                  ))}
              </div>
            )}

            {durationStates[2] && (
              <div
                style={{
                  gridTemplateColumns: forDailyFeatured
                    ? "repeat(1, minmax(210px, 3fr))"
                    : "undefined",
                }}
                className={classes.gridListContain}
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
                      idx={idx}
                      dbPath={databasePath}
                      openedFromUserModal={forModal}
                    />
                  ))}
              </div>
            )}

            {showEmptyResults && (
              <div
                style={{
                  gap: "1em",
                  minWidth:
                    idx === 1
                      ? location.pathname === "/profile/gallery"
                        ? "50vw"
                        : "74vw"
                      : "75vw",
                  minHeight: "350px",
                }}
                className={baseClasses.baseVertFlex}
              >
                {idx === 1 && location.pathname === "/profile/gallery" ? (
                  <>
                    <div style={{ fontSize: "20px" }}>No drawings found</div>
                    <div className={baseClasses.animatedRainbow}>
                      <Link to="/daily-drawings">
                        Start Your First Drawing!
                      </Link>
                    </div>
                    <div style={{ fontSize: "20px" }}>
                      and return here to view your masterpiece!
                    </div>
                  </>
                ) : (
                  <>
                    <MagnifyingGlassIcon dimensions={"4.5em"} color={"black"} />
                    <div style={{ fontSize: "20px" }}>
                      No drawings found for:
                    </div>
                    <div style={{ fontSize: "25px" }}>"{title}"</div>
                  </>
                )}
              </div>
            )}
          </Card>

          {/* page swap buttons */}
          <div
            style={{
              display: !forDailyFeatured ? "flex" : "none",
              gap: "1em",
            }}
            className={baseClasses.baseFlex}
          >
            {currentlyShownDuration && (
              <PageSelector
                currentlyShownDuration={currentlyShownDuration}
                idx={idx}
                databasePath={databasePath}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default GallaryList;
