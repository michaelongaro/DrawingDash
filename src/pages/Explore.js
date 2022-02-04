import SearchContext from "../components/layout/SearchContext";
import Search from "../components/layout/Search";
import GallaryList from "../components/layout/GallaryList";

import classes from "./Explore.module.css";

function Explore() {
  return (
    <div className={classes.exploreContain}>
      <Search forProfile={false} />

      <SearchContext.Consumer>
        {(value) => <GallaryList drawings={value.gallary} />}
      </SearchContext.Consumer>
    </div>
  );
}

export default Explore;
