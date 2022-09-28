import React, { useRef, useEffect, useState, useContext } from "react";

import { useLocation } from "react-router-dom";

import SearchContext from "./SearchContext";
import GalleryList from "../galleries/GalleryList";
import UserList from "../galleries/UserList";
import AdjAutofillResults from "./AdjAutofillResults";
import NounAutofillResults from "./NounAutofillResults";
import UserResults from "../galleries/UserResults";

import GalleryIcon from "../../svgs/GalleryIcon";
import DefaultUserIcon from "../../svgs/DefaultUserIcon";

import { getDatabase, ref, onValue } from "firebase/database";

import { app } from "../../util/init-firebase";

import classes from "./Search.module.css";
import baseClasses from "../../index.module.css";

const Search = ({ dbPath, margin, idx, forModal }) => {
  const location = useLocation();
  const searchCtx = useContext(SearchContext);
  const db = getDatabase(app);

  const [resultsPerPage, setResultsPerPage] = useState(0);

  const [dbTitles, setDBTitles] = useState(null);
  const [users, setUsers] = useState(null);

  const [showAdjResults, setShowAdjResults] = useState(false);
  const [showNounResults, setShowNounResults] = useState(false);
  const [showUserResults, setShowUserResults] = useState(false);

  const [checkAdjPair, setCheckAdjPair] = useState(false);
  const [checkNounPair, setCheckNounPair] = useState(false);

  const [gallaryListStaticTitle, setGallaryListStaticTitle] = useState();

  const formContainerRef = useRef(null);
  const adjectiveInputRef = useRef();
  const nounInputRef = useRef();
  const userInputRef = useRef();

  const [dynamicNounMargin, setDynamicNounMargin] = useState(0);
  const [dynamicSearchMargin, setDynamicSearchMargin] = useState(0);

  const [adjInputFocused, setAdjInputFocused] = useState(false);
  const [nounInputFocused, setNounInputFocused] = useState(false);
  const [userInputFocused, setUserInputFocused] = useState(false);

  const [mobileWidthReached, setMobileWidthReached] = useState(false);
  const [inputsWereSubmitted, setInputsWereSubmitted] = useState(false);

  const [hoveringOnDrawingsSelector, setHoveringOnDrawingsSelector] =
    useState(false);
  const [hoveringOnUsersSelector, setHoveringOnUsersSelector] = useState(false);

  const [showDrawings, setShowDrawings] = useState(true);
  const [showUsers, setShowUsers] = useState(false);

  useEffect(() => {
    if (
      (adjInputFocused || nounInputFocused || userInputFocused) &&
      mobileWidthReached
    ) {
      formContainerRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [adjInputFocused, nounInputFocused, userInputFocused, mobileWidthReached]);

  function refreshAdjSearch(event) {
    searchCtx.updateSearchValues("adjSearch", event.target.value.trim(), idx);

    searchCtx.updateSearchValues("adjKeyboardNavigationIndex", -1, idx);
    setShowAdjResults(true);

    if (event.target.value === "") {
      setShowAdjResults(false);
    }
  }

  function refreshNounSearch(event) {
    searchCtx.updateSearchValues("nounSearch", event.target.value.trim(), idx);

    searchCtx.updateSearchValues("nounKeyboardNavigationIndex", -1, idx);
    setShowNounResults(true);

    if (event.target.value === "") {
      setShowNounResults(false);
    }
  }

  function refreshUserSearch(event) {
    searchCtx.updateUserSearchValues({
      userSearch: event.target.value,
      userKeyboardNavigationIndex: -1,
    });

    setShowUserResults(true);

    if (event.target.value === "") {
      setShowUserResults(false);
    }
  }

  useEffect(() => {
    // inital render
    if (window.innerWidth > 1250) {
      setResultsPerPage(15);
    } else if (window.innerWidth > 750) {
      setResultsPerPage(10);
    } else {
      setResultsPerPage(6);
    }

    if (window.innerWidth <= 650) {
      setMobileWidthReached(true);
    } else {
      setMobileWidthReached(false);
    }

    function resizeHandler(ev) {
      if (window.innerWidth > 1250) {
        setResultsPerPage(15);
      } else if (window.innerWidth > 750) {
        setResultsPerPage(10);
      } else {
        setResultsPerPage(6);
      }

      if (window.innerWidth <= 650) {
        setMobileWidthReached(true);
      } else {
        setMobileWidthReached(false);
      }
    }

    window.addEventListener("resize", resizeHandler);

    return () => {
      window.removeEventListener("resize", resizeHandler);
    };
  }, []);

  useEffect(() => {
    if (
      adjectiveInputRef.current?.value === "" &&
      nounInputRef.current?.value === ""
    ) {
      searchCtx.resetAllValues(idx);
    }
    return () => {
      searchCtx.resetUserSearchValues();
    };
  }, []);

  useEffect(() => {
    if (resultsPerPage !== 0) {
      if (
        idx !== 0 &&
        getSubmittedInputValues()["subAdjs"].length === 0 &&
        getSubmittedInputValues()["subNouns"].length === 0
      ) {
        searchCtx.getGallary(0, resultsPerPage, resultsPerPage, idx, dbPath);
      } else if (
        idx === 0 &&
        getSubmittedInputValues()["subAdjs"].length !== 0 &&
        getSubmittedInputValues()["subNouns"].length !== 0
      ) {
        searchCtx.getGallary(0, resultsPerPage, resultsPerPage, idx, dbPath);
      }
    }
  }, [resultsPerPage, idx, dbPath]);

  function getSubmittedInputValues() {
    return {
      subAdjs: searchCtx.searchValues["submittedAdjectives"][idx],
      subNouns: searchCtx.searchValues["submittedNouns"][idx],
    };
  }

  useEffect(() => {
    searchCtx.updateSearchValues(
      "anInputIsFocused",
      adjInputFocused || nounInputFocused,
      idx
    );
  }, [adjInputFocused, nounInputFocused, idx]);

  useEffect(() => {
    searchCtx.updateUserSearchValues({ inputIsFocused: userInputFocused });
  }, [userInputFocused]);

  useEffect(() => {
    if (formContainerRef.current !== null) {
      if (
        window
          .getComputedStyle(formContainerRef.current)
          .getPropertyValue("flex-direction") === "column"
      ) {
        if (showAdjResults && !showNounResults) {
          let adjustedMargin;

          if (searchCtx.searchValues["requestedAdjectives"][idx].length === 0) {
            adjustedMargin = 32;
          } else {
            adjustedMargin =
              searchCtx.searchValues["requestedAdjectives"][idx].length * 32;
          }
          setDynamicNounMargin(`${adjustedMargin}px`);

          setDynamicSearchMargin(0); // resetting other margin
        } else if (!showAdjResults && showNounResults) {
          let adjustedMargin;

          if (searchCtx.searchValues["requestedNouns"][idx].length === 0) {
            adjustedMargin = 32;
          } else {
            adjustedMargin =
              searchCtx.searchValues["requestedNouns"][idx].length * 32;
          }
          setDynamicSearchMargin(`${adjustedMargin}px`);

          setDynamicNounMargin(0); // resetting other margin
        } else if (!showAdjResults && !showNounResults) {
          setDynamicSearchMargin(0);
          setDynamicNounMargin(0);
        }
      }
    }
  }, [showAdjResults, showNounResults, searchCtx.searchValues, idx]);

  useEffect(() => {
    // arrowup/down event autofillHandlers

    function arrowKeyHandler(e) {
      // copying context values into smaller, more managable variable names
      let adjIdx = searchCtx.searchValues["adjKeyboardNavigationIndex"][idx];
      let nounIdx = searchCtx.searchValues["nounKeyboardNavigationIndex"][idx];
      let userIdx = searchCtx.userSearchValues["userKeyboardNavigationIndex"];

      let adjResults = searchCtx.searchValues["requestedAdjectives"][idx];
      let nounResults = searchCtx.searchValues["requestedNouns"][idx];
      let userResults = searchCtx.userSearchValues["requestedUsers"];

      if (e.key === "ArrowDown") {
        if (showAdjResults) {
          e.preventDefault();
          if (adjIdx < adjResults.length - 1) {
            if (adjResults[adjIdx + 1] === "related") {
              searchCtx.updateSearchValues(
                "adjKeyboardNavigationIndex",
                adjIdx + 2,
                idx
              );
            } else {
              searchCtx.updateSearchValues(
                "adjKeyboardNavigationIndex",
                adjIdx + 1,
                idx
              );
            }
          }
        } else if (showNounResults) {
          e.preventDefault();

          if (nounIdx < nounResults.length - 1) {
            if (nounResults[nounIdx + 1] === "related") {
              searchCtx.updateSearchValues(
                "nounKeyboardNavigationIndex",
                nounIdx + 2,
                idx
              );
            } else {
              searchCtx.updateSearchValues(
                "nounKeyboardNavigationIndex",
                nounIdx + 1,
                idx
              );
            }
          }
        } else if (showUserResults) {
          e.preventDefault();

          if (userIdx < userResults.length - 1) {
            searchCtx.updateUserSearchValues({
              userKeyboardNavigationIndex: userIdx + 1,
            });
          }
        }
      } else if (e.key === "ArrowUp") {
        if (showAdjResults) {
          e.preventDefault();

          if (adjIdx > 0 && adjIdx < adjResults.length) {
            if (adjResults[adjIdx - 1] === "related") {
              searchCtx.updateSearchValues(
                "adjKeyboardNavigationIndex",
                adjIdx - 2,
                idx
              );
            } else {
              searchCtx.updateSearchValues(
                "adjKeyboardNavigationIndex",
                adjIdx - 1,
                idx
              );
            }
          }
        } else if (showNounResults) {
          e.preventDefault();

          if (nounIdx > 0 && nounIdx < nounResults.length) {
            if (nounResults[nounIdx - 1] === "related") {
              searchCtx.updateSearchValues(
                "nounKeyboardNavigationIndex",
                nounIdx - 2,
                idx
              );
            } else {
              searchCtx.updateSearchValues(
                "nounKeyboardNavigationIndex",
                nounIdx - 1,
                idx
              );
            }
          }
        } else if (showUserResults) {
          e.preventDefault();

          if (userIdx > 0 && userIdx < userResults.length) {
            searchCtx.updateUserSearchValues({
              userKeyboardNavigationIndex: userIdx - 1,
            });
          }
        }
      }

      if (e.key === "Enter") {
        if (showAdjResults) {
          e.preventDefault();

          setShowAdjResults(false);

          if (adjIdx !== -1) {
            searchCtx.updateSearchValues(
              "autofilledAdjectiveInput",
              adjResults[adjIdx],
              idx
            );
          }
        } else if (showNounResults) {
          e.preventDefault();

          setShowNounResults(false);

          if (nounIdx !== -1) {
            searchCtx.updateSearchValues(
              "autofilledNounInput",
              nounResults[nounIdx],
              idx
            );
          }
        } else if (showUserResults) {
          e.preventDefault();

          setShowUserResults(false);

          if (userIdx !== -1) {
            searchCtx.updateUserSearchValues({
              autofilledUserInput: userResults[userIdx],
            });
          }
        }
      }

      if (e.key === "Escape") {
        e.preventDefault();

        setShowAdjResults(false);
        setShowNounResults(false);
        setShowUserResults(false);
      }
    }

    document.addEventListener("keydown", arrowKeyHandler);

    return () => {
      document.removeEventListener("keydown", arrowKeyHandler);
    };
  }, [
    idx,
    showAdjResults,
    showNounResults,
    showUserResults,
    searchCtx.searchValues,
    searchCtx.userSearchValues,
  ]);

  useEffect(() => {
    if (showDrawings && !showUsers) {
      adjectiveInputRef.current.value = "";
      nounInputRef.current.value = "";

      searchCtx.resetAllValues(idx);

      onValue(ref(db, dbPath), (snapshot) => {
        if (snapshot.exists()) {
          setDBTitles(snapshot.val());
        }
      });

      adjectiveInputRef.current.addEventListener("input", refreshAdjSearch);
      nounInputRef.current.addEventListener("input", refreshNounSearch);

      let cleanupAdjInputRef = adjectiveInputRef.current;
      let cleanupNInpRef = nounInputRef.current;
      return () => {
        cleanupAdjInputRef.removeEventListener("input", refreshAdjSearch);
        cleanupNInpRef.removeEventListener("input", refreshNounSearch);
      };
    } else if (!showDrawings && showUsers) {
      userInputRef.current.value = "";

      searchCtx.resetUserSearchValues();

      onValue(ref(db, "users"), (snapshot) => {
        if (snapshot.exists()) {
          setUsers(snapshot.val());
        }
      });

      userInputRef.current.addEventListener("input", refreshUserSearch);

      let cleanupUserInputRef = userInputRef.current;
      return () => {
        cleanupUserInputRef.removeEventListener("input", refreshUserSearch);
      };
    }
  }, [dbPath, idx, showDrawings, showUsers]);

  useEffect(() => {
    if (searchCtx.searchValues["autofilledAdjectiveInput"][idx].length > 0) {
      adjectiveInputRef.current.value =
        searchCtx.searchValues["autofilledAdjectiveInput"][idx];

      searchCtx.updateSearchValues(
        "adjSearch",
        searchCtx.searchValues["autofilledAdjectiveInput"][idx],
        idx
      );

      searchCtx.updateSearchValues("autofilledAdjectiveInput", "", idx);
    }
  }, [searchCtx.searchValues["autofilledAdjectiveInput"][idx], idx]);

  useEffect(() => {
    if (searchCtx.searchValues["autofilledNounInput"][idx].length > 0) {
      nounInputRef.current.value =
        searchCtx.searchValues["autofilledNounInput"][idx];

      searchCtx.updateSearchValues(
        "nounSearch",
        searchCtx.searchValues["autofilledNounInput"][idx],
        idx
      );

      searchCtx.updateSearchValues("autofilledNounInput", "", idx);
    }
  }, [searchCtx.searchValues["autofilledNounInput"][idx], idx]);

  useEffect(() => {
    if (showUsers) {
      if (searchCtx.userSearchValues["autofilledUserInput"].length > 0) {
        userInputRef.current.value =
          searchCtx.userSearchValues["autofilledUserInput"];

        searchCtx.updateUserSearchValues({
          userSearch: searchCtx.userSearchValues["autofilledUserInput"],
          autofilledUserInput: "",
        });
      }
    }
  }, [searchCtx.userSearchValues["autofilledUserInput"], showUsers]);

  let autofillHandler = (event, isFocusing = null, target = null) => {
    let focusedInsideAdjInput, focusedInsideNounInput, focusedInsideUserInput;

    if (isFocusing) {
      if (target === "adj") {
        focusedInsideAdjInput = true;
      } else if (target === "noun") {
        focusedInsideNounInput = true;
      } else if (target === "user") {
        focusedInsideUserInput = true;
      }
    } else if (isFocusing === false) {
      if (target === "adj") {
        focusedInsideAdjInput = false;
      } else if (target === "noun") {
        focusedInsideNounInput = false;
      } else if (target === "user") {
        focusedInsideUserInput = false;
      }
    } else {
      if (showDrawings && !showUsers) {
        focusedInsideAdjInput = adjectiveInputRef.current.contains(
          event.target
        );
        focusedInsideNounInput = nounInputRef.current.contains(event.target);
      } else if (!showDrawings && showUsers) {
        focusedInsideUserInput = userInputRef.current.contains(event.target);
      }
    }

    // user handling
    if (target === "user") {
      if (!focusedInsideUserInput) {
        setShowUserResults(false);
        searchCtx.updateUserSearchValues({ userKeyboardNavigationIndex: -1 });
      } else {
        if (userInputRef.current.value.trim().length !== 0) {
          if (
            searchCtx.userSearchValues["requestedUsers"][0]?.toLowerCase() !==
            userInputRef.current.value.trim()?.toLowerCase()
          ) {
            setShowUserResults(true);
          }
        }
      }
    } else {
      // adjective handling

      // hiding results and resetting context
      if (!focusedInsideAdjInput) {
        setShowAdjResults(false);
        setCheckAdjPair(false);
        searchCtx.updateSearchValues("adjKeyboardNavigationIndex", -1, idx);
      } else {
        if (
          adjectiveInputRef.current.value.trim().length === 0 &&
          nounInputRef.current.value.trim().length !== 0
        ) {
          setCheckAdjPair(true);
          setShowAdjResults(true);
        } else if (
          adjectiveInputRef.current.value.trim().length !== 0 &&
          nounInputRef.current.value.trim().length === 0
        ) {
          // checking to see if currently input value is equal to the one that is going to be suggested,
          // if it isn't, show the suggestion
          if (
            searchCtx.searchValues["requestedAdjectives"][
              idx
            ][0]?.toLowerCase() !==
            adjectiveInputRef.current.value.trim()?.toLowerCase()
          ) {
            setShowAdjResults(true);
          }
        }
      }

      // noun handling

      // hiding results and resetting context
      if (!focusedInsideNounInput) {
        setShowNounResults(false);
        setCheckNounPair(false);
        searchCtx.updateSearchValues("nounKeyboardNavigationIndex", -1, idx);
      } else {
        if (
          nounInputRef.current.value.trim().length === 0 &&
          adjectiveInputRef.current.value.trim().length !== 0
        ) {
          setCheckNounPair(true);
          setShowNounResults(true);
        } else if (
          nounInputRef.current.value.trim().length !== 0 &&
          adjectiveInputRef.current.value.trim().length === 0
        ) {
          // checking to see if currently input value is equal to the one that is going to be suggested,
          // if it isn't, show the suggestion
          if (
            searchCtx.searchValues["requestedNouns"][idx][0].toLowerCase() !==
            nounInputRef.current.value.trim().toLowerCase()
          ) {
            setShowNounResults(true);
          }
        }
      }
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", autofillHandler);
    return () => {
      document.removeEventListener("mousedown", autofillHandler);
    };
  }, [showDrawings, showUsers]);

  useEffect(() => {
    if (inputsWereSubmitted) {
      setInputsWereSubmitted(false);

      searchCtx.updatePageSelectorDetails("durationToManuallyLoad", null, idx);

      searchCtx.getGallary(0, resultsPerPage, resultsPerPage, idx, dbPath);

      setGallaryListStaticTitle(
        `${searchCtx.searchValues["adjSearch"][idx]} ${searchCtx.searchValues["nounSearch"][idx]}`
      );

      // clearing autofill + related context values
      searchCtx.updateSearchValues("autofilledAdjectiveInput", "", idx);
      searchCtx.updateSearchValues("autofilledNounInput", "", idx);
      searchCtx.updateSearchValues("requestedAdjectives", [], idx);
      searchCtx.updateSearchValues("requestedNouns", [], idx);
    }
  }, [
    inputsWereSubmitted,
    searchCtx.searchValues,
    idx,
    dbPath,
    resultsPerPage,
  ]);

  function prepGallarySearch(event) {
    event.preventDefault();

    // may want to do a {...searchCtx.searchValues}
    // and update manually as opposed to two separate calls here
    searchCtx.updateSearchValues(
      "submittedAdjectives",
      adjectiveInputRef.current.value,
      idx
    );
    searchCtx.updateSearchValues(
      "submittedNouns",
      nounInputRef.current.value,
      idx
    );

    if (idx !== 0) {
      setInputsWereSubmitted(true);
    } else {
      if (
        adjectiveInputRef.current.value.length !== 0 ||
        nounInputRef.current.value.length !== 0
      ) {
        setInputsWereSubmitted(true);
      } else {
        searchCtx.resetAllValues(idx);
      }
    }
  }

  function prepUserSearch(event) {
    event.preventDefault();

    searchCtx.updateUserSearchValues({
      submittedUsers: userInputRef.current.value,
    });

    // maybe do && searchCtx.userSearchValues("requestedUsers").length === 0 too?
    if (userInputRef.current.value.length !== 0) {
      searchCtx.getUsers();

      // clearing autofill + related context values
      searchCtx.updateUserSearchValues({
        autofilledUserInput: "",
        requestedUsers: [],
      });
    } else {
      searchCtx.resetUserSearchValues();
    }
  }

  return (
    <>
      {location.pathname === "/explore" && !forModal && (
        <div style={{ gap: "2em" }} className={baseClasses.baseFlex}>
          <button
            style={{
              gap: ".5em",

              backgroundColor:
                showDrawings || hoveringOnDrawingsSelector
                  ? "#ff7e31"
                  : "rgb(240,240,240)",
              transition: "all 200ms",
            }}
            className={`${classes.searchTypeSelectorButton} ${baseClasses.baseFlex}`}
            onClick={() => {
              setShowDrawings(true);
              setShowUsers(false);
              setHoveringOnUsersSelector(false);
            }}
            onMouseEnter={() => {
              setHoveringOnDrawingsSelector(true);
            }}
            onMouseLeave={() => {
              if (!showDrawings) {
                setHoveringOnDrawingsSelector(false);
              }
            }}
          >
            <GalleryIcon
              dimensions={"1.25em"}
              color={
                showDrawings || hoveringOnDrawingsSelector ? "white" : "black"
              }
            />

            <div
              style={{
                color:
                  showDrawings || hoveringOnDrawingsSelector
                    ? "white"
                    : "black",
                transition: "all 200ms",
              }}
            >
              Drawings
            </div>
          </button>

          <button
            style={{
              gap: ".5em",

              backgroundColor:
                showUsers || hoveringOnUsersSelector
                  ? "#ff7e31"
                  : "rgb(240,240,240)",
              transition: "all 200ms",
            }}
            className={`${classes.searchTypeSelectorButton} ${baseClasses.baseFlex}`}
            onClick={() => {
              setShowUsers(true);
              setShowDrawings(false);
              setHoveringOnDrawingsSelector(false);
            }}
            onMouseEnter={() => {
              setHoveringOnUsersSelector(true);
            }}
            onMouseLeave={() => {
              if (!showUsers) {
                setHoveringOnUsersSelector(false);
              }
            }}
          >
            <DefaultUserIcon
              dimensions={"1.25em"}
              color={showUsers || hoveringOnUsersSelector ? "white" : "black"}
            />
            <div
              style={{
                color: showUsers || hoveringOnUsersSelector ? "white" : "black",
                transition: "all 200ms",
              }}
            >
              Users
            </div>
          </button>
        </div>
      )}

      {showDrawings ? (
        <>
          <form
            ref={formContainerRef}
            className={classes.formContainer}
            onSubmit={prepGallarySearch}
          >
            <div className={classes.searchContainer}>
              <input
                className={classes.searchInput}
                id="adj"
                ref={adjectiveInputRef}
                onFocus={(e) => {
                  setAdjInputFocused(true);
                  autofillHandler(e, true, "adj");
                }}
                onBlur={(e) => {
                  setAdjInputFocused(false);
                  autofillHandler(e, false, "adj");
                }}
                autoComplete="off"
                required
              ></input>
              <label>Adjective</label>
              <div className={showAdjResults ? classes.show : classes.hide}>
                <AdjAutofillResults
                  titles={dbTitles}
                  checkForPair={checkAdjPair}
                  idx={idx}
                />
              </div>
            </div>
            <div
              style={{
                marginTop: dynamicNounMargin,
                transition: "all 200ms",
              }}
              className={classes.searchContainer}
            >
              <input
                className={classes.searchInput}
                id="noun"
                ref={nounInputRef}
                onFocus={(e) => {
                  setNounInputFocused(true);
                  autofillHandler(e, true, "noun");
                }}
                onBlur={(e) => {
                  setNounInputFocused(false);
                  autofillHandler(e, false, "noun");
                }}
                autoComplete="off"
                required
              ></input>
              <label>Noun</label>
              <div className={showNounResults ? classes.show : classes.hide}>
                <NounAutofillResults
                  titles={dbTitles}
                  checkForPair={checkNounPair}
                  idx={idx}
                />
              </div>
            </div>
            <button
              style={{
                marginTop: dynamicSearchMargin,
                transition: "all 200ms",
              }}
              formNoValidate
              className={baseClasses.activeButton}
            >
              Search
            </button>
          </form>

          <GalleryList
            drawingIDs={searchCtx.searchValues["gallary"][idx]}
            dbPath={dbPath}
            title={gallaryListStaticTitle}
            margin={margin}
            databasePath={dbPath}
            idx={idx}
            forModal={forModal}
          />
        </>
      ) : (
        <>
          <form
            ref={formContainerRef}
            className={classes.formContainer}
            onSubmit={prepUserSearch}
          >
            <div className={classes.searchContainer}>
              <input
                className={classes.searchInput}
                id="username"
                ref={userInputRef}
                onFocus={(e) => {
                  setUserInputFocused(true);
                  autofillHandler(e, true, "user");
                }}
                onBlur={(e) => {
                  setUserInputFocused(false);
                  autofillHandler(e, false, "user");
                }}
                autoComplete="off"
                spellCheck="false"
                required
              ></input>
              <label>Username</label>
              <div className={showUserResults ? classes.show : classes.hide}>
                <UserResults users={users} />
              </div>
            </div>

            <button
              style={{
                marginTop: dynamicSearchMargin,
                transition: "all 200ms",
              }}
              formNoValidate
              className={baseClasses.activeButton}
            >
              Search
            </button>
          </form>

          <UserList
            userIDs={searchCtx.userSearchValues["userIDList"]}
            username={"test"} // change this to be actual username prob
            margin={margin}
            databasePath={dbPath}
            idx={idx}
          />
        </>
      )}
    </>
  );
};

export default React.memo(Search);
