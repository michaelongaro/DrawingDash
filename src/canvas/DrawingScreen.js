import React, { useState, useEffect, useRef, useContext } from "react";

import Countdown from "react-countdown";
import { useAuth0 } from "@auth0/auth0-react";
import { v4 as uuidv4 } from "uuid";

import { CountdownCircleTimer } from "react-countdown-circle-timer";

import anime from "animejs/lib/anime.es.js";
import isEqual from "lodash/isEqual";

import formatTime from "../util/formatTime";

import { useCanvas } from "./CanvasContext";
import DrawingSelectionContext from "./DrawingSelectionContext";
import Controls from "./Controls";
import { getCursorPaintbucketIcon } from "../svgs/cursorPaintbucketIcon";

import CopyToClipboard from "../components/layout/CopyToClipboard";
import DownloadIcon from "../svgs/DownloadIcon";
import RedoIcon from "../svgs/RedoIcon";
import LogInButton from "../oauth/LogInButton";

import {
  getDatabase,
  ref,
  set,
  onValue,
  child,
  get,
  update,
} from "firebase/database";

import {
  getDownloadURL,
  getStorage,
  ref as ref_storage,
  uploadBytes,
} from "firebase/storage";

import { app } from "../util/init-firebase";

import classes from "./Canvas.module.css";
import baseClasses from "../index.module.css";

const DrawingScreen = () => {
  const DSCtx = useContext(DrawingSelectionContext);
  const { user, isLoading, isAuthenticated } = useAuth0();

  const db = getDatabase(app);
  const dbRef = ref(getDatabase(app));
  const storage = getStorage();

  const timerOptions = [
    { seconds: 60, colorArray: [45, 30, 15, 0] },
    { seconds: 180, colorArray: [135, 90, 45, 0] },
    { seconds: 300, colorArray: [225, 150, 75, 0] },
  ];

  const currentTimer = {
    60: 0,
    180: 1,
    300: 2,
  };

  const [initComponentWidth, setInitComponentWidth] = useState(1920);

  const [startTimer, setStartTimer] = useState(false);
  const [countdownKey, setCountdownKey] = useState(0);
  const [drawingTime, setDrawingTime] = useState(60);
  const [downloadedDrawing, setDownloadedDrawing] = useState();

  const [showPendingDownload, setShowPendingDownload] = useState(false);
  const [showPendingCopy, setShowPendingCopy] = useState(false);

  const [showCountdownTimer, setShowCountdownTimer] = useState(false);
  const [resetAtDate, setResetAtDate] = useState(
    "January 01, 2030 00:00:00 GMT+03:00"
  );

  const [initAnimationDelayCompleted, setInitAnimationDelayCompleted] =
    useState(false);

  const drawingScreenRef = useRef(null);
  const canvasContainerRef = useRef(null);

  const {
    canvasRef,
    prepareCanvas,
    clearCanvas,
    finishDrawing,
    draw,
    resetAbleToFloodFill,
    floodFillStatus,
    setMouseInsideOfCanvas,
  } = useCanvas();

  function preventScrolling(e) {
    e.preventDefault();
  }

  useEffect(() => {
    // clearing canvas and preparing it to be drawn on
    prepareCanvas();

    // setting current time to reset prompts at
    onValue(ref(db, "masterDateToResetPromptsAt"), (snapshot) => {
      if (snapshot.exists()) {
        setResetAtDate(snapshot.val());
      }
    });

    anime({
      targets: "#drawingScreen",
      loop: false,
      translateX: window.innerWidth,
      opacity: [0, 1],
      direction: "normal",
      duration: 250,
      easing: "easeInSine",
      complete: () => {
        // scrolling down to canvas after progress bar +
        canvasContainerRef.current.scrollIntoView({ behavior: "smooth" });
      },
    });

    // 3-2-1 countdown animation
    console.log("animation stated");
    anime({
      targets: "#threeCountdown",
      loop: false,

      delay: 500,

      keyframes: [
        {
          top: ["-75px", 0],
          opacity: [0, 1],
          scale: [0, 1],
          easing: "easeOutElastic(2.5, .6)",
          duration: 500,
        },
        { opacity: 1, scale: 1, duration: 400 },
        {
          top: [0, "75px"],
          opacity: [1, 0],
          scale: [1, 0],
          easing: "easeInSine",
          duration: 150,
        },
      ],

      direction: "normal",
      duration: 1000,
    });

    anime({
      targets: "#twoCountdown",
      loop: false,

      delay: 1500,

      keyframes: [
        {
          top: ["-75px", 0],
          opacity: [0, 1],
          scale: [0, 1],
          easing: "easeOutElastic(2.5, .6)",
          duration: 500,
        },
        { opacity: 1, scale: 1, duration: 400 },
        {
          top: [0, "75px"],
          opacity: [1, 0],
          scale: [1, 0],
          easing: "easeInSine",
          duration: 150,
        },
      ],

      direction: "normal",
      duration: 1000,
    });

    anime({
      targets: "#oneCountdown",
      loop: false,

      delay: 2500,

      keyframes: [
        {
          top: ["-75px", 0],
          opacity: [0, 1],
          scale: [0, 1],
          easing: "easeOutElastic(2.5, .6)",
          duration: 500,
        },
        { opacity: 1, scale: 1, duration: 400 },
        {
          top: [0, "75px"],
          opacity: [1, 0],
          scale: [1, 0],
          easing: "easeInSine",
          duration: 150,
        },
      ],

      direction: "normal",
      duration: 1000,
    });

    let initAnimDelayID = setTimeout(() => {
      setInitAnimationDelayCompleted(true);
    }, 500);

    return () => {
      clearTimeout(initAnimDelayID);
    };
  }, []);

  useEffect(() => {
    setInitComponentWidth(window.innerWidth);
  }, []);

  useEffect(() => {
    // adding eventlisteners only when canvas is available to be interacted with
    let currentCanvasRef = null;
    if (initAnimationDelayCompleted && DSCtx.seconds === 0) {
      document.addEventListener("mousemove", draw);
      document.addEventListener("mouseup", resetAbleToFloodFill);
      document.addEventListener("mouseup", finishDrawing);

      document.addEventListener("touchmove", draw);
      document.addEventListener("touchend", resetAbleToFloodFill);
      document.addEventListener("touchend", finishDrawing);

      document.documentElement.addEventListener("mouseenter", draw, {
        once: true,
      });

      canvasRef.current.addEventListener("wheel", preventScrolling);
      canvasRef.current.addEventListener("touchstart", preventScrolling);
      canvasRef.current.addEventListener("touchmove", preventScrolling);

      currentCanvasRef = canvasRef.current;
    }

    return () => {
      document.removeEventListener("mousemove", draw);
      document.removeEventListener("mouseup", resetAbleToFloodFill);
      document.removeEventListener("mouseup", finishDrawing);

      document.removeEventListener("touchmove", draw);
      document.removeEventListener("touchend", resetAbleToFloodFill);
      document.removeEventListener("touchend", finishDrawing);

      document.documentElement.removeEventListener(
        "mouseenter",

        draw,
        {
          once: true,
        }
      );

      if (currentCanvasRef) {
        currentCanvasRef.removeEventListener("wheel", preventScrolling);
        currentCanvasRef.removeEventListener("touchstart", preventScrolling);
        currentCanvasRef.removeEventListener("touchmove", preventScrolling);
      }
    };
  }, [DSCtx.seconds, initAnimationDelayCompleted]);

  const [showCanvas, setShowCanvas] = useState(false);

  const [showCountdownOverlay, setShowCountdownOverlay] = useState(
    classes.overlayBreathingBackground
  );

  const [showCanvasOutline, setShowCanvasOutline] = useState(
    classes.canvasOutline
  );

  const [showEndOverlay, setShowEndOverlay] = useState(classes.hide);
  const [showEndOutline, setShowEndOutline] = useState(false);

  useEffect(() => {
    if (!DSCtx.showPaletteChooser) {
      setShowCountdownOverlay(classes.overlayBreathingBackground);
      setShowCanvasOutline(classes.canvasOutline);
      setShowCanvas(false);
    }
  }, [DSCtx.showPaletteChooser]);

  useEffect(() => {
    if (DSCtx.drawingTime > 0) {
      setDrawingTime(DSCtx.drawingTime);
    }
  }, [DSCtx.drawingTime]);

  useEffect(() => {
    if (DSCtx.showEndOverlay && DSCtx.showEndOutline) {
      setShowEndOutline(true);
    } else {
      setShowEndOutline(false);
    }
  }, [DSCtx.showEndOverlay, DSCtx.showEndOutline]);

  useEffect(() => {
    if (initAnimationDelayCompleted) {
      if (DSCtx.seconds > 0) {
        setTimeout(() => DSCtx.setSeconds(DSCtx.seconds - 1), 1000);
      } else {
        setShowCountdownOverlay(classes.hide);
        setShowCanvasOutline(classes.hide);

        clearCanvas();

        setShowCanvas(true);

        setCountdownKey((prevKey) => prevKey + 1);
        setStartTimer(true);
      }
    }
  }, [DSCtx.seconds, initAnimationDelayCompleted]);

  useEffect(() => {
    let id = null;

    // drawingTime will only be non-zero when coming from palette selection page
    // all other renders of this effect w/ zero values are not run

    if (DSCtx.drawingTime !== 0) {
      if (!isLoading && isAuthenticated) {
        id = setTimeout(sendToDB, DSCtx.drawingTime * 1000 + 3600);
      } else if (!isLoading && !isAuthenticated) {
        id = setTimeout(
          updateUserLocalStorage,
          DSCtx.drawingTime * 1000 + 3600
        );
      }
    }

    return () => {
      clearTimeout(id);
    };
  }, [isLoading, isAuthenticated, DSCtx.drawingTime]);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      if (
        DSCtx.drawingStatuses["60"] &&
        DSCtx.drawingStatuses["180"] &&
        DSCtx.drawingStatuses["300"] &&
        DSCtx.drawingStatuses["extra"]
      ) {
        setShowCountdownTimer(true);
      }
    } else if (!isLoading && !isAuthenticated) {
      if (
        DSCtx.drawingStatuses["60"] &&
        DSCtx.drawingStatuses["180"] &&
        DSCtx.drawingStatuses["300"]
      ) {
        setShowCountdownTimer(true);
      }
    }
    // added isload and auth here, not sure why they weren't there before - 7/13
  }, [isLoading, isAuthenticated, DSCtx.drawingStatuses]);

  function updateUserLocalStorage() {
    if (DSCtx.drawingTime === 0 || DSCtx.drawingTime === undefined) return;

    DSCtx.setDrawingTime(0);

    setShowCanvas(false);

    let currentStorageValues = JSON.parse(
      localStorage.getItem("unregisteredUserInfo")
    );

    const canvas = canvasRef.current;
    const title = DSCtx.chosenPrompt;

    // eventually have this turn into full words when in fullscreen modal
    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();

    const uniqueID = uuidv4();

    let averageImageRGB = getAverageRGB(canvas);

    // adding actual drawing

    if (currentStorageValues.drawings === "") {
      currentStorageValues.drawings = {};
    }
    currentStorageValues["drawings"][`${uniqueID}`] =
      canvas.toDataURL("image/jpeg");

    // adding misc drawing data
    currentStorageValues["drawingMetadata"][`${uniqueID}`] = {
      title: title,
      seconds: DSCtx.drawingTime,
      date: `${month}/${day}/${year}`,
      drawnBy: null,
      averageColor: averageImageRGB,
      index: uniqueID,
    };

    // if user is completing a (now) old prompt, then don't update
    // their drawingStatuses
    if (!Object.values(DSCtx.dailyPrompts).includes(DSCtx.currentPrompt)) {
      let tempUpdatedStatuses = DSCtx.drawingStatuses;

      tempUpdatedStatuses[DSCtx.drawingTime] = true;

      // updating daily completed prompts in localStorage
      currentStorageValues["dailyCompletedPrompts"] = tempUpdatedStatuses;
      // updating daily completed prompts in context
      DSCtx.setDrawingStatuses(tempUpdatedStatuses);
      DSCtx.setDrawingStatusRefreshes((refreshes) => refreshes + 1);
    }

    // actually setting user localstorage with all updated values
    localStorage.setItem(
      "unregisteredUserInfo",
      JSON.stringify(currentStorageValues)
    );

    DSCtx.setShowEndOverlay(true);
    DSCtx.setShowEndOutline(true);

    document.removeEventListener("mousemove", draw);
    document.removeEventListener("mouseup", resetAbleToFloodFill);
    document.removeEventListener("mouseup", finishDrawing);

    document.documentElement.removeEventListener(
      "mouseenter",

      draw,
      {
        once: true,
      }
    );

    setStartTimer(false);
  }

  const renderTime = ({ remainingTime }) => {
    if (remainingTime === 0) {
      return (
        <div className={baseClasses.baseVertFlex}>
          <div style={{ fontSize: ".85em" }}>Time's</div>
          <div style={{ fontSize: ".85em" }}>Up!</div>
        </div>
      );
    }

    return (
      <div>
        <div style={{ fontSize: "1em", userSelect: "none" }}>
          {remainingTime}
        </div>
      </div>
    );
  };

  // refactor later so that you aren't repeating same function over and over
  // const pushToDB = (pushDrawing, seconds, pushToProfile) => {
  //   if (pushDrawing) {

  //   }
  // }

  function downloadDrawing() {
    var url = `${downloadedDrawing}`;
    var xhr = new XMLHttpRequest();
    xhr.responseType = "blob";

    xhr.onload = function () {
      var a = document.createElement("a");
      a.href = window.URL.createObjectURL(xhr.response);

      a.download = `${DSCtx.chosenPrompt}.jpeg`;
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
    };

    xhr.open("GET", url);
    xhr.send();
  }

  // used to find average color used in image to use as a background gradient
  // on gallary item bottom banner
  function getAverageRGB(imgEl) {
    var blockSize = 5, // only visit every 5 pixels
      defaultRGB = { r: 0, g: 0, b: 0 }, // for non-supporting envs
      canvas = document.createElement("canvas"),
      context = canvas.getContext && canvas.getContext("2d"),
      data,
      width,
      height,
      i = -4,
      length,
      rgb = { r: 0, g: 0, b: 0 },
      count = 0;

    if (!context) {
      return defaultRGB;
    }

    height = canvas.height =
      imgEl.naturalHeight || imgEl.offsetHeight || imgEl.height;
    width = canvas.width =
      imgEl.naturalWidth || imgEl.offsetWidth || imgEl.width;

    context.drawImage(imgEl, 0, 0);

    try {
      data = context.getImageData(0, 0, width, height);
    } catch (e) {
      /* security error, img on diff domain */
      return defaultRGB;
    }

    length = data.data.length;

    while ((i += blockSize * 4) < length) {
      ++count;
      rgb.r += data.data[i];
      rgb.g += data.data[i + 1];
      rgb.b += data.data[i + 2];
    }

    // ~~ used to floor values
    rgb.r = ~~(rgb.r / count);
    rgb.g = ~~(rgb.g / count);
    rgb.b = ~~(rgb.b / count);

    return rgb;
  }

  function postTitle(seconds, id, title, profileDest = "") {
    let destination = `${profileDest}titles/${seconds}/${title}`;

    get(child(dbRef, destination)).then((snapshot) => {
      if (snapshot.exists()) {
        let prev_post = snapshot.val()["drawingID"];
        prev_post.push(id);
        update(ref(db, destination), {
          drawingID: prev_post,
        });
      } else {
        set(ref(db, destination), {
          drawingID: [id],
        });
      }
    });
  }

  const sendToDB = () => {
    if (DSCtx.drawingTime === 0 || DSCtx.drawingTime === undefined) return;

    DSCtx.setDrawingTime(0);

    setShowCanvas(false);

    const canvas = canvasRef.current;
    const title = DSCtx.chosenPrompt;

    // eventually have this turn into full words when in fullscreen modal
    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();

    const uniqueID = uuidv4();

    let averageImageRGB = getAverageRGB(canvas);

    canvas.toBlob(function (blob) {
      var image = new Image();
      image.src = blob;

      // averageImageRGB = getAverageRGB(image);

      var uploadTask = ref_storage(storage, `drawings/${uniqueID}.jpg`);
      uploadBytes(uploadTask, blob, {
        contentType: "image/jpeg",
      }).then((result) => {
        getDownloadURL(ref_storage(storage, `drawings/${uniqueID}.jpg`)).then(
          (url) => {
            setDownloadedDrawing(url);
          }
        );
      });
    });

    // posting titles w/ drawing ref ids
    postTitle(DSCtx.drawingTime, uniqueID, title);
    postTitle(DSCtx.drawingTime, uniqueID, title, `users/${user.sub}/`);

    // adding drawing to totalDrawings count in db
    get(child(dbRef, "totalDrawings")).then((snapshot) => {
      if (snapshot.exists()) {
        set(ref(db, "totalDrawings"), {
          count: snapshot.val().count + 1,
        });
      } else {
        set(ref(db, "totalDrawings"), {
          count: 1,
        });
      }
    });

    // initalizing likes counters
    set(ref(db, `drawingLikes/${DSCtx.drawingTime}/${uniqueID}`), {
      totalLikes: 0,
      dailyLikes: 0,
    });

    // posting drawing misc data object
    set(ref(db, `drawings/${uniqueID}`), {
      title: title,
      seconds: DSCtx.drawingTime,
      date: `${month}/${day}/${year}`,
      drawnBy: user.sub,
      averageColor: averageImageRGB,
      index: uniqueID,
    });

    DSCtx.setShowEndOverlay(true);
    DSCtx.setShowEndOutline(true);

    document.removeEventListener("mousemove", draw);
    document.documentElement.removeEventListener(
      "mouseenter",

      draw,
      {
        once: true,
      }
    );

    // if user is completing a (now) old prompt, then don't update
    // their drawingStatuses
    if (!Object.values(DSCtx.dailyPrompts).includes(DSCtx.currentPrompt)) {
      let tempUpdatedStatuses = DSCtx.drawingStatuses;
      if (
        tempUpdatedStatuses["60"] &&
        tempUpdatedStatuses["180"] &&
        tempUpdatedStatuses["300"]
      ) {
        tempUpdatedStatuses["extra"] = true;
      } else {
        tempUpdatedStatuses[DSCtx.drawingTime] = true;
      }
      set(
        ref(db, `users/${user.sub}/completedDailyPrompts`),
        tempUpdatedStatuses
      );
    }

    setStartTimer(false);
  };

  function drawAgain() {
    document.getElementById("root").scrollIntoView({ behavior: "smooth" });

    anime({
      targets: "#drawingScreen",
      loop: false,
      translateX: window.innerWidth * 2,
      opacity: [1, 0],
      direction: "normal",
      duration: 500,
      easing: "easeInSine",
      complete: function () {
        DSCtx.updatePBStates("resetToSelectBar", true);
        DSCtx.resetSelections();
      },
    });
  }

  return (
    <div
      id={"drawingScreen"}
      style={{
        position: "relative",
        left: `${-1 * initComponentWidth}px`,
        top: "5vh",
        width: "100vw",
      }}
      ref={drawingScreenRef}
      className={classes.flexContain}
    >
      <div
        style={{
          marginTop: "3em",
        }}
      >
        <div
          ref={canvasContainerRef}
          className={classes.canvasBreathingBackground}
        >
          <div style={{ userSelect: "none", margin: "0.15em 0" }}>
            {DSCtx.chosenPrompt}
          </div>

          <div className={classes.sharedContain}>
            <div
              style={{ zIndex: showCanvasOutline ? 500 : -1 }}
              className={`${showCanvasOutline} ${classes.startScreen}`}
            >
              <div
                style={{ position: "relative", width: "100%", height: "100%" }}
                className={baseClasses.baseFlex}
              >
                <div
                  style={{
                    position: "relative",
                    width: "27px",
                    height: "72px",
                  }}
                  className={baseClasses.baseFlex}
                >
                  <div
                    id={"threeCountdown"}
                    style={{
                      position: "absolute",
                      top: 0,
                      opacity: 0,
                    }}
                  >
                    3
                  </div>
                  <div
                    id={"twoCountdown"}
                    style={{
                      position: "absolute",
                      top: 0,
                      opacity: 0,
                    }}
                  >
                    2
                  </div>
                  <div
                    id={"oneCountdown"}
                    style={{
                      position: "absolute",
                      top: 0,
                      opacity: 0,
                    }}
                  >
                    1
                  </div>
                </div>
              </div>
            </div>

            <div
              className={classes.canvasStyles}
              style={{
                filter: showCanvas ? "" : "blur(3px)",
                transition: showCanvas ? "" : "all 500ms",
              }}
            >
              <div className={classes.timer}>
                <CountdownCircleTimer
                  key={countdownKey}
                  isPlaying={startTimer}
                  duration={timerOptions[currentTimer[drawingTime]].seconds}
                  size={75}
                  colors={["#4fe912", "#e6ee11", "#eea211", "#ee2011"]}
                  colorsTime={
                    timerOptions[currentTimer[drawingTime]].colorArray
                  }
                >
                  {renderTime}
                </CountdownCircleTimer>
              </div>
              <div
                style={{ display: "block" }}
                className={classes.canvasBorder}
              >
                <canvas
                  // className={classes.canvas}
                  style={{
                    // width: "100% !important",
                    // height: "100% !important",
                    // objectFit: "contain",
                    cursor: floodFillStatus
                      ? // paintbucket cursor svg
                        getCursorPaintbucketIcon(
                          DSCtx.currentColor.replace("#", "")
                        )
                      : // regular selected color cursor svg
                        `url('data:image/svg+xml;utf8,<svg id="svg" xmlns="http://www.w3.org/2000/svg" version="1.1" width="40" height="40"><circle cx="${
                          DSCtx.currentCursorSize
                        }" cy="${DSCtx.currentCursorSize}" r="${
                          DSCtx.currentCursorSize
                        }" style="fill: %23${DSCtx.currentColor.replace(
                          "#",
                          ""
                        )}; stroke: ${
                          DSCtx.currentColor === "#FFFFFF" ? "%23c4c4c4" : ""
                        }; strokeWidth:${
                          DSCtx.currentColor === "#FFFFFF" ? "1px" : "0"
                        }; "/></svg>') ${DSCtx.currentCursorSize} ${
                          DSCtx.currentCursorSize
                        }, pointer`,
                  }}
                  onMouseDown={draw}
                  onTouchStart={draw}
                  onMouseEnter={() => {
                    setMouseInsideOfCanvas(true);
                  }}
                  onMouseLeave={() => {
                    setMouseInsideOfCanvas(false);
                  }}
                  ref={canvasRef}
                />
              </div>
            </div>

            <div
              style={{
                opacity: showEndOutline ? 1 : 0,
                pointerEvents: showEndOutline ? "auto" : "none",
                backgroundColor: showEndOutline
                  ? "rgba(255,255,255, .2)"
                  : "rgba(255,255,255, .001)",
                transform: showEndOutline ? "scale(1)" : "scale(0)",
              }}
              className={`${classes.canvasOutline} ${classes.endScreen}`}
            >
              <div className={classes.endButtonContainer}>
                {showCountdownTimer ? (
                  <div
                    className={`${classes.promptRefreshTimer} ${baseClasses.baseVertFlex}`}
                  >
                    <div className={baseClasses.baseFlex}>
                      New prompts refresh in
                    </div>
                    <Countdown
                      date={resetAtDate}
                      renderer={formatTime}
                      onComplete={() => setShowCountdownTimer(false)}
                    />
                  </div>
                ) : (
                  <button
                    className={classes.drawAgainButton}
                    onClick={() => {
                      // unregistered users don't get the access to the extra prompt so only need to check
                      // if drawingStatuses values are all true (completed)
                      if (
                        !isEqual(Object.values(DSCtx.drawingStatuses), [
                          true,
                          true,
                          true,
                        ])
                      ) {
                        drawAgain();
                      }
                    }}
                  >
                    <RedoIcon dimensions={"2em"} />
                    <div
                      style={{
                        opacity:
                          !isLoading &&
                          !isAuthenticated &&
                          isEqual(Object.values(DSCtx.drawingStatuses), [
                            true,
                            true,
                            true,
                          ])
                            ? 0.4
                            : 1,
                        cursor:
                          !isLoading &&
                          !isAuthenticated &&
                          isEqual(Object.values(DSCtx.drawingStatuses), [
                            true,
                            true,
                            true,
                          ])
                            ? "auto"
                            : "pointer",
                        fontSize: "1.25em",
                      }}
                    >
                      Draw another prompt
                    </div>
                  </button>
                )}

                {!isLoading && !isAuthenticated ? (
                  <button
                    style={{ margin: "1em 0" }}
                    className={classes.registerPromoContainer}
                  >
                    <div
                      style={{ gap: "1em" }}
                      className={`${classes.signInButtonContainer} ${baseClasses.baseFlex}`}
                    >
                      <LogInButton forceShowSignUp={true} />
                      <div>or</div>
                      <LogInButton forceShowSignUp={false} />
                    </div>

                    <div style={{ width: "60%" }}>
                      to publish your drawing and gain full access to all
                      features!
                    </div>
                  </button>
                ) : (
                  <>
                    <div className={classes.orSeparator}>
                      <div
                        style={{
                          width: showCountdownTimer ? "7em" : "5em",
                          marginRight: showCountdownTimer ? "0" : ".5em",
                        }}
                        className={classes.leadingLine}
                      ></div>
                      <div
                        style={{
                          display: showCountdownTimer ? "none" : "block",
                        }}
                      >
                        or
                      </div>
                      <div
                        style={{
                          width: showCountdownTimer ? "7em" : "5em",
                          marginLeft: showCountdownTimer ? "0" : ".5em",
                        }}
                        className={classes.trailingLine}
                      ></div>
                    </div>

                    <div style={{ marginBottom: "1.25em" }}>
                      Share your drawing!
                    </div>

                    <div className={classes.baseFlex}>
                      <div
                        style={{
                          opacity: !downloadedDrawing ? 0.5 : 1,
                          cursor: !downloadedDrawing ? "auto" : "pointer",
                          transition: "200ms all",
                        }}
                        onMouseEnter={() => {
                          if (!showPendingCopy && !downloadedDrawing)
                            setShowPendingCopy(true);
                        }}
                        onMouseLeave={() => {
                          setShowPendingCopy(false);
                        }}
                      >
                        <div style={{ position: "relative" }}>
                          <CopyToClipboard url={downloadedDrawing} />
                          <div
                            style={{
                              opacity:
                                showPendingCopy && !downloadedDrawing ? 1 : 0,
                            }}
                            className={classes.infoModal}
                          >
                            Upload in progress
                          </div>
                        </div>
                      </div>

                      <div
                        style={{
                          opacity: !downloadedDrawing ? 0.5 : 1,
                          cursor: !downloadedDrawing ? "auto" : "pointer",
                          transition: "200ms all",
                        }}
                        onMouseEnter={() => {
                          if (!showPendingDownload && !downloadedDrawing)
                            setShowPendingDownload(true);
                        }}
                        onMouseLeave={() => {
                          setShowPendingDownload(false);
                        }}
                      >
                        <div style={{ position: "relative" }}>
                          <button
                            style={{
                              display: "flex",
                              gap: "0.75em",
                              fontSize: "16px",
                            }}
                            className={`${baseClasses.activeButton} ${baseClasses.baseFlex}`}
                            onClick={downloadDrawing}
                          >
                            <div>Download</div>
                            <DownloadIcon color={"#FFF"} />
                          </button>
                          <div
                            style={{
                              opacity:
                                showPendingDownload && !downloadedDrawing
                                  ? 1
                                  : 0,
                            }}
                            className={classes.infoModal}
                          >
                            Upload in progress
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          <Controls />
        </div>
      </div>
    </div>
  );
};

export default DrawingScreen;
