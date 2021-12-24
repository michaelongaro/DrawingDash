import React from "react";
import { useEffect } from "react";

import classes from "./AutofillResult.module.css";

const AutofillResult = (props) => {
  console.log(`${props.word} result "shown"`);
  // will have to useEffect here and add eventlistener,
  // will need to i guess add the inputs into the context/maybe somehow use the refs?

  // useEffect(() => {
  //   document.getElementById("result").addEventListener("click", fillText);
  //   return () => {
  //     document.getElementById("result").removeEventListener("click", fillText);
  //   };
  // }, []);

  // function fillText() {
  //   props.parentRef.current.innerText = props.word;
  // }

  return (
    <div className={classes.autofillResult}>
      <div id="result">{props.word}</div>
    </div>
  );
};

export default AutofillResult;
