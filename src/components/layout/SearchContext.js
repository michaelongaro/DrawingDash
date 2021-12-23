import { createContext, useState } from "react";

const SearchContext = createContext(null);

export function SearchProvider(props) {
  const [adjSearch, setAdjSearch] = useState("");
  const [nounSearch, setNounSearch] = useState("");

  const [requestedAdjectives, setRequestedAdjectives] = useState([]);
  const [requestedNouns, setRequestedNouns] = useState([]);

  const [gallary, setGallary] = useState([]);

  function getGallary() {
    // let strippedAdj = requestedAdjectives[0].adjective;
    // let strippedNoun = requestedNouns[0].noun;
    // let fullQuery = `${strippedAdj} ${strippedNoun}`;
    let fullQuery = `${adjSearch} ${nounSearch}`
    // console.log(fullQuery);
    fetch(`https://drawing-dash-41f14-default-rtdb.firebaseio.com/.json`)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        const results = [];

        for (const user of Object.values(data)) {
          for (const drawing of Object.values(user)) {
            if (fullQuery === drawing.title) {
              console.log("found a match!");
              results.push(drawing);
            }
          }
        }

        setGallary(results);
      });
  }

  const context = {
    adjSearch: adjSearch,
    nounSearch: nounSearch,
    requestedAdjectives: requestedAdjectives,
    requestedNouns: requestedNouns,
    gallary: gallary,
    setAdjSearch: setAdjSearch,
    setNounSearch: setNounSearch,
    setRequestedAdjectives: setRequestedAdjectives,
    setRequestedNouns: setRequestedNouns,
    setGallary: setGallary,
    getGallary: getGallary,
  };

  return (
    <SearchContext.Provider value={context}>
      {props.children}
    </SearchContext.Provider>
  );
}

export default SearchContext;
