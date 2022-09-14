import { useState, useEffect, useContext } from "react";
import SearchContext from "./SearchContext";

import AutofillResult from "./AutofillResult";

import classes from "./SharedAutofillResults.module.css";

const NounAutofillResults = ({ titles, checkForPair, idx }) => {
  const searchCtx = useContext(SearchContext);
  const [showPairedResults, setShowPairedResults] = useState(false);

  // eventually refactor this + nounautofillresults to be one component that
  // has all relevant adj/noun fields assigned properly to neutral-named vars

  useEffect(() => {
    if (searchCtx.searchValues["adjSearch"][idx] !== "") {
      getPairedAdjectives();
      setShowPairedResults(true);
    } else if (searchCtx.searchValues["nounSearch"][idx] === "") {
      searchCtx.updateSearchValues("requestedNouns", [], idx);
      setShowPairedResults(false);
    } else {
      getNouns();
      setShowPairedResults(false);
    }
  }, [searchCtx.searchValues["nounSearch"][idx], checkForPair]);

  function getPairedAdjectives() {
    let results = [],
      related_results = [],
      totalResults = [];

    if (titles === null) return;

    for (const duration of Object.values(titles)) {
      // sorting titles for each 60/180/300 duration by one's with the most entries first
      let descendingEntries = [];
      let highestEntries = 0;

      // checking to see if looping through likes, else follow normal pattern
      if (typeof duration === "object" && Array.isArray(duration)) {
        descendingEntries = duration;
      } else {
        for (const title of Object.keys(duration)) {
          if (duration[title]["drawingID"].length > highestEntries) {
            descendingEntries.unshift(title);
          } else {
            descendingEntries.push(title);
          }
        }
      }

      // finding the titles that match or at least contain the user input
      for (const title of descendingEntries) {
        // isolating the adjective
        let adjective = title.split(" ")[0].toLowerCase();
        let noun = title.split(" ")[1].toLowerCase();

        // checking for direct matches
        if (
          adjective === searchCtx.searchValues["adjSearch"][idx].toLowerCase()
        ) {
          if (searchCtx.searchValues["nounSearch"][idx].length === 0) {
            if (!results.includes(noun)) {
              results.push(noun);
            }
          } else if (
            noun.substring(
              0,
              searchCtx.searchValues["nounSearch"][idx].length
            ) === searchCtx.searchValues["nounSearch"][idx].toLowerCase()
          ) {
            if (!results.includes(noun)) {
              results.push(noun);
            }
          }
        }

        // checking for related words (only applicable if there is text in noun input)
        if (
          noun.includes(
            searchCtx.searchValues["nounSearch"][idx].toLowerCase()
          ) &&
          searchCtx.searchValues["nounSearch"][idx].length > 0
        ) {
          if (!results.includes(noun) && !related_results.includes(noun)) {
            related_results.push(noun);
          }
        }
      }
    }

    // finding (up to) first 5 alphabetical direct results (that are sorted roughly descending from
    // # of entries) and then first 3 alphabetical related results
    results.sort().splice(5);
    // properly capitalizing word
    results = results.map((elem) => {
      return elem.charAt(0).toUpperCase() + elem.substring(1).toLowerCase();
    });

    related_results.sort().splice(3);
    // properly capitalizing word
    related_results = related_results.map((elem) => {
      return elem.charAt(0).toUpperCase() + elem.substring(1).toLowerCase();
    });

    if (results.length !== 0) {
      totalResults.push(results);

      // updating context
      searchCtx.updateSearchValues(
        "requestedNouns",
        ...new Set(totalResults),
        idx
      );
    } else {
      searchCtx.updateSearchValues("requestedNouns", [], idx);
    }
  }

  function getNouns() {
    let results = [],
      related_results = [],
      totalResults = [];

    if (titles === null) return;

    for (const duration of Object.values(titles)) {
      // sorting titles for each 60/180/300 duration by one's with the most entries first
      let descendingEntries = [];
      let highestEntries = 0;

      // checking to see if looping through likes, else follow normal pattern
      if (typeof duration === "object" && Array.isArray(duration)) {
        descendingEntries = duration;
      } else {
        for (const title of Object.keys(duration)) {
          if (duration[title]["drawingID"].length > highestEntries) {
            descendingEntries.unshift(title);
          } else {
            descendingEntries.push(title);
          }
        }
      }

      // finding the titles that match or at least contain the user input
      for (const title of descendingEntries) {
        // isolating the adjective
        let noun = title.split(" ")[1].toLowerCase();

        // checking for direct matches
        if (
          noun.substring(
            0,
            searchCtx.searchValues["nounSearch"][idx].length
          ) === searchCtx.searchValues["nounSearch"][idx].toLowerCase()
        ) {
          if (!results.includes(noun)) {
            results.push(noun);
          }
        }

        // checking for related words
        if (
          noun.includes(searchCtx.searchValues["nounSearch"][idx].toLowerCase())
        ) {
          if (!results.includes(noun) && !related_results.includes(noun)) {
            related_results.push(noun);
          }
        }
      }
    }

    // finding (up to) first 5 alphabetical direct results (that are sorted roughly descending from
    // # of entries) and then first 3 alphabetical related results
    results.sort().splice(5);
    // properly capitalizing word
    results = results.map((elem) => {
      return elem.charAt(0).toUpperCase() + elem.substring(1).toLowerCase();
    });

    related_results.sort().splice(3);
    // properly capitalizing word
    related_results = related_results.map((elem) => {
      return elem.charAt(0).toUpperCase() + elem.substring(1).toLowerCase();
    });

    if (results.length !== 0) {
      if (related_results.length !== 0) {
        totalResults.push(results.concat(["related"]).concat(related_results));
      } else {
        totalResults.push(results);
      }

      // updating context
      searchCtx.updateSearchValues(
        "requestedNouns",
        ...new Set(totalResults),
        idx
      );
    } else {
      searchCtx.updateSearchValues("requestedNouns", [], idx);
    }
  }

  return (
    <div className={classes.listContain}>
      {searchCtx.searchValues["requestedNouns"][idx].length !== 0 ? (
        searchCtx.searchValues["requestedNouns"][idx].map((title) => (
          <AutofillResult key={title} word={title} type="noun" idx={idx} />
        ))
      ) : showPairedResults ? (
        <div className={classes.autofillRelatedDivider}>
          <div className={classes.leadingLine}></div>
          <div className={classes.columnFlex}>
            <div style={{ fontSize: ".85em" }}>No results found for</div>
            <div>
              "{`${searchCtx.searchValues["adjSearch"][idx]} `}
              {searchCtx.searchValues["nounSearch"][idx]}"
            </div>
          </div>
          <div className={classes.trailingLine}></div>
        </div>
      ) : (
        <div className={classes.autofillRelatedDivider}>
          <div className={classes.leadingLine}></div>
          <div>No Results Found</div>
          <div className={classes.trailingLine}></div>
        </div>
      )}
    </div>
  );
};

export default NounAutofillResults;
