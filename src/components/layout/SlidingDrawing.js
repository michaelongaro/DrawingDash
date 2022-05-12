import React, { useState, useEffect, useRef } from "react";
import anime from "animejs/lib/anime.es.js";

const SlidingDrawing = (props) => {
  const animationRef = useRef(null);

  const [yDepth, setYDepth] = useState(randomYDepth());
  const [xDepth, setXDepth] = useState(props.offsetX);
  // + Math.floor(Math.random() * props.width * 0.3)
  const [currentWidth, setCurrentWidth] = useState(props.width);

  console.log(xDepth);

  useEffect(() => {
    function handleResize() {
      setCurrentWidth(window.innerWidth);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);

    // seriously why does this below need to be there
  }, [currentWidth]);

  useEffect(() => {
    // if (xDepth !== 0) {
      animationRef.current = anime({
        targets: `#image${props.id}`,
        translateX: currentWidth - xDepth,
        // delay: 0,
        delay:  Math.floor(Math.random() * 5000),
        // opacity: [0, 0.10, 0.25, 0.45, 0.9, 0],
        opacity: [0, 1, 0],
        // opacity: function (el, i, l) {
        //   return i * 100;
        // },

        // endDelay: 0,
        endDelay: function (el, i, l) {
          return (l - i) * 300;
        },
        loop: true,
        direction: "normal",
        duration: Math.floor(Math.random() * 2000) + 4000,
        easing: "linear",
      });
    // }
  }, [xDepth, currentWidth]);

  function randomYDepth() {
    return Math.floor(Math.random() * props.maxHeight) + props.baseHeight;
  }

  function randomXDepth(defaultVal = xDepth) {
    let a = defaultVal;
    //  + Math.floor(Math.random() * props.width * .2);
    // if (a > props.width *.75) {
    //   a -= props.width *.3;
    // }
    console.log(defaultVal, props.width);
    return a;
  }

  return (
    <div
      // ref={drawingOffsetX}
      id={`image${props.id}`}
      style={{
        position: "absolute",
        left: `${xDepth}px`,
        top: `${yDepth}px`,
        width: "8em",
        zIndex: "1",
        opacity: "0%",
        pointerEvents: "none",
      }}
    >
      <img alt={"floating drawing"} src={props.drawing}></img>
    </div>
  );
};

export default SlidingDrawing;
