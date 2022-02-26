import React from "react";

import GallaryItem from "./GallaryItem";

import classes from "./GallaryList.module.css";

const GallaryList = (props) => {
  if (props.drawings.length === 0) {
    return null
  }

  if (props.drawings[0] === "none") {
    return <div>No Results</div>;
  } else {
    return (
      <div className={classes.listContain}>
        {props.drawings.map((drawing) => (
          <GallaryItem
            key={drawing.index}
            drawnBy={drawing.drawnBy}
            index={drawing.index}
            image={drawing.image}
            date={drawing.date}
            seconds={drawing.seconds}
            title={drawing.title}
          />
        ))}
      </div>
    );
  }
};

export default React.memo(GallaryList);