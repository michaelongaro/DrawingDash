import React, { useEffect, useState, useRef } from "react";

import { useAuth0 } from "@auth0/auth0-react";
import { useLocation } from "react-router-dom";
import anime from "animejs/lib/anime.es.js";
import isEqual from "lodash/isEqual";

import { getDatabase, get, ref, child } from "firebase/database";

import {
  getDownloadURL,
  getStorage,
  ref as ref_storage,
  uploadBytes,
} from "firebase/storage";

import { app } from "../../util/init-firebase";

import AnimatedGridContainer from "./AnimatedGridContainer";
import FocalBannerMessage from "../homepage/FocalBannerMessage";

import OneMinuteIcon from "../../svgs/OneMinuteIcon";
import ThreeMinuteIcon from "../../svgs/ThreeMinuteIcon";
import FiveMinuteIcon from "../../svgs/FiveMinuteIcon";

import SHADES_OF_GREEN from "../../ui/greenshades";

import classes from "./FocalAnimatedDrawings.module.css";

const FocalAnimatedDrawings = (props) => {
  const { isLoading, isAuthenticated } = useAuth0();
  const location = useLocation();

  const [mobileThresholdReached, setMobileThresholdReached] = useState(false);

  const [showPrompt, setShowPrompt] = useState([false, false, false]);
  const [randomDrawingIDs60, setRandomDrawingIDs60] = useState(null);
  const [randomDrawingIDs180, setRandomDrawingIDs180] = useState(null);
  const [randomDrawingIDs300, setRandomDrawingIDs300] = useState(null);

  const [drawingTitle60, setDrawingTitle60] = useState(null);
  const [drawingTitle180, setDrawingTitle180] = useState(null);
  const [drawingTitle300, setDrawingTitle300] = useState(null);

  const [fetchedDrawings60, setFetchedDrawings60] = useState([]);
  const [fetchedDrawings180, setFetchedDrawings180] = useState([]);
  const [fetchedDrawings300, setFetchedDrawings300] = useState([]);

  const [startIntervalTimer, setStartIntervalTimer] = useState(false);

  const intervalID = useRef(null);

  const testRef = useRef(null);

  let miscSettings = useRef(null);

  const dbRef = ref(getDatabase(app));
  const storage = getStorage();

  if (!props.forSearch) {
    if (props.forHomepage) {
      miscSettings.current = {
        fullHeight: "20em",
        fullWidth: "70%",
        radius: "1em",
        forHomepage: props.forHomepage,
      };
    } else {
      miscSettings.current = {
        fullHeight: "20em",
        fullWidth: "90%",
        radius: "1em",
        forHomepage: props.forHomepage,
      };
    }
  } else {
    miscSettings.current = {
      fullHeight: "20em",
      fullWidth: "90%",
      radius: "1em",
      forHomepage: props.forHomepage,
    };
  }

  useEffect(() => {
    function resizeHandler() {
      if (window.innerWidth < 450) {
        setMobileThresholdReached(true);
      } else {
        setMobileThresholdReached(false);
      }
    }

    resizeHandler();

    window.addEventListener("resize", resizeHandler);
    return () => {
      window.removeEventListener("resize", resizeHandler);
    };
  }, []);

  useEffect(() => {
    getRandomDrawingIDs();
  }, []);

  useEffect(() => {
    // maybe need to limit this further, seems to be getting called more than once,
    // could be simple boolean
    if (randomDrawingIDs60 && randomDrawingIDs180 && randomDrawingIDs300) {
      getImagesFromIDs();
    }
  }, [randomDrawingIDs60, randomDrawingIDs180, randomDrawingIDs300]);

  useEffect(() => {
    if (fetchedDrawings60.length > 0) {
      setShowPrompt([true, false, false]);
      setStartIntervalTimer(true);
    }
  }, [fetchedDrawings60]);

  useEffect(() => {
    if (startIntervalTimer) {
      intervalID.current = setInterval(() => {
        setShowPrompt((showPrompt) => {
          if (
            isEqual(showPrompt, [false, false, false]) ||
            isEqual(showPrompt, [false, false, true])
          ) {
            return [true, false, false];
          } else if (isEqual(showPrompt, [true, false, false])) {
            return [false, true, false];
          } else if (isEqual(showPrompt, [false, true, false])) {
            return [false, false, true];
          }
        });
      }, 10000);
    }

    return () => {
      clearInterval(intervalID.current);
    };
  }, [startIntervalTimer]);

  useEffect(() => {
    if (isEqual(showPrompt, [true, false, false])) {
      anime({
        targets: `#redFocalProgressBar`,
        width: [0, "90%"],

        delay: 0,
        endDelay: 0,

        duration: 10000,
        loop: false,

        easing: "linear",
      });
    } else if (isEqual(showPrompt, [false, true, false])) {
      anime({
        targets: `#yellowFocalProgressBar`,
        width: [0, "90%"],

        delay: 0,
        endDelay: 0,

        duration: 10000,
        loop: false,

        easing: "linear",
      });
    } else if (isEqual(showPrompt, [false, false, true])) {
      anime({
        targets: `#greenFocalProgressBar`,
        width: [0, "90%"],

        delay: 0,
        endDelay: 0,

        duration: 10000,
        loop: false,

        easing: "linear",
      });
    }
  }, [showPrompt]);

  function getRandomDrawingIDs() {
    get(child(dbRef, `titles`)).then((snapshot) => {
      const titles60 = Object.keys(snapshot.val()["60"]);
      const titles180 = Object.keys(snapshot.val()["180"]);
      const titles300 = Object.keys(snapshot.val()["300"]);

      const drawings60 = Object.values(snapshot.val()["60"]);
      const drawings180 = Object.values(snapshot.val()["180"]);
      const drawings300 = Object.values(snapshot.val()["300"]);

      const drawingIDs60 = [],
        drawingIDs180 = [],
        drawingIDs300 = [];

      findRandomEligiblePrompt(
        titles60,
        drawings60,
        drawingIDs60,
        setDrawingTitle60
      );
      findRandomEligiblePrompt(
        titles180,
        drawings180,
        drawingIDs180,
        setDrawingTitle180
      );
      findRandomEligiblePrompt(
        titles300,
        drawings300,
        drawingIDs300,
        setDrawingTitle300
      );

      // setting states with proper IDs
      setRandomDrawingIDs60(drawingIDs60);
      setRandomDrawingIDs180(drawingIDs180);
      setRandomDrawingIDs300(drawingIDs300);
    });
  }

  // finds random prompt which has at least 10 submitted drawings
  function findRandomEligiblePrompt(
    // duration,
    sourceTitles,
    sourceDrawingIDs,
    finalDrawingIDs,
    setDrawingIDs
  ) {
    let loopComplete = false;
    let drawingsPerTitle = {};
    let searchedIndicies = [];
    let randomIndex;

    while (!loopComplete) {
      // if all indicies checked, defaults to true and skips while loop
      let validIndexFound = searchedIndicies.length === sourceDrawingIDs.length;

      // finding new random index
      while (!validIndexFound) {
        let indexToBeChecked = Math.floor(
          Math.random() * sourceDrawingIDs.length
        );
        if (!searchedIndicies.includes(indexToBeChecked)) {
          randomIndex = indexToBeChecked;
          searchedIndicies.push(randomIndex);

          validIndexFound = true;
        }
      }

      // checking if it has >= 10 drawings for that title
      if (sourceDrawingIDs[randomIndex]["drawingID"].length >= 10) {
        for (let i = 0; i < 10; i++) {
          const actualID = sourceDrawingIDs[randomIndex]["drawingID"][i];

          finalDrawingIDs.push(actualID);
        }

        loopComplete = true;
      } else {
        drawingsPerTitle[randomIndex] =
          sourceDrawingIDs[randomIndex]["drawingID"].length;

        // if all indicies have been searched and none had >= 10 drawings, exit loop
        if (searchedIndicies.length === sourceDrawingIDs.length) {
          loopComplete = true;
        }
      }
    }

    // if no ideal index has been found yet
    if (finalDrawingIDs.length === 0) {
      // find the drawing index with the most drawings
      const highestDrawingsIndex = Object.values(drawingsPerTitle).reduce(
        (a, b) => Math.max(a, b),
        -Infinity
      );

      function getKeyByValue(object, value) {
        return Object.keys(object).find((key) => object[key] === value);
      }

      randomIndex = getKeyByValue(drawingsPerTitle, highestDrawingsIndex);

      // pushing all available ids from drawings array
      for (let i = 0; i < highestDrawingsIndex; i++) {
        const actualID = sourceDrawingIDs[randomIndex]["drawingID"][i];

        finalDrawingIDs.push(actualID);
      }

      // returns index value that is scaled off of current loop i value
      // that is within range of found drawings
      const scale = (number, [inMin, inMax], [outMin, outMax]) => {
        return Math.round(
          ((number - inMin) / (inMax - inMin)) * (outMax - outMin) + outMin
        );
      };

      for (let i = 0; i < 10 - highestDrawingsIndex; i++) {
        const scaledID = scale(i, [0, 9], [0, highestDrawingsIndex - 1]);

        const actualID = sourceDrawingIDs[randomIndex]["drawingID"][scaledID];

        finalDrawingIDs.push(actualID);
      }
    }

    setDrawingIDs(sourceTitles[randomIndex]);
  }

  function getImagesFromIDs() {
    getImagesFromDuration(randomDrawingIDs60, 60);
    getImagesFromDuration(randomDrawingIDs180, 180);
    getImagesFromDuration(randomDrawingIDs300, 300);
  }

  function getImagesFromDuration(durationIDs, duration) {
    const tempDrawings = [];
    const promises = [];
    for (const drawingID of durationIDs) {
      promises.push(
        getDownloadURL(ref_storage(storage, `drawings/${drawingID}.jpg`))
      );
    }

    Promise.all(promises).then((results) => {
      for (const result of results) {
        tempDrawings.push(result);
      }

      if (duration === 60) {
        setFetchedDrawings60(tempDrawings);
      } else if (duration === 180) {
        setFetchedDrawings180(tempDrawings);
      } else {
        setFetchedDrawings300(tempDrawings);
      }
    });
  }

  return (
    <div
      ref={testRef}
      style={{
        position: "relative",
        height: miscSettings.current.fullHeight,
        borderRadius: miscSettings.current.radius,
      }}
      className={classes.animatedDrawingsContainer}
    >
      <div
        style={{ opacity: showPrompt[0] && drawingTitle60 ? 1 : 0 }}
        className={classes.drawingTitleContainer}
      >
        <div className={classes.durationContainer}>
          <div style={{ display: mobileThresholdReached ? "none" : "block" }}>
            <OneMinuteIcon
              dimensions={window.innerWidth <= 900 ? "2.25em" : "3em"}
            />
          </div>
          <div>{drawingTitle60}</div>
        </div>
        <div
          style={{ backgroundColor: "red" }}
          className={classes.focalProgressBar}
          id={"redFocalProgressBar"}
        ></div>
      </div>

      <div
        style={{ opacity: showPrompt[1] && drawingTitle180 ? 1 : 0 }}
        className={classes.drawingTitleContainer}
      >
        <div className={classes.durationContainer}>
          <div style={{ display: mobileThresholdReached ? "none" : "block" }}>
            <ThreeMinuteIcon
              dimensions={window.innerWidth <= 900 ? "2.25em" : "3em"}
            />
          </div>
          <div>{drawingTitle180}</div>
        </div>
        <div
          style={{ backgroundColor: "yellow" }}
          className={classes.focalProgressBar}
          id={"yellowFocalProgressBar"}
        ></div>
      </div>

      <div
        style={{ opacity: showPrompt[2] && drawingTitle300 ? 1 : 0 }}
        className={classes.drawingTitleContainer}
      >
        <div className={classes.durationContainer}>
          <div style={{ display: mobileThresholdReached ? "none" : "block" }}>
            <FiveMinuteIcon
              dimensions={window.innerWidth <= 900 ? "2.25em" : "3em"}
            />
          </div>
          <div>{drawingTitle300}</div>
        </div>
        <div
          style={{ backgroundColor: "green" }}
          className={classes.focalProgressBar}
          id={"greenFocalProgressBar"}
        ></div>
      </div>

      {/* Drawings */}
      <div
        style={{
          opacity: showPrompt[0] && fetchedDrawings60.length > 0 ? 1 : 0,
        }}
        className={`${
          !isLoading && !isAuthenticated && location.pathname === "/"
            ? classes.unregisteredAnimatedGridContainer
            : classes.animatedGridContainer
        }`}
      >
        <AnimatedGridContainer
          displayDrawings={showPrompt[0] && fetchedDrawings60.length > 0}
          drawings={fetchedDrawings60}
          offset={0}
          miscSettings={miscSettings.current}
          SHADES_OF_GREEN={SHADES_OF_GREEN}
        />
      </div>

      <div
        style={{
          opacity: showPrompt[1] && fetchedDrawings180.length > 0 ? 1 : 0,
        }}
        className={`${
          !isLoading && !isAuthenticated && location.pathname === "/"
            ? classes.unregisteredAnimatedGridContainer
            : classes.animatedGridContainer
        }`}
      >
        <AnimatedGridContainer
          displayDrawings={showPrompt[1] && fetchedDrawings180.length > 0}
          drawings={fetchedDrawings180}
          offset={31}
          miscSettings={miscSettings.current}
          SHADES_OF_GREEN={SHADES_OF_GREEN}
        />
      </div>

      <div
        style={{
          opacity: showPrompt[2] && fetchedDrawings300.length > 0 ? 1 : 0,
        }}
        className={`${
          !isLoading && !isAuthenticated && location.pathname === "/"
            ? classes.unregisteredAnimatedGridContainer
            : classes.animatedGridContainer
        }`}
      >
        <AnimatedGridContainer
          displayDrawings={showPrompt[2] && fetchedDrawings300.length > 0}
          drawings={fetchedDrawings300}
          offset={62}
          miscSettings={miscSettings.current}
          SHADES_OF_GREEN={SHADES_OF_GREEN}
        />
      </div>

      <FocalBannerMessage
        forHomepage={props.forHomepage}
        forSearch={props.forSearch}
      />
    </div>
  );
};

export default FocalAnimatedDrawings;
