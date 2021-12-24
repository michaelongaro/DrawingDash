import { createContext, useState } from "react";

// createContext returns react component -> capital var name
const FavoritesContext = createContext({
    favorites: [],
    totalFavorites: 0,
    // these three are just for autocompletion help in ide
    addFavorite: (favoriteMeetup) => {},
    removeFavorite: (meetupIndex) => {},
    itemIsFavorite: (meetupIndex) => {},
});

export function FavoritesProvider(props) {
    const [userFavorites, setUserFavorites] = useState([]);

    function addFavoriteHandler(favoriteMeetup) {
        // written as a function because react schedules state
        // changes, gives us the latest state snapshot
        // (useful if you depend on previous version of state)

        // this might not be working because each image has the same index? 
        setUserFavorites((prevUserFavorites) => {
            return prevUserFavorites.concat(favoriteMeetup);
        });
    }

    function removeFavoriteHandler(meetupIndex) {
        setUserFavorites(prevUserFavorites => {
            return prevUserFavorites.filter(meetup => meetup.index !== meetupIndex)
        })
    }

    function itemIsFavoriteHandler(meetupIndex) {
        return userFavorites.some(meetup => meetup.index === meetupIndex)
    }

    const context = {
        favorites: userFavorites,
        totalFavorites: userFavorites.length,
        addFavorite: addFavoriteHandler,
        removeFavorite: removeFavoriteHandler,
        itemIsFavorite: itemIsFavoriteHandler,

    };

    return <FavoritesContext.Provider value={context}>
        {props.children}
    </FavoritesContext.Provider>
}

export default FavoritesContext;