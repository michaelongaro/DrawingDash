import React, { useState, useEffect, useRef } from "react";
import anime from "animejs/lib/anime.es.js";

const AnimatedDrawing = (props) => {
  const animationRef = useRef(null);

  const styles = props.forSearch ? {
    borderRadius: "1em",
    width: "10em"
  } : {
    borderRadius: "1em",
    
  }

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

      scale: props.id % 2 === 0 ? [0, 0.97] : [0.97, 0],
      opacity: props.id % 2 === 0 ? [0, 1] : [1, 0],

      delay: props.id % 2 === 0 ? 0 : 500,


      duration: 2000,
      loop: true,
      direction: "alternate",
      easing: props.id % 2 === 0 ? "easeOutCirc" : "easeInCirc",
      // on the fifth one
    });
  }, []);

  return (
    <div
      id={`drawing${props.id}`}
      style={{
        zIndex: "1",
        pointerEvents: "none",
        scale: props.id % 2 === 0 ? 0 : 0.95,
        opacity: props.id % 2 === 0 ? 0 : 1,
      }}
    >
      <img style={styles} alt={"floating focal drawing"} src={props.drawing}></img>
    </div>
  );
};

export default AnimatedDrawing;
