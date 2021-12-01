import React, { useEffect } from "react";
import { useCanvas } from "./CanvasContext";

import classes from "./Canvas.module.css";

export function Canvas() {
  const { canvasRef, prepareCanvas, startDrawing, finishDrawing, draw } =
    useCanvas();

  useEffect(() => {
    prepareCanvas();
  }, []);

  return (
    <div className={classes.contain}>
      <canvas
        onMouseDown={startDrawing}
        onMouseUp={finishDrawing}
        onMouseMove={draw}
        ref={canvasRef}
      />

      
    </div>
  );
}
