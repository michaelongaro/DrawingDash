import React, { useEffect, useState, useContext } from "react";
import SearchContext from "./SearchContext";

import AutofillResult from "./AutofillResult";

import { getDatabase, get, ref, child } from "firebase/database";
import { app } from "../../util/init-firebase";

const AutofillResults = () => {
  const searchCtx = useContext(SearchContext);

  const [rerender, setRerender] = useState(false);

  // can optimize later, probably just want to filter out
  useEffect(() => {
    if (searchCtx.adjSearch === "") {
      searchCtx.setRequestedAdjectives([]);
    } else {
      const results = [],
        related_results = [];
      let fetched_titles;

      const dbRef = ref(getDatabase(app));

      get(child(dbRef, `titles/`))
        .then((snapshot) => {
          fetched_titles = snapshot.val();
        })
        .then(() => {
          for (const title of Object.keys(fetched_titles)) {
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
              related_results.push(adjective);
            }
          }
          searchCtx.setRequestedAdjectives(results);
        });
        
      setRerender(!rerender);
    }
  }, [searchCtx.adjSearch]);

  return searchCtx.requestedAdjectives.length !== 0 ? (
    
    searchCtx.requestedAdjectives.map((title) => (
      <AutofillResult
        key={title.id}
        word={title}
        type="adj"
      />
    ))
  ) : (
    <div>{"no results found"}</div>
  );
};

export default AutofillResults;
