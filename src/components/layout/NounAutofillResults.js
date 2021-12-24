import { useEffect, useState, useContext } from "react";
import SearchContext from "./SearchContext";

import AutofillResult from "./AutofillResult";

const AutofillResults = (props) => {
  const searchCtx = useContext(SearchContext);

  const [rerender, setRerender] = useState(false);

  useEffect(() => {
    if (searchCtx.nounSearch === "") {
      searchCtx.setRequestedNouns([]);
    } else {
      console.log(`${searchCtx.nounSearch} - fetching autofill`);
      fetch(`https://drawing-dash-41f14-default-rtdb.firebaseio.com/.json`)
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          const results = [];

          for (const user of Object.values(data)) {
            for (const drawing of Object.values(user)) {
              console.log(
                drawing.noun.substring(0, searchCtx.adjSearch.length)
              );

              if (
                searchCtx.nounSearch ===
                drawing.noun.substring(0, searchCtx.nounSearch.length)
              ) {
                results.push(drawing);
              }

            }
          }

          searchCtx.setRequestedNouns(results);
        });

      setRerender(!rerender);
    }
  }, [searchCtx.nounSearch]);

  return (
    searchCtx.requestedNouns.length !== 0 ? (searchCtx.requestedNouns.map((drawing) => (
        <AutofillResult key={drawing.id} word={drawing.noun} parentRef={props.nounRef}/>
      ))) : <div>{"no results found"}</div>
  )
};

export default AutofillResults;
