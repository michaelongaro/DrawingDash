import React, { useContext } from "react";

import FavoritesContext from "./FavoritesContext";

import GallaryList from "./GallaryList";

const Likes = () => {
  const favoritesCtx = useContext(FavoritesContext);

  // looks like we will need to fetch actual drawings from favoritesCtx.favorites
  // also need to copy paste 60/180/300 functionality from regular titles db schema

  return (
    <section style={{ width: "80%" }}>
      <h1>My Favorites</h1>
      {favoritesCtx.totalFavorites === 0 ? (
        "You haven't selected any favorites yet. Add some and view them here!"
      ) : (
        <GallaryList drawings={favoritesCtx.favorites} />
      )}
    </section>
  );
};

export default Likes;
