import React from "react";
import { useState, useContext } from "react";

import ProfilePicture from "./ProfilePicture";
import FavoritesContext from "./FavoritesContext";
import Card from "../../ui/Card";

import classes from "./GallaryItem.module.css";

const GallaryItem = (props) => {
  const favoritesCtx = useContext(FavoritesContext);
  const itemIsFavorite = favoritesCtx.itemIsFavorite(props.drawing.index);

  const [drawingContainerSize, setDrawingContainerSize] = useState(
    classes.widthContain
  );

  function toggleFavoriteStatusHandler() {
    if (itemIsFavorite) {
      favoritesCtx.removeFavorite(props.drawing.index);
    } else {
      favoritesCtx.addFavorite(props.drawing);
    }
  }

  function getUserProfileInformation() {}

  function showFullscreenModal() {
    setDrawingContainerSize(classes.fullScreen);
  }

  return (
    <div className={drawingContainerSize}>
      {/* <div className={show} */}
      <Card>
        <div
          className={classes.glossOver}
          onClick={() => showFullscreenModal()}
        >
          <img
            className={classes.imgCenter}
            src={props.drawing.image}
            alt={props.drawing.title}
          />
        </div>
        <div className={classes.bottomContain}>
          <ProfilePicture user={props.drawing.drawnBy} size="small" />
          {/*<UserProfileContainer user={props.drawing.drawnBy} /> */}
          <div>{props.drawing.title}</div>
          <div>{props.drawing.date}</div>
          <div>{props.drawing.seconds}</div>
          <button style={{margin: "0"}} onClick={toggleFavoriteStatusHandler}>
            {itemIsFavorite ? "💔" : "💖"}
          </button>
        </div>
      </Card>

      {/* <div className={drawingContainerSize}></div> */}
    </div>
  );
};

export default GallaryItem;
