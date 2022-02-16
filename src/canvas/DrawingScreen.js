import React, { useState, useEffect, useContext } from "react";

import { useAuth0 } from "@auth0/auth0-react";
import { v4 as uuidv4 } from "uuid";

import { CountdownCircleTimer } from "react-countdown-circle-timer";

import { useCanvas } from "./CanvasContext";
import DrawingSelectionContext from "./DrawingSelectionContext";
import PromptSelection from "./PromptSelection";
import RandomWords from "../components/layout/RandomWords";
import WordsContext from "./WordsContext";
import Controls from "./Controls";

import { getDatabase, ref, set, child, get, update } from "firebase/database";

import { app } from "../util/init-firebase";

import classes from "./Canvas.module.css";

const DrawingScreen = () => {

  const DSCtx = useContext(DrawingSelectionContext);
  const wordsCtx = useContext(WordsContext);
  const { user } = useAuth0();

  const [allowResetOfDrawing, setAllowResetOfDrawing] = useState(true);

  const timerOptions = [
    { seconds: 60, colorArray: [60, 45, 30, 15] },
    { seconds: 180, colorArray: [180, 120, 60, 0] },
    { seconds: 300, colorArray: [300, 180, 120, 60] },
  ];

  const currentTimer = {
    60: 0,
    180: 1,
    300: 2,
  };
  const [startTimer, setStartTimer] = useState(false);
  const [countdownKey, setCountdownKey] = useState(0);
  const [drawingTime, setDrawingTime] = useState(60);

  const {
    canvasRef,
    prepareCanvas,
    clearCanvas,
    startDrawing,
    finishDrawing,
    draw,
  } = useCanvas();

  const [showCanvas, setShowCanvas] = useState(classes.hide);

  const [showCountdownOverlay, setShowCountdownOverlay] = useState(
    classes.overlayBreathingBackground
  );

  const [showCanvasOutline, setShowCanvasOutline] = useState(
    classes.canvasOutline
  );

  const [showEndOverlay, setShowEndOverlay] = useState(classes.hide);
  const [showEndOutline, setShowEndOutline] = useState(classes.hide);

  useEffect(() => {
    if (!DSCtx.showPaletteChooser) {
      // should probably throw a classes.hide for all things when user comes to this
      // page again after it has been loaded already
      setShowCountdownOverlay(classes.overlayBreathingBackground);
      setShowCanvasOutline(classes.canvasOutline);
      setShowCanvas(classes.hide);
    }
  }, [DSCtx.showPaletteChooser]);

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

  const sendToDB = () => {
    setShowCanvas(classes.hide);

    const canvas = canvasRef.current;
    const title = wordsCtx.getPhrase(drawingTime);

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
      seconds: timerOptions[currentTimer[drawingTime]].seconds,
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
      seconds: timerOptions[currentTimer[drawingTime]].seconds,
      date: `${month}-${day}-${year}`,
      drawnBy: user.sub,
    });

    wordsCtx.resetPostable();

    DSCtx.setShowEndOverlay(true);
    DSCtx.setShowEndOutline(true);

    setStartTimer(false);
    DSCtx.setDrawingTime(0);
  };

  useEffect(() => {
    if (DSCtx.drawingTime > 0) {
      setDrawingTime(DSCtx.drawingTime);
    }
  }, [DSCtx.drawingTime]);

  useEffect(() => {
    if (DSCtx.showEndOverlay && DSCtx.showEndOutline) {
      setShowEndOverlay(classes.overlayBreathingBackground);
      setShowEndOutline(classes.canvasOutline);
    } else {
      setShowEndOverlay(classes.hide);
      setShowEndOutline(classes.hide);
    }
  }, [DSCtx.showEndOverlay, DSCtx.showEndOutline]);

  useEffect(() => {
    if (DSCtx.seconds > 0) {
      setTimeout(() => DSCtx.setSeconds(DSCtx.seconds - 1), 1000);
    } else {
      setShowCountdownOverlay(classes.hide);
      setShowCanvasOutline(classes.hide);

      clearCanvas();

      setShowCanvas(classes.canvasBreathingBackground);

      setCountdownKey((prevKey) => prevKey + 1);
      setStartTimer(true);
      console.log(DSCtx.seconds, "should be 0");
      wordsCtx.makePostable();
    }
  }, [DSCtx.seconds]);

  useEffect(() => {
    prepareCanvas();
    const id = setTimeout(
      sendToDB,
      timerOptions[currentTimer[drawingTime]].seconds * 1000 + 3
    );

    return () => {
      clearTimeout(id);
    };
  }, []);


  return (
    <div>
      <div className={showCountdownOverlay}>
        <RandomWords time={drawingTime} />
        <div className={showCanvasOutline}>{DSCtx.seconds}</div>
        <Controls />
      </div>

      <div className={showEndOverlay}>
        <RandomWords time={drawingTime} />
        <div
          className={showEndOutline}
          style={{ fontSize: "1em" }}
        >
          <PromptSelection />
        </div>
        <Controls />
      </div>

      <div className={showCanvas}>
        <RandomWords time={drawingTime} />
        <div style={{ position: "relative" }}>
          <div className={classes.timer}>
            <CountdownCircleTimer
              key={countdownKey}
              isPlaying={startTimer}
              duration={timerOptions[currentTimer[drawingTime]].seconds}
              size={75}
              colors={["#004777", "#F7B801", "#A30000", "#A30000"]}
              colorsTime={timerOptions[currentTimer[drawingTime]].colorArray}
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
};

export default DrawingScreen;
