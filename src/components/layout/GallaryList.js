import React from "react";

import GallaryItem from "./GallaryItem";

import classes from "./GallaryList.module.css";

const GallaryList = (props) => {

  if (props.drawings.length === 0) {
    return <div>No Results</div>;
  } else {
    return (
      <div className={classes.listContain}>
      {/* {console.log("gallary refreshed")} */}
        {props.drawings.map((drawing) => (
          <GallaryItem
            key={drawing.index}
            index={drawing.index}
            image={drawing.image}
            date={drawing.date}
            title={drawing.title}
          />
        ))}
      </div>
    );
  }

};

export default React.memo(GallaryList);
