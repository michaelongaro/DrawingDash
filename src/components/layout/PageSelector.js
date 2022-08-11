import React, { useState, useEffect, useContext, useRef } from "react";

import SearchContext from "./SearchContext";

import Arrow from "../../svgs/Arrow";

import classes from "./PageSelector.module.css";
import baseClasses from "../../index.module.css";

const PageSelector = ({ currentlyShownDuration, idx, databasePath }) => {
  const searchCtx = useContext(SearchContext);

  const inputRef = useRef(null);

  const [customPageNumber, setCustomPageNumber] = useState(0);
  const [resultsPerPage, setResultsPerPage] = useState(0);
  const [numPages, setNumPages] = useState(0);

  useEffect(() => {
    // inital render
    if (window.innerWidth > 1250) {
      setResultsPerPage(16);
    } else if (window.innerWidth > 750) {
      setResultsPerPage(10);
    } else {
      setResultsPerPage(6);
    }

    function resizeHandler(ev) {
      if (window.innerWidth > 1250) {
        setResultsPerPage(16);
      } else if (window.innerWidth > 750) {
        setResultsPerPage(10);
      } else {
        setResultsPerPage(6);
      }
    }

    window.addEventListener("resize", resizeHandler);

    return () => {
      window.removeEventListener("resize", resizeHandler);
    };
  }, []);

  useEffect(() => {
    if (resultsPerPage > 0) {
      setNumPages(
        Math.floor(
          (searchCtx.pageSelectorDetails["totalDrawingsByDuration"][idx][
            currentlyShownDuration
          ] +
            resultsPerPage -
            1) /
            resultsPerPage
        )
      );
    }
  }, [resultsPerPage, searchCtx.pageSelectorDetails]);

  function handleSubmit(ev) {
    ev.preventDefault();

    if (inputRef.current.value > 0 && inputRef.current.value <= numPages) {
      retrieveNewPage("intermediate", customPageNumber);
    }
  }

  function retrieveNewPage(pageDirection, pageDestination) {
    let modifier;
    if (pageDirection === "prev") {
      modifier = searchCtx.pageSelectorDetails["currentPageNumber"][idx] - 1;
    } else if (pageDirection === "first") {
      modifier = 1;
    } else if (pageDirection === "intermediate") {
      modifier = pageDestination;
    } else if (pageDirection === "last") {
      modifier = numPages;
    } else if (pageDirection === "next") {
      modifier = searchCtx.pageSelectorDetails["currentPageNumber"][idx] + 1;
    }

    console.log(
      numPages,
      resultsPerPage * (modifier - 1),
      resultsPerPage * (modifier - 1) + resultsPerPage,
      modifier,
      searchCtx.pageSelectorDetails["currentPageNumber"][idx]
    );

    searchCtx.getGallary(
      resultsPerPage * (modifier - 1),
      resultsPerPage * (modifier - 1) + resultsPerPage,
      resultsPerPage,
      idx,
      databasePath
    );
    searchCtx.updatePageSelectorDetails("currentPageNumber", modifier, idx);
  }

  return (
    <>
      {numPages !== 0 &&
        (numPages < 5 ? (
          Array(
            Math.floor(
              (searchCtx.pageSelectorDetails["totalDrawingsByDuration"][idx][
                currentlyShownDuration
              ] +
                resultsPerPage -
                1) /
                resultsPerPage
            )
          )
            .fill("")
            .map((val, i) => (
              <button
                key={i}
                style={{
                  backgroundColor:
                    searchCtx.pageSelectorDetails["currentPageNumber"][idx] ===
                    i + 1
                      ? "#c2c2c2"
                      : "#fff",
                }}
                className={classes.pageSelectorButton}
                onClick={() => {
                  searchCtx.getGallary(
                    resultsPerPage * i,
                    resultsPerPage * (i + 1),
                    resultsPerPage,
                    idx,
                    databasePath
                  );
                  searchCtx.updatePageSelectorDetails(
                    "currentPageNumber",
                    i + 1,
                    idx
                  );
                }}
              >
                {i + 1}
              </button>
            ))
        ) : (
          <>
            <button
              style={{
                backgroundColor: "#ffffff",
                opacity:
                  searchCtx.pageSelectorDetails["currentPageNumber"][idx] === 1
                    ? 0.5
                    : 1,
              }}
              className={`${classes.pageSelectorButton} ${baseClasses.baseFlex}`}
              onClick={() => {
                if (
                  searchCtx.pageSelectorDetails["currentPageNumber"][idx] !== 1
                ) {
                  retrieveNewPage("prev");
                }
              }}
            >
              <Arrow dimensions={"1em"} color={"#c2c2c2"} direction={"left"} />
            </button>
            <button
              style={{
                backgroundColor:
                  searchCtx.pageSelectorDetails["currentPageNumber"][idx] === 1
                    ? "#c2c2c2"
                    : "#fff",
              }}
              className={classes.pageSelectorButton}
              onClick={() => {
                retrieveNewPage("first");
              }}
            >
              1
            </button>
            <form onSubmit={handleSubmit}>
              <input
                type={"number"}
                min={1}
                max={numPages}
                className={classes.pageSelectorInput}
                ref={inputRef}
                onChange={(e) => {
                  setCustomPageNumber(parseInt(e.target.value));
                }}
              ></input>
            </form>
            <button
              style={{
                backgroundColor:
                  searchCtx.pageSelectorDetails["currentPageNumber"][idx] ===
                  numPages
                    ? "#c2c2c2"
                    : "#fff",
              }}
              className={classes.pageSelectorButton}
              onClick={() => {
                retrieveNewPage("last");
              }}
            >
              {numPages}
            </button>
            <button
              style={{
                backgroundColor: "#ffffff",
                opacity:
                  searchCtx.pageSelectorDetails["currentPageNumber"][idx] ===
                  numPages
                    ? 0.5
                    : 1,
              }}
              className={`${classes.pageSelectorButton} ${baseClasses.baseFlex}`}
              onClick={() => {
                if (
                  searchCtx.pageSelectorDetails["currentPageNumber"][idx] !==
                  numPages
                ) {
                  retrieveNewPage("next");
                }
              }}
            >
              <Arrow dimensions={"1em"} color={"#c2c2c2"} direction={"right"} />
            </button>
          </>
        ))}
    </>
  );
};

export default PageSelector;
