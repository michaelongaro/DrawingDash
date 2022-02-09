import React from "react";

import classes from "./ProgressBar.module.css";

const ProgressBar = () => {
  return (
    <div className={classes.rectangle}>
      <div className={classes.circle}></div>
      <div className={classes.circle}></div>
      <div className={classes.circle}></div>
    </div>
  );
};

export default ProgressBar;
