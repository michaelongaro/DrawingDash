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

  const [userDrawings, setUserDrawings] = useState({
    60: [],
    180: [],
    300: [],
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

  function setPinnedDrawing(drawing, seconds) {
    // console.log("called in ctx");
    let tempPinned = { ...pinnedDrawings };
    tempPinned[seconds] = drawing;
    // console.log("should be updated with", tempPinned);
    setPinnedDrawings(tempPinned);
  }

  function updateDatabase() {
    for (const drawingIdx of Object.keys(pinnedDrawings)) {
      set(
        ref(db, `users/${user.sub}/pinnedArt/${drawingIdx}`),
        pinnedDrawings[drawingIdx]
      );
    }
  }

  function searchIndexOfPinned(drawingsArray, seconds) {
    for (const idx in drawingsArray) {
      console.log(pinnedDrawings[seconds], drawingsArray[idx], idx);

      if (isEqual(pinnedDrawings[seconds], drawingsArray[idx])) {
        console.log("found match");
        return idx;
      }
    }
  }

  function updateDrawings(newDrawings, seconds) {
    let tempUserDrawings = { ...userDrawings };
    tempUserDrawings[seconds] = newDrawings;
    setUserDrawings(tempUserDrawings);
  }

  function resetAllAndHighlightNew(seconds, idx) {
    console.log("entered function");
    let tempHighlighted = Array(userDrawings[seconds].length).fill("");
    if (idx >= 0) {
      tempHighlighted[idx] = classes.highlighted;
    } else {
      tempHighlighted[searchIndexOfPinned(userDrawings[seconds], seconds)] =
        classes.highlighted;
    }

    let tempHighlightedDrawings = { ...highlightedDrawings };
    tempHighlightedDrawings[seconds] = tempHighlighted;
    console.log(tempHighlightedDrawings);
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
    console.log(userDrawings);
  }, [userDrawings]);

  useEffect(() => {
    if ((!isLoading, isAuthenticated)) {
      get(child(dbRef, `users/${user.sub}/pinnedArt`)).then((snapshot) => {
        if (snapshot.exists() && !isEqual(snapshot.val(), pinnedDrawings)) {
          setPinnedDrawings(snapshot.val());
        }
      });
    }
  }, [isLoading, isAuthenticated]);

  const context = {
    userDrawings: userDrawings,
    pinnedDrawings: pinnedDrawings,
    highlightedDrawings: highlightedDrawings,
    setUserDrawings: setUserDrawings,
    setPinnedDrawing: setPinnedDrawing,
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
