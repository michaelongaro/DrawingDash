import React from "react";
import { useContext } from "react";

import FavoritesContext from "./FavoritesContext";
import Card from "../../ui/Card";

import classes from "./GallaryItem.module.css";

const GallaryItem = (props) => {

  const favoritesCtx = useContext(FavoritesContext);
  const itemIsFavorite = favoritesCtx.itemIsFavorite(props.drawing.index);

  function toggleFavoriteStatusHandler() {
    if (itemIsFavorite) {
      favoritesCtx.removeFavorite(props.drawing.index);
    } else {
      favoritesCtx.addFavorite(props.drawing);
    }
  }

  function getUserProfileInformation() {}

  return (
    <div className={classes.widthContain}>
    <Card>
      <div className={classes.glossOver}>
        <img src={props.drawing.image} alt={props.drawing.title} />
      </div>
      <div className={classes.bottomContain}>
        {/*<UserProfileContainer user={props.drawing.drawnBy} /> */}
        <div>{props.drawing.title}</div>
        <div>{props.drawing.date}</div>
        <div>{props.drawing.seconds}</div>
        <button onClick={toggleFavoriteStatusHandler}>
          {itemIsFavorite ? "💔" : "💖"}
        </button>
      </div>
    </Card>
    </div>
  );
};

export default GallaryItem;
