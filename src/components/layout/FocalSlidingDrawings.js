import React, { useEffect, useState, useRef } from "react";

import { getDatabase, get, ref, child } from "firebase/database";

import {
  getDownloadURL,
  getStorage,
  ref as ref_storage,
  uploadBytes,
} from "firebase/storage";

import { app } from "../../util/init-firebase";

import classes from "./FocalSlidingDrawings.module.css";
import SlidingDrawing from "./SlidingDrawing";
import FocalBannerMessage from "./FocalBannerMessage";

const FocalSlidingDrawings = (props) => {
  const [randomDrawingIDs, setRandomDrawingIDs] = useState(null);
  const [fetchedImages, setFetchedImages] = useState([]);
  const [offsetX, setOffsetX] = useState(0);

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

  useEffect(() => {
    getRandomDrawingIDs();
  }, []);

  useEffect(() => {
    function handleResize() {
      setOffsetX(testRef.current.getBoundingClientRect().left);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (randomDrawingIDs !== null) {
      getImagesFromIDs();
      setOffsetX(testRef.current.getBoundingClientRect().left);
    }
  }, [randomDrawingIDs]);

  function getRandomDrawingIDs() {
    get(child(dbRef, `titles`)).then((snapshot) => {
      const titles60 = Object.values(snapshot.val()["60"]);
      const titles180 = Object.values(snapshot.val()["180"]);
      const titles300 = Object.values(snapshot.val()["300"]);

      const allTitles = titles60.concat(titles180, titles300);
      const tempDrawingIDs = [];

      // find 25 random indices out of allTitles.length
      for (let i = 0; i < 25; i++) {
        const actualID =
          allTitles[Math.floor(Math.random() * allTitles.length)][
            "drawingID"
          ][0];

        tempDrawingIDs.push(actualID);
      }

      setRandomDrawingIDs(tempDrawingIDs);
    });
  }

  function getImagesFromIDs() {
    const tempDrawings = [];
    const promises = [];
    for (const drawingID of randomDrawingIDs) {
      promises.push(
        getDownloadURL(ref_storage(storage, `drawings/${drawingID}.jpg`))
      );
    }

    Promise.all(promises).then((results) => {
      for (const result of results) {
        tempDrawings.push(result);
      }
      console.log(tempDrawings);
      setFetchedImages(tempDrawings);
    });
  }

  return (
    <div
      ref={testRef}
      style={{
        height: miscSettings.fullHeight,
        width: miscSettings.fullWidth,
        borderRadius: miscSettings.radius,
      }}
      className={classes.fullWidth}
    >
      {fetchedImages.length > 0 ? (
        fetchedImages.map((image, i) => (
          <SlidingDrawing
            key={i}
            drawing={image}
            baseHeight={miscSettings.baseHeight}
            maxHeight={miscSettings.maxHeight}
            offsetX={offsetX}
            width={miscSettings.slidingWidth}
            id={i}
          />
        ))
      ) : (
        <div></div>
      )}

      <FocalBannerMessage forHomepage={props.forHomepage} />
    </div>
  );
};

export default FocalSlidingDrawings;
