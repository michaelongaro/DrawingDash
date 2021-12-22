import { useEffect, useContext } from "react";
import SearchContext from "./SearchContext";

import AutofillResult from "./AutofillResult";

const AutofillResults = (props) => {
  const searchCtx = useContext(SearchContext);
  useEffect(() => {
    if (props.query === "") {
      return <div></div>;
    } else {
      console.log(`${props.query} - fetching autofill`);
      fetch(`https://drawing-dash-41f14-default-rtdb.firebaseio.com/.json`)
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          const results = [];

          for (const user of Object.values(data)) {
            for (const drawing of Object.values(user)) {
              console.log(drawing);
              if (props.type === "a") {
                if (
                  props.query ===
                  drawing.adjective.substring(0, props.query.length - 1)
                ) {
                  
                  results.push(drawing);
                } else {
                  // display "no matching terms" or something like that
                }
              } else {
                if (
                  props.query ===
                  drawing.noun.substring(0, props.query.length - 1)
                ) {
                  
                  results.push(drawing);
                } else {
                  // display "no matching terms" or something like that
                }
              }
            }
          }
          // this needs to be async i think.
          props.type === "a"
            ? searchCtx.setRequestedAdjectives(results)
            : searchCtx.setRequestedNouns(results);
        });
    }
  }, []);

  function renderResults() {
    if (props.type === "a" && searchCtx.requestedAdjectives.length !== 0) {
      console.log(searchCtx.requestedAdjectives);

      searchCtx.requestedAdjectives.map((drawing) => (
        <AutofillResult key={drawing.id} word={drawing.adjective} />
      ));
    } else if (props.type === "n" && searchCtx.requestedNouns.length !== 0) {
      console.log(searchCtx.requestedNouns);

      searchCtx.requestedNouns.map((drawing) => (
        <AutofillResult key={drawing.id} word={drawing.noun} />
      ));
    } else {
      <div>"no results found"</div>;
    }
  }

  return <div>{renderResults()}</div>;
};

export default AutofillResults;
