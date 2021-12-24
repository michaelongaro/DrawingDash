import React, { useContext, useState, useEffect } from "react";
import { useCanvas } from "./CanvasContext";
import { useAuth0 } from "@auth0/auth0-react";
import WordsContext from "./WordsContext";

import { v4 as uuidv4 } from 'uuid';

import classes from "./Canvas.module.css";

export function Canvas() {
  const wordsCtx = useContext(WordsContext);

  const { user } = useAuth0();
  const [seconds, setSeconds] = useState(3);

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
  const [endMessage, setEndMessage] = useState({
    display: "none",
  });

  const { canvasRef, prepareCanvas, startDrawing, finishDrawing, draw } =
    useCanvas();

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

      wordsCtx.makePostable();
    }
  }, [seconds]);

  useEffect(() => {
    prepareCanvas();
  }, []);

  useEffect(() => {
    console.log(wordsCtx.postable);
    if (wordsCtx.postable) {
      setTimeout(() => {
        setShowCanvas({
          display: "none",
        });

        const canvas = canvasRef.current;
        const title = `${wordsCtx.adj} ${wordsCtx.n}`;

        const today = new Date();
        const day = today.getDate();
        const month = today.getMonth() + 1;
        const year = today.getFullYear();

        const uniqueID = uuidv4();
        console.log(uniqueID);

        let canvasContents = canvas.toDataURL();
        let data = {
          index: uniqueID,
          image: canvasContents,
          adjective: wordsCtx.adj,
          noun: wordsCtx.n,
          title: title,
          date: `${month}-${day}-${year}`,
        };
        let urlString = JSON.stringify(data);

        let file = new Blob([urlString], {
          type: "application/json",
        });

        fetch(
          `https://drawing-dash-41f14-default-rtdb.firebaseio.com//${user.sub}.json`,
          {
            method: "POST",
            body: file,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        wordsCtx.resetPostable();

        setEndMessage({
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
      }, 33000);
    }
  }, [wordsCtx.postable]);

  return (
    <div className={classes.contain}>
      <div style={showPrompt}>{seconds}</div>
      <div style={endMessage}>Time's up!</div>
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
