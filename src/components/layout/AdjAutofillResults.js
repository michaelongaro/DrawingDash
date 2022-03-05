import React, { useEffect, useState, useContext } from "react";
import SearchContext from "./SearchContext";

import AutofillResult from "./AutofillResult";

import { getDatabase, get, ref, child } from "firebase/database";
import { app } from "../../util/init-firebase";

const AutofillResults = (props) => {
  const searchCtx = useContext(SearchContext);

  const [rerender, setRerender] = useState(false);

  // can optimize later, probably just want to filter out
  useEffect(() => {
    if (searchCtx.adjSearch === "") {
      searchCtx.setRequestedAdjectives([]);
    } else {
      // set it to null
      getAdjectives();

      setRerender(!rerender);
    }
  }, [searchCtx.adjSearch]);

  function getAdjectives() {
    const results = [],
      related_results = [],
      totalResults = [];

    const dbRef = ref(getDatabase(app));
    get(child(dbRef, `${props.profile}titles`))
      .then((snapshot) => {
        for (const duration of Object.values(snapshot.val())) {
          for (const title of Object.keys(duration)) {
            // isolating the adjective
            let adjective = title.split(" ")[0];
            if (
              adjective.substring(0, searchCtx.adjSearch.length) ===
              searchCtx.adjSearch
            ) {
              results.push(adjective);
            }

            if (
              adjective.substring(0, searchCtx.adjSearch.length) ===
                searchCtx.adjSearch &&
              adjective.includes(searchCtx.adjSearch)
            ) {
              if (!results.includes(adjective)) {
                related_results.push(adjective);
              }
            }
          }
        }
      })
      .then(() => {
        if (results.length !== 0) {
          if (related_results.length !== 0) {
            totalResults.push(
              results.concat(["---------"]).concat(related_results)
            );
          } else {
            totalResults.push(results);
          }
          searchCtx.setRequestedAdjectives(...new Set(totalResults));
        } else {
          searchCtx.setRequestedAdjectives([]);
        }
      });
  }

  return searchCtx.requestedAdjectives.length !== 0 ? (
    searchCtx.requestedAdjectives.map((title) => (
      <AutofillResult key={title} word={title} type="adj" />
    ))
  ) : (
    <div style={{ textAlign: "center", pointerEvents: "none"}}>{"-No Results Found-"}</div>
  );
};

export default AutofillResults;
