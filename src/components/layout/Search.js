import React from "react";

import { useRef, useEffect, useContext } from "react";

import SearchContext from "./SearchContext";
import AutofillResults from "./AutofillResults";

import classes from "./Search.module.css";

const Search = () => {
  const searchCtx = useContext(SearchContext);
  useEffect(() => {
    searchCtx.setAdjSearch("");
    searchCtx.setNounSearch("");
  }, [])

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
    searchCtx.setRequestedAdjectives([adjectiveInputRef.current.value]);
    searchCtx.setRequestedNouns([nounInputRef.current.value]);

    searchCtx.getGallary();
  }

  return (
    <form className={classes.formContainer} onSubmit={prepGallarySearch}>
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
