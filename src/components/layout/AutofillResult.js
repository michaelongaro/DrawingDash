import React, { useState, useEffect, useRef, useContext } from "react";

import SearchContext from "./SearchContext";

import classes from "./AutofillResult.module.css";

const AutofillResult = ({ word, type, idx }) => {
  const searchCtx = useContext(SearchContext);

  const resultRef = useRef();

  const [hovering, setHovering] = useState(false);

  const [preHighlightedText, setPreHighlightedText] = useState("");
  const [highlightedText, setHighlightedText] = useState("");
  const [postHighlightedText, setPostHighlightedText] = useState("");

  const [localAdjIdx, setLocalAdjIdx] = useState(0);
  const [localNounIdx, setLocalNounIdx] = useState(0);
  const [localUserIdx, setLocalUserIdx] = useState(0);

  const [localAdjectives, setLocalAdjectives] = useState([]);
  const [localNouns, setLocalNouns] = useState([]);
  const [localUsers, setLocalUsers] = useState([]);

  useEffect(() => {
    if (word !== "related") {
      resultRef.current.addEventListener("mousedown", fillText);
    }

    let cleanupResultRef = resultRef.current;
    return () => {
      if (word !== "related") {
        cleanupResultRef.removeEventListener("mousedown", fillText);
      }
    };
  }, []);

  useEffect(() => {
    setLocalAdjIdx(searchCtx.searchValues["adjKeyboardNavigationIndex"][idx]);
    setLocalNounIdx(searchCtx.searchValues["nounKeyboardNavigationIndex"][idx]);
    setLocalUserIdx(searchCtx.userSearchValues["userKeyboardNavigationIndex"]);

    setLocalAdjectives(searchCtx.searchValues["requestedAdjectives"][idx]);
    setLocalNouns(searchCtx.searchValues["requestedNouns"][idx]);
    setLocalUsers(searchCtx.userSearchValues["requestedUsers"]);
  }, [idx, searchCtx.searchValues, searchCtx.userSearchValues]);

  useEffect(() => {
    if (type === "user") {
      let highlightedUserIndex = word
        .toLowerCase()
        .indexOf(searchCtx.userSearchValues["userSearch"].toLowerCase());
      let userLength = searchCtx.userSearchValues["userSearch"].length;

      if (highlightedUserIndex === 0) {
        setHighlightedText(word.substring(0, userLength));
        setPostHighlightedText(word.substring(userLength));
      }

      if (highlightedUserIndex > 0) {
        setPreHighlightedText(word.substring(0, highlightedUserIndex));
        setHighlightedText(
          word.substring(
            highlightedUserIndex,
            highlightedUserIndex + userLength
          )
        );
        setPostHighlightedText(
          word.substring(highlightedUserIndex + userLength)
        );
      }
    } else {
      let highlightedAdjIndex = word
        .toLowerCase()
        .indexOf(searchCtx.searchValues["adjSearch"][idx].toLowerCase());
      let highlightedNounIndex = word
        .toLowerCase()
        .indexOf(searchCtx.searchValues["nounSearch"][idx].toLowerCase());

      let adjLength = searchCtx.searchValues["adjSearch"][idx].length;
      let nounLength = searchCtx.searchValues["nounSearch"][idx].length;

      // adjective highlighting
      if (type === "adj" && highlightedAdjIndex === 0) {
        setHighlightedText(word.substring(0, adjLength));
        setPostHighlightedText(word.substring(adjLength));
      }

      if (type === "adj" && highlightedAdjIndex > 0) {
        setPreHighlightedText(word.substring(0, highlightedAdjIndex));
        setHighlightedText(
          word.substring(highlightedAdjIndex, highlightedAdjIndex + adjLength)
        );
        setPostHighlightedText(word.substring(highlightedAdjIndex + adjLength));
      }

      // noun highlighting
      if (type === "noun" && highlightedNounIndex === 0) {
        setHighlightedText(word.substring(0, nounLength));
        setPostHighlightedText(word.substring(nounLength));
      }

      if (type === "noun" && highlightedNounIndex > 0) {
        setPreHighlightedText(word.substring(0, highlightedNounIndex));
        setHighlightedText(
          word.substring(
            highlightedNounIndex,
            highlightedNounIndex + nounLength
          )
        );
        setPostHighlightedText(
          word.substring(highlightedNounIndex + nounLength)
        );
      }

      // for suggested related word
      if (type === "adj" && adjLength === 0) {
        setPreHighlightedText("");
        setHighlightedText(word);
        setPostHighlightedText("");
      }

      if (type === "noun" && nounLength === 0) {
        setPreHighlightedText("");
        setHighlightedText(word);
        setPostHighlightedText("");
      }
    }
  }, [searchCtx.searchValues, searchCtx.userSearchValues, word, type, idx]);

  function fillText() {
    if (type === "adj") {
      searchCtx.updateSearchValues("autofilledAdjectiveInput", word, idx);
    } else if (type === "noun") {
      searchCtx.updateSearchValues("autofilledNounInput", word, idx);
    } else if (type === "user") {
      searchCtx.updateUserSearchValues("autofilledUserInput", word);
    }
  }

  return (
    <>
      {word === "related" ? (
        <div className={classes.autofillRelatedDivider}>
          <div className={classes.leadingLine}></div>
          <div>Related</div>
          <div className={classes.trailingLine}></div>
        </div>
      ) : (
        <div
          style={{
            backgroundColor:
              (type === "adj" &&
                (localAdjectives[localAdjIdx] === word || hovering)) ||
              (type === "noun" &&
                (localNouns[localNounIdx] === word || hovering)) ||
              (type === "user" &&
                (localUsers[localUserIdx] === word || hovering))
                ? "#d7d7d7"
                : "#eeeeee",
          }}
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
          className={classes.autofillResult}
          ref={resultRef}
        >
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
