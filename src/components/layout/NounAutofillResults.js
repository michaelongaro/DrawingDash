import { useEffect, useState, useContext } from "react";
import SearchContext from "./SearchContext";

import AutofillResult from "./AutofillResult";

import { getDatabase, get, ref, child } from "firebase/database";
import { app } from "../../util/init-firebase";

const NounAutofillResults = (props) => {
  const searchCtx = useContext(SearchContext);

  let idx = props.userProfile.length > 0 ? 1 : 0;
  let titleLocation = props.userProfile.length > 0 ? `users/${props.userProfile}/titles` : "titles";


  const [rerender, setRerender] = useState(false);

  useEffect(() => {
    if (searchCtx.searchValues["nounSearch"][idx] === "") {
      searchCtx.updateSearchValues("requestedNouns", [], idx);
    } else {
      getNouns();

      setRerender(!rerender);
    }
  }, [searchCtx.searchValues["nounSearch"][idx]]);

  function getNouns() {
    const results = [],
      related_results = [],
      totalResults = [];

    const dbRef = ref(getDatabase(app));
    get(child(dbRef, titleLocation))
      .then((snapshot) => {
        for (const duration of Object.values(snapshot.val())) {
          for (const title of Object.keys(duration)) {
            // isolating the noun
            let noun = title.split(" ")[1];
            if (
              noun.substring(0,searchCtx.searchValues["nounSearch"][idx].length) ===
              searchCtx.searchValues["nounSearch"][idx]
            ) {
              results.push(noun);
            }

            if (
              noun.substring(0, searchCtx.searchValues["nounSearch"][idx].length) ===
                searchCtx.searchValues["nounSearch"][idx] &&
              noun.includes(searchCtx.searchValues["nounSearch"][idx])
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
          searchCtx.updateSearchValues(
            "requestedNouns",
            ...new Set(totalResults),
            idx
          );
        } else {
          searchCtx.updateSearchValues("requestedNouns", [], idx);
        }

        
      });
  }

  return searchCtx.searchValues["requestedNouns"][idx].length !== 0 ? (
    searchCtx.searchValues["requestedNouns"][idx].map((title) => (
      <AutofillResult key={title} word={title} type="noun" userProfile={props.userProfile} />
    ))
  ) : (
    <div style={{ textAlign: "center", pointerEvents: "none" }}>{"-No Results Found-"}</div>
  );
};

export default NounAutofillResults;
