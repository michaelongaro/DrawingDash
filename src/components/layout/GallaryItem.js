import React from "react";
import { useContext } from "react";

import FavoritesContext from "./FavoritesContext";
import Card from "../../ui/Card";

import classes from "./GallaryItem.module.css";

const GallaryItem = (props) => {

  const favoritesCtx = useContext(FavoritesContext);
  const itemIsFavorite = favoritesCtx.itemIsFavorite(props.index);

  function toggleFavoriteStatusHandler() {
    if (itemIsFavorite) {
      favoritesCtx.removeFavorite(props.index);
    } else {
      favoritesCtx.addFavorite(
        {
          index: props.index,
          drawnBy: props.drawnBy,
          title: props.title,
          image: props.image,
          date: props.date,
          seconds: props.seconds,
        }
      );
    }
  }

  function getUserProfileInformation() {}

  return (
    <Card>
      <div className={classes.glossOver}>
        <img src={props.image} alt={props.title} />
      </div>
      <div className={classes.bottomContain}>
        {/*<UserProfileContainer user={props.drawnBy} /> */}
        <div>{props.title}</div>
        <div>{props.date}</div>
        <div>{props.seconds}</div>
        <button onClick={toggleFavoriteStatusHandler}>
          {itemIsFavorite ? "💔" : "💖"}
        </button>
      </div>
    </Card>
  );
};

export default GallaryItem;
