import React, { createContext, useContext, useEffect, useState } from "react";

import { isEqual } from "lodash";
import { useAuth0 } from "@auth0/auth0-react";
import { useLocation } from "react-router-dom";

import SearchContext from "./SearchContext";

import {
  getDatabase,
  get,
  set,
  ref,
  child,
  update,
  onValue,
} from "firebase/database";
import { app } from "../../util/init-firebase";

const FavoritesContext = createContext(null);

export function FavoritesProvider(props) {
  const location = useLocation();

  // cannot access context from another context
  const searchCtx = useContext(SearchContext);

  const [userFavorites, setUserFavorites] = useState({
    60: false,
    180: false,
    300: false,
  });

  const [totalFavorites, setTotalFavorites] = useState(0);

  const { user, isLoading, isAuthenticated } = useAuth0();

  const db = getDatabase(app);
  const dbRef = ref(getDatabase(app));

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      // could have clause for only doing this if on /profile/likes for sure
      onValue(ref(db, `users/${user.sub}/likes`), (snapshot) => {
        if (snapshot.exists()) {
          setUserFavorites(snapshot.val());

          let tempTotalFavorites = 0;
          for (const duration of Object.values(snapshot.val())) {
            for (const title of Object.values(duration)) {
              tempTotalFavorites += title["drawingID"].length;
            }
          }

          setTotalFavorites(tempTotalFavorites);

          // set manuallyLoad[2] to null and currentPagenumber to be 1 if empty
          // [1,0,2]
          if (location.pathname === "/profile/likes") {
            let currentPageNumber =
              searchCtx.pageSelectorDetails["currentPageNumber"][2];

            searchCtx.getGallary(
              (currentPageNumber - 1) * 6,
              currentPageNumber * 6,
              6,
              2,
              `users/${user.sub}/likes`
            );
          }
        }
      });
    }
  }, [isLoading, isAuthenticated]);

  function addFavorite(
    currDrawingID,
    drawingSeconds,
    drawingTitle,
    newTotalLikesCount,
    newDailyLikesCount
  ) {
    // updating user likes object in db
    get(child(dbRef, `users/${user.sub}/likes/${drawingSeconds}`)).then(
      (snapshot) => {
        if (snapshot.exists()) {
          let tempLikes = snapshot.val();

          let newLikedDrawingObject = {
            [drawingTitle]: { drawingID: [currDrawingID] },
          };

          // if there are no liked drawings for that duration
          if (!tempLikes) {
            // populating first drawing in likes
            tempLikes = newLikedDrawingObject;
          } else if (!tempLikes?.[drawingTitle]) {
            // adding first occurance of title to existing drawings in likes
            tempLikes = { ...tempLikes, ...newLikedDrawingObject };
          } else {
            // adding to existing drawing title in likes
            tempLikes[drawingTitle]["drawingID"].push(currDrawingID);
          }
          set(ref(db, `users/${user.sub}/likes/${drawingSeconds}`), tempLikes);
        }
      }
    );

    // updating drawingLikes values
    update(ref(db, `drawingLikes/${drawingSeconds}/${currDrawingID}`), {
      totalLikes: newTotalLikesCount,
      dailyLikes: newDailyLikesCount,
    });
  }

  function removeFavorite(
    currDrawingID,
    drawingSeconds,
    drawingTitle,
    newTotalLikesCount,
    newDailyLikesCount
  ) {
    // updating user likes object in db
    get(child(dbRef, `users/${user.sub}/likes`)).then((snapshot) => {
      if (snapshot.exists()) {
        let tempLikes = snapshot.val();

        // taking out any occurance of the liked drawing in the array
        tempLikes[drawingSeconds][drawingTitle]["drawingID"] = tempLikes[
          drawingSeconds
        ][drawingTitle]["drawingID"].filter(
          (drawingID) => drawingID !== currDrawingID
        );

        if (tempLikes[drawingSeconds][drawingTitle]["drawingID"].length === 0) {
          delete tempLikes[drawingSeconds][drawingTitle];
        }

        // if there are no liked drawing titles left for that duration then replace with false
        if (isEqual(tempLikes[drawingSeconds], {})) {
          tempLikes[drawingSeconds] = false;

          // manually switching to normal rendering flow (switching off of now null duration tab)
          searchCtx.updatePageSelectorDetails("currentPageNumber", 1, 2);
          searchCtx.updatePageSelectorDetails(
            "durationToManuallyLoad",
            null,
            2
          );
        }

        set(ref(db, `users/${user.sub}/likes/`), tempLikes);
      }
    });

    // updating drawingLikes values
    update(ref(db, `drawingLikes/${drawingSeconds}/${currDrawingID}`), {
      totalLikes: newTotalLikesCount,
      dailyLikes: newDailyLikesCount,
    });
  }

  function itemIsFavorite(currDrawingID, drawingSeconds, drawingTitle) {
    if (userFavorites[drawingSeconds]?.[drawingTitle]?.["drawingID"]) {
      if (
        userFavorites[drawingSeconds][drawingTitle]["drawingID"].includes(
          currDrawingID
        ) === true
      ) {
        return true;
      }
    }

    return false;
  }

  const context = {
    favorites: userFavorites,
    totalFavorites: totalFavorites,
    addFavorite: addFavorite,
    removeFavorite: removeFavorite,
    itemIsFavorite: itemIsFavorite,
  };

  return (
    <FavoritesContext.Provider value={context}>
      {props.children}
    </FavoritesContext.Provider>
  );
}

export default FavoritesContext;
