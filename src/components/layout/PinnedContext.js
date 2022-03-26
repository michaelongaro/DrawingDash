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

  const [user60Drawings, setUser60Drawings] = useState([]);
  const [user180Drawings, setUser180Drawings] = useState([]);
  const [user300Drawings, setUser300Drawings] = useState([]);

  const [userDrawings, setUserDrawings] = useState({
    60: [],
    180: [],
    300: [],
  });

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

  function updateDrawings(newDrawings, seconds) {
    let tempUserDrawings = { ...userDrawings };
    tempUserDrawings[seconds] = newDrawings;
    console.log("updating with", tempUserDrawings);
    setUserDrawings(tempUserDrawings);
  }

  function resetAllAndHighlightNew(seconds, idx) {
    // alternative would be to save previous highlighted, turn that into ""
    // and then make currently selected highlighted.
    console.log(userDrawings, "look here");
    let tempHighlighted = Array(userDrawings[seconds].length).fill("");
    if (idx >= 0) {
      tempHighlighted[idx] = classes.highlighted;
    } else {
      tempHighlighted[searchIndexOfPinned(userDrawings[seconds], seconds)] =
        classes.highlighted;
    }

    let tempHighlightedDrawings = { ...highlightedDrawings };
    tempHighlightedDrawings[seconds] = tempHighlighted;
    setHighlightedDrawings(tempHighlightedDrawings);
  }

  useEffect(() => {
    if (!isEmpty(userDrawings)) {
      if (!isEmpty(userDrawings["60"]) && !isEmpty(pinnedDrawings["60"])) {
        resetAllAndHighlightNew("60", -1);
      } else if (
        !isEmpty(userDrawings["180"]) &&
        !isEmpty(pinnedDrawings["180"])
      ) {
        resetAllAndHighlightNew("180", -1);
      } else if (
        !isEmpty(userDrawings["300"]) &&
        !isEmpty(pinnedDrawings["300"])
      ) {
        resetAllAndHighlightNew("300", -1);
      }
    }
  }, [userDrawings, pinnedDrawings]);

  useEffect(() => {
    if (
      !isEmpty(user60Drawings) &&
      !isEmpty(user180Drawings) &&
      !isEmpty(user300Drawings)
    ) {
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
    userDrawings: userDrawings,
    pinnedDrawings: pinnedDrawings,
    highlightedDrawings: highlightedDrawings,
    selectedPinnedDrawings: selectedPinnedDrawings,
    setUser60Drawings: setUser60Drawings,
    setUser180Drawings: setUser180Drawings,
    setUser300Drawings: setUser300Drawings,
    setUserDrawings: setUserDrawings,
    setPinnedDrawings: setPinnedDrawings,
    updateSelectedPinnedDrawings: updateSelectedPinnedDrawings,
    updateDatabase: updateDatabase,
    resetAllAndHighlightNew: resetAllAndHighlightNew,
    updateDrawings: updateDrawings,
  };

  return (
    <PinnedContext.Provider value={context}>
      {props.children}
    </PinnedContext.Provider>
  );
}

export default PinnedContext;
