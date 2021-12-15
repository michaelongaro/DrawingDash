import React from 'react';
import { ColorChanger } from './ColorChanger';
import { ClearCanvasButton } from './ClearCanvas';

import classes from "./Controls.module.css";
import BrushSizeChanger from './BrushSizeChanger';

const Controls = () => {
  return (
    <div className={classes.contain}>
      <ColorChanger />
      <BrushSizeChanger />
      <ClearCanvasButton />
    </div>
  )
}

export default Controls
