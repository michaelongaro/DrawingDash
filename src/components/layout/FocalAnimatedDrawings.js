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
import FocalBannerMessage from "./FocalBannerMessage";

import classes from "./FocalAnimatedDrawings.module.css";
import AnimatedGridContainer from "./AnimatedGridContainer";

const FocalAnimatedDrawings = (props) => {
  const [showPrompt, setShowPrompt] = useState([false, false, false]);
  const [randomDrawingIDs60, setRandomDrawingIDs60] = useState(null);
  const [randomDrawingIDs180, setRandomDrawingIDs180] = useState(null);
  const [randomDrawingIDs300, setRandomDrawingIDs300] = useState(null);

  const [fetchedDrawings60, setFetchedDrawings60] = useState([]);
  const [fetchedDrawings180, setFetchedDrawings180] = useState([]);
  const [fetchedDrawings300, setFetchedDrawings300] = useState([]);

  const [startIntervalTimer, setStartIntervalTimer] = useState(false);

  const [offsetX, setOffsetX] = useState(0);

  const intervalID = useRef(null);

  const testRef = useRef(null);

  const miscSettings = props.forHomepage
    ? {
        maxHeight: 295,
        baseHeight: 115,
        fullHeight: "20em",
        fullWidth: "66%",
        slidingWidth: window.innerWidth * 0.66,
        radius: "1em",
      }
    : {
        maxHeight: 170,
        baseHeight: 75,
        fullHeight: "15em",
        fullWidth: "100vw",
        slidingWidth: window.innerWidth,
        radius: 0,
      };

  const dbRef = ref(getDatabase(app));
  const storage = getStorage();

  //  useEffect(() => {
  //   function handleResize() {
  //     setOffsetX(testRef.current.getBoundingClientRect().left);
  //   }
  //   window.addEventListener("resize", handleResize);
  //   return () => window.removeEventListener("resize", handleResize);
  // }, []);

  useEffect(() => {
    getRandomDrawingIDs();
    // intervalID.current = setInterval(switchPrompt, 10000);

    // return () => {
    //   clearInterval(intervalID.current);
    // };
  }, []);

  useEffect(() => {
    if (randomDrawingIDs60 && randomDrawingIDs180 && randomDrawingIDs300) {
      console.log(randomDrawingIDs60, randomDrawingIDs180, randomDrawingIDs300);
      getImagesFromIDs();
      setOffsetX(testRef.current.getBoundingClientRect().left);
    }
  }, [randomDrawingIDs60, randomDrawingIDs180, randomDrawingIDs300]);

  // useEffect(() => {
  //   if (
  //     fetchedDrawings60 &&
  //     fetchedDrawings180 &&
  //     fetchedDrawings300 &&
  //     !intervalStarted
  //   ) {
  //     setIntervalStarted(true);

  //     function switchPrompt() {
  //       let tempPrompt = [false, false, false];
  //       if (showPrompt[0]) {
  //         tempPrompt = [false, true, false];
  //       } else if (showPrompt[1]) {
  //         tempPrompt = [false, false, true];
  //       } else {
  //         tempPrompt = [true, false, false];
  //       }
  //       setShowPrompt(tempPrompt);
  //     }
  //     intervalID.current = setInterval(switchPrompt, 10000);
  //   }
  // }, [fetchedDrawings60, fetchedDrawings180, fetchedDrawings300, showPrompt]);

  useEffect(() => {
    console.log("found 60 and starting interval");
    if (fetchedDrawings60.length > 0) {
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
      const titles60 = Object.values(snapshot.val()["60"]);
      const titles180 = Object.values(snapshot.val()["180"]);
      const titles300 = Object.values(snapshot.val()["300"]);

      // const allTitles = titles60.concat(titles180, titles300);
      const tempDrawingIDs60 = [],
        tempDrawingIDs180 = [],
        tempDrawingIDs300 = [];

      findRandomEligiblePrompt(titles60, tempDrawingIDs60);
      findRandomEligiblePrompt(titles180, tempDrawingIDs180);
      findRandomEligiblePrompt(titles300, tempDrawingIDs300);

      // setting states with proper IDs
      setRandomDrawingIDs60(tempDrawingIDs60);
      setRandomDrawingIDs180(tempDrawingIDs180);
      setRandomDrawingIDs300(tempDrawingIDs300);
    });
  }

  // finds random prompt which has at least 15 submitted drawings
  function findRandomEligiblePrompt(sourceArr, tempArr) {
    // uncomment this out below when you actually have 15 or whatever drawings
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

    for (let i = 0; i < 15; i++) {
      const actualID = sourceArr[randomIndex]["drawingID"][0];

      tempArr.push(actualID);
    }
  }

  // function switchPrompt() {
  //   console.log("current starting vals are", showPrompt);
  //   let tempPrompt;
  //   if (
  //     isEqual(showPrompt, [false, false, false]) ||
  //     isEqual(showPrompt, [false, false, true])
  //   ) {
  //     tempPrompt = [true, false, false];
  //   } else if (isEqual(showPrompt, [true, false, false])) {
  //     tempPrompt = [false, true, false];
  //   } else if (isEqual(showPrompt, [false, true, false])) {
  //     tempPrompt = [false, false, true];
  //   }
  //   console.log("setting showprompt to", tempPrompt);
  //   setShowPrompt(tempPrompt);
  // }

  function getImagesFromIDs() {
    console.log("fetching drawings from ids");
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
        height: miscSettings.fullHeight,
        width: miscSettings.fullWidth,
        borderRadius: miscSettings.radius,
        position: "relative",
      }}
      className={classes.fullWidth}
    >
      {showPrompt[0] && fetchedDrawings60.length > 0 && (
        <AnimatedGridContainer
          drawings={fetchedDrawings60}
          offset={0}
          miscSettings={miscSettings}
        />
      )}

      {showPrompt[1] && fetchedDrawings180.length > 0 && (
        <AnimatedGridContainer
          drawings={fetchedDrawings180}
          offset={15}
          miscSettings={miscSettings}
        />
      )}

      {showPrompt[2] && fetchedDrawings300.length > 0 && (
        <AnimatedGridContainer
          drawings={fetchedDrawings300}
          offset={30}
          miscSettings={miscSettings}
        />
      )}

      {/* 60s drawings */}
      {/* <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          opacity: `${showPrompt[0] ? 1 : 0}`,
          transition: "opacity .5s",
        }}
      >
        <div className={classes.gridContainer}>
          {fetchedDrawings60.length > 0 &&
            fetchedDrawings60.map((image, i) => (
              <div className={`classes.drawing${i}`}>
                <AnimatedDrawing
                  key={i}
                  drawing={image}
                  baseHeight={miscSettings.baseHeight}
                  maxHeight={miscSettings.maxHeight}
                  offsetX={offsetX}
                  width={miscSettings.slidingWidth}
                  id={i}
                />
              </div>
            ))}
        </div>
      </div> */}

      {/* 180s drawings */}
      {/* <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          opacity: `${showPrompt[1] ? 1 : 0}`,
          transition: "opacity .5s",
        }}
      >
        <div className={classes.gridContainer}>
          {fetchedDrawings180.length > 0 &&
            fetchedDrawings180.map((image, i) => (
              <div className={`classes.drawing${i + 15}`}>
                <AnimatedDrawing
                  key={i}
                  drawing={image}
                  baseHeight={miscSettings.baseHeight}
                  maxHeight={miscSettings.maxHeight}
                  offsetX={offsetX}
                  width={miscSettings.slidingWidth}
                  id={i + 15}
                />
              </div>
            ))}
        </div>
      </div> */}

      {/* 300s drawings */}
      {/* <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          opacity: `${showPrompt[2] ? 1 : 0}`,
          transition: "opacity .5s",
        }}
      >
        <div className={classes.gridContainer}>
          {fetchedDrawings300.length > 0 &&
            fetchedDrawings300.map((image, i) => (
              <div className={`classes.drawing${i + 30}`}>
                <AnimatedDrawing
                  key={i}
                  drawing={image}
                  baseHeight={miscSettings.baseHeight}
                  maxHeight={miscSettings.maxHeight}
                  offsetX={offsetX}
                  width={miscSettings.slidingWidth}
                  id={i + 30}
                />
              </div>
            ))}
        </div>
      </div> */}

      <FocalBannerMessage forHomepage={props.forHomepage} />
    </div>
  );
};

export default FocalAnimatedDrawings;
