import React, { useEffect } from "react";
import { useContext } from "react";

// import { useAuth0 } from "@auth0/auth0-react";

import FavoritesContext from "./FavoritesContext";

import GallaryList from "./GallaryList";

const Likes = () => {
  // const user = useAuth0();

  // // need to figure this out: i am 99% sure you can have more than one use of useAuth0 hook,
  // // so why is below returning undefined. i think other logic is workable
  // useEffect(() => {
  //   console.log(`${user.sub} ---`);
  //   favoritesCtx.setClientID(user.sub);
  // }, []);

  const favoritesCtx = useContext(FavoritesContext);
  
  
  // i guess when you click onto the favorites page you wrap that inside a function???
  let content;

  if (favoritesCtx.totalFavorites === 0) {
    content = (
      <p>
        You haven't selected any favorites yet. Add some and view them here!
      </p>
    );
  } else {
    content = <GallaryList drawings={favoritesCtx.favorites} />;
  }

  return (
    <section style={{width:"80%"}}>
      <h1>My Favorites</h1>
      {content}
    </section>
  );
};

export default Likes;
