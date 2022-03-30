import React, { useEffect, useState, useContext } from "react";
import SearchContext from "./SearchContext";

import AutofillResult from "./AutofillResult";

import { getDatabase, get, ref, child } from "firebase/database";
import { app } from "../../util/init-firebase";

const AdjAutofillResults = (props) => {
  const searchCtx = useContext(SearchContext);

  let idx = props.userProfile.length > 0 ? 1 : 0;
  let titleLocation = props.userProfile.length > 0 ? `users/${props.userProfile}/titles` : "titles";

  const [rerender, setRerender] = useState(false);

  // can optimize later, probably just want to filter out
  useEffect(() => {
    if (searchCtx.searchValues["adjSearch"][idx] === "") {
      searchCtx.updateSearchValues("requestedAdjectives", [], idx);
    } else {
      // set it to null
      getAdjectives();

      setRerender(!rerender);
    }
  }, [searchCtx.searchValues["adjSearch"][idx]]);

  function getAdjectives() {
    const results = [],
      related_results = [],
      totalResults = [];

    const dbRef = ref(getDatabase(app));
    get(child(dbRef, titleLocation))
      .then((snapshot) => {
        console.log(snapshot.val());
        for (const duration of Object.values(snapshot.val())) {
          for (const title of Object.keys(duration)) {
            // isolating the adjective
            let adjective = title.split(" ")[0];
            if (
              adjective.substring(0, searchCtx.searchValues["adjSearch"][idx].length) ===
              searchCtx.searchValues["adjSearch"][idx]
            ) {
              results.push(adjective);
            }

            if (
              adjective.substring(
                0,
                searchCtx.searchValues["adjSearch"][idx].length
              ) === searchCtx.searchValues["adjSearch"][idx] &&
              adjective.includes(searchCtx.searchValues["adjSearch"][idx])
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
          searchCtx.updateSearchValues(
            "requestedAdjectives",
            ...new Set(totalResults),
            idx
          );
        } else {
          searchCtx.updateSearchValues("requestedAdjectives", [], idx);
        }
      });
  }

  return searchCtx.searchValues["requestedAdjectives"][idx].length !== 0 ? (
    searchCtx.searchValues["requestedAdjectives"][idx].map((title) => (
      <AutofillResult key={title} word={title} type="adj" userProfile={props.userProfile} />
    ))
  ) : (
    <div style={{ textAlign: "center", pointerEvents: "none" }}>
      {"-No Results Found-"}
    </div>
  );
};

export default AdjAutofillResults;
