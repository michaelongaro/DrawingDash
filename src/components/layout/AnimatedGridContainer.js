import React, { useEffect } from "react";
import anime from "animejs/lib/anime.es.js";

import AnimatedDrawing from "./AnimatedDrawing";

import classes from "./AnimatedGridContainer.module.css";

const AnimatedGridContainer = ({ drawings, offset, miscSettings }) => {
  useEffect(() => {
    anime({
      targets: `#container${offset}`,
      opacity: [0, 1],
      loop: false,
      direction: "normal",
      duration: 1000,
      easing: "linear",
    });

    return () => {
      anime({
        targets: `#container${offset}`,
        opacity: [1, 0],
        loop: false,
        direction: "normal",
        duration: 1000,
        easing: "linear",
      });
    };
  }, []);

  return (
    <div
      id={`container${offset}`}
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        // height: "2em",
      }}
    >
      <div className={`${miscSettings.forHomepage ? classes.gridContainer : classes.searchGridContainer}`}>
        {drawings.map((image, i) => (
          <div className={`classes.drawing${i}`}>
            <AnimatedDrawing
              key={i + offset}
              drawing={image}
              forHomepage={miscSettings.forHomepage}
              offsetX={0}
              id={i}
            />
          </div>
        ))}
        {drawings.map((image, i) => (
          <div className={`classes.drawing${i + 15}`}>
            <AnimatedDrawing
              key={i + 15}
              drawing={image}
              forHomepage={miscSettings.forHomepage}
              offsetX={0}
              id={i + 15}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnimatedGridContainer;
