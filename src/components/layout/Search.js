import React from "react";

import { useRef, useEffect, useState, useContext } from "react";

import SearchContext from "./SearchContext";
import GallaryList from "./GallaryList";
import AdjAutofillResults from "./AdjAutofillResults";
import NounAutofillResults from "./NounAutofillResults";

import classes from "./Search.module.css";

const Search = (props) => {
  const searchCtx = useContext(SearchContext);

  let idx = props.userProfile.length > 0 ? 1 : 0;

  useEffect(() => {
    searchCtx.resetAllValues(idx);
    if (idx === 1) {
      searchCtx.setPersistingUserGallary([]);
      searchCtx.getGallary(`users/${props.userProfile}/`);
    }
  }, [props]);

  const [showAdjResults, setShowAdjResults] = useState(classes.hide);
  const [showNounResults, setShowNounResults] = useState(classes.hide);

  const [gallaryListStaticTitle, setGallaryListStaticTitle] = useState();

  const adjectiveInputRef = useRef();
  const nounInputRef = useRef();

  const refreshAdjSearch = (event) => {
    searchCtx.updateSearchValues("adjSearch", event.target.value.trim(), idx);

    setShowAdjResults(classes.show);

    if (event.target.value === "") {
      setShowAdjResults(classes.hide);
    }
  };

  const refreshNounSearch = (event) => {
    searchCtx.updateSearchValues("nounSearch", event.target.value.trim(), idx);

    setShowNounResults(classes.show);

    if (event.target.value === "") {
      setShowNounResults(classes.hide);
    }
  };

  useEffect(() => {
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

  useEffect(() => {
    let handler = (event) => {
      if (!adjectiveInputRef.current.contains(event.target)) {
        setShowAdjResults(classes.hide);
      }
      if (!nounInputRef.current.contains(event.target)) {
        setShowNounResults(classes.hide);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
    };
  });

  function prepGallarySearch(event) {
    event.preventDefault();

    if (
      searchCtx.searchValues["adjSearch"][idx].length === 0 &&
      searchCtx.searchValues["nounSearch"][idx].length === 0 &&
      idx === 0
    ) {
      searchCtx.updateSearchValues("gallary", null, idx);
      return;
    }

    if (idx === 1) {
      searchCtx.getGallary(`users/${props.userProfile}/`);
    } else {
      searchCtx.getGallary();
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

  return (
    <>
      <form className={classes.formContainer} onSubmit={prepGallarySearch}>
        <div className={classes.searchContainer}>
          <input
            id="adj"
            placeholder="Adjective"
            ref={adjectiveInputRef}
            autoComplete="off"
          ></input>
          <div className={showAdjResults}>
            <AdjAutofillResults userProfile={props.userProfile} />
          </div>
        </div>
        <div className={classes.searchContainer}>
          <input
            id="noun"
            placeholder="Noun"
            ref={nounInputRef}
            autoComplete="off"
          ></input>
          <div className={showNounResults}>
            <NounAutofillResults userProfile={props.userProfile} />
          </div>
        </div>
        <button>Search</button>
      </form>

      {searchCtx.searchValues["gallary"][idx] !== null ? (
        <GallaryList
          drawingIDs={searchCtx.searchValues["gallary"][idx]}
          title={gallaryListStaticTitle}
          margin={props.margin}
        />
      ) : (
        <div></div>
      )}
    </>
  );
};

export default Search;
