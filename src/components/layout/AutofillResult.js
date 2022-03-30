import React from "react";
import { useEffect, useContext, useRef } from "react";

import classes from "./AutofillResult.module.css";
import SearchContext from "./SearchContext";

const AutofillResult = (props) => {
  const searchCtx = useContext(SearchContext);

  let idx = props.userProfile.length > 0 ? 1 : 0;

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
      searchCtx.updateSearchValues("autofilledAdjectiveInput", props.word, idx);
    } else {
      searchCtx.updateSearchValues("autofilledNounInput", props.word, idx);
    }
  }

  return (
    <div className={classes.autofillResult} ref={resultRef}>
      <div style={{ marginLeft: "0.18em" }}>{props.word}</div>
    </div>
  );
};

export default AutofillResult;
