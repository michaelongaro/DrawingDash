import React, { useState, useEffect, useRef, useContext } from "react";

import { useAuth0 } from "@auth0/auth0-react";
import { v4 as uuidv4 } from "uuid";

import { CountdownCircleTimer } from "react-countdown-circle-timer";

import anime from "animejs/lib/anime.es.js";

import { useCanvas } from "./CanvasContext";
import DrawingSelectionContext from "./DrawingSelectionContext";
import PromptSelection from "./PromptSelection";
import Controls from "./Controls";

import CopyToClipboard from "../components/layout/CopyToClipboard";
import DownloadIcon from "../svgs/DownloadIcon";
import RedoIcon from "../svgs/RedoIcon";

import { getDatabase, ref, set, child, get, update } from "firebase/database";

import {
  getDownloadURL,
  getStorage,
  ref as ref_storage,
  uploadBytes,
} from "firebase/storage";

import { app } from "../util/init-firebase";

import classes from "./Canvas.module.css";

const DrawingScreen = () => {
  const DSCtx = useContext(DrawingSelectionContext);
  const { user } = useAuth0();

  const db = getDatabase(app);
  const dbRef = ref(getDatabase(app));
  const storage = getStorage();

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

  const [countdownTimer, setCountdownTimer] = useState(3);
  const [startTimer, setStartTimer] = useState(false);
  const [countdownKey, setCountdownKey] = useState(0);
  const [drawingTime, setDrawingTime] = useState(60);
  const [downloadedDrawing, setDownloadedDrawing] = useState();

  const [showPendingDownload, setShowPendingDownload] = useState(false);
  const [showPendingCopy, setShowPendingCopy] = useState(false);

  const drawingScreenRef = useRef(null);

  const {
    canvasRef,
    prepareCanvas,
    clearCanvas,
    finishDrawing,
    draw,
    getFloodFillStatus,
  } = useCanvas();

  function preventScrolling(e) {
    e.preventDefault();
  }

  useEffect(() => {
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
        drawingScreenRef.current.scrollIntoView({ behavior: "smooth" });
      },
    });
    //   complete: () => {
    //     anime({
    //       targets: "#countdownTimer",
    //       loop: false,

    //       innerText: 3,
    //       round: 1,
    //       opacity: [0, 1, 0],

    //       direction: "normal",
    //       duration: 1000,
    //       easing: "easeInSine",
    //       complete: () => {
    //         anime({
    //           targets: "#countdownTimer",
    //           loop: false,
    //           // delay: 1000,
    //           opacity: [0, 1, 0],

    //           innerText: 2,
    //           direction: "normal",
    //           round: 1,

    //           duration: 1000,
    //           easing: "easeInSine",
    //           complete: () => {
    //             anime({
    //               targets: "#countdownTimer",
    //               loop: false,
    //               // delay: 2000,
    //               opacity: [0, 1, 0],
    //               round: 1,

    //               innerText: 1,
    //               direction: "normal",
    //               duration: 1000,
    //               easing: "easeInSine",
    //             });
    //           },
    //         });
    //       },
    //     });
    //   },
    // });

    document.addEventListener("mousemove", draw);
    document.documentElement.addEventListener("mouseenter", draw, {
      once: true,
    });

    canvasRef.current.addEventListener("wheel", preventScrolling);
    let currentCanvasRef = canvasRef.current;

    return () => {
      document.removeEventListener("mousemove", draw);
      document.documentElement.removeEventListener(
        "mouseenter",

        draw,
        {
          once: true,
        }
      );

      currentCanvasRef.removeEventListener("wheel", preventScrolling);
    };
  }, []);

  console.log(getFloodFillStatus());

  const [showCanvas, setShowCanvas] = useState(false);

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
      setShowCountdownOverlay(classes.overlayBreathingBackground);
      setShowCanvasOutline(classes.canvasOutline);
      setShowCanvas(false);
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
        defaultRGB = {r:0,g:0,b:0}, // for non-supporting envs
        canvas = document.createElement('canvas'),
        context = canvas.getContext && canvas.getContext('2d'),
        data, width, height,
        i = -4,
        length,
        rgb = {r:0,g:0,b:0},
        count = 0;

    if (!context) {
        return defaultRGB;
    }

    height = canvas.height = imgEl.naturalHeight || imgEl.offsetHeight || imgEl.height;
    width = canvas.width = imgEl.naturalWidth || imgEl.offsetWidth || imgEl.width;

    context.drawImage(imgEl, 0, 0);

    try {
        data = context.getImageData(0, 0, width, height);
    } catch(e) {
        /* security error, img on diff domain */
        return defaultRGB;
    }

    length = data.data.length;

    while ( (i += blockSize * 4) < length ) {
        ++count;
        rgb.r += data.data[i];
        rgb.g += data.data[i+1];
        rgb.b += data.data[i+2];
    }

    // ~~ used to floor values
    rgb.r = ~~(rgb.r/count);
    rgb.g = ~~(rgb.g/count);
    rgb.b = ~~(rgb.b/count);

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

    // ${title.split(" ")[0]}${title.split(" ")[1]}

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
            console.log(url);
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

    console.log("removing listeners");
    document.removeEventListener("mousemove", draw);
    document.documentElement.removeEventListener(
      "mouseenter",

      draw,
      {
        once: true,
      }
    );

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

      setShowCanvas(true);

      setCountdownKey((prevKey) => prevKey + 1);
      setStartTimer(true);
    }
  }, [DSCtx.seconds]);

  useEffect(() => {
    prepareCanvas();
    const id = setTimeout(sendToDB, DSCtx.drawingTime * 1000 + 3015);

    return () => {
      clearTimeout(id);
    };
  }, []);

  function drawAgain() {
    anime({
      targets: "#drawingScreen",
      loop: false,
      translateX: window.innerWidth * 2,
      opacity: [1, 0],
      direction: "normal",
      duration: 450,
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
        position: "absolute",
        left: `${-1 * window.innerWidth}px`,
        top: "185px",
        width: "100vw",
      }}
      className={classes.flexContain}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: "1em",
        }}
      >
        <div
          ref={drawingScreenRef}
          className={classes.canvasBreathingBackground}
        >
          <div style={{ pointerEvents: "none", userSelect: "none" }}>{DSCtx.chosenPrompt}</div>

          <div className={classes.sharedContain}>
            <div className={`${showCanvasOutline} ${classes.startScreen}`}>
              {DSCtx.seconds}
            </div>

            <div
              className={classes.canvasStyles}
              style={{
                filter: showCanvas ? "" : "blur(3px)",
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
              <div className={classes.canvasBorder}>
                <canvas
                  style={{
                    cursor: `url('data:image/svg+xml;utf8,<svg id="svg" xmlns="http://www.w3.org/2000/svg" version="1.1" width="40" height="40"><circle cx="${
                      DSCtx.currentCursorSize
                    }" cy="${DSCtx.currentCursorSize}" r="${
                      DSCtx.currentCursorSize
                    }" style="fill: %23${DSCtx.currentColor.replace(
                      "#",
                      ""
                    )};stroke: ${
                      DSCtx.currentColor === "#FFFFFF" ? "%23c4c4c4" : "none"
                    }; strokeWidth:${
                      DSCtx.currentColor === "#FFFFFF" ? "1px" : "none"
                    }; "/></svg>') ${DSCtx.currentCursorSize} ${
                      DSCtx.currentCursorSize
                    }, pointer`,
                  }}
                  onMouseDown={draw}
                  onMouseUp={finishDrawing}
                  ref={canvasRef}
                />
              </div>
            </div>

            <div className={`${showEndOutline} ${classes.endScreen}`}>
              <div className={classes.endButtonContainer}>
                <button className={classes.drawAgainButton} onClick={drawAgain}>
                  <RedoIcon dimensions={"2em"} />
                  <div style={{fontSize: "1.25em"}}>Draw another prompt</div>
                </button>

                <div className={classes.orSeparator}>
                  <div className={classes.leadingLine}></div>
                  <div>OR</div>
                  <div className={classes.trailingLine}></div>
                </div>

                <div style={{ marginBottom: "1.25em" }}>Share your drawing!</div>

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
                        style={{ opacity: showPendingCopy && !downloadedDrawing ? 1 : 0 }}
                        className={classes.infoModal}
                      >
                        Upload in progress
                      </div>
                    </div>
                  </div>
                  {/* <div className={classes.fadingVerticalLine}></div> */}

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
                      <div
                        className={classes.download}
                        onClick={downloadDrawing}
                      >
                        <div>Download</div>
                        <DownloadIcon />
                      </div>
                      <div
                        style={{ opacity: showPendingDownload && !downloadedDrawing ? 1 : 0 }}
                        className={classes.infoModal}
                      >
                        Upload in progress
                      </div>
                    </div>
                  </div>
                </div>
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
