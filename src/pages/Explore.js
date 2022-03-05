import SearchContext from "../components/layout/SearchContext";
import Search from "../components/layout/Search";
import GallaryList from "../components/layout/GallaryList";

import classes from "./Explore.module.css";
import FocalSlidingDrawings from "../components/layout/FocalSlidingDrawings";

function Explore() {
  return (
    <div className={classes.exploreContain}>
      <FocalSlidingDrawings />
      <Search userProfile={""} />
    </div>
  );
}

export default Explore;
