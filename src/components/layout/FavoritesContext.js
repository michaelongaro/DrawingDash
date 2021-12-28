import { createContext, useEffect, useState } from "react";

// import { useAuth0 } from "@auth0/auth0-react";

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
  // const { user } = useAuth0();

  const [userFavorites, setUserFavorites] = useState([]);
  const [initalizedFavorites, setInitializedFavorites] = useState(false);
  const [favoritesID, setFavoritesID] = useState("");

  useEffect(() => {
    // go through likes, and add child of likes to userFavorites
  }, []);

  function addFavoriteHandler(favoriteMeetup, userID) {
    setUserFavorites((prevUserFavorites) => {
      return prevUserFavorites.concat(favoriteMeetup);
    });

    const updatedFavorites = userFavorites.concat(favoriteMeetup);

    if (initalizedFavorites) {
      fetch(
        `https://drawing-dash-41f14-default-rtdb.firebaseio.com//${userID}/likes/${favoritesID}.json`,
        {
          method: "PUT",
          body: JSON.stringify(updatedFavorites),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    } else {
      setInitializedFavorites(true);

      const arrayFavorites = [favoriteMeetup];

      fetch(
        `https://drawing-dash-41f14-default-rtdb.firebaseio.com//${userID}/likes.json`,
        {
          method: "POST",
          body: JSON.stringify(arrayFavorites),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setTimeout(() => {
        fetch(
          `https://drawing-dash-41f14-default-rtdb.firebaseio.com/${userID}/likes.json`
        )
          .then((response) => {
            return response.json();
          })
          .then((data) => {
            setFavoritesID(Object.keys(data)[0]);
          });
      }, 1000);
    }
  }

  function removeFavoriteHandler(meetupIndex, userID) {
    // actually going to be a PUT here
    // should delete favorite from db here

    const drawingsToKeep = userFavorites.filter(
      (meetup) => meetup.index !== meetupIndex
    );

    fetch(
      `https://drawing-dash-41f14-default-rtdb.firebaseio.com//${userID}/likes/${favoritesID}.json`,
      {
        method: "PUT",
        body: JSON.stringify(drawingsToKeep),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    setUserFavorites((prevUserFavorites) => {
      return prevUserFavorites.filter((meetup) => meetup.index !== meetupIndex);
    });
  }

  function itemIsFavoriteHandler(meetupIndex) {
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
