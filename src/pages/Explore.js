import React from "react";

import Search from "../components/layout/Search";
import FocalAnimatedDrawings from "../components/layout/FocalAnimatedDrawings";

import classes from "./Explore.module.css";

function Explore() {
  return (
    <div className={classes.exploreContain}>
      <div styles={{ marginTop: "3em"}}></div>
      <FocalAnimatedDrawings forHomepage={false} forSearch={true}/>
      <Search userProfile={""} />
    </div>
  );
}

export default Explore;
