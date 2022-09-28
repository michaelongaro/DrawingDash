import React, { useEffect } from "react";
import { motion } from "framer-motion";

import { CanvasProvider } from "../components/canvas/CanvasContext";
import { Canvas } from "../components/canvas/Canvas";

function DailyDoodle() {
  useEffect(() => {
    // used to allow scroll height checking after using
    // scrollIntoView when switching from different components
    document.documentElement.style.overflow = "auto";

    return () => {
      document.documentElement.style.overflow = "hidden";
    };
  }, []);

  return (
    <motion.div
      key={"daily"}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      style={{ height: "87.5vh" }}
    >
      <CanvasProvider>
        <Canvas />
      </CanvasProvider>
    </motion.div>
  );
}

export default DailyDoodle;
