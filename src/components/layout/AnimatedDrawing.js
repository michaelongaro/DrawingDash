import React, { useState, useEffect, useRef } from "react";
import anime from "animejs/lib/anime.es.js";

import classes from "./AnimatedDrawing.module.css";
import { useLinkClickHandler } from "react-router-dom";

const AnimatedDrawing = (props) => {
  const animationRef = useRef(null);

  const styles = props.forSearch
    ? {
        borderRadius: "1em",
        width: "10em",
      }
    : {
        borderRadius: "1em",
      };

  // useEffect(() => {
  //   function handleResize() {
  //     setCurrentWidth(window.innerWidth);
  //   }
  //   window.addEventListener("resize", handleResize);
  //   return () => window.removeEventListener("resize", handleResize);

  //   // seriously why does this below need to be there
  // }, [currentWidth]);

  // come back to later
  useEffect(() => {
    animationRef.current = anime({
      targets: `#drawing${props.id}`,

      // scale: props.id % 2 === 0 ? [0, 0.97] : [0.97, 0],
      // opacity: props.id % 2 === 0 ? [0, 1] : [1, 0],
      // opacity: [1,0],

      /// MAYYYY need to have drawing fit oh damn the actual tile is rectangle sooo 
      // def need to mech out how to make it look natural when width and height aren't the same
      rotateY: "90deg",

      delay: props.delay,
      endDelay: 1000,

      duration: 1000,
      loop: true,
      direction: "alternate",
      // easing: props.id % 2 === 0 ? "easeOutCirc" : "easeInCirc",
      easing: "linear",
      // on the fifth one
    });
  }, []);

  return (
    <div
      id={`drawing${props.id}`}
      className={classes.spinner}
      style={{
        // zIndex: "1",
        pointerEvents: "none",
        // scale: props.id % 2 === 0 ? 0 : 0.95,
        // opacity: props.id % 2 === 0 ? 0 : 1,
      }}
    >
      {/* <div className={classes.face3}></div> */}
      <img
        // style={styles}
        className={classes.face2}
        alt={"spinning featured drawing"}
        src={props.drawing}
      ></img>
    </div>
  );
};

export default AnimatedDrawing;
