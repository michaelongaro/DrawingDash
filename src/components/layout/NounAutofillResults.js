import { useEffect, useState, useContext } from "react";
import SearchContext from "./SearchContext";

import AutofillResult from "./AutofillResult";

import { getDatabase, get, ref, child } from "firebase/database";
import { app } from "../../util/init-firebase";

const AutofillResults = () => {
  const searchCtx = useContext(SearchContext);

  const [rerender, setRerender] = useState(false);

  useEffect(() => {
    if (searchCtx.nounSearch === "") {
      searchCtx.setRequestedNouns([]);
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
            // isolating the noun
            let noun = title.split(" ")[1];
            if (
              noun.substring(0, searchCtx.nounSearch.length) ===
              searchCtx.nounSearch
            ) {
              results.push(noun);
            }

            if (
              noun.substring(0, searchCtx.nounSearch.length) ===
                searchCtx.nounSearch &&
              noun.includes(searchCtx.nounSearch)
            ) {
              related_results.push(noun);
            }
          }

          searchCtx.setRequestedNouns(results);
        });

      setRerender(!rerender);
    }
  }, [searchCtx.nounSearch]);

  return searchCtx.requestedNouns.length !== 0 ? (
    searchCtx.requestedNouns.map((title) => (
      <AutofillResult key={title.id} word={title} type="noun" />
    ))
  ) : (
    <div>{"no results found"}</div>
  );
};

export default AutofillResults;
