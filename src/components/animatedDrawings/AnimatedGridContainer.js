import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useLocation } from "react-router-dom";
import AnimatedDrawing from "./AnimatedDrawing";
import { inRange } from "lodash";

const AnimatedGridContainer = ({
  displayDrawings,
  drawings,
  offset,
  miscSettings,
  SHADES_OF_GREEN,
}) => {
  const { isLoading, isAuthenticated } = useAuth0();
  const location = useLocation();

  const DRAWING_DELAYS = [
    10, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000,
  ];

  const [shownIndicies, setShownIndicies] = useState(0);
  const [maxDrawingsToShow, setMaxDrawingsToShow] = useState(0);

  const [randomDrawingIndicies, setRandomDrawingIndicies] = useState([]);
  const [randomStaticTileIndicies, setRandomStaticTileIndicies] = useState([]);

  useEffect(() => {
    function resizeHandler() {
      if (!isLoading && !isAuthenticated && location.pathname === "/") {
        if (window.innerWidth > 1400) {
          setShownIndicies(27);
          setMaxDrawingsToShow(10);
        } else if (window.innerWidth > 1300 && window.innerWidth < 1400) {
          setShownIndicies(24);
          setMaxDrawingsToShow(10);
        } else if (window.innerWidth > 1150 && window.innerWidth < 1300) {
          setShownIndicies(21);
          setMaxDrawingsToShow(10);
        } else if (window.innerWidth > 800 && window.innerWidth < 1150) {
          setShownIndicies(18);
          setMaxDrawingsToShow(10);
        } else if (window.innerWidth > 600 && window.innerWidth < 800) {
          setShownIndicies(15);
          setMaxDrawingsToShow(7);
        } else if (window.innerWidth > 400 && window.innerWidth < 600) {
          setShownIndicies(12);
          setMaxDrawingsToShow(8);
        } else if (window.innerWidth < 400) {
          setShownIndicies(9);
          setMaxDrawingsToShow(5);
        }
      } else if (!isLoading) {
        if (window.innerWidth > 1400) {
          setShownIndicies(27);
          setMaxDrawingsToShow(10);
        } else if (window.innerWidth > 1200 && window.innerWidth < 1400) {
          setShownIndicies(24);
          setMaxDrawingsToShow(10);
        } else if (window.innerWidth > 1000 && window.innerWidth < 1200) {
          setShownIndicies(21);
          setMaxDrawingsToShow(10);
        } else if (window.innerWidth > 800 && window.innerWidth < 1000) {
          setShownIndicies(18);
          setMaxDrawingsToShow(10);
        } else if (window.innerWidth > 600 && window.innerWidth < 800) {
          setShownIndicies(15);
          setMaxDrawingsToShow(7);
        } else if (window.innerWidth > 400 && window.innerWidth < 600) {
          setShownIndicies(12);
          setMaxDrawingsToShow(8);
        } else if (window.innerWidth < 400) {
          setShownIndicies(9);
          setMaxDrawingsToShow(5);
        }
      }
    }

    resizeHandler();

    window.addEventListener("resize", resizeHandler);
    return () => {
      window.removeEventListener("resize", resizeHandler);
    };
  }, [isLoading, isAuthenticated, location.pathname]);

  useEffect(() => {
    if (shownIndicies !== 0 && maxDrawingsToShow !== 0 && displayDrawings) {
      getRandomIndicies();
    }
  }, [shownIndicies, maxDrawingsToShow, displayDrawings]);

  function getRandomIndicies() {
    let tempRandomDrawingIndicies = [];
    let tempRandomExtraTileIndicies = [];

    let allIndiciesFound = false;

    let dynamicEndIdxModifier =
      shownIndicies === 27 ? 0 : (27 - shownIndicies) / 3;

    let topStartIdx = 0;
    let topEndIdx = 27 / 3 - dynamicEndIdxModifier;
    let midStartIdx = 9;
    let midEndIdx = (27 / 3) * 2 - dynamicEndIdxModifier;
    let botStartIdx = 18;
    let botEndIdx = 27 - dynamicEndIdxModifier;

    while (!allIndiciesFound) {
      // top row indicies
      let randomTopRowIndex = Math.floor(
        Math.random() * (topEndIdx - topStartIdx) + topStartIdx
      );

      if (!tempRandomDrawingIndicies.includes(randomTopRowIndex))
        tempRandomDrawingIndicies.push(randomTopRowIndex);

      if (tempRandomDrawingIndicies.length === maxDrawingsToShow) {
        allIndiciesFound = true;
        break;
      }

      // middle row indicies
      let randomMiddleRowIndex = Math.floor(
        Math.random() * (midEndIdx - midStartIdx) + midStartIdx
      );

      if (!tempRandomDrawingIndicies.includes(randomMiddleRowIndex))
        tempRandomDrawingIndicies.push(randomMiddleRowIndex);

      if (tempRandomDrawingIndicies.length === maxDrawingsToShow) {
        allIndiciesFound = true;
        break;
      }

      // bottom row indicies
      let randomBottomRowIndex = Math.floor(
        Math.random() * (botEndIdx - botStartIdx) + botStartIdx
      );

      if (!tempRandomDrawingIndicies.includes(randomBottomRowIndex))
        tempRandomDrawingIndicies.push(randomBottomRowIndex);

      if (tempRandomDrawingIndicies.length === maxDrawingsToShow) {
        allIndiciesFound = true;
        break;
      }
    }

    for (let i = 0; i < 27; i++) {
      if (
        !tempRandomDrawingIndicies.includes(i) &&
        (inRange(i, topStartIdx, topEndIdx) ||
          inRange(i, midStartIdx, midEndIdx) ||
          inRange(i, botStartIdx, botEndIdx))
      ) {
        tempRandomExtraTileIndicies.push(i);
      }
    }

    setRandomDrawingIndicies(tempRandomDrawingIndicies);
    setRandomStaticTileIndicies(tempRandomExtraTileIndicies);
  }

  return (
    <>
      {displayDrawings && randomDrawingIndicies && randomStaticTileIndicies && (
        <>
          {new Array(maxDrawingsToShow).fill("").map((image, i) => (
            <div
              style={{
                backgroundColor: SHADES_OF_GREEN[randomDrawingIndicies[i]],
                gridArea: `drawing${randomDrawingIndicies[i]}`,
              }}
            >
              <AnimatedDrawing
                key={i + offset}
                drawing={drawings[i]}
                delay={DRAWING_DELAYS[i]}
                forHomepage={miscSettings.forHomepage}
                id={i}
                offsetX={0}
              />
            </div>
          ))}

          {randomStaticTileIndicies.map((index, i) => (
            <div
              style={{
                backgroundColor: SHADES_OF_GREEN[randomStaticTileIndicies[i]],
                gridArea: `drawing${randomStaticTileIndicies[i]}`,
              }}
            ></div>
          ))}
        </>
      )}
    </>
  );
};

export default AnimatedGridContainer;
