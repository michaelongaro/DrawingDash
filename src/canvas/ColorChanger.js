import React from "react";
import { useCanvas } from "./CanvasContext";

import classes from "./ColorChanger.module.css";

export const ColorChanger = () => {
  const { changeColor } = useCanvas();
  // once selected, give a black inner border around the button
  // want to give the button a border, and remove all other button's borders  
  return (
    <>
     {/* i guess when you click inside the funciton you will add the class, and then map through the other buttons*/}
      {/* and then maybe you need the buttons in an array? ah is kinda so cringe, look up in stackoverflow */}
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
