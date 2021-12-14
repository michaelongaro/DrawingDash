import { createContext, useState } from "react";

const SearchContext = createContext(null);

export function SearchProvider(props) {
  const [adjSearch, setAdjSearch] = useState("");
  const [nounSearch, setNounSearch] = useState("");

  const [requestedAdjectives, setRequestedAdjectives] = useState([]);
  const [requestedNouns, setRequestedNouns] = useState([]);

  const [gallary, setGallary] = useState();

  function getGallary() {
      let fullQuery = `${requestedAdjectives} ${requestedNouns}`
       fetch(`https://drawing-app-18de5-default-rtdb.firebaseio.com/.json`)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        const results = [];
        // will have to save the user's name/link to profile?? in db and eventually display it
        for (const user of data) {
          for (const drawing of user) {

            if (fullQuery === drawing.title) {
                results.push(drawing)
            }

            }
          }
        
        // could certainly find a way to reduce number of calls to db
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
    getGallary,
  }
 
   return (
    <SearchContext.Provider value={context}>
      {props.children}
    </SearchContext.Provider>
  );
}

export default SearchContext;
