import { createContext, useState, useEffect } from "react";

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
    submittedAdjectives: [[], [], []],
    submittedNouns: [[], [], []],
    adjKeyboardNavigationIndex: [-1, -1, -1],
    nounKeyboardNavigationIndex: [-1, -1, -1],
    anInputIsFocused: [false, false, false],
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

  function resetAllValues(idx) {
    let tempSearchValues = { ...searchValues };

    tempSearchValues["adjSearch"][idx] = "";
    tempSearchValues["nounSearch"][idx] = "";
    tempSearchValues["autofilledAdjectiveInput"][idx] = "";
    tempSearchValues["autofilledNounInput"][idx] = "";
    tempSearchValues["requestedAdjectives"][idx] = [];
    tempSearchValues["requestedNouns"][idx] = [];
    tempSearchValues["submittedAdjectives"][idx] = [];
    tempSearchValues["submittedNouns"][idx] = [];
    tempSearchValues["adjKeyboardNavigationIndex"][idx] = -1;
    tempSearchValues["nounKeyboardNavigationIndex"][idx] = -1;
    tempSearchValues["anInputIsFocused"][idx] = false;
    tempSearchValues["gallary"][idx] = null;

    setSearchValues(tempSearchValues);
  }

  function resetPageSelectorDetails(idx) {
    let tempPageSelectorDetails = { ...pageSelectorDetails };

    tempPageSelectorDetails["currentPageNumber"][idx] = 1;
    tempPageSelectorDetails["totalDrawingsByDuration"][idx] = {
      60: 0,
      180: 0,
      300: 0,
    };
    tempPageSelectorDetails["durationToManuallyLoad"][idx] = null;

    setPageSelectorDetails(tempPageSelectorDetails);
  }

  function updateSearchValues(key, value, idx) {
    let tempValues = { ...searchValues };
    let newValue = tempValues[key];
    newValue[idx] = value;

    tempValues[key] = newValue;
    setSearchValues(tempValues);
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
      idx !== 0 &&
      searchValues["submittedAdjectives"][idx].length === 0 &&
      searchValues["submittedNouns"][idx].length === 0
    ) {
      console.log("fetching all");
      fetchAll = true;
    }

    // if (
    //   // searchValues["adjSearch"][idx] === "" &&
    //   // searchValues["nounSearch"][idx] === ""
    //   searchValues["requestedAdjectives"][idx].length === 0 &&
    //   searchValues["requestedNouns"][idx].length === 0

    //   // AHHHHHHHHHH take deep fresh start tommorrow you are lahoosing your moind!!!
    //   // but don't worry I am 99% sure this isn't actually complex so you should be gucci ;3
    // ) {
    //   if (idx !== 0) {
    //     fetchAll = true;
    //   } else {
    //     return;
    //   }
    // }

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
        console.log("context", gallaryResults, totalDrawings);
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
