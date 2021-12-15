import React from 'react'
import { useCanvas } from './CanvasContext';

import classes from "./BrushSizeChanger.module.css";

const BrushSizeChanger = () => {
  const { changeBrushSize } = useCanvas();
  // once selected, give a black inner border around the button
  return (
    <>
      <button className={classes.rounded} onClick={() => changeBrushSize(5)}></button>
      <button className={classes.rounded} onClick={() => changeBrushSize(10)}></button>
      <button className={classes.rounded} onClick={() => changeBrushSize(15)}></button>

    </>
  );
}

export default BrushSizeChanger
