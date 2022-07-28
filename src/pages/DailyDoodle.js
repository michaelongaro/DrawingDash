import React from "react";
import { motion } from "framer-motion";

import { CanvasProvider } from "../canvas/CanvasContext";
import { Canvas } from "../canvas/Canvas";
import Footer from "../ui/Footer";

function DailyDoodle() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <CanvasProvider>
        <Canvas />
      </CanvasProvider>
    </motion.div>
  );
}

export default DailyDoodle;
