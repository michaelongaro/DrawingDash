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

  // const [durationToManuallyLoad, setDurationToManuallyLoad] = useState(null);

  const [pageSelectorDetails, setPageSelectorDetails] = useState({
    currentPageNumber: [1, 1],
    totalDrawingsByDuration: [
      {
        60: 0,
        180: 0,
        300: 0,
      },
      {
        60: 0,
        180: 0,
        300: 0,
      },
    ],
    durationToManuallyLoad: [null, null],
  });

  const [persistingUserGallary, setPersistingUserGallary] = useState([]);

  function manuallyLoadDurations(idx) {
    if (pageSelectorDetails["durationToManuallyLoad"][idx] === "60") {
      return [true, false, false];
    } else if (pageSelectorDetails["durationToManuallyLoad"][idx] === "180") {
      return [false, true, false];
    } else if (pageSelectorDetails["durationToManuallyLoad"][idx] === "300") {
      return [false, false, true];
    }
  }

  function updateSearchValues(key, value, idx) {
    let tempValues = { ...searchValues };
    let newValue = tempValues[key];
    newValue[idx] = value;

    tempValues[key] = newValue;
    setSearchValues(tempValues);
  }

  function resetAllValues(idx) {
    updateSearchValues("adjSearch", "", idx);
    updateSearchValues("nounSearch", "", idx);
    updateSearchValues("autofilledAdjectiveInput", "", idx);
    updateSearchValues("autofilledNounInput", "", idx);
    updateSearchValues("requestedAdjectives", [], idx);
    updateSearchValues("requestedNouns", [], idx);
    updateSearchValues("gallary", null, idx);
  }

  function getFlattenedIDs(fullTitles) {
    let flattenedIDs = [];
    console.log("undefined values...", Object.values(fullTitles));
    for (const titles of Object.values(fullTitles)) {
      // console.log(titles["drawingID"]);
      flattenedIDs.push(titles["drawingID"]);
    }
    return flattenedIDs.flat();
  }

  function updatePageSelectorDetails(key, value, idx) {
    let tempValues = { ...pageSelectorDetails };
    let newValue = tempValues[key];
    newValue[idx] = value;

    tempValues[key] = newValue;
    console.log("updated pageselectorDetails with", value);
    setPageSelectorDetails(tempValues);
  }

  function getGallary(startIdx, endIdx, maxAllowed, profile = "") {
    console.log("called with", startIdx, endIdx, maxAllowed);
    const dbRef = ref(getDatabase(app));

    let startIndex = startIdx;
    let endIndex = endIdx;

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
    let totalDrawings = { 60: 0, 180: 0, 300: 0 };

    // setDurationToManuallyLoad(null);

    get(child(dbRef, `${profile}titles`))
      .then((snapshot) => {
        // will be null if title doesn't exist in duration
        let fullQuery60, fullQuery180, fullQuery300;

        // make this below into 3 calls each (use idx to see whether it's for profile or not)
        if (fetchAll) {
          console.log(fetchAll, profile);
          fullQuery60 = snapshot.val()["60"];
          fullQuery180 = snapshot.val()["180"];
          fullQuery300 = snapshot.val()["300"];

          // console.log(fullQuery60);
          // console.log(fullQuery180);
          // console.log(fullQuery300);

          // CHANGE THIS LATER 100% JUST NEED TO MAKE IT WORK FIRST
          console.log(
            "called with",
            pageSelectorDetails["durationToManuallyLoad"][idx]
          );
          console.log(
            "called with",
            pageSelectorDetails["durationToManuallyLoad"][idx]
          );

          if (pageSelectorDetails["durationToManuallyLoad"][idx]) {
            if (pageSelectorDetails["durationToManuallyLoad"][idx] === "60") {
              if (fullQuery60) {
                let drawingIDs = getFlattenedIDs(Object.values(fullQuery60));
                totalDrawings["60"] = drawingIDs.length;

                gallaryResults["60"] = drawingIDs.slice(startIndex, endIndex);

                startIndex = 0;
                endIndex = maxAllowed;
              }

              if (fullQuery180) {
                let drawingIDs = getFlattenedIDs(Object.values(fullQuery180));
                totalDrawings["180"] = drawingIDs.length;

                gallaryResults["180"] = drawingIDs.slice(startIndex, endIndex);

                startIndex = 0;
                endIndex = maxAllowed;
              }

              if (fullQuery300) {
                let drawingIDs = getFlattenedIDs(Object.values(fullQuery300));
                totalDrawings["300"] = drawingIDs.length;

                gallaryResults["300"] = drawingIDs.slice(startIndex, endIndex);

                startIndex = 0;
                endIndex = maxAllowed;
              }
            } else if (
              pageSelectorDetails["durationToManuallyLoad"][idx] === "180"
            ) {
              if (fullQuery180) {
                let drawingIDs = getFlattenedIDs(Object.values(fullQuery180));
                totalDrawings["180"] = drawingIDs.length;

                gallaryResults["180"] = drawingIDs.slice(startIndex, endIndex);

                startIndex = 0;
                endIndex = maxAllowed;
              }

              if (fullQuery300) {
                let drawingIDs = getFlattenedIDs(Object.values(fullQuery300));
                totalDrawings["300"] = drawingIDs.length;

                gallaryResults["300"] = drawingIDs.slice(startIndex, endIndex);

                startIndex = 0;
                endIndex = maxAllowed;
              }
              if (fullQuery60) {
                let drawingIDs = getFlattenedIDs(Object.values(fullQuery60));
                totalDrawings["60"] = drawingIDs.length;

                gallaryResults["60"] = drawingIDs.slice(startIndex, endIndex);

                startIndex = 0;
                endIndex = maxAllowed;
              }
            } else if (
              pageSelectorDetails["durationToManuallyLoad"][idx] === "300"
            ) {
              if (fullQuery300) {
                let drawingIDs = getFlattenedIDs(Object.values(fullQuery300));
                totalDrawings["300"] = drawingIDs.length;

                gallaryResults["300"] = drawingIDs.slice(startIndex, endIndex);

                startIndex = 0;
                endIndex = maxAllowed;
              }
              if (fullQuery60) {
                let drawingIDs = getFlattenedIDs(Object.values(fullQuery60));
                totalDrawings["60"] = drawingIDs.length;

                gallaryResults["60"] = drawingIDs.slice(startIndex, endIndex);

                startIndex = 0;
                endIndex = maxAllowed;
              }

              if (fullQuery180) {
                let drawingIDs = getFlattenedIDs(Object.values(fullQuery180));
                totalDrawings["180"] = drawingIDs.length;

                gallaryResults["180"] = drawingIDs.slice(startIndex, endIndex);

                startIndex = 0;
                endIndex = maxAllowed;
              }
            }
          } else {
            if (fullQuery60) {
              let drawingIDs = getFlattenedIDs(Object.values(fullQuery60));
              totalDrawings["60"] = drawingIDs.length;

              gallaryResults["60"] = drawingIDs.slice(startIndex, endIndex);

              startIndex = 0;
              endIndex = maxAllowed;
            }

            if (fullQuery180) {
              let drawingIDs = getFlattenedIDs(Object.values(fullQuery180));
              totalDrawings["180"] = drawingIDs.length;

              gallaryResults["180"] = drawingIDs.slice(startIndex, endIndex);

              startIndex = 0;
              endIndex = maxAllowed;
            }

            if (fullQuery300) {
              let drawingIDs = getFlattenedIDs(Object.values(fullQuery300));
              totalDrawings["300"] = drawingIDs.length;

              gallaryResults["300"] = drawingIDs.slice(startIndex, endIndex);

              startIndex = 0;
              endIndex = maxAllowed;
            }
          }
        } else {
          fullQuery60 = snapshot.val()["60"][fullQuery]?.drawingID;
          fullQuery180 = snapshot.val()["180"][fullQuery]?.drawingID;
          fullQuery300 = snapshot.val()["300"][fullQuery]?.drawingID;

          if (fullQuery60) {
            totalDrawings["60"] = Object.keys(fullQuery60).length;

            gallaryResults["60"] = fullQuery60.slice(startIndex, endIndex);

            startIndex = 0;
            endIndex = maxAllowed;
          }

          if (fullQuery180) {
            totalDrawings["180"] = Object.keys(fullQuery180).length;

            gallaryResults["180"] = fullQuery180.slice(startIndex, endIndex);

            startIndex = 0;
            endIndex = maxAllowed;
          }

          if (fullQuery300) {
            totalDrawings["300"] = Object.keys(fullQuery300).length;

            gallaryResults["300"] = fullQuery300.slice(startIndex, endIndex);

            startIndex = 0;
            endIndex = maxAllowed;
          }
        }
      })
      .then(() => {
        updateSearchValues("gallary", gallaryResults, idx);

        updatePageSelectorDetails(
          "totalDrawingsByDuration",
          totalDrawings,
          idx
        );
      });
  }

  const context = {
    searchValues: searchValues,
    persistingUserGallary: persistingUserGallary,
    // durationToManuallyLoad: durationToManuallyLoad,
    // setDurationToManuallyLoad: setDurationToManuallyLoad,
    manuallyLoadDurations: manuallyLoadDurations,
    pageSelectorDetails: pageSelectorDetails,
    updatePageSelectorDetails: updatePageSelectorDetails,
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
