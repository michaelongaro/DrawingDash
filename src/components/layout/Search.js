import React from "react";

import { useRef, useEffect, useContext } from "react";

import SearchContext from "./SearchContext";
import AutofillResults from "./AutofillResults";

import classes from "./Search.module.css";


const Search = () => {
  const adjectiveInputRef = useRef();
  const nounInputRef = useRef();

  const searchCtx = useContext(SearchContext);
  
  // maybe use context here to share state of when the input changes (between this component and 
  // the AutofillResult.js component) give that a useEffect and update 

  // WAYYY future here but how to reduce overall calls to server, maybe split into separate dbs
  // that are indexed(?)

  const refreshAdjSearch = (event) => {
    if (
      (event.which >= 65 && event.which <= 90) ||
      event.code === "Backspace"
    ) {
      // clearAutofillResults();
      searchCtx.setAdjSearch(event.target.value);
    }
  };

  const refreshNounSearch = (event) => {
     if (
      (event.which >= 65 && event.which <= 90) ||
      event.code === "Backspace"
    ) {
      // update state -> automatically updates autofill
      searchCtx.setNounSearch(event.target.value);
    }
  }

  useEffect(() => {
    adjectiveInputRef.current.addEventListener("input", refreshAdjSearch);
    nounInputRef.current.addEventListener("input", refreshNounSearch)

    return () => {
      adjectiveInputRef.current.removeEventListener("input", refreshAdjSearch);
      nounInputRef.current.removeEventListener("input", refreshNounSearch);
    };
  }, []);

  function prepGallarySearch() {
    searchCtx.setRequestedAdjectives(adjectiveInputRef.current.value);
    searchCtx.setRequestedNouns(nounInputRef.current.value);

    searchCtx.getGallary();
  }

  return (
    // for onSubmit here, use context and throw the gallarylist in another file
    <form className={classes.formContainer} onSubmit={prepGallarySearch}>
      {/* here is where we would add the rotating (vertically) examples + update results */}
      {/* look at weather app for how to make responsive */}
      <div className={classes.searchContainer}>
        <input id="adj" placeholder="Adjective" ref={adjectiveInputRef}></input>
        <AutofillResults query={searchCtx.adjSearch} type="a" />
      </div>
      <div className={classes.searchContainer}>
        <input id="noun" placeholder="Noun" ref={nounInputRef}></input>
        <AutofillResults query={searchCtx.nounSearch} type="n" />
      </div>
      <button>Search</button>
    </form>
  );
};

export default Search;
