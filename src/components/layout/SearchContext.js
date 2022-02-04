import { createContext, useState } from "react";

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

  const [gallary, setGallary] = useState([]);

  function getGallary(profile="") {
    if (adjSearch === "" && nounSearch === "") {
      return;
    }
    let fullQuery = `${adjSearch} ${nounSearch}`;
    let drawingIDsList = [];
    const gallaryResults = [];

    const dbRef = ref(getDatabase(app));

    get(child(dbRef, `${profile}titles/${fullQuery}`))
      .then((snapshot) => {
        console.log(fullQuery);
        if (snapshot.exists()) {
          let title = snapshot.val();
          drawingIDsList = title["drawingID"];
        } else {
          setGallary(["none"]);
          return;
        }
      })
      .then(() => {
        for (let drawingID of drawingIDsList) {
          get(child(dbRef, `${profile}drawings/${drawingID}`)).then((snapshot) => {
            gallaryResults.push(snapshot.val());
            setGallary(gallaryResults);
            console.log(gallaryResults);
          });
        }
      })
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
