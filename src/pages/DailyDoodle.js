import React from "react";
import { motion } from "framer-motion";

import { CanvasProvider } from "../canvas/CanvasContext";
import { Canvas } from "../canvas/Canvas";

function DailyDoodle() {
  return (
    <motion.div
      key={"daily"}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      style={{ height: "82vh" }} // was 100%, keep an eye on this
    >
      <CanvasProvider>
        <Canvas />
      </CanvasProvider>
    </motion.div>
  );
}

export default DailyDoodle;
