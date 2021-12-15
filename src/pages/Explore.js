import SearchContext, { SearchProvider } from "../components/layout/SearchContext";
import Search from "../components/layout/Search";
import GallaryList from "../components/layout/GallaryList";
import { useContext } from "react";

import classes from "./Explore.module.css";

function Explore() {
  const searchCtx = useContext(SearchContext);

  return (
    <div className={classes.exploreContain}>
      <SearchProvider>
        <Search />
        <GallaryList drawings={searchCtx.gallary} />
      </SearchProvider>
    </div>
  );
}

export default Explore;