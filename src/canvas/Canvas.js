import React, { useContext, useState, useEffect } from "react";

import { useAuth0 } from "@auth0/auth0-react";
import { v4 as uuidv4 } from "uuid";

import { CountdownCircleTimer } from "react-countdown-circle-timer";

import { useCanvas } from "./CanvasContext";
import WordsContext from "./WordsContext";
import RandomWords from "../components/layout/RandomWords";
import Controls from "./Controls";

import classes from "./Canvas.module.css";

export function Canvas() {
  const wordsCtx = useContext(WordsContext);

  const { user } = useAuth0();
  const [seconds, setSeconds] = useState(-1);
  const [drawingTime, setDrawingTime] = useState(0);

  const timerOptions = [
    { seconds: 60, colorArray: [60, 45, 30, 15] },
    { seconds: 180, colorArray: [180, 120, 60, 0] },
    { seconds: 300, colorArray: [300, 180, 120, 60] },
  ];
  const [startTimer, setStartTimer] = useState(false);
  const [currentTimer, setCurrentTimer] = useState(0);

  const [firstButtonAvailabilty, setFirstButtonAvailabilty] = useState(true);
  const [secondButtonAvailabilty, setSecondButtonAvailabilty] = useState(true);
  const [thirdButtonAvailabilty, setThirdButtonAvailabilty] = useState(true);

  const [showPromptContainer, setShowPromptContainer] = useState({
    display: "none",
  });

  const [showPrompt, setShowPrompt] = useState({
    display: "none",
  });

  const [showOptionsModal, setShowOptionsModal] = useState({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    gap: "2em",
    height: "100vh",
    fontSize: "15pt",
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
    if (drawingTime > 0) {
      setShowOptionsModal({
        display: "none",
      });

      setSeconds(3);

      setShowPromptContainer({
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      });

      setShowPrompt({
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
        userSelect: "none",
      });
    }
  }, [drawingTime]);

  useEffect(() => {
    if (seconds === -1) {
    } else if (seconds > 0) {
      setTimeout(() => setSeconds(seconds - 1), 1000);
    } else {
      setShowPromptContainer({
        display: "none",
      });

      setShowPrompt({
        display: "none",
      });

      setShowCanvas({
        display: "block",
      });

      setStartTimer(true);

      wordsCtx.makePostable();
    }
  }, [seconds]);

  useEffect(() => {
    prepareCanvas();
  }, []);

  useEffect(() => {
    if (wordsCtx.postable) {
      setTimeout(() => {
        setShowCanvas({
          display: "none",
        });

        const canvas = canvasRef.current;
        const title = wordsCtx.getPhrase(drawingTime);
        console.log(title);
        const [adj, noun] = title.split(" ");

        const today = new Date();
        const day = today.getDate();
        const month = today.getMonth() + 1;
        const year = today.getFullYear();

        const uniqueID = uuidv4();

        let canvasContents = canvas.toDataURL();
        let data = {
          index: uniqueID,
          image: canvasContents,
          adjective: adj,
          noun: noun,
          title: title,
          seconds: timerOptions[currentTimer].seconds,
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
          flexDirection: "column",
          alignItems: "center",
          fontSize: "15pt",
          backgroundColor: "rgb(255, 255, 255)",
          opacity: "75%",
          borderColor: "black",
          borderWidth: "1px",
          borderRadius: "5px",
          borderStyle: "solid",
        });

        setStartTimer(false);
        setSeconds(-1);
      }, timerOptions[currentTimer].seconds * 1000);
    }
  }, [wordsCtx.postable]);

  const renderTime = ({ remainingTime }) => {
    if (remainingTime === 0) {
      return (
        <div style={{ fontFamily: "Montserrat" }}>
          <div style={{ fontSize: "1em", userSelect: "none" }}>Time's Up!</div>
        </div>
      );
    }

    return (
      <div style={{ fontFamily: "Montserrat" }}>
        <div style={{ fontSize: "1em", userSelect: "none" }}>
          {remainingTime}
        </div>
      </div>
    );
  };

  return (
    <div className={classes.contain}>
      <div style={showOptionsModal}>
        <div>Select a drawing time</div>
        <div className={classes.horizContain}>
          <div className={classes.sidePadding}>
            <button
              disabled={!firstButtonAvailabilty}
              onClick={() => {
                setFirstButtonAvailabilty(false);
                // setDrawingTime(60000);
                setCurrentTimer(0);
              }}
            >
              1 Minute
            </button>
            <RandomWords time={60000} />
          </div>
          <div className={classes.sidePadding}>
            <button
              disabled={!secondButtonAvailabilty}
              onClick={() => {
                setSecondButtonAvailabilty(false);
                // setDrawingTime(180000);
                setCurrentTimer(1);
              }}
            >
              3 Minutes
            </button>
            <RandomWords time={180000} />
          </div>
          <div className={classes.sidePadding}>
            <button
              disabled={!thirdButtonAvailabilty}
              onClick={() => {
                setThirdButtonAvailabilty(false);
                // setDrawingTime(300000);
                setCurrentTimer(2);
              }}
            >
              5 Minutes
            </button>
            <RandomWords time={300000} />
          </div>
        </div>
      </div>

      <div style={showPromptContainer}>
        <RandomWords time={drawingTime} />
        <div style={showPrompt}>{seconds}</div>
        <Controls />
      </div>

      <div style={endMessage}>
        <div>Time's up!</div>
        <div>Doodle again:</div>
        <div className={classes.sidePadding}>
          <button
            disabled={!firstButtonAvailabilty}
            onClick={() => {
              setFirstButtonAvailabilty(false);
              setDrawingTime(60000);
            }}
          >
            1 Minute
          </button>
          <RandomWords time={60000} />
        </div>
        <div className={classes.sidePadding}>
          <button
            disabled={!secondButtonAvailabilty}
            onClick={() => {
              setSecondButtonAvailabilty(false);
              setDrawingTime(180000);
            }}
          >
            3 Minutes
          </button>
          <RandomWords time={180000} />
        </div>
        <div className={classes.sidePadding}>
          <button
            disabled={!thirdButtonAvailabilty}
            onClick={() => {
              setThirdButtonAvailabilty(false);
              setDrawingTime(300000);
            }}
          >
            5 Minutes
          </button>
          <RandomWords time={300000} />
        </div>
      </div>
      {/* ideally have opacity to show the previous picture below */}

      <div style={showCanvas}>
        <RandomWords time={drawingTime} />
        <div style={{ position: "relative" }}>
          <div className={classes.timer}>
            <CountdownCircleTimer
              isPlaying={startTimer}
              duration={timerOptions[currentTimer].seconds}
              size={75}
              colors={["#004777", "#F7B801", "#A30000", "#A30000"]}
              colorsTime={timerOptions[currentTimer].colorArray}
              // will have to look at how others reset -> implement maybe useEffect
              // for when timerDuration changes?
              // onComplete={() => ({ shouldRepeat: true, delay: 1 })}
            >
              {renderTime}
            </CountdownCircleTimer>
          </div>
          <canvas
            onMouseDown={startDrawing}
            onMouseUp={finishDrawing}
            onMouseMove={draw}
            ref={canvasRef}
          />
        </div>
        <Controls />
      </div>
    </div>
  );
}
