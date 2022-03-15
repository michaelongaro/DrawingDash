import { createContext, useEffect, useState } from "react";

import { getDatabase, get, ref, child } from "firebase/database";
import { app } from "../../util/init-firebase";

const SearchContext = createContext(null);

export function SearchProvider(props) {
  const [adjSearch, setAdjSearch] = useState("");
  const [nounSearch, setNounSearch] = useState("");

  const [autofilledAdjectiveInput, setAutofilledAdjectiveInput] = useState("");
  const [autofilledNounInput, setAutofilledNounInput] = useState("");

  const [requestedAdjectives, setRequestedAdjectives] = useState([]);
  const [requestedNouns, setRequestedNouns] = useState([]);

  const [gallary, setGallary] = useState(null);

  function getGallary(profile = "") {
    if (adjSearch === "" && nounSearch === "") {
      return;
    }
    let fullQuery = `${adjSearch} ${nounSearch}`;
    let gallaryResults = { 60: [], 180: [], 300: [] };
    const drawingIDS = [];
    const promises = [];
    const dbRef = ref(getDatabase(app));

    get(child(dbRef, `${profile}titles`))
      .then((snapshot) => {
        for (const index in Object.values(snapshot.val())) {
          let durationObj = Object.values(snapshot.val());
          for (const title of Object.keys(durationObj[index])) {
            if (title === fullQuery) {
              for (let drawingID of durationObj[index][title]["drawingID"]) {
                drawingIDS.push(drawingID);
              }
            }
          }
        }

        for (const id of drawingIDS) {
          promises.push(get(child(dbRef, `drawings/${id}`)));
        }

        return Promise.all(promises);
      })
      .then((results) => {
        if (results.length === 0) {
          setGallary("none");
        } else {
          for (const result of results) {
            gallaryResults[result.val()["seconds"]].push(result.val());
          }

          setGallary(gallaryResults);
        }
      });
  }


  const context = {
    adjSearch: adjSearch,
    nounSearch: nounSearch,
    requestedAdjectives: requestedAdjectives,
    requestedNouns: requestedNouns,
    gallary: gallary,
    autofilledAdjectiveInput: autofilledAdjectiveInput,
    autofilledNounInput: autofilledNounInput,
    setAutofilledAdjectiveInput: setAutofilledAdjectiveInput,
    setAutofilledNounInput: setAutofilledNounInput,
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
