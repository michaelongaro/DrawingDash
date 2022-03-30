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

  // deal with this later, turn into one obj
  const [show60, setShow60] = useState({ display: "none" });
  const [show180, setShow180] = useState({ display: "none" });
  const [show300, setShow300] = useState({ display: "none" });

  const [user60Drawings, setUser60Drawings] = useState([]);
  const [user180Drawings, setUser180Drawings] = useState([]);
  const [user300Drawings, setUser300Drawings] = useState([]);

  const [selectedPinnedDrawings, setSelectedPinnedDrawings] = useState({
    60: "",
    180: "",
    300: "",
  });

  const [pinnedDrawings, setPinnedDrawings] = useState({
    60: "",
    180: "",
    300: "",
  });

  const [highlightedDrawings, setHighlightedDrawings] = useState({
    60: [],
    180: [],
    300: [],
  });

  const [userDrawings, setUserDrawings] = useState({
    60: [],
    180: [],
    300: [],
  });

  function updateSelectedPinnedDrawings(drawing, seconds) {
    let tempPinned = { ...selectedPinnedDrawings };
    tempPinned[seconds] = drawing;
    setSelectedPinnedDrawings(tempPinned);
  }

  function updateDatabase(updatedPinnedDrawings) {
    set(ref(db, `users/${user.sub}/pinnedArt`), updatedPinnedDrawings);
  }

  function searchIndexOfPinned(drawingsArray, seconds) {
    for (const idx in drawingsArray) {
      if (isEqual(pinnedDrawings[seconds], drawingsArray[idx])) {
        return idx;
      }
    }
  }

  function resetAllAndHighlightNew(seconds, idx) {
    let tempHighlighted = Array(highlightedDrawings[seconds].length).fill("");

    tempHighlighted[idx] = classes.highlighted;

    let tempHighlightedDrawings = { ...highlightedDrawings };
    tempHighlightedDrawings[seconds] = tempHighlighted;
    setHighlightedDrawings(tempHighlightedDrawings);
  }

  function resetAllAndHighlightNewInit() {
    let tempHighlightedDrawings = { ...highlightedDrawings };
    let seconds = [60, 180, 300];
    for (const duration of seconds) {
      let tempHighlighted = Array(highlightedDrawings[duration].length).fill(
        ""
      );

      tempHighlighted[searchIndexOfPinned(userDrawings[duration], duration)] =
        classes.highlighted;

      tempHighlightedDrawings[duration] = tempHighlighted;
    }
    setHighlightedDrawings(tempHighlightedDrawings);
  }

  function hideAllModals() {
    console.log("i have been clicked");
    setShow60({ display: "none" });
    setShow180({ display: "none" });
    setShow300({ display: "none" });
    resetAllAndHighlightNewInit();
  }

  useEffect(() => {
    if (!isEmpty(userDrawings)) {
      if (
        !isEmpty(userDrawings["60"]) &&
        !isEmpty(pinnedDrawings["60"]) &&
        !isEmpty(userDrawings["180"]) &&
        !isEmpty(pinnedDrawings["180"]) &&
        !isEmpty(userDrawings["300"]) &&
        !isEmpty(pinnedDrawings["300"])
      ) {
        resetAllAndHighlightNewInit();
      }
    }
  }, [userDrawings, pinnedDrawings]);

  useEffect(() => {
    if (
      !isEmpty(user60Drawings) &&
      !isEmpty(user180Drawings) &&
      !isEmpty(user300Drawings)
    ) {
      setHighlightedDrawings({
        60: user60Drawings,
        180: user180Drawings,
        300: user300Drawings,
      });
      setUserDrawings({
        60: user60Drawings,
        180: user180Drawings,
        300: user300Drawings,
      });
    }
  }, [user60Drawings, user180Drawings, user300Drawings]);

  useEffect(() => {
    if ((!isLoading, isAuthenticated)) {
      get(child(dbRef, `users/${user.sub}/pinnedArt`)).then((snapshot) => {
        if (snapshot.exists() && !isEqual(snapshot.val(), pinnedDrawings)) {
          setPinnedDrawings(snapshot.val());
          // need to set this if not all duration's pinned drawings
          // are changed before posting to db
          setSelectedPinnedDrawings(snapshot.val());
        }
      });
    }
  }, [isLoading, isAuthenticated]);

  const context = {
    show60: show60,
    show180: show180,
    show300: show300,
    userDrawings: userDrawings,
    pinnedDrawings: pinnedDrawings,
    highlightedDrawings: highlightedDrawings,
    selectedPinnedDrawings: selectedPinnedDrawings,
    setShow60: setShow60,
    setShow180: setShow180,
    setShow300: setShow300,
    setUser60Drawings: setUser60Drawings,
    setUser180Drawings: setUser180Drawings,
    setUser300Drawings: setUser300Drawings,
    setUserDrawings: setUserDrawings,
    setPinnedDrawings: setPinnedDrawings,
    updateSelectedPinnedDrawings: updateSelectedPinnedDrawings,
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
