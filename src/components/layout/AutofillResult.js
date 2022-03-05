import React from "react";
import { useEffect, useContext, useRef } from "react";

import classes from "./AutofillResult.module.css";
import SearchContext from "./SearchContext";

const AutofillResult = (props) => {
  const searchCtx = useContext(SearchContext);

  const resultRef = useRef();

  useEffect(() => {
    resultRef.current.addEventListener("mousedown", fillText);

    let cleanupResultRef = resultRef.current;
    return () => {
      cleanupResultRef.removeEventListener("mousedown", fillText);
    };
  }, []);

  function fillText() {
    if (props.type === "adj") {
      searchCtx.setAutofilledAdjectiveInput(props.word);
    } else {
      searchCtx.setAutofilledNounInput(props.word);
    }
  }

  return (
    <div className={classes.autofillResult} ref={resultRef}>
      <div style={{ marginLeft: "0.18em" }}>{props.word}</div>
    </div>
  );
};

export default AutofillResult;
