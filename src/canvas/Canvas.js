import React, { useContext, useState, useEffect } from "react";

import { useAuth0 } from "@auth0/auth0-react";
import { v4 as uuidv4 } from "uuid";

import { CountdownCircleTimer } from "react-countdown-circle-timer";

import { useCanvas } from "./CanvasContext";
import WordsContext from "./WordsContext";
import RandomWords from "../components/layout/RandomWords";
import Controls from "./Controls";

// import { firebase } from "../util/init-firebase";
import {
  getDatabase,
  ref,
  set,
  child,
  get,
  update,
  remove,
  push,
} from "firebase/database";

import { app } from "../util/init-firebase";

import classes from "./Canvas.module.css";

// benefits of putting it outside of function?
// const db = firebase.database();

export function Canvas() {
  const wordsCtx = useContext(WordsContext);

  const { user } = useAuth0();
  const [seconds, setSeconds] = useState(-1);
  const [drawingTime, setDrawingTime] = useState(0);

  // const db = getDatabase(fb);

  const timerOptions = [
    { seconds: 60, colorArray: [60, 45, 30, 15] },
    { seconds: 180, colorArray: [180, 120, 60, 0] },
    { seconds: 300, colorArray: [300, 180, 120, 60] },
  ];
  const [startTimer, setStartTimer] = useState(false);
  const [currentTimer, setCurrentTimer] = useState(0);
  const [countdownKey, setCountdownKey] = useState(0);

  const [firstButtonAvailabilty, setFirstButtonAvailabilty] = useState(true);
  const [secondButtonAvailabilty, setSecondButtonAvailabilty] = useState(true);
  const [thirdButtonAvailabilty, setThirdButtonAvailabilty] = useState(true);

  const [countdownOverlay, setCountdownOverlay] = useState({
    display: "none",
  });

  const [canvasOutline, setCanvasOutline] = useState({
    display: "none",
  });

  const [startTimerSelectionsModal, setStartTimerSelectionsModal] = useState({
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

  const [endTimerSelectionsModal, setEndTimerSelectionsModal] = useState({
    display: "none",
  });

  const {
    canvasRef,
    prepareCanvas,
    clearCanvas,
    startDrawing,
    finishDrawing,
    draw,
  } = useCanvas();

  useEffect(() => {
    if (drawingTime > 0) {
      setStartTimerSelectionsModal({
        display: "none",
      });

      setSeconds(3);

      setCountdownOverlay({
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      });

      setCanvasOutline({
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
      setCountdownOverlay({
        display: "none",
      });

      setCanvasOutline({
        display: "none",
      });

      setEndTimerSelectionsModal({
        display: "none",
      });

      clearCanvas();

      setShowCanvas({
        // work on changing the gradient to the color selected (very very high opacity)
        background:
          "linear-gradient(0deg, rgba(64,64,64,1) 0%, rgba(204,204,204,1) 100%)",
        borderRadius: "25px",
        display: "grid",
        // justifyItems: "center",
        placeItems: "end center",
      });

      setCountdownKey((prevKey) => prevKey + 1);
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

        const [adj, noun] = title.split(" ");

        const today = new Date();
        const day = today.getDate();
        const month = today.getMonth() + 1;
        const year = today.getFullYear();

        const uniqueID = uuidv4();

        let canvasContents = canvas.toDataURL();

        const db = getDatabase(app);
        const dbRef = ref(getDatabase(app));

        // check to see if this title has already been drawn
        get(child(dbRef, `titles/${title}`)).then((snapshot) => {
          if (snapshot.exists()) {
            let prev_post = [snapshot.val()[title]["drawingID"]];
            prev_post.push(uniqueID);
            update(ref(db, "titles/" + title), {
              drawingID: prev_post,
            });
          } else {
            set(ref(db, "titles/" + title), {
              drawingID: [uniqueID],
            });
          }
        });

        set(ref(db, "drawings/" + uniqueID), {
          title: title,
          image: canvasContents,
          seconds: timerOptions[currentTimer].seconds,
          date: `${month}-${day}-${year}`,
          drawnBy: user.sub,
        });

        
        // just for user profile
        
        // check to see if this title has already been drawn
        get(child(dbRef, `users/${user.sub}/titles/${title}`)).then((snapshot) => {
          if (snapshot.exists()) {
            let prev_post = snapshot.val()[title]["drawingID"];
            prev_post.push(uniqueID);
            update(ref(db, `users/${user.sub}/titles/${title}`), {
              drawingID: prev_post,
            });
          } else {
            set(ref(db, `users/${user.sub}/titles/${title}`), {
              drawingID: [uniqueID],
            });
          }
        });

        set(ref(db, `users/${user.sub}/drawings/${uniqueID}`), {
          title: title,
          image: canvasContents,
          seconds: timerOptions[currentTimer].seconds,
          date: `${month}-${day}-${year}`,
          drawnBy: user.sub,
        });

        wordsCtx.resetPostable();

        setEndTimerSelectionsModal({
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
      <div style={startTimerSelectionsModal}>
        <div>Select a drawing time</div>
        <div className={classes.horizContain}>
          <div className={classes.sidePadding}>
            <button
              disabled={!firstButtonAvailabilty}
              onClick={() => {
                setFirstButtonAvailabilty(false);
                setDrawingTime(60);
                setCurrentTimer(0);
              }}
            >
              1 Minute
            </button>
            <RandomWords time={60} />
          </div>
          <div className={classes.sidePadding}>
            <button
              disabled={!secondButtonAvailabilty}
              onClick={() => {
                setSecondButtonAvailabilty(false);
                setDrawingTime(180);
                setCurrentTimer(1);
              }}
            >
              3 Minutes
            </button>
            <RandomWords time={180} />
          </div>
          <div className={classes.sidePadding}>
            <button
              disabled={!thirdButtonAvailabilty}
              onClick={() => {
                setThirdButtonAvailabilty(false);
                setDrawingTime(300);
                setCurrentTimer(2);
              }}
            >
              5 Minutes
            </button>
            <RandomWords time={300} />
          </div>
        </div>
      </div>

      <div style={countdownOverlay}>
        <RandomWords time={drawingTime} />
        <div style={canvasOutline}>{seconds}</div>
        <Controls />
      </div>

      <div style={endTimerSelectionsModal}>
        <div>Time's up!</div>
        <div>Doodle again:</div>
        <div className={classes.sidePadding}>
          <button
            disabled={!firstButtonAvailabilty}
            onClick={() => {
              setFirstButtonAvailabilty(false);
              setDrawingTime(60);
              setCurrentTimer(0);
            }}
          >
            1 Minute
          </button>
          <RandomWords time={60} />
        </div>
        <div className={classes.sidePadding}>
          <button
            disabled={!secondButtonAvailabilty}
            onClick={() => {
              setSecondButtonAvailabilty(false);
              setDrawingTime(180);
              setCurrentTimer(1);
            }}
          >
            3 Minutes
          </button>
          <RandomWords time={180} />
        </div>
        <div className={classes.sidePadding}>
          <button
            disabled={!thirdButtonAvailabilty}
            onClick={() => {
              setThirdButtonAvailabilty(false);
              setDrawingTime(300);
              setCurrentTimer(2);
            }}
          >
            5 Minutes
          </button>
          <RandomWords time={300} />
        </div>
      </div>
      {/* ideally have opacity to show the previous picture below */}

      <div style={showCanvas}>
        <RandomWords time={drawingTime} />
        <div style={{ position: "relative" }}>
          <div className={classes.timer}>
            <CountdownCircleTimer
              key={countdownKey}
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
