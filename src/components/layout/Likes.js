import React from 'react'

import { useContext } from 'react';

import FavoritesContext from './FavoritesContext';

import GallaryList from './GallaryList';

const Likes = () => {
  const favoritesCtx = useContext(FavoritesContext);
    // need to store this locally/on server if you want to keep vals after refresh
    // : i'm thinking just push up/learn how to update the favorites from favoritesCtx
    // : up to firebase for each profile
    let content;

    if (favoritesCtx.totalFavorites === 0) {
        content = <p>You haven't selected any favorites yet. Add some and view them here!</p>
    } else {
        content = <GallaryList drawings={favoritesCtx.favorites}/>
    }

    return (
        <section>
            <h1>My Favorites</h1>
            {content}
        </section>
    );
}

export default Likes
