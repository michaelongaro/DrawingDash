import React, { useState, useEffect, useContext } from "react";
import SearchContext from "./SearchContext";

import AutofillResult from "./AutofillResult";

import classes from "./SharedAutofillResults.module.css";

const AdjAutofillResults = ({ titles, checkForPair, idx }) => {
  const searchCtx = useContext(SearchContext);
  const [showPairedResults, setShowPairedResults] = useState(false);

  // eventually refactor this + nounautofillresults to be one component that
  // has all relevant adj/noun fields assigned properly to neutral-named vars

  const adjSearch = searchCtx.searchValues["adjSearch"][idx];

  useEffect(() => {
    if (searchCtx.searchValues["nounSearch"][idx] !== "") {
      getPairedNouns();
      setShowPairedResults(true);
    } else if (adjSearch === "") {
      searchCtx.updateSearchValues("requestedAdjectives", [], idx);
      setShowPairedResults(false);
    } else {
      getAdjectives();
      setShowPairedResults(false);
    }
  }, [adjSearch, idx, checkForPair]);

  function getPairedNouns() {
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
        if (noun === searchCtx.searchValues["nounSearch"][idx].toLowerCase()) {
          if (searchCtx.searchValues["adjSearch"][idx].length === 0) {
            if (!results.includes(adjective)) {
              results.push(adjective);
            }
          } else if (
            adjective.substring(
              0,
              searchCtx.searchValues["adjSearch"][idx].length
            ) === searchCtx.searchValues["adjSearch"][idx].toLowerCase()
          ) {
            if (!results.includes(adjective)) {
              results.push(adjective);
            }
          }
        }

        // checking for related words (only applicable if there is text in adj input)
        if (
          adjective.includes(
            searchCtx.searchValues["adjSearch"][idx].toLowerCase()
          ) &&
          searchCtx.searchValues["adjSearch"][idx].length > 0
        ) {
          if (
            !results.includes(adjective) &&
            !related_results.includes(adjective)
          ) {
            related_results.push(adjective);
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

    totalResults = totalResults.concat(results).concat(related_results);

    if (totalResults.length !== 0) {
      // updating context
      searchCtx.updateSearchValues(
        "requestedAdjectives",
        [...new Set(totalResults)],
        idx
      );
    } else {
      searchCtx.updateSearchValues("requestedAdjectives", [], idx);
    }
  }

  function getAdjectives() {
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

        // checking for direct matches
        if (
          adjective.substring(
            0,
            searchCtx.searchValues["adjSearch"][idx].length
          ) === searchCtx.searchValues["adjSearch"][idx].toLowerCase()
        ) {
          if (!results.includes(adjective)) {
            results.push(adjective);
          }
        }

        // checking for related words
        if (
          adjective.includes(
            searchCtx.searchValues["adjSearch"][idx].toLowerCase()
          )
        ) {
          if (
            !results.includes(adjective) &&
            !related_results.includes(adjective)
          ) {
            related_results.push(adjective);
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

    totalResults = totalResults.concat(results).concat(related_results);

    if (totalResults.length !== 0) {
      // updating context
      searchCtx.updateSearchValues(
        "requestedAdjectives",
        [...new Set(totalResults)],
        idx
      );
    } else {
      searchCtx.updateSearchValues("requestedAdjectives", [], idx);
    }
  }

  return (
    <div className={classes.listContain}>
      {searchCtx.searchValues["requestedAdjectives"][idx].length !== 0 ? (
        searchCtx.searchValues["requestedAdjectives"][idx].map((title) => (
          <AutofillResult key={title} word={title} type="adj" idx={idx} />
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

export default AdjAutofillResults;
