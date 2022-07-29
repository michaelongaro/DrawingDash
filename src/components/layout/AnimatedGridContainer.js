import React, { useState, useEffect } from "react";

import AnimatedDrawing from "./AnimatedDrawing";

const AnimatedGridContainer = ({
  displayDrawings,
  drawings,
  offset,
  miscSettings,
  SHADES_OF_GREEN,
}) => {
  const DRAWING_DELAYS = [
    10, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000,
  ];

  const [randomDrawingIndicies, setRandomDrawingIndicies] = useState([]);
  const [randomExtraTileIndicies, setRandomExtraTileIndicies] = useState([]);

  useEffect(() => {
    if (displayDrawings) {
      getRandomIndicies();
    }
  }, [displayDrawings]);

  function getRandomIndicies() {
    let tempRandomDrawingIndicies = [];
    let tempRandomExtraTileIndicies = [];

    let allIndiciesFound = false;

    while (!allIndiciesFound) {
      let randomIndex = Math.floor(Math.random() * 30);

      if (!tempRandomDrawingIndicies.includes(randomIndex))
        tempRandomDrawingIndicies.push(randomIndex);

      if (tempRandomDrawingIndicies.length === 10) allIndiciesFound = true;
    }

    for (let i = 0; i < 30; i++) {
      if (!tempRandomDrawingIndicies.includes(i))
        tempRandomExtraTileIndicies.push(i);
    }

    setRandomDrawingIndicies(tempRandomDrawingIndicies);
    setRandomExtraTileIndicies(tempRandomExtraTileIndicies);
  }

  return (
    <>
      {displayDrawings && randomDrawingIndicies && randomExtraTileIndicies && (
        <>
          {drawings.map((image, i) => (
            <div
              style={{
                backgroundColor: SHADES_OF_GREEN[randomDrawingIndicies[i]],
                gridArea: `drawing${randomDrawingIndicies[i]}`,
              }}
            >
              <AnimatedDrawing
                key={i + offset}
                drawing={image}
                delay={DRAWING_DELAYS[i]}
                forHomepage={miscSettings.forHomepage}
                id={i}
                offsetX={0}
              />
            </div>
          ))}

          {randomExtraTileIndicies.map((index, i) => (
            <div
              style={{
                backgroundColor: SHADES_OF_GREEN[randomExtraTileIndicies[i]],
                gridArea: `drawing${randomExtraTileIndicies[i]}`,
              }}
            ></div>
          ))}
        </>
      )}
    </>
  );
};

export default AnimatedGridContainer;
