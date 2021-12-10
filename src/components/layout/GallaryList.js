import React from "react";

import GallaryItem from "./GallaryItem";

import classes from "./GallaryList.module.css";

const GallaryList = (props) => {
  return (
    <div className={classes.listContain}>
      {/* <ul> */}
        {props.drawings.map((drawing) => (
          <GallaryItem
            key={drawing.id}
            image={drawing.image}
            date={drawing.date}
            title={drawing.title}
          />
        ))}
      {/* </ul> */}
    </div>
  );
};

export default GallaryList;