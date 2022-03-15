import { createContext, useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

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

// createContext returns react component -> capital var name
const FavoritesContext = createContext({
  favorites: [],
  totalFavorites: 0,
  initalizedFavorites: false,
  // these three are just for autocompletion help in ide
  addFavorite: (favoriteMeetup) => {},
  removeFavorite: (meetupIndex) => {},
  itemIsFavorite: (meetupIndex) => {},
});

export function FavoritesProvider(props) {
  const [userFavorites, setUserFavorites] = useState([]);

  const { user, isLoading, isAuthenticated } = useAuth0();

  const db = getDatabase(app);
  const dbRef = ref(getDatabase(app));

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      // get(child(dbRef, `users/${user.sub}/likes`)).then((snapshot) => {
      //   if (snapshot.exists()) {
      //     setUserFavorites(Object.values(snapshot.val()));
      //   }
      // });
      onValue(ref(db, `users/${user.sub}/likes`)).then((snapshot) => {
        if (snapshot.exists()) {
          setUserFavorites(Object.values(snapshot.val()));
        }
      });
    }
  }, [isLoading, isAuthenticated]);

  function addFavoriteHandler(favoriteMeetup) {
    setUserFavorites((prevUserFavorites) => {
      return prevUserFavorites.concat(favoriteMeetup);
    });

    set(
      ref(db, `users/${user.sub}/likes/${favoriteMeetup.index}`),
      favoriteMeetup
    );
  }

  function removeFavoriteHandler(meetupIndex) {
    setUserFavorites((prevUserFavorites) => {
      return prevUserFavorites.filter((meetup) => meetup.index !== meetupIndex);
    });

    remove(ref(db, `users/${user.sub}/likes/${meetupIndex}`));
  }

  function itemIsFavoriteHandler(meetupIndex) {
    if (userFavorites.length === 0) {
      return false;
    }
    return userFavorites.some((meetup) => meetup.index === meetupIndex);
  }

  const context = {
    favorites: userFavorites,
    totalFavorites: userFavorites.length,
    addFavorite: addFavoriteHandler,
    removeFavorite: removeFavoriteHandler,
    itemIsFavorite: itemIsFavoriteHandler,
  };

  return (
    <FavoritesContext.Provider value={context}>
      {props.children}
    </FavoritesContext.Provider>
  );
}

export default FavoritesContext;
