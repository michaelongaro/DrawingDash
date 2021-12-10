import React from "react";

import Card from "./Card";

import classes from "./GallaryItem.module.css";

const GallaryItem = (props) => {
  //console.log(props.key);
  return (
    // <div className={classes.contain}>
    <Card>
      <img src={props.image} alt={props.title} />
      <div className={classes.bottomContain}>
        <div>{props.title}</div>
        <div>{props.date}</div>
        <button>💖</button>
      </div>
    </Card>
    // </div>
  );
};

export default GallaryItem;
