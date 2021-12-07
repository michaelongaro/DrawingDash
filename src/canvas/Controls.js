import React from 'react';
import { ColorChanger } from './ColorChanger';
import { ClearCanvasButton } from './ClearCanvas';

import classes from "./Controls.module.css";

const Controls = () => {
  return (
    <div className={classes.contain}>
      <ColorChanger />
      <ClearCanvasButton />
    </div>
  )
}

export default Controls
