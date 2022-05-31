import Search from "../components/layout/Search";

import classes from "./Explore.module.css";
import FocalAnimatedDrawings from "../components/layout/FocalAnimatedDrawings";

function Explore() {
  return (
    <div className={classes.exploreContain}>
      <FocalAnimatedDrawings forHomepage={false} forSearch={true}/>
      <Search userProfile={""} />
    </div>
  );
}

export default Explore;
