import { useContext } from "react";
import SearchContext from "./SearchContext";

import AutofillResult from "./AutofillResult";

const AutofillResults = (props) => {
  const searchCtx = useContext(SearchContext);

  // maybe also need an AutofillResult component..
  if (props.query === "") {
    return;
  } else {
    fetch(`https://drawing-dash-default-rtdb.firebaseio.com/.json`)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        const results = [];
        // will have to save the user's name/link to profile?? in db and eventually display it
        for (const user of data) {
          for (const drawing of user) {

            if (props.type === "a") {
                if (props.query === drawing.adjective.substring(0, props.query.length - 1)) {
                  results.push(drawing);
                } else {
                  // display "no matching terms" or something like that
                }
              } else {
                if (props.query ===  drawing.noun.substring(0, props.query.length - 1)) {
                  results.push(drawing);
                } else {
                  // display "no matching terms" or something like that
                }
              }

            }
          }
        
        // could certainly find a way to reduce number of calls to db
        searchCtx.setRequestedDrawings(results);
      });
        // why is this perma rerendering
  }
  
  function renderResults() {
    if (props.type ==="a") {
        searchCtx.requestedDrawings.map((drawing) => (
        <AutofillResult
          key={drawing.id}
          word={drawing.adjective}
        />
      ))
      } else {
        searchCtx.requestedDrawings.map((drawing) => (
        <AutofillResult
          key={drawing.id}
          word={drawing.noun}
        />
      ))
      }
  }

  return (
    <div>
      {renderResults}
    </div>
  );
};

export default AutofillResults;
