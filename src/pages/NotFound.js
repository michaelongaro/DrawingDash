import React from "react";
import { motion } from "framer-motion";

import Footer from "../ui/Footer";

import NotFoundIcon from "../svgs/NotFoundIcon";

import baseClasses from "../index.module.css";

const NotFound = () => {
  let styles = {
    backgroundColor: "white",
    width: "35rem",
    height: "20rem",
    fontSize: "25px",
    borderRadius: "1em",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    gap: "1.5em",
  };
  return (
    <motion.div
      key={"notFound"}
      style={{ height: "70vh" }}
      className={baseClasses.baseFlex}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div style={styles} className={baseClasses.baseVertFlex}>
        <div style={{ gap: ".5em" }} className={baseClasses.baseFlex}>
          <div
            style={{
              transform: "rotate(-45deg)",
              fontSize: "35px",
              userSelect: "none",
            }}
          >
            ?
          </div>
          <NotFoundIcon dimensions={"3em"} />
          <div
            style={{
              transform: "rotate(45deg)",
              fontSize: "35px",
              userSelect: "none",
            }}
          >
            ?
          </div>
        </div>
        <div>The requested URL does not exist.</div>
      </div>
    </motion.div>
  );
};

export default NotFound;
