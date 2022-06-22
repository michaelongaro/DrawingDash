import { createContext, useEffect, useState } from "react";

import { getDatabase, get, ref, child } from "firebase/database";
import { app } from "../../util/init-firebase";

const SearchContext = createContext(null);

export function SearchProvider(props) {
  const [searchValues, setSearchValues] = useState({
    adjSearch: ["", ""],
    nounSearch: ["", ""],
    autofilledAdjectiveInput: ["", ""],
    autofilledNounInput: ["", ""],
    requestedAdjectives: [[], []],
    requestedNouns: [[], []],
    gallary: [null, null],
  });

  const [persistingUserGallary, setPersistingUserGallary] = useState([]);

  function updateSearchValues(key, value, idx) {
    let tempValues = { ...searchValues };
    let newValue = tempValues[key];
    newValue[idx] = value;

    tempValues[key] = newValue;
    setSearchValues(tempValues);
  }

  function resetAllValues(idx) {
    console.log("RESETTING ALL VALUES");
    updateSearchValues("adjSearch", "", idx);
    updateSearchValues("nounSearch", "", idx);
    updateSearchValues("autofilledAdjectiveInput", "", idx);
    updateSearchValues("autofilledNounInput", "", idx);
    updateSearchValues("requestedAdjectives", [], idx);
    updateSearchValues("requestedNouns", [], idx);
    updateSearchValues("gallary", null, idx);
  }

  function getGallary(profile = "") {
    const dbRef = ref(getDatabase(app));

    let idx = profile.length > 0 ? 1 : 0;
    let fetchAll = false;

    if (
      searchValues["adjSearch"][idx] === "" &&
      searchValues["nounSearch"][idx] === ""
    ) {
      if (idx === 1) {
        fetchAll = true;
        // return; // comment this out
      } else {
        return;
      }
    }

    let fullQuery = `${searchValues["adjSearch"][idx]} ${searchValues["nounSearch"][idx]}`;
    let gallaryResults = { 60: [], 180: [], 300: [] };
    const drawingIDS = [];

    get(child(dbRef, `${profile}titles`))
      .then((snapshot) => {
        for (const index in Object.values(snapshot.val())) {
          let durationObj = Object.values(snapshot.val());
          for (const title of Object.keys(durationObj[index])) {
            if (title === fullQuery || fetchAll) {
              for (let drawingID of durationObj[index][title]["drawingID"]) {
                drawingIDS.push(drawingID);
                console.log("refeshing in Context");
                // console.log(Object.keys(snapshot.val())[index], gallaryResults, drawingID);
                gallaryResults[Object.keys(snapshot.val())[index]].push(
                  drawingID
                );
              }
            }
          }
        }
      })
      .then(() => {
        updateSearchValues("gallary", gallaryResults, idx);
        // this below is not currently being used.
        setPersistingUserGallary(drawingIDS);
      });
  }

  const context = {
    searchValues: searchValues,
    persistingUserGallary: persistingUserGallary,
    setPersistingUserGallary: setPersistingUserGallary,
    updateSearchValues: updateSearchValues,
    resetAllValues: resetAllValues,
    getGallary: getGallary,
  };

  return (
    <SearchContext.Provider value={context}>
      {props.children}
    </SearchContext.Provider>
  );
}

export default SearchContext;
