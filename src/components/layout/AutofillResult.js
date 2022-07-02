import React, { useState, useEffect, useRef, useContext } from "react";

import SearchContext from "./SearchContext";

import classes from "./AutofillResult.module.css";

const AutofillResult = (props) => {
  const searchCtx = useContext(SearchContext);

  let idx = props.userProfile.length > 0 ? 1 : 0;

  const resultRef = useRef();

  const [preHighlightedText, setPreHighlightedText] = useState("");
  const [highlightedText, setHighlightedText] = useState("");
  const [postHighlightedText, setPostHighlightedText] = useState("");

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

  useEffect(() => {
    let highlightedAdjIndex = props.word
      .toLowerCase()
      .indexOf(searchCtx.searchValues["adjSearch"][idx].toLowerCase());
    let highlightedNounIndex = props.word
      .toLowerCase()
      .indexOf(searchCtx.searchValues["nounSearch"][idx].toLowerCase());

    let adjLength = searchCtx.searchValues["adjSearch"][idx].length;
    let nounLength = searchCtx.searchValues["nounSearch"][idx].length;

    // adjective highlighting
    if (props.type === "adj" && highlightedAdjIndex === 0) {
      setHighlightedText(props.word.substring(0, adjLength));
      setPostHighlightedText(props.word.substring(adjLength));
    }

    if (props.type === "adj" && highlightedAdjIndex > 0) {
      setPreHighlightedText(props.word.substring(0, highlightedAdjIndex));
      setHighlightedText(
        props.word.substring(
          highlightedAdjIndex,
          highlightedAdjIndex + adjLength
        )
      );
      setPostHighlightedText(
        props.word.substring(highlightedAdjIndex + adjLength)
      );
    }

    // noun highlighting
    if (props.type === "noun" && highlightedNounIndex === 0) {
      setHighlightedText(props.word.substring(0, nounLength));
      setPostHighlightedText(props.word.substring(nounLength));
    }

    if (props.type === "noun" && highlightedNounIndex > 0) {
      setPreHighlightedText(props.word.substring(0, highlightedNounIndex));
      setHighlightedText(
        props.word.substring(
          highlightedNounIndex,
          highlightedNounIndex + nounLength
        )
      );
      setPostHighlightedText(
        props.word.substring(highlightedNounIndex + nounLength)
      );
    }

    // for suggested related word
    if (props.type === "adj" && adjLength === 0) {
      setPreHighlightedText("");
      setHighlightedText(props.word);
      setPostHighlightedText("");
    }

    if (props.type === "noun" && nounLength === 0) {
      setPreHighlightedText("");
      setHighlightedText(props.word);
      setPostHighlightedText("");
    }
    
  }, [searchCtx.searchValues, props, idx]);

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
          <div className={classes.autofillFormatting}>
            <div style={{ color: "#6b6b6b" }}>{preHighlightedText}</div>
            <div style={{ color: "#000000" }}>{highlightedText}</div>
            <div style={{ color: "#6b6b6b" }}>{postHighlightedText}</div>
          </div>
        </div>
      )}
    </>
  );
};

export default AutofillResult;
