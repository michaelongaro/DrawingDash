import Search from "../components/layout/Search";

import classes from "./Explore.module.css";
import FocalSlidingDrawings from "../components/layout/FocalSlidingDrawings";

function Explore() {
  return (
    <div className={classes.exploreContain}>
      {/* <FocalSlidingDrawings baseHeight={75} maxHeight={170} title={"Search"} forHomepage={false} /> */}
      <Search userProfile={""} />
    </div>
  );
}

export default Explore;
