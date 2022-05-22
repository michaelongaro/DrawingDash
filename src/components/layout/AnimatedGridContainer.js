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

  return (
    <div
      id={`container${offset}`}
      style={{
        position: "absolute",
        left: 0,
        top: 0,
      }}
    >
      <div className={classes.gridContainer}>
        {drawings.map((image, i) => (
          <div className={`classes.drawing${i}`}>
            <AnimatedDrawing
              key={i + offset}
              drawing={image}
              baseHeight={miscSettings.baseHeight}
              maxHeight={miscSettings.maxHeight}
              offsetX={0}
              width={miscSettings.slidingWidth}
              id={i + offset}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnimatedGridContainer;
