import React, { useRef, useEffect, useState, useContext } from "react";

import { isEqual } from "lodash";

import SearchContext from "./SearchContext";
import GallaryList from "./GallaryList";
import AdjAutofillResults from "./AdjAutofillResults";
import NounAutofillResults from "./NounAutofillResults";

import {
  getDatabase,
  ref,
  set,
  child,
  get,
  onValue,
  update,
} from "firebase/database";

import { app } from "../../util/init-firebase";

import classes from "./Search.module.css";
import baseClasses from "../../index.module.css";

const Search = ({ dbPath, margin, idx, forModal }) => {
  const searchCtx = useContext(SearchContext);
  const db = getDatabase(app);

  const [resultsPerPage, setResultsPerPage] = useState(0);

  const [dbTitles, setDBTitles] = useState(null);

  const [showAdjResults, setShowAdjResults] = useState(false);
  const [showNounResults, setShowNounResults] = useState(false);

  const [checkAdjPair, setCheckAdjPair] = useState(false);
  const [checkNounPair, setCheckNounPair] = useState(false);

  const [gallaryListStaticTitle, setGallaryListStaticTitle] = useState();

  const formContainerRef = useRef(null);
  const adjectiveInputRef = useRef();
  const nounInputRef = useRef();

  const [dynamicNounMargin, setDynamicNounMargin] = useState(0);
  const [dynamicSearchMargin, setDynamicSearchMargin] = useState(0);

  const [adjInputFocused, setAdjInputFocused] = useState(false);
  const [nounInputFocused, setNounInputFocused] = useState(false);

  const [mobileWidthReached, setMobileWidthReached] = useState(false);
  const [inputsWereSubmitted, setInputsWereSubmitted] = useState(false);

  useEffect(() => {
    if ((adjInputFocused || nounInputFocused) && mobileWidthReached) {
      formContainerRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [adjInputFocused, nounInputFocused, mobileWidthReached]);

  const refreshAdjSearch = (event) => {
    searchCtx.updateSearchValues("adjSearch", event.target.value.trim(), idx);

    searchCtx.updateSearchValues("adjKeyboardNavigationIndex", -1, idx);
    setShowAdjResults(true);

    if (event.target.value === "") {
      setShowAdjResults(false);
    }
  };

  const refreshNounSearch = (event) => {
    searchCtx.updateSearchValues("nounSearch", event.target.value.trim(), idx);

    searchCtx.updateSearchValues("nounKeyboardNavigationIndex", -1, idx);
    setShowNounResults(true);

    if (event.target.value === "") {
      setShowNounResults(false);
    }
  };

  useEffect(() => {
    // inital render
    if (window.innerWidth > 1250) {
      setResultsPerPage(16);
    } else if (window.innerWidth > 750) {
      setResultsPerPage(10);
    } else {
      setResultsPerPage(6);
    }

    if (window.innerWidth <= 650) {
      setMobileWidthReached(true);
    } else {
      setMobileWidthReached(false);
    }

    function resizeHandler(ev) {
      if (window.innerWidth > 1250) {
        setResultsPerPage(16);
      } else if (window.innerWidth > 750) {
        setResultsPerPage(10);
      } else {
        setResultsPerPage(6);
      }

      if (window.innerWidth <= 650) {
        setMobileWidthReached(true);
      } else {
        setMobileWidthReached(false);
      }
    }

    window.addEventListener("resize", resizeHandler);

    return () => {
      window.removeEventListener("resize", resizeHandler);
    };
  }, []);

  useEffect(() => {
    if (
      adjectiveInputRef.current.value === "" &&
      nounInputRef.current.value === ""
    ) {
      searchCtx.resetAllValues(idx);
    }
  }, []);

  useEffect(() => {
    if (resultsPerPage !== 0) {
      console.log("entered up top", getSubmittedInputValues());
      if (
        idx !== 0 &&
        getSubmittedInputValues()["subAdjs"].length === 0 &&
        getSubmittedInputValues()["subNouns"].length === 0
      ) {
        searchCtx.getGallary(0, resultsPerPage, resultsPerPage, idx, dbPath);
      } else if (
        idx === 0 &&
        getSubmittedInputValues()["subAdjs"].length !== 0 &&
        getSubmittedInputValues()["subNouns"].length !== 0
      ) {
        searchCtx.getGallary(0, resultsPerPage, resultsPerPage, idx, dbPath);
      }
    }
  }, [resultsPerPage, idx, dbPath]);

  function getSubmittedInputValues() {
    return {
      subAdjs: searchCtx.searchValues["submittedAdjectives"][idx],
      subNouns: searchCtx.searchValues["submittedNouns"][idx],
    };
  }

  useEffect(() => {
    searchCtx.updateSearchValues(
      "anInputIsFocused",
      adjInputFocused || nounInputFocused,
      idx
    );
  }, [adjInputFocused, nounInputFocused, idx]);

  useEffect(() => {
    if (formContainerRef.current !== null) {
      if (
        window
          .getComputedStyle(formContainerRef.current)
          .getPropertyValue("flex-direction") === "column"
      ) {
        if (showAdjResults && !showNounResults) {
          let adjustedMargin;

          if (searchCtx.searchValues["requestedAdjectives"][idx].length === 0) {
            adjustedMargin = 32;
          } else {
            adjustedMargin =
              searchCtx.searchValues["requestedAdjectives"][idx].length * 32;
          }
          setDynamicNounMargin(`${adjustedMargin}px`);

          setDynamicSearchMargin(0); // resetting other margin
        } else if (!showAdjResults && showNounResults) {
          let adjustedMargin;

          if (searchCtx.searchValues["requestedNouns"][idx].length === 0) {
            adjustedMargin = 32;
          } else {
            adjustedMargin =
              searchCtx.searchValues["requestedNouns"][idx].length * 32;
          }
          setDynamicSearchMargin(`${adjustedMargin}px`);

          setDynamicNounMargin(0); // resetting other margin
        } else if (!showAdjResults && !showNounResults) {
          setDynamicSearchMargin(0);
          setDynamicNounMargin(0);
        }
      }
    }
  }, [showAdjResults, showNounResults, searchCtx.searchValues, idx]);

  useEffect(() => {
    // arrowup/down event autofillHandlers

    function arrowKeyHandler(e) {
      // copying context values into smaller, more managable variable names
      let adjIdx = searchCtx.searchValues["adjKeyboardNavigationIndex"][idx];
      let nounIdx = searchCtx.searchValues["nounKeyboardNavigationIndex"][idx];

      let adjResults = searchCtx.searchValues["requestedAdjectives"][idx];
      let nounResults = searchCtx.searchValues["requestedNouns"][idx];

      if (e.key === "ArrowDown") {
        if (showAdjResults) {
          e.preventDefault();
          if (adjIdx < adjResults.length - 1) {
            if (adjResults[adjIdx + 1] === "related") {
              searchCtx.updateSearchValues(
                "adjKeyboardNavigationIndex",
                adjIdx + 2,
                idx
              );
            } else {
              searchCtx.updateSearchValues(
                "adjKeyboardNavigationIndex",
                adjIdx + 1,
                idx
              );
            }
          }
        } else if (showNounResults) {
          e.preventDefault();

          if (nounIdx < nounResults.length - 1) {
            if (nounResults[nounIdx + 1] === "related") {
              searchCtx.updateSearchValues(
                "nounKeyboardNavigationIndex",
                nounIdx + 2,
                idx
              );
            } else {
              searchCtx.updateSearchValues(
                "nounKeyboardNavigationIndex",
                nounIdx + 1,
                idx
              );
            }
          }
        }
      } else if (e.key === "ArrowUp") {
        if (showAdjResults) {
          e.preventDefault();

          if (adjIdx > 0 && adjIdx < adjResults.length) {
            if (adjResults[adjIdx - 1] === "related") {
              searchCtx.updateSearchValues(
                "adjKeyboardNavigationIndex",
                adjIdx - 2,
                idx
              );
            } else {
              searchCtx.updateSearchValues(
                "adjKeyboardNavigationIndex",
                adjIdx - 1,
                idx
              );
            }
          }
        } else if (showNounResults) {
          e.preventDefault();

          if (nounIdx > 0 && nounIdx < nounResults.length) {
            if (nounResults[nounIdx - 1] === "related") {
              searchCtx.updateSearchValues(
                "nounKeyboardNavigationIndex",
                nounIdx - 2,
                idx
              );
            } else {
              searchCtx.updateSearchValues(
                "nounKeyboardNavigationIndex",
                nounIdx - 1,
                idx
              );
            }
          }
        }
      }

      if (e.key === "Enter") {
        if (showAdjResults && adjIdx !== -1) {
          e.preventDefault();

          setShowAdjResults(false);

          searchCtx.updateSearchValues(
            "autofilledAdjectiveInput",
            adjResults[adjIdx],
            idx
          );
        } else if (showNounResults && nounIdx !== -1) {
          e.preventDefault();

          setShowNounResults(false);

          searchCtx.updateSearchValues(
            "autofilledNounInput",
            nounResults[nounIdx],
            idx
          );
        }
      }

      if (e.key === "Escape") {
        e.preventDefault();

        setShowAdjResults(false);
        setShowNounResults(false);
      }
    }

    document.addEventListener("keydown", arrowKeyHandler);

    return () => {
      document.removeEventListener("keydown", arrowKeyHandler);
    };
  }, [showAdjResults, showNounResults, searchCtx.searchValues]);

  useEffect(() => {
    onValue(ref(db, dbPath), (snapshot) => {
      if (snapshot.exists()) {
        setDBTitles(snapshot.val());
      }
    });

    adjectiveInputRef.current.addEventListener("input", refreshAdjSearch);
    nounInputRef.current.addEventListener("input", refreshNounSearch);

    let cleanupAdjInputRef = adjectiveInputRef.current;
    let cleanupNInpRef = nounInputRef.current;
    return () => {
      cleanupAdjInputRef.removeEventListener("input", refreshAdjSearch);
      cleanupNInpRef.removeEventListener("input", refreshNounSearch);
    };
  }, []);

  useEffect(() => {
    if (searchCtx.searchValues["autofilledAdjectiveInput"][idx].length > 0) {
      adjectiveInputRef.current.value =
        searchCtx.searchValues["autofilledAdjectiveInput"][idx];

      searchCtx.updateSearchValues(
        "adjSearch",
        searchCtx.searchValues["autofilledAdjectiveInput"][idx],
        idx
      );

      searchCtx.updateSearchValues("autofilledAdjectiveInput", "", idx);
    }
  }, [searchCtx.searchValues["autofilledAdjectiveInput"][idx]]);

  useEffect(() => {
    if (searchCtx.searchValues["autofilledNounInput"][idx].length > 0) {
      nounInputRef.current.value =
        searchCtx.searchValues["autofilledNounInput"][idx];

      searchCtx.updateSearchValues(
        "nounSearch",
        searchCtx.searchValues["autofilledNounInput"][idx],
        idx
      );

      searchCtx.updateSearchValues("autofilledNounInput", "", idx);
    }
  }, [searchCtx.searchValues["autofilledNounInput"][idx]]);

  let autofillHandler = (event, isFocusing = null, forAdj = null) => {
    let focusedInsideAdjInput, focusedInsideNounInput;

    if (isFocusing) {
      if (forAdj) {
        focusedInsideAdjInput = true;
      } else {
        focusedInsideNounInput = true;
      }
    } else if (isFocusing === false) {
      if (forAdj) {
        focusedInsideAdjInput = false;
      } else {
        focusedInsideNounInput = false;
      }
    } else {
      focusedInsideAdjInput = adjectiveInputRef.current.contains(event.target);
      focusedInsideNounInput = nounInputRef.current.contains(event.target);
    }
    // adjective handling

    // hiding results and resetting context
    if (!focusedInsideAdjInput) {
      setShowAdjResults(false);
      setCheckAdjPair(false);
      searchCtx.updateSearchValues("adjKeyboardNavigationIndex", -1, idx);
    } else {
      if (
        adjectiveInputRef.current.value.trim().length === 0 &&
        nounInputRef.current.value.trim().length !== 0
      ) {
        setCheckAdjPair(true);
        setShowAdjResults(true);
      } else if (
        adjectiveInputRef.current.value.trim().length !== 0 &&
        nounInputRef.current.value.trim().length === 0
      ) {
        // checking to see if currently input value is equal to the one that is going to be suggested,
        // if it isn't, show the suggestion
        if (
          searchCtx.searchValues["requestedAdjectives"][
            idx
          ][0]?.toLowerCase() !==
          adjectiveInputRef.current.value.trim()?.toLowerCase()
        ) {
          setShowAdjResults(true);
        }
      }
    }

    // noun handling

    // hiding results and resetting context
    if (!focusedInsideNounInput) {
      setShowNounResults(false);
      setCheckNounPair(false);
      searchCtx.updateSearchValues("nounKeyboardNavigationIndex", -1, idx);
    } else {
      if (
        nounInputRef.current.value.trim().length === 0 &&
        adjectiveInputRef.current.value.trim().length !== 0
      ) {
        setCheckNounPair(true);
        setShowNounResults(true);
      } else if (
        nounInputRef.current.value.trim().length !== 0 &&
        adjectiveInputRef.current.value.trim().length === 0
      ) {
        // checking to see if currently input value is equal to the one that is going to be suggested,
        // if it isn't, show the suggestion
        if (
          searchCtx.searchValues["requestedNouns"][idx][0].toLowerCase() !==
          nounInputRef.current.value.trim().toLowerCase()
        ) {
          setShowNounResults(true);
        }
      }
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", autofillHandler);
    return () => {
      document.removeEventListener("mousedown", autofillHandler);
    };
  }, []);

  useEffect(() => {
    if (inputsWereSubmitted) {
      setInputsWereSubmitted(false);

      searchCtx.updatePageSelectorDetails("durationToManuallyLoad", null, idx);

      if (idx !== 0) {
        searchCtx.getGallary(0, resultsPerPage, resultsPerPage, idx, dbPath);
      } else {
        searchCtx.getGallary(0, resultsPerPage, resultsPerPage, idx, dbPath);
      }

      setGallaryListStaticTitle(
        `${searchCtx.searchValues["adjSearch"][idx]} ${searchCtx.searchValues["nounSearch"][idx]}`
      );

      // clearing autofill + related context values
      searchCtx.updateSearchValues("autofilledAdjectiveInput", "", idx);
      searchCtx.updateSearchValues("autofilledNounInput", "", idx);
      searchCtx.updateSearchValues("requestedAdjectives", [], idx);
      searchCtx.updateSearchValues("requestedNouns", [], idx);
    }
  }, [
    inputsWereSubmitted,
    searchCtx.searchValues,
    idx,
    dbPath,
    resultsPerPage,
  ]);

  function prepGallarySearch(event) {
    event.preventDefault();

    // may want to do a {...searchCtx.searchValues}
    // and update manually as opposed to two separate calls here
    searchCtx.updateSearchValues(
      "submittedAdjectives",
      adjectiveInputRef.current.value,
      idx
    );
    searchCtx.updateSearchValues(
      "submittedNouns",
      nounInputRef.current.value,
      idx
    );

    if (idx !== 0) {
      setInputsWereSubmitted(true);
    } else {
      if (
        adjectiveInputRef.current.value.length !== 0 ||
        nounInputRef.current.value.length !== 0
      ) {
        setInputsWereSubmitted(true);
      } else {
        searchCtx.resetAllValues(idx);
      }
    }
  }

  return (
    <>
      <form
        ref={formContainerRef}
        className={classes.formContainer}
        onSubmit={prepGallarySearch}
      >
        <div className={classes.searchContainer}>
          <input
            className={classes.searchInput}
            id="adj"
            ref={adjectiveInputRef}
            onFocus={(e) => {
              setAdjInputFocused(true);
              autofillHandler(e, true, true);
            }}
            onBlur={(e) => {
              setAdjInputFocused(false);
              autofillHandler(e, false, true);
            }}
            autoComplete="off"
            required
          ></input>
          <label>Adjective</label>
          <div className={showAdjResults ? classes.show : classes.hide}>
            <AdjAutofillResults
              titles={dbTitles}
              checkForPair={checkAdjPair}
              idx={idx}
            />
          </div>
        </div>
        <div
          style={{
            marginTop: dynamicNounMargin,
            transition: "all 200ms",
          }}
          className={classes.searchContainer}
        >
          <input
            className={classes.searchInput}
            id="noun"
            ref={nounInputRef}
            onFocus={(e) => {
              setNounInputFocused(true);
              autofillHandler(e, true, false);
            }}
            onBlur={(e) => {
              setNounInputFocused(false);
              autofillHandler(e, false, false);
            }}
            autoComplete="off"
            required
          ></input>
          <label>Noun</label>
          <div className={showNounResults ? classes.show : classes.hide}>
            <NounAutofillResults
              titles={dbTitles}
              checkForPair={checkNounPair}
              idx={idx}
            />
          </div>
        </div>
        <button
          style={{
            marginTop: dynamicSearchMargin,
            transition: "all 200ms",
          }}
          formNoValidate
          className={baseClasses.activeButton}
        >
          Search
        </button>
      </form>

      <GallaryList
        drawingIDs={searchCtx.searchValues["gallary"][idx]}
        title={gallaryListStaticTitle}
        margin={margin}
        databasePath={dbPath}
        idx={idx}
        forModal={forModal}
      />
    </>
  );
};

export default React.memo(Search);
