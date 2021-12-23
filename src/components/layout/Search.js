import React from "react";

import { useRef, useEffect, useContext } from "react";

import SearchContext from "./SearchContext";
import AdjAutofillResults from "./AdjAutofillResults";
import NounAutofillResults from "./NounAutofillResults";

import classes from "./Search.module.css";

const Search = () => {
  const searchCtx = useContext(SearchContext);
  useEffect(() => {
    return () => {
      searchCtx.setAdjSearch("");
      searchCtx.setNounSearch("");
      searchCtx.setRequestedAdjectives([]);
      searchCtx.setRequestedNouns([]);
      searchCtx.setGallary([]);
    };
  }, []);

  console.log("search refreshed");
  const adjectiveInputRef = useRef();
  const nounInputRef = useRef();

  // WAYYY future here but how to reduce overall calls to server, maybe split into separate dbs
  // that are indexed(?)

  const refreshAdjSearch = (event) => {
    searchCtx.setAdjSearch(event.target.value);
    //console.log(searchCtx.adjSearch);
  };

  const refreshNounSearch = (event) => {
    searchCtx.setNounSearch(event.target.value);
    //console.log(searchCtx.nounSearch);
  };

  useEffect(() => {
    adjectiveInputRef.current.addEventListener("input", refreshAdjSearch);
    nounInputRef.current.addEventListener("input", refreshNounSearch);

    let cleanupAdjInpRef = adjectiveInputRef.current;
    let cleanupNInpRef = nounInputRef.current;
    return () => {
      cleanupAdjInpRef.removeEventListener("input", refreshAdjSearch);
      cleanupNInpRef.removeEventListener("input", refreshNounSearch);
    };
  }, []);

  function prepGallarySearch(event) {
    event.preventDefault();

    console.log(`${searchCtx.adjSearch} ${searchCtx.nounSearch}`);
    // searchCtx.setRequestedAdjectives([adjectiveInputRef.current.value]);
    // searchCtx.setRequestedNouns([nounInputRef.current.value]);

    searchCtx.getGallary();
  }

  // function onFocus(event) {
  //   if(event.target.autocomplete)
  //  {
  //    event.target.autocomplete = "whatever";
  //  }

  // }

  return (
    <form className={classes.formContainer} onSubmit={prepGallarySearch}>
      <div className={classes.searchContainer}>
        <input
          id="adj"
          placeholder="Adjective"
          ref={adjectiveInputRef}
          autoComplete="off"
        ></input>
        <AdjAutofillResults />
      </div>
      <div className={classes.searchContainer}>
        <input
          id="noun"
          placeholder="Noun"
          ref={nounInputRef}
          autoComplete="off"
        ></input>
        <NounAutofillResults />
      </div>
      <button>Search</button>
    </form>
  );
};

export default Search;
