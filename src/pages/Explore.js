import React, { useState, useContext, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import SearchContext from "../components/search/SearchContext";

import Search from "../components/search/Search";
import FocalAnimatedDrawings from "../components/animatedDrawings/FocalAnimatedDrawings";

import classes from "./Explore.module.css";

function Explore() {
  // used to determine whether footer should be at 100vh or at 100% height
  const searchCtx = useContext(SearchContext);

  const [dynamicHeight, setDynamicHeight] = useState("100vh");

  useEffect(() => {
    if (searchCtx.searchValues["gallary"][0]) {
      if (
        searchCtx.searchValues["gallary"][0]["60"].length !== 0 ||
        searchCtx.searchValues["gallary"][0]["180"].length !== 0 ||
        searchCtx.searchValues["gallary"][0]["300"].length !== 0
      ) {
        setDynamicHeight("100%");
      } else {
        setDynamicHeight("100vh");
      }
    } else {
      setDynamicHeight("100vh");
    }
  }, [searchCtx.searchValues]);
  return (
    <motion.div
      key={"explore"}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div
        style={{ minHeight: dynamicHeight }}
        className={classes.exploreContain}
      >
        <FocalAnimatedDrawings forHomepage={false} forSearch={true} />
        <Search dbPath={"titles"} forModal={false} idx={0} />
      </div>
    </motion.div>
  );
}

export default Explore;
