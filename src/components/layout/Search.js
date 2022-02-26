import React from "react";

import { useRef, useEffect, useState, useContext } from "react";

import SearchContext from "./SearchContext";
import AdjAutofillResults from "./AdjAutofillResults";
import NounAutofillResults from "./NounAutofillResults";
import { useAuth0 } from "@auth0/auth0-react";

import classes from "./Search.module.css";

const Search = (props) => {
  const searchCtx = useContext(SearchContext);
  const { user } = useAuth0();
  useEffect(() => {
    return () => {
      searchCtx.setAdjSearch("");
      searchCtx.setNounSearch("");
      searchCtx.setRequestedAdjectives([]);
      searchCtx.setRequestedNouns([]);
      searchCtx.setGallary([]);
    };
  }, []);

  const [showAdjResults, setShowAdjResults] = useState({ display: "none" });
  const [showNounResults, setShowNounResults] = useState({ display: "none" });

  const adjectiveInputRef = useRef();
  const nounInputRef = useRef();

  const refreshAdjSearch = (event) => {
    searchCtx.setAdjSearch(event.target.value);

    setShowAdjResults({ display: "block" });

    if (event.target.value === "") {
      setShowAdjResults({ display: "none" });
    }
  };

  const refreshNounSearch = (event) => {
    searchCtx.setNounSearch(event.target.value);

    setShowNounResults({ display: "block" });

    if (event.target.value === "") {
      setShowNounResults({ display: "none" });
    }
  };

  const hideAutofill = () => {
    setShowAdjResults({ display: "none" });
    setShowNounResults({ display: "none" });
  };

  useEffect(() => {
    adjectiveInputRef.current.addEventListener("input", refreshAdjSearch);
    nounInputRef.current.addEventListener("input", refreshNounSearch);

    document.addEventListener("mousedown", hideAutofill);

    let cleanupAdjInputRef = adjectiveInputRef.current;
    let cleanupNInpRef = nounInputRef.current;
    return () => {
      cleanupAdjInputRef.removeEventListener("input", refreshAdjSearch);
      cleanupNInpRef.removeEventListener("input", refreshNounSearch);
      document.removeEventListener("mousedown", hideAutofill);
    };
  }, []);

  useEffect(() => {
    if (searchCtx.autofilledAdjectiveInput.length > 0) {
      adjectiveInputRef.current.value = searchCtx.autofilledAdjectiveInput;
      searchCtx.setAdjSearch(searchCtx.autofilledAdjectiveInput);
    }
  }, [searchCtx.autofilledAdjectiveInput]);

  useEffect(() => {
    if (searchCtx.autofilledNounInput.length > 0) {
      nounInputRef.current.value = searchCtx.autofilledNounInput;
      searchCtx.setNounSearch(searchCtx.autofilledNounInput);
    }
  }, [searchCtx.autofilledNounInput]);

  function prepGallarySearch(event) {
    event.preventDefault();
    if (props.forProfile) {
      searchCtx.getGallary(`users/${user.sub}/`);
    } else {
      searchCtx.getGallary();
    }

    // clearing autofill context values
    searchCtx.setAutofilledAdjectiveInput("");
    searchCtx.setAutofilledNounInput("");
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
        <div style={showAdjResults}>
          <AdjAutofillResults />
        </div>
      </div>
      <div className={classes.searchContainer}>
        <input
          id="noun"
          placeholder="Noun"
          ref={nounInputRef}
          autoComplete="off"
        ></input>
        <div style={showNounResults}>
          <NounAutofillResults />
        </div>
      </div>
      <button>Search</button>
    </form>
  );
};

export default Search;
