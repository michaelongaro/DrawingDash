import React, { useState, useContext, useEffect } from "react";
import { motion } from "framer-motion";

import SearchContext from "../components/layout/SearchContext";

import Search from "../components/layout/Search";
import FocalAnimatedDrawings from "../components/layout/FocalAnimatedDrawings";
import Footer from "../ui/Footer";

import classes from "./Explore.module.css";

function Explore() {
  // used to determine whether footer should be at 100vh or at 100% height
  const searchCtx = useContext(SearchContext);

  const [dynamicHeight, setDynamicHeight] = useState("100vh");

  useEffect(() => {
    if (searchCtx.searchValues["gallary"][0]) {
      if (
        searchCtx.searchValues["gallary"][0]["60"].length !== 0 &&
        searchCtx.searchValues["gallary"][0]["180"].length !== 0 &&
        searchCtx.searchValues["gallary"][0]["300"].length !== 0
      ) {
        setDynamicHeight("100%");
      }
    }
  }, [searchCtx.searchValues]);
  return (
    <motion.div 
    initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: .2}}

      >
      <div style={{ height: dynamicHeight }} className={classes.exploreContain}>
        <div styles={{ marginTop: "3em" }}></div>
        <FocalAnimatedDrawings forHomepage={false} forSearch={true} />
        <Search userProfile={""} />
      </div>
      <Footer />
    </motion.div>
  );
}

export default Explore;
