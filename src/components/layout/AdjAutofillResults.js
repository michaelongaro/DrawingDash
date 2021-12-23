import { useEffect, useState, useContext } from "react";
import SearchContext from "./SearchContext";

import AutofillResult from "./AutofillResult";

const AutofillResults = () => {
  const searchCtx = useContext(SearchContext);

  const [rerender, setRerender] = useState(false);

  useEffect(() => {
    if (searchCtx.adjSearch === "") {
      searchCtx.setRequestedAdjectives([]);
    } else {
      console.log(`${searchCtx.adjSearch} - fetching autofill`);
      fetch(`https://drawing-dash-41f14-default-rtdb.firebaseio.com/.json`)
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          const results = [];

          for (const user of Object.values(data)) {
            for (const drawing of Object.values(user)) {
              console.log(
                drawing.adjective.substring(0, searchCtx.adjSearch.length)
              );

              if (
                searchCtx.adjSearch ===
                drawing.adjective.substring(0, searchCtx.adjSearch.length)
              ) {
                results.push(drawing);
              } else {
                // display "no matching terms" or something like that
              }
            }
          }

          searchCtx.setRequestedAdjectives(results);
        });

      setRerender(!rerender);
    }
  }, [searchCtx.adjSearch]);

  // if (searchCtx.requestedAdjectives.length !== 0) {
  //   console.log(`calling result comp. of ${searchCtx.requestedAdjectives}`);

  //   searchCtx.requestedAdjectives.map((drawing) => {
  //     console.log("IS THIS EVEN HITTING");
  //     return <AutofillResult key={drawing.id} word={drawing.adjective} />;
  //   });
  // } else {
  //   return <div>"no results found"</div>;
  // }

   return (
    searchCtx.requestedAdjectives.length !== 0 ? (searchCtx.requestedAdjectives.map((drawing) => (
        <AutofillResult key={drawing.id} word={drawing.adjective} />
      ))) : <div>{"no results found"}</div>
  )
};

export default AutofillResults;
