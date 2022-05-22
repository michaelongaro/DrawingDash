import React, { useState, useEffect, useRef } from "react";
import anime from "animejs/lib/anime.es.js";

const AnimatedDrawing = (props) => {
  const animationRef = useRef(null);

  const [offsetDelay, setOffsetDelay] = useState(false);
  let loopCompleted = 0;

  // const [currentWidth, setCurrentWidth] = useState(props.width);

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
    console.log(offsetDelay);
    // have boolean that tells whether
    animationRef.current = anime({
      targets: `#drawing${props.id}`,

      scale: props.id % 2 === 0 ? [0, 0.95] : [0.95, 0],

      // delay: props.id % 2 === 0 ? 1000 : 0,
      delay: props.id % 2 !== 0 ? (offsetDelay ? 0 : 3000) : 0,
      // endDelay: props.id % 2 === 0 ? 1000 : 2000,
      // endDelay: props.id % 2 !== 0 && offsetDelay ? 0 : 1000,
      // endDelay: 1000,

      duration: 1000,
      loop: true,
      direction: "alternate",
      // easing: "linear",
      easing: props.id % 2 === 0 ? "easeInCubic" : "easeOutCubic",
      loopComplete: function () {
        loopCompleted++;
        console.log("complete called", loopCompleted);
        if (loopCompleted === 1) {
          setOffsetDelay(true);
        }
      },
    });
  }, [offsetDelay]);

  return (
    <div
      id={`drawing${props.id}`}
      style={{
        zIndex: "1",
        pointerEvents: "none",
        scale: props.id % 2 === 0 ? 0 : 0.95,
        // opacity: props.id % 2 === 0 ? 0 : 1,
      }}
    >
      <img alt={"floating focal drawing"} src={props.drawing}></img>
    </div>
  );
};

export default AnimatedDrawing;
