import React from "react";
import Card from "../../ui/Card";

import classes from "./PinnedArt.module.css";

const PinnedShowcaseItem = (props) => {
  
  if (props.drawing === undefined) {
    return (
      <div className={classes.vertFlex}>
        <Card>
          <div style={{ margin: "5em"}}>Click to select a drawing</div>
        </Card>
        <div>{props.timer}</div>
      </div>
    );
  }

  // refactor: replace with modularized gallaryitem
  return (
    <div className={classes.vertFlex}>
      <div>
        <img src={props.drawing.image} alt={props.drawing.title} />
        <div className={classes.bottomContain}>
          <div>{props.drawing.title}</div>
          <div>{props.drawing.date}</div>
        </div>
      </div>
      <div>{props.timer}</div>
    </div>
  );
};

export default PinnedShowcaseItem;
