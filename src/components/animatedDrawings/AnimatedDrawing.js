import React, { useState, useEffect, useRef } from "react";
import anime from "animejs/lib/anime.es.js";

import classes from "./AnimatedDrawing.module.css";
import baseClasses from "../../index.module.css";

const AnimatedDrawing = ({ id, drawing, delay }) => {
  const imageRef = useRef(null);

  const [imageElementLoaded, setImageElementLoaded] = useState(false);

  useEffect(() => {
    anime({
      targets: `#drawing${id}`,

      rotateY: "90deg",

      delay: delay,
      endDelay: 1000,

      duration: 1000,
      loop: true,
      direction: "alternate",
      easing: "easeInSine",
    });
  }, [id, delay]);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
      }}
      className={baseClasses.baseFlex}
    >
      <div
        id={`drawing${id}`}
        className={`${classes.spinner} ${baseClasses.baseFlex}`}
        style={{
          pointerEvents: "none",
        }}
      >
        <img
          ref={imageRef}
          style={{
            aspectRatio: imageElementLoaded
              ? `${imageRef.current.naturalWidth} / ${imageRef.current.naturalHeight}`
              : undefined,
            height: "100%",
          }}
          className={classes.rotate}
          alt={"randomly selected rotating focal drawing"}
          src={drawing}
          onLoad={() => {
            setImageElementLoaded(true);
          }}
        ></img>
      </div>
    </div>
  );
};

export default AnimatedDrawing;
