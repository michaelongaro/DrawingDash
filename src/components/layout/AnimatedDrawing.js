import React, { useEffect, useRef } from "react";
import anime from "animejs/lib/anime.es.js";

import classes from "./AnimatedDrawing.module.css";
import baseClasses from "../../index.module.css";

const AnimatedDrawing = (props) => {
  const animationRef = useRef(null);

  useEffect(() => {
    animationRef.current = anime({
      targets: `#drawing${props.id}`,

      rotateY: "90deg",

      delay: props.delay,
      endDelay: 1000,

      duration: 1000,
      loop: true,
      direction: "alternate",
      easing: "easeInSine",
    });
  }, []);

  return (
    <div
      id={`drawing${props.id}`}
      className={`${classes.spinner} ${baseClasses.baseFlex}`}
      style={{
        pointerEvents: "none",
      }}
    >
      <img
        className={classes.face2}
        alt={"animated revealing featured drawing"}
        src={props.drawing}
      ></img>
    </div>
  );
};

export default AnimatedDrawing;
