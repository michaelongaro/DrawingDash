import React from "react";
import { useEffect, useContext, useRef } from "react";

import classes from "./AutofillResult.module.css";
import SearchContext from "./SearchContext";

const AutofillResult = (props) => {
  const searchCtx = useContext(SearchContext);

  let idx = props.userProfile.length > 0 ? 1 : 0;

  const resultRef = useRef();

  useEffect(() => {
    if (props.word !== "related") {
      resultRef.current.addEventListener("mousedown", fillText);
    }

    let cleanupResultRef = resultRef.current;
    return () => {
      if (props.word !== "related") {
        cleanupResultRef.removeEventListener("mousedown", fillText);
      }
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
    <>
      {props.word === "related" ? (
        <div className={classes.autofillRelatedDivider}>
          <div className={classes.leadingLine}></div>
          <div>Related</div>
          <div className={classes.trailingLine}></div>
        </div>
      ) : (
        <div className={classes.autofillResult} ref={resultRef}>
          <div style={{ marginLeft: "1em", paddingTop: ".25em", paddingBottom: ".25em" }}>{props.word}</div>
        </div>
      )}
    </>
  );
};

export default AutofillResult;
