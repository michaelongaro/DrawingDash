import React from "react";
import { useCanvas } from "./CanvasContext";

import classes from "./ColorChanger.module.css";

export const ColorChanger = () => {
  const { changeColor } = useCanvas();
  // once selected, give a black inner border around the button
  return (
    <>
      <button className={classes.rounded} style={{backgroundColor: "black"}} onClick={() => changeColor("black")}></button>
      <button className={classes.rounded} style={{backgroundColor: "red"}} onClick={() => changeColor("red")}></button>
      <button className={classes.rounded} style={{backgroundColor: "blue"}} onClick={() => changeColor("blue")}></button>
      <button className={classes.rounded} style={{backgroundColor: "yellow"}} onClick={() => changeColor("yellow")}></button>
      <button className={classes.rounded} style={{backgroundColor: "brown"}} onClick={() => changeColor("brown")}></button>
      <button className={classes.rounded} style={{backgroundColor: "green"}} onClick={() => changeColor("green")}></button>
      <button className={classes.rounded} style={{backgroundColor: "orange"}} onClick={() => changeColor("orange")}></button>
      <button className={classes.rounded} style={{backgroundColor: "purple"}} onClick={() => changeColor("purple")}></button>
      <button className={classes.rounded} style={{backgroundColor: "white"}} onClick={() => changeColor("white")}></button>
    </>
  );
};
