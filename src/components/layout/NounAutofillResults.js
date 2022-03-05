import { useEffect, useState, useContext } from "react";
import SearchContext from "./SearchContext";

import AutofillResult from "./AutofillResult";

import { getDatabase, get, ref, child } from "firebase/database";
import { app } from "../../util/init-firebase";

const AutofillResults = (props) => {
  const searchCtx = useContext(SearchContext);

  const [rerender, setRerender] = useState(false);

  useEffect(() => {
    if (searchCtx.nounSearch === "") {
      searchCtx.setRequestedNouns([]);
    } else {
      getNouns();

      setRerender(!rerender);
    }
  }, [searchCtx.nounSearch]);

  function getNouns() {
    const results = [],
      related_results = [],
      totalResults = [];

    const dbRef = ref(getDatabase(app));
    get(child(dbRef, `${props.profile}titles`))
      .then((snapshot) => {
        for (const duration of Object.values(snapshot.val())) {
          for (const title of Object.keys(duration)) {
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
              if (!results.includes(noun)) {
                related_results.push(noun);
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
          searchCtx.setRequestedNouns(...new Set(totalResults));
        } else {
          searchCtx.setRequestedNouns([]);
        }

        
      });
  }

  return searchCtx.requestedNouns.length !== 0 ? (
    searchCtx.requestedNouns.map((title) => (
      <AutofillResult key={title} word={title} type="noun" />
    ))
  ) : (
    <div style={{ textAlign: "center", pointerEvents: "none" }}>{"-No Results Found-"}</div>
  );
};

export default AutofillResults;
