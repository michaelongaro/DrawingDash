import React, { useState, useEffect } from "react";
import anime from "animejs/lib/anime.es.js";

import AnimatedDrawing from "./AnimatedDrawing";

import classes from "./AnimatedGridContainer.module.css";

const AnimatedGridContainer = ({
  drawings,
  offset,
  miscSettings,
  SHADES_OF_GREEN,
}) => {
  const DRAWING_DELAYS = [
    10, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000,
  ];

  // const SHADES_OF_GREEN = ["#3de320", "#29a813", "#328a22", "#4aed2d"];

  const [randomDrawingIndicies, setRandomDrawingIndicies] = useState([]);
  const [randomExtraTileIndicies, setRandomExtraTileIndicies] = useState([]);

  // can manually add an extra (context) variable so that the useEffect cleanup can properly
  // fade this out with a complete: (() => {}) that says it's okay to transition to next duration
  useEffect(() => {
    getRandomIndicies();

    anime({
      targets: `#container${offset}`,
      opacity: [0, 1],
      loop: false,
      direction: "normal",
      duration: 500,
      easing: "linear",
    });

    return () => {
      anime({
        targets: `#container${offset}`,
        opacity: [1, 0],
        loop: false,
        direction: "normal",
        duration: 500,
        easing: "linear",
      });
    };
  }, []);

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

    console.log(tempRandomDrawingIndicies, tempRandomExtraTileIndicies);
    setRandomDrawingIndicies(tempRandomDrawingIndicies);
    setRandomExtraTileIndicies(tempRandomExtraTileIndicies);
  }

  return (
    <>
      {randomDrawingIndicies && randomExtraTileIndicies && (
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
