import React from "react";

import { useRef, useEffect, useState, useContext } from "react";

import SearchContext from "./SearchContext";
import GallaryList from "./GallaryList";
import AdjAutofillResults from "./AdjAutofillResults";
import NounAutofillResults from "./NounAutofillResults";

import classes from "./Search.module.css";

const Search = (props) => {
  const searchCtx = useContext(SearchContext);

  useEffect(() => {
    return () => {
      searchCtx.setAdjSearch("");
      searchCtx.setNounSearch("");
      // do this for whenever input changes/submit is clicked?
      searchCtx.setRequestedAdjectives([]);
      searchCtx.setRequestedNouns([]);
      searchCtx.setGallary(null);
    };
  }, []);

  const [showAdjResults, setShowAdjResults] = useState(classes.hide);
  const [showNounResults, setShowNounResults] = useState(classes.hide);

  const [gallaryListStaticTitle, setGallaryListStaticTitle] = useState();

  const adjectiveInputRef = useRef();
  const nounInputRef = useRef();

  const refreshAdjSearch = (event) => {
    searchCtx.setAdjSearch(event.target.value.trim());

    setShowAdjResults(classes.show);

    if (event.target.value === "") {
      setShowAdjResults(classes.hide);
    }
  };

  const refreshNounSearch = (event) => {
    searchCtx.setNounSearch(event.target.value.trim());

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
    if (searchCtx.autofilledAdjectiveInput.length > 0) {
      adjectiveInputRef.current.value = searchCtx.autofilledAdjectiveInput;
      searchCtx.setAdjSearch(searchCtx.autofilledAdjectiveInput);
      searchCtx.setAutofilledAdjectiveInput("");
    }
  }, [searchCtx.autofilledAdjectiveInput]);

  useEffect(() => {
    if (searchCtx.autofilledNounInput.length > 0) {
      nounInputRef.current.value = searchCtx.autofilledNounInput;
      searchCtx.setNounSearch(searchCtx.autofilledNounInput);
      searchCtx.setAutofilledNounInput("");
    }
  }, [searchCtx.autofilledNounInput]);

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

    if (searchCtx.adjSearch.length === 0 && searchCtx.nounSearch.length === 0) {
      searchCtx.setGallary(null);
      return;
    }

    if (props.userProfile.length > 0) {
      searchCtx.getGallary(`users/${props.userProfile}/`);
    } else {
      searchCtx.getGallary();
    }

    setGallaryListStaticTitle(`${searchCtx.adjSearch} ${searchCtx.nounSearch}`)

    // clearing autofill context values
    searchCtx.setAutofilledAdjectiveInput("");
    searchCtx.setAutofilledNounInput("");
    searchCtx.setRequestedAdjectives([]);
    searchCtx.setRequestedNouns([]);
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
            <AdjAutofillResults profile={props.userProfile} />
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
            <NounAutofillResults profile={props.userProfile} />
          </div>
        </div>
        <button>Search</button>
      </form>

      {searchCtx.gallary !== null ? (
        <GallaryList
          drawings={searchCtx.gallary}
          title={gallaryListStaticTitle}
        />
      ) : (
        <div></div>
      )}
    </>
  );
};

export default Search;
