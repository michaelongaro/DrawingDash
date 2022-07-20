import { createContext, useState, useEffect } from "react";

import { useAuth0 } from "@auth0/auth0-react";

import isEqual from "lodash/isEqual";
import isEmpty from "lodash/isEmpty";

import {
  getDatabase,
  get,
  set,
  ref,
  child,
  update,
  remove,
  onValue,
} from "firebase/database";

import { app } from "../../util/init-firebase";

import classes from "./PinnedContext.module.css";

const PinnedContext = createContext(null);

export function PinnedProvider(props) {
  const { user, isLoading, isAuthenticated } = useAuth0();
  const db = getDatabase(app);
  const dbRef = ref(getDatabase(app));

  // change all variable names with drawingID to drawingIDIDs...

  // deal with this later, turn into one obj
  const [show60, setShow60] = useState({ display: "none" });
  const [show180, setShow180] = useState({ display: "none" });
  const [show300, setShow300] = useState({ display: "none" });

  const [user60DrawingIDs, setUser60DrawingIDs] = useState([]);
  const [user180DrawingIDs, setUser180DrawingIDs] = useState([]);
  const [user300DrawingIDs, setUser300DrawingIDs] = useState([]);

  const [selectedPinnedDrawingIDs, setSelectedPinnedDrawingIDs] = useState({
    60: "",
    180: "",
    300: "",
  });

  const [pinnedDrawingIDs, setPinnedDrawingIDs] = useState({
    60: "",
    180: "",
    300: "",
  });

  const [highlightedDrawingIDs, setHighlightedDrawingIDs] = useState({
    60: [],
    180: [],
    300: [],
  });

  const [userDrawingIDs, setUserDrawingIDs] = useState({
    60: [],
    180: [],
    300: [],
  });

  const [manuallyChangedSelectedDrawing, setManuallyChangedSelectedDrawing] =
    useState(false);

  function updateSelectedPinnedDrawingIDs(drawingID, seconds) {
    let tempPinned = { ...selectedPinnedDrawingIDs };
    tempPinned[seconds] = drawingID;
    setSelectedPinnedDrawingIDs(tempPinned);
  }

  function updateDatabase(updatedPinnedDrawingIDs) {
    set(ref(db, `users/${user.sub}/pinnedArt`), updatedPinnedDrawingIDs);
  }

  function searchIndexOfPinned(drawingIDsArray, seconds) {
    for (const idx in drawingIDsArray) {
      if (isEqual(pinnedDrawingIDs[seconds], drawingIDsArray[idx])) {
        return idx;
      }
    }
  }

  function resetAllAndHighlightNew(seconds, idx) {
    let tempHighlighted = Array(highlightedDrawingIDs[seconds].length).fill("");

    tempHighlighted[idx] = classes.highlighted;

    let tempHighlightedDrawingIDs = { ...highlightedDrawingIDs };
    tempHighlightedDrawingIDs[seconds] = tempHighlighted;
    setHighlightedDrawingIDs(tempHighlightedDrawingIDs);
  }

  function resetAllAndHighlightNewInit() {
    let tempHighlightedDrawingIDs = { ...highlightedDrawingIDs };
    let seconds = [60, 180, 300];
    for (const duration of seconds) {
      let tempHighlighted = Array(highlightedDrawingIDs[duration].length).fill(
        ""
      );

      if (tempHighlighted.length > 0) {
        tempHighlighted[
          searchIndexOfPinned(userDrawingIDs[duration], duration)
        ] = classes.highlighted;
      }

      tempHighlightedDrawingIDs[duration] = tempHighlighted;
    }
    setHighlightedDrawingIDs(tempHighlightedDrawingIDs);
  }

  function hideAllModals() {
    setShow60({ display: "none" });
    setShow180({ display: "none" });
    setShow300({ display: "none" });
    resetAllAndHighlightNewInit();
  }

  useEffect(() => {
    if (!isEmpty(userDrawingIDs)) {
      if (
        (!isEmpty(userDrawingIDs["60"]) && !isEmpty(pinnedDrawingIDs["60"])) ||
        (!isEmpty(userDrawingIDs["180"]) &&
          !isEmpty(pinnedDrawingIDs["180"])) ||
        (!isEmpty(userDrawingIDs["300"]) && !isEmpty(pinnedDrawingIDs["300"]))
      ) {
        resetAllAndHighlightNewInit();
      }
    }
  }, [userDrawingIDs, pinnedDrawingIDs]);

  useEffect(() => {
    // if at least one duration has drawingIDs
    if (
      !isEmpty(user60DrawingIDs) ||
      !isEmpty(user180DrawingIDs) ||
      !isEmpty(user300DrawingIDs)
    ) {
      setHighlightedDrawingIDs({
        60: user60DrawingIDs,
        180: user180DrawingIDs,
        300: user300DrawingIDs,
      });
      setUserDrawingIDs({
        60: user60DrawingIDs,
        180: user180DrawingIDs,
        300: user300DrawingIDs,
      });
    }
  }, [user60DrawingIDs, user180DrawingIDs, user300DrawingIDs]);

  useEffect(() => {
    if ((!isLoading, isAuthenticated)) {
      // look into just changing this to onValue, (didn't want to deal with potential side effects
      // with logic that is already there)
      get(child(dbRef, `users/${user.sub}/pinnedArt`)).then((snapshot) => {
        if (snapshot.exists() && !isEqual(snapshot.val(), pinnedDrawingIDs)) {
          setPinnedDrawingIDs(snapshot.val());
          // need to set this if not all duration's pinned drawingIDs
          // are changed before posting to db
          setSelectedPinnedDrawingIDs(snapshot.val());
        }
      });
    }
  }, [isLoading, isAuthenticated]);

  const context = {
    show60: show60,
    show180: show180,
    show300: show300,
    userDrawingIDs: userDrawingIDs,
    pinnedDrawingIDs: pinnedDrawingIDs,
    highlightedDrawingIDs: highlightedDrawingIDs,
    selectedPinnedDrawingIDs: selectedPinnedDrawingIDs,
    manuallyChangedSelectedDrawing: manuallyChangedSelectedDrawing,
    setManuallyChangedSelectedDrawing: setManuallyChangedSelectedDrawing,
    setShow60: setShow60,
    setShow180: setShow180,
    setShow300: setShow300,
    setUser60DrawingIDs: setUser60DrawingIDs,
    setUser180DrawingIDs: setUser180DrawingIDs,
    setUser300DrawingIDs: setUser300DrawingIDs,
    setUserDrawingIDs: setUserDrawingIDs,
    setPinnedDrawingIDs: setPinnedDrawingIDs,
    updateSelectedPinnedDrawingIDs: updateSelectedPinnedDrawingIDs,
    updateDatabase: updateDatabase,
    resetAllAndHighlightNew: resetAllAndHighlightNew,
    resetAllAndHighlightNewInit: resetAllAndHighlightNewInit,
    hideAllModals: hideAllModals,
  };

  return (
    <PinnedContext.Provider value={context}>
      {props.children}
    </PinnedContext.Provider>
  );
}

export default PinnedContext;
