import React, { useEffect, useRef, useContext } from "react";

import classes from "./PinnedArt.module.css";
import PinnedContext from "./PinnedContext";

const PinnedArt = (props) => {
  const pinnedCtx = useContext(PinnedContext);
  const pinRef = useRef(null);

  useEffect(() => {
    pinRef.current.addEventListener("click", updateContextIndex);

    let cleanupPinRef = pinRef.current;
    return () => {
      cleanupPinRef.removeEventListener("click", updateContextIndex);
    };
  }, []);
  
  function updateContextIndex() {
    if (props.seconds === 60000) {
      pinnedCtx.setIndex60(props.counter);
    } else if (props.seconds === 180000) {
      pinnedCtx.setIndex180(props.counter);
    } else if (props.seconds === 300000) {
      pinnedCtx.setIndex300(props.counter);
    }
  }

  return (
    <div ref={pinRef}>
      <img src={props.image} alt={props.title} />
      <div className={classes.bottomContain}>
        <div>{props.title}</div>
        <div>{props.date}</div>
      </div>
    </div>
  );
};

export default PinnedArt;
