import { useEffect, useState, useContext } from "react";
import SearchContext from "./SearchContext";

import AutofillResult from "./AutofillResult";

const AutofillResults = () => {
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
              } else {
                // display "no matching terms" or something like that
              }
            }
          }

          searchCtx.setRequestedNouns(results);
        });

      setRerender(!rerender);
    }
  }, [searchCtx.nounSearch]);

  // if (searchCtx.requestedNouns.length !== 0) {
  //   // console.log(`calling result comp. of ${searchCtx.requestedNouns}`);
  //   return (
  //     { searchCtx.requestedNouns.map((drawing) => (
  //       <AutofillResult key={drawing.id} word={drawing.noun} />
  //     ))}
  //   );
  // } else {
  //   return <div>"no results found"</div>;
  // }
  return (
    searchCtx.requestedNouns.length !== 0 ? (searchCtx.requestedNouns.map((drawing) => (
        <AutofillResult key={drawing.id} word={drawing.noun} />
      ))) : <div>{"no results found"}</div>
  )
};

export default AutofillResults;
