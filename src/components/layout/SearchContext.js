import { createContext, useEffect, useState } from "react";

import { getDatabase, get, ref, child } from "firebase/database";
import { app } from "../../util/init-firebase";

const SearchContext = createContext(null);

export function SearchProvider(props) {
  const [searchValues, setSearchValues] = useState({
    adjSearch: ["", "", ""],
    nounSearch: ["", "", ""],
    autofilledAdjectiveInput: ["", "", ""],
    autofilledNounInput: ["", "", ""],
    requestedAdjectives: [[], [], []],
    requestedNouns: [[], [], []],
    adjKeyboardNavigationIndex: [-1, -1, -1],
    nounKeyboardNavigationIndex: [-1, -1, -1],
    gallary: [null, null, null],
  });

  const [pageSelectorDetails, setPageSelectorDetails] = useState({
    currentPageNumber: [1, 1, 1],
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
      {
        60: 0,
        180: 0,
        300: 0,
      },
    ],
    durationToManuallyLoad: [null, null, null],
  });

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
    let tempSearchValues = { ...searchValues };

    tempSearchValues["adjSearch"][idx] = "";
    tempSearchValues["nounSearch"][idx] = "";
    tempSearchValues["autofilledAdjectiveInput"][idx] = "";
    tempSearchValues["autofilledNounInput"][idx] = "";
    tempSearchValues["requestedAdjectives"][idx] = [];
    tempSearchValues["requestedNouns"][idx] = [];
    tempSearchValues["adjKeyboardNavigationIndex"][idx] = -1;
    tempSearchValues["nounKeyboardNavigationIndex"][idx] = -1;
    tempSearchValues["gallary"][idx] = null;

    setSearchValues(tempSearchValues);
  }

  function resetPageSelectorDetails(idx) {
    updatePageSelectorDetails("currentPageNumber", 1, idx);
    updatePageSelectorDetails(
      "totalDrawingsByDuration",
      {
        60: 0,
        180: 0,
        300: 0,
      },
      idx
    );
    updatePageSelectorDetails("durationToManuallyLoad", null, idx);
  }

  function updatePageSelectorDetails(key, value, idx) {
    let tempValues = { ...pageSelectorDetails };
    let newValue = tempValues[key];
    newValue[idx] = value;

    tempValues[key] = newValue;
    setPageSelectorDetails(tempValues);
  }

  function getFlattenedIDs(fullTitles) {
    let flattenedIDs = [];

    for (const titles of Object.values(fullTitles)) {
      flattenedIDs.push(titles["drawingID"]);
    }
    return flattenedIDs.flat();
  }

  function getGallary(startIdx, endIdx, maxAllowed, idx, dbPath) {
    const dbRef = ref(getDatabase(app));

    let startIndex = startIdx;
    let endIndex = endIdx;

    let fetchAll = false;

    if (
      searchValues["adjSearch"][idx] === "" &&
      searchValues["nounSearch"][idx] === ""
    ) {
      if (idx !== 0) {
        fetchAll = true;
      } else {
        return;
      }
    }

    let fullQuery = `${searchValues["adjSearch"][idx]} ${searchValues["nounSearch"][idx]}`;

    let gallaryResults = { 60: [], 180: [], 300: [] };
    let totalDrawings = { 60: 0, 180: 0, 300: 0 };

    get(child(dbRef, dbPath))
      .then((snapshot) => {
        if (snapshot.exists()) {
          // will be null if title doesn't exist in duration
          let fullQuery60, fullQuery180, fullQuery300;

          // make this below into 3 calls each (use idx to see whether it's for profile or not)
          if (fetchAll) {
            fullQuery60 = snapshot.val()["60"];
            fullQuery180 = snapshot.val()["180"];
            fullQuery300 = snapshot.val()["300"];

            // CHANGE THIS LATER 100% JUST NEED TO MAKE IT WORK FIRST, maybe need to use refs
            // since the values like endIndex getting changed will matter to the whole...

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

                  gallaryResults["180"] = drawingIDs.slice(
                    startIndex,
                    endIndex
                  );

                  startIndex = 0;
                  endIndex = maxAllowed;
                }

                if (fullQuery300) {
                  let drawingIDs = getFlattenedIDs(Object.values(fullQuery300));
                  totalDrawings["300"] = drawingIDs.length;

                  gallaryResults["300"] = drawingIDs.slice(
                    startIndex,
                    endIndex
                  );

                  startIndex = 0;
                  endIndex = maxAllowed;
                }
              } else if (
                pageSelectorDetails["durationToManuallyLoad"][idx] === "180"
              ) {
                if (fullQuery180) {
                  let drawingIDs = getFlattenedIDs(Object.values(fullQuery180));
                  totalDrawings["180"] = drawingIDs.length;

                  gallaryResults["180"] = drawingIDs.slice(
                    startIndex,
                    endIndex
                  );

                  startIndex = 0;
                  endIndex = maxAllowed;
                }

                if (fullQuery300) {
                  let drawingIDs = getFlattenedIDs(Object.values(fullQuery300));
                  totalDrawings["300"] = drawingIDs.length;

                  gallaryResults["300"] = drawingIDs.slice(
                    startIndex,
                    endIndex
                  );

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

                  gallaryResults["300"] = drawingIDs.slice(
                    startIndex,
                    endIndex
                  );

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

                  gallaryResults["180"] = drawingIDs.slice(
                    startIndex,
                    endIndex
                  );

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
    manuallyLoadDurations: manuallyLoadDurations,
    pageSelectorDetails: pageSelectorDetails,
    updatePageSelectorDetails: updatePageSelectorDetails,
    updateSearchValues: updateSearchValues,
    resetAllValues: resetAllValues,
    resetPageSelectorDetails: resetPageSelectorDetails,
    getGallary: getGallary,
  };

  return (
    <SearchContext.Provider value={context}>
      {props.children}
    </SearchContext.Provider>
  );
}

export default SearchContext;
