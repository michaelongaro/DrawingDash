import React, { useContext } from "react";

import { useAuth0 } from "@auth0/auth0-react";

import FavoritesContext from "./FavoritesContext";

import ProfileHeader from "./ProfileHeader";
import Search from "./Search";
import GallaryList from "./GallaryList";

import classes from "./Preferences.module.css";

const Likes = () => {
  const favoritesCtx = useContext(FavoritesContext);
  const { user } = useAuth0();

  return (
    <div className={`${classes.baseFlex} ${classes.prefCard}`}>
      <ProfileHeader title={"Likes"} />
      {favoritesCtx.totalFavorites === 0 ? (
        "You haven't selected any favorites yet. Add some and view them here!"
      ) : (
        // looks like will need to refactor Search to be able to search through just user likes
        // tedious, but should be EXACT same logic soooo
        <Search userProfile={user.sub} margin={"1em"} />
        // <GallaryList drawingIDs={favoritesCtx.favorites} />
      )}
    </div>
  );
};

export default Likes;
