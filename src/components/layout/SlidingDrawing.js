import React, { useState, useEffect, useRef } from "react";
import anime from "animejs/lib/anime.es.js";

const SlidingDrawing = (props) => {
  const animationRef = useRef(null);
  const [yDepth, setYDepth] = useState();
  const [xDepth, setXDepth] = useState(0);

  useEffect(() => {
    setYDepth(randomYDepth());
    setXDepth(randomXDepth());
  }, []);

  useEffect(() => {
    if (xDepth !== 0) {
      animationRef.current = anime({
        targets: `#image${props.id}`,
        translateX: window.innerWidth + (-1 * xDepth),
        delay: Math.floor(Math.random() * 6000) + 250,
        endDelay: 0,
        loop: true,
        direction: "normal",
        duration: Math.floor(Math.random() * 3000) + 5000,
        easing: "linear",
      });
    }
  }, [xDepth]);

  function randomYDepth(height) {
    //maybe find way to get current div's height or just do it manually.

    if (Math.floor(Math.random() * 2) === 0) {
      return Math.floor(Math.random() * 35) + 80;
    } else {
      return Math.floor(Math.random() * 35) + 200;
    }
  }

  function randomXDepth() {
    return -1 * (Math.floor(Math.random() * 225) + 350);
  }

  return (
    <div
      id={`image${props.id}`}
      style={{
        position: "absolute",
        left: `${xDepth}px`,
        top: `${yDepth}px`,
        width: "8em",
        zIndex: "1",
        opacity: "80%",
        pointerEvents: "none",
        // overflow: "hidden",
      }}
    >
      <img alt={"floating drawing"} src={props.drawing}></img>
    </div>
  );
};

export default SlidingDrawing;
