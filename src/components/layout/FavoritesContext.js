import { createContext, useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

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
  const [userFavorites, setUserFavorites] = useState({
    60: [],
    180: [],
    300: [],
  });

  const { user, isLoading, isAuthenticated } = useAuth0();

  const db = getDatabase(app);
  const dbRef = ref(getDatabase(app));

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      onValue(ref(db, `users/${user.sub}/likes`), (snapshot) => {
        if (snapshot.exists()) {
          let tempUserFavorites = snapshot.val();
          if (snapshot.val()["60"][0] === "temp") {
            tempUserFavorites["60"] = [];
          }
          if (snapshot.val()["180"][0] === "temp") {
            tempUserFavorites["180"] = [];
          }
          if (snapshot.val()["300"][0] === "temp") {
            tempUserFavorites["300"] = [];
          }
          setUserFavorites(tempUserFavorites);
        }
      });
    }
  }, [isLoading, isAuthenticated]);

  useEffect(() => {
    console.log(userFavorites);
  }, [userFavorites]);

  function addFavorite(
    currDrawingID,
    drawingSeconds,
    newTotalLikesCount,
    newDailyLikesCount
  ) {
    // updating locally, could potentially just have it tied to onValue like above
    setUserFavorites((prevUserFavorites) => {
      console.log(
        prevUserFavorites,
        drawingSeconds,
        prevUserFavorites[drawingSeconds],
        currDrawingID
      );
      prevUserFavorites[drawingSeconds].push(currDrawingID);
      console.log(prevUserFavorites);
      return prevUserFavorites;
    });

    // updating user likes object in db
    get(child(dbRef, `users/${user.sub}/likes`)).then((snapshot) => {
      if (snapshot.exists()) {
        let tempLikes = snapshot.val();
        if (tempLikes[drawingSeconds][0] === "temp") {
          tempLikes[drawingSeconds][0] = currDrawingID;
        } else {
          tempLikes[drawingSeconds].push(currDrawingID);
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

  function removeFavorite(
    currDrawingID,
    drawingSeconds,
    newTotalLikesCount,
    newDailyLikesCount
  ) {
    // updating locally, could potentially just have it tied to onValue like above
    setUserFavorites((prevUserFavorites) => {
      let updatedUserFavorites = prevUserFavorites[drawingSeconds].filter(
        (drawingID) => drawingID !== currDrawingID
      );
      prevUserFavorites[drawingSeconds] = updatedUserFavorites;
      return prevUserFavorites;
    });

    // updating user likes object in db
    get(child(dbRef, `users/${user.sub}/likes`)).then((snapshot) => {
      if (snapshot.exists()) {
        let tempLikes = snapshot.val();
        tempLikes[drawingSeconds].filter(
          (drawingID) => drawingID !== currDrawingID
        );

        set(ref(db, `users/${user.sub}/likes/`), tempLikes);
      }
    });

    // updating drawingLikes values
    update(ref(db, `drawingLikes/${drawingSeconds}/${currDrawingID}`), {
      totalLikes: newTotalLikesCount,
      dailyLikes: newDailyLikesCount,
    });
  }

  function itemIsFavorite(currDrawingID, drawingSeconds) {
    console.log(userFavorites);
    if (
      userFavorites["60"].length === 0 &&
      userFavorites["180"].length === 0 &&
      userFavorites["300"].length === 0
    ) {
      return false;
    }

    console.log(userFavorites, currDrawingID, drawingSeconds);

    return userFavorites[drawingSeconds].some(
      (drawingID) => drawingID === currDrawingID
    );
  }

  const context = {
    favorites: userFavorites,
    totalFavorites: userFavorites.length,
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
