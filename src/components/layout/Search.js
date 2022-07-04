import React, { useRef, useEffect, useState, useContext } from "react";

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

const Search = (props) => {
  const searchCtx = useContext(SearchContext);
  const db = getDatabase(app);

  const [dbTitles, setDBTitles] = useState(null);

  let idx = props.userProfile.length > 0 ? 1 : 0;

  useEffect(() => {
    if (idx === 0) {
      console.log(0);
    }
    if (idx === 1) {
      console.log(1);
      console.log("refreshing in Search");

      searchCtx.getGallary(0, 6, 6, `users/${props.userProfile}/`);
    }

    return () => {
      searchCtx.resetAllValues(idx);
    };
  }, []);

  const [showAdjResults, setShowAdjResults] = useState(false);
  const [showNounResults, setShowNounResults] = useState(false);

  const [checkAdjPair, setCheckAdjPair] = useState(false);
  const [checkNounPair, setCheckNounPair] = useState(false);

  const [gallaryListStaticTitle, setGallaryListStaticTitle] = useState();

  const adjectiveInputRef = useRef();
  const nounInputRef = useRef();
  // const outerRef = useRef();

  const refreshAdjSearch = (event) => {
    searchCtx.updateSearchValues("adjSearch", event.target.value.trim(), idx);

    setShowAdjResults(true);

    if (event.target.value === "") {
      setShowAdjResults(false)
    }
  };

  const refreshNounSearch = (event) => {
    searchCtx.updateSearchValues("nounSearch", event.target.value.trim(), idx);

    setShowNounResults(true);

    if (event.target.value === "") {
      setShowNounResults(false);
    }
  };

  useEffect(() => {
    onValue(
      ref(
        db,
        `${
          props.userProfile.length > 0
            ? `users/${props.userProfile}/titles`
            : "titles"
        }`
      ),
      (snapshot) => {
        if (snapshot.exists()) {
          setDBTitles(snapshot.val());
        }
      }
    );

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
    console.log(showAdjResults);
  }, [showAdjResults])

  useEffect(() => {
    let handler = (event) => {
      // adjective handling
      if (!adjectiveInputRef.current.contains(event.target)) {
        // console.log("hiding from handler");
        // if (idx === 1) outerRef.current.click();
        setShowAdjResults(false);
        setCheckAdjPair(false);
      } else if (
        adjectiveInputRef.current.contains(event.target) &&
        adjectiveInputRef.current.value.trim().length === 0 &&
        nounInputRef.current.value.trim().length !== 0
      ) {
        setCheckAdjPair(true);
          // console.log("showing adj results 1");

        setShowAdjResults(true);
      } else if (
        adjectiveInputRef.current.contains(event.target) &&
        adjectiveInputRef.current.value.trim().length !== 0 &&
        nounInputRef.current.value.trim().length === 0
      ) {
        // checking to see if currently input value is equal to the one that is going to be suggested,
        // if it isn't, show the suggestion
        if (
          searchCtx.searchValues["requestedAdjectives"][
            idx
          ][0].toLowerCase() !==
          adjectiveInputRef.current.value.trim().toLowerCase()
        ) {
          // console.log("showing adj results 2");
          setShowAdjResults(true);
        }
      }

      // noun handling
      if (!nounInputRef.current.contains(event.target)) {
        setShowNounResults(false);
        setCheckNounPair(false);
      } else if (
        nounInputRef.current.contains(event.target) &&
        nounInputRef.current.value.trim().length === 0 &&
        adjectiveInputRef.current.value.trim().length !== 0
      ) {
        setCheckNounPair(true);

        setShowNounResults(true);
      } else if (
        nounInputRef.current.contains(event.target) &&
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
    };

    document.addEventListener("mousedown", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, []);

  //  searchCtx.searchValues["requestedAdjectives"][idx],
  // searchCtx.searchValues["requestedNouns"][idx],

  function prepGallarySearch(event) {
    event.preventDefault();

    // why does this have an '&& idx === 0' ? feel like it should apply to both scenarios
    if (
      searchCtx.searchValues["adjSearch"][idx].length === 0 &&
      searchCtx.searchValues["nounSearch"][idx].length === 0 &&
      idx === 0
    ) {
      searchCtx.updateSearchValues("gallary", null, idx);
      return;
    }

    searchCtx.updatePageSelectorDetails("durationToManuallyLoad", null, idx);
    if (idx === 1) {
      searchCtx.getGallary(0, 6, 6, `users/${props.userProfile}/`);
    } else {
      searchCtx.getGallary(0, 6, 6, "");
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
            className={classes.searchInput}
            id="adj"
            ref={adjectiveInputRef}
            autoComplete="off"
            required
          ></input>
          <label>Adjective</label>
          <div className={showAdjResults ? classes.show : classes.hide}>
            <AdjAutofillResults
              titles={dbTitles}
              checkForPair={checkAdjPair}
              userProfile={props.userProfile}
            />
          </div>
        </div>
        <div className={classes.searchContainer}>
          <input
            className={classes.searchInput}
            id="noun"
            ref={nounInputRef}
            autoComplete="off"
            required
          ></input>
          <label>Noun</label>
          <div className={showNounResults ? classes.show : classes.hide}>
            <NounAutofillResults
              titles={dbTitles}
              checkForPair={checkNounPair}
              userProfile={props.userProfile}
            />
          </div>
        </div>
        <button className={classes.searchButton}>Search</button>
      </form>

      <GallaryList
        drawingIDs={searchCtx.searchValues["gallary"][idx]}
        title={gallaryListStaticTitle}
        margin={props.margin}
        databasePath={idx === 1 ? `users/${props.userProfile}/` : ""}
        forModal={props.forModal}
      />
    </>
  );
};

export default React.memo(Search);
