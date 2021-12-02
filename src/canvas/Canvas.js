import React, { useState, useEffect } from "react";
import { useCanvas } from "./CanvasContext";
import { useAuth0 } from "@auth0/auth0-react";
import RandomWords from "../components/layout/RandomWords";

import classes from "./Canvas.module.css";

export function Canvas() {
  const { user, isAuthenticated } = useAuth0();
  // maybe need a "showSetSeconds" state here to get rid of the seconds
  const [seconds, setSeconds] = useState(3);
  // const [timer, setTimer] = useState(30);
  const [showPrompt, setShowPrompt] = useState({
    width: window.innerWidth * 0.75,
    height: window.innerHeight * 0.75,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "30pt",
    backgroundColor: "rgb(255, 255, 255)",
    borderColor: "black",
    borderWidth: "1px",
    borderRadius: "5px",
    borderStyle: "solid",
  });
  const [showCanvas, setShowCanvas] = useState({
    display: "none",
  });

  const { canvasRef, prepareCanvas, startDrawing, finishDrawing, draw } =
    useCanvas();

  useEffect(() => {
    prepareCanvas();
    setTimeout(() => UploadCanvas(), 33000);
  }, []);

  useEffect(() => {
    if (seconds > 0) {
      setTimeout(() => setSeconds(seconds - 1), 1000);
    } else {
      setShowPrompt({
        display: "none",
      });
      setShowCanvas({
        display: "block",
      });
    }
  }, [seconds]);

  // export this function as it's own thing, and 
  function UploadCanvas() {
    const canvas = canvasRef.current;

    let canvasContents = canvas.toDataURL(); // a data URL of the current canvas image
    let data = { image: canvasContents, title: "hello", date: Date.now() };
    let string = JSON.stringify(data);

    // create a blob object representing the data as a JSON string
    let file = new Blob([string], {
      type: "application/json",
    });

    fetch(
      `https://drawing-app-18de5-default-rtdb.firebaseio.com/${user.sub}.json`,
      {
        method: "POST",
        body: file,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  return (
    <div className={classes.contain}>
      <RandomWords />
      <div style={showPrompt}>{seconds}</div>
      <canvas
        style={showCanvas}
        onMouseDown={startDrawing}
        onMouseUp={finishDrawing}
        onMouseMove={draw}
        ref={canvasRef}
      />
    </div>
  );
}
