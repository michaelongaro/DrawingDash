import React from "react";
import { useContext } from "react";

import FavoritesContext from "./FavoritesContext";
import Card from "./Card";

import classes from "./GallaryItem.module.css";

const GallaryItem = (props) => {
  const favoritesCtx = useContext(FavoritesContext);
  console.log(`props id: ${props.index}`);
  const itemIsFavorite = favoritesCtx.itemIsFavorite(props.index);

  function toggleFavoriteStatusHandler() {
    if (itemIsFavorite) {
      favoritesCtx.removeFavorite(props.index);
    } else {
      favoritesCtx.addFavorite({
        index: props.index,
        title: props.title,
        image: props.image,
        date: props.date,
      });
    }
  }

  return (
    // <div className={classes.contain}>
    <Card>
      <img src={props.image} alt={props.title} />
      <div className={classes.bottomContain}>
        <div>{props.title}</div>
        <div>{props.date}</div>
        <button onClick={toggleFavoriteStatusHandler}>
          {itemIsFavorite ? "💔" : "💖"}
        </button>
      </div>
    </Card>
    // </div>
  );
};

export default GallaryItem;
