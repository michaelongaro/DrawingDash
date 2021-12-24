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

  const adjectiveInputRef = useRef();
  const nounInputRef = useRef();

  const refreshAdjSearch = (event) => {
    searchCtx.setAdjSearch(event.target.value);
  };

  const refreshNounSearch = (event) => {
    searchCtx.setNounSearch(event.target.value);
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

  useEffect(() => {
    console.log("reacted to ref change");
  }, [adjectiveInputRef.current, nounInputRef.current])

  function prepGallarySearch(event) {
    event.preventDefault();
    searchCtx.getGallary();
  }

  return (
    <form className={classes.formContainer} onSubmit={prepGallarySearch}>
      <div className={classes.searchContainer}>
        <input
          id="adj"
          placeholder="Adjective"
          ref={adjectiveInputRef}
          autoComplete="off"
        ></input>
        <AdjAutofillResults adjRef={adjectiveInputRef} />
      </div>
      <div className={classes.searchContainer}>
        <input
          id="noun"
          placeholder="Noun"
          ref={nounInputRef}
          autoComplete="off"
        ></input>
        <NounAutofillResults nounRef={nounInputRef} />
      </div>
      <button>Search</button>
    </form>
  );
};

export default Search;
