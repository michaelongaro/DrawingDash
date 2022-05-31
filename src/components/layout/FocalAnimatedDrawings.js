import React, { useEffect, useState, useRef } from "react";

import isEqual from "lodash/isEqual";
import { getDatabase, get, ref, child } from "firebase/database";

import {
  getDownloadURL,
  getStorage,
  ref as ref_storage,
  uploadBytes,
} from "firebase/storage";

import { app } from "../../util/init-firebase";

import AnimatedDrawing from "./AnimatedDrawing";
import AnimatedGridContainer from "./AnimatedGridContainer";
import FocalBannerMessage from "./FocalBannerMessage";

import classes from "./FocalAnimatedDrawings.module.css";

const FocalAnimatedDrawings = (props) => {
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

  const [offsetX, setOffsetX] = useState(0);

  const intervalID = useRef(null);

  const testRef = useRef(null);

  let miscSettings = useRef(null);

  const dbRef = ref(getDatabase(app));
  const storage = getStorage();

  if (!props.forSearch) {
      if (props.forHomepage) {
        miscSettings.current = {
          fullHeight: "22.85em",
          fullWidth: "66%",
          radius: "1em",
          forHomepage: props.forHomepage,
        };
      } else {
        miscSettings.current = {
          fullHeight: "17em",
          fullWidth: "100vw",
          radius: "1em",
          forHomepage: props.forHomepage,
        };
      }
    } else {
      miscSettings.current = {
        fullHeight: "17em",
        fullWidth: "100vw",
        radius: 0,
        forHomepage: props.forHomepage,
      };
    }

  //  useEffect(() => {
  //   function handleResize() {
  //     setOffsetX(testRef.current.getBoundingClientRect().left);
  //   }
  //   window.addEventListener("resize", handleResize);
  //   return () => window.removeEventListener("resize", handleResize);
  // }, []);

  useEffect(() => {
    getRandomDrawingIDs();
    console.log("loaded and started fetch of words");

    
  }, []);

  useEffect(() => {
    if (randomDrawingIDs60 && randomDrawingIDs180 && randomDrawingIDs300) {
      console.log("collected all ids & fetching images from ids");
      getImagesFromIDs();
      // setOffsetX(testRef.current.getBoundingClientRect().left);
    }
  }, [randomDrawingIDs60, randomDrawingIDs180, randomDrawingIDs300]);

  useEffect(() => {
    if (fetchedDrawings60.length > 0) {
      console.log("found 60 and starting interval");
      setShowPrompt([true, false, false]);
      setStartIntervalTimer(true);
    }
  }, [fetchedDrawings60]);

  useEffect(() => {
    if (startIntervalTimer) {
      console.log("starting interval");
      intervalID.current = setInterval(() => {
        setShowPrompt((showPrompt) => {
          console.log(showPrompt);
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
      // setStartIntervalTimer(false);
    }

    return () => {
      clearInterval(intervalID.current);
    };
  }, [startIntervalTimer]);

  function getRandomDrawingIDs() {
    get(child(dbRef, `titles`)).then((snapshot) => {

      const titles60 = Object.titles(snapshot.val()["60"]);
      const titles180 = Object.titles(snapshot.val()["180"]);
      const titles300 = Object.titles(snapshot.val()["300"]);

      const drawings60 = Object.values(snapshot.val()["60"]);
      const drawings180 = Object.values(snapshot.val()["180"]);
      const drawings300 = Object.values(snapshot.val()["300"]);

      // const allTitles = drawings60.concat(drawings180, drawings300);
      const tempDrawingIDs60 = [],
        tempDrawingIDs180 = [],
        tempDrawingIDs300 = [];

      findRandomEligiblePrompt("60", titles60, drawings60, tempDrawingIDs60);
      findRandomEligiblePrompt("180", titles180, drawings180, tempDrawingIDs180);
      findRandomEligiblePrompt("300", titles300, drawings300, tempDrawingIDs300);

      // setting states with proper IDs
      setRandomDrawingIDs60(tempDrawingIDs60);
      setRandomDrawingIDs180(tempDrawingIDs180);
      setRandomDrawingIDs300(tempDrawingIDs300);
    });
  }

  // finds random prompt which has at least 15 submitted drawings
  function findRandomEligiblePrompt(duration, sourceTitles, sourceArr, tempArr) {
    // uncomment this out below when you actually have 15 or whatever drawings
    // will need to update becuase it was using Object.values(...) before above
    // let promptHas15OrMoreDrawings = false;
    // while (!promptHas15OrMoreDrawings) {
    //   let randomIndex = Math.floor(Math.random() * sourceArr.length);
    //   if (sourceArr[randomIndex].length >= 15) {
    //     for (let i = 0; i < 15; i++) {
    //       const actualID = sourceArr[randomIndex]["drawingID"][i];

    //       tempArr.push(actualID);
    //     }
    //     promptHas15OrMoreDrawings = true;
    //   }
    // }
    let randomIndex = Math.floor(Math.random() * sourceArr.length);

    // adding the title that corresponds with the images
    if (duration === "60") setDrawingTitle60(sourceTitles[randomIndex]);
    if (duration === "180") setDrawingTitle180(sourceTitles[randomIndex]);
    if (duration === "300") setDrawingTitle300(sourceTitles[randomIndex]);

    for (let i = 0; i < 15; i++) {
      const actualID = sourceArr[randomIndex]["drawingID"][0];

      tempArr.push(actualID);
    }
    console.log("finished finding ids");
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
        width: miscSettings.current.fullWidth,
        borderRadius: miscSettings.current.radius,
      }}
      className={classes.fullWidth}
    >

      {/* Drawing Titles */}
      {/* may have to put into components like below in order to get fade in/fade out effect to work */}
      {showPrompt[0] && drawingTitle60 && (
        <div className={classes.drawingTitleContainer}>{drawingTitle60}</div>
      )}

      {showPrompt[1] && drawingTitle180 && (
        <div className={classes.drawingTitleContainer}>{drawingTitle60}</div>
      )}

      {showPrompt[2] && drawingTitle300 && (
        <div className={classes.drawingTitleContainer}>{drawingTitle60}</div>
      )}

      {/* Drawings */}
      {showPrompt[0] && fetchedDrawings60.length > 0 && (
        <AnimatedGridContainer
          drawings={fetchedDrawings60}
          offset={0}
          miscSettings={miscSettings.current}
        />
      )}

      {showPrompt[1] && fetchedDrawings180.length > 0 && (
        <AnimatedGridContainer
          drawings={fetchedDrawings180}
          offset={16}
          miscSettings={miscSettings.current}
        />
      )}

      {showPrompt[2] && fetchedDrawings300.length > 0 && (
        <AnimatedGridContainer
          drawings={fetchedDrawings300}
          offset={32}
          miscSettings={miscSettings.current}
        />
      )}

      <FocalBannerMessage forHomepage={props.forHomepage} forSearch={props.forSearch} />
    </div>
  );
};

export default FocalAnimatedDrawings;
