import React, { useState, useContext, useEffect, useRef } from "react";

import floodFill from "../util/floodfill";

const CanvasContext = React.createContext();

export const CanvasProvider = ({ children }) => {
  let isDrawing = useRef(false);

  let lastEvent;

  const previousFillStyle = useRef("#FFFFFF");

  const [mouseInsideOfCanvas, setMouseInsideOfCanvas] = useState(false);
  const [currentColor, setCurrentColor] = useState("#FFFFFF");

  const previousDrawingSnapshots = useRef([]);
  const floodFillStatusRef = useRef(false);
  const ableToFloodFill = useRef(false);
  const drawingOutsideCanvas = useRef(false);
  const mouseInsideOfCanvasRef = useRef(false);
  const newFloodFillAdded = useRef(false);

  const [prevNumSnapshots, setPrevNumSnapshots] = useState(0);
  const [floodFillStatus, setFloodFillStatus] = useState(false);

  const canvasRef = useRef(null);
  const contextRef = useRef(null);

  function prepareCanvas() {
    const canvas = canvasRef.current;
    const mod_width = window.innerWidth * 0.75;
    const mod_height = window.innerHeight * 0.75;

    canvas.width = mod_width;
    canvas.height = mod_height;
    canvas.style.width = `${mod_width}px`;
    canvas.style.height = `${mod_height}px`;

    const context = canvas.getContext("2d");
    context.lineCap = "round";
    context.lineJoin = "round";
    context.lineWidth = 8;
    // context.imageSmoothingEnabled = false;

    contextRef.current = context;
  }

  function changeColor(color) {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.strokeStyle = color;
    context.fillStyle = color;
    previousFillStyle.current = color;
    console.log("fill and stroke got changed to", color);
    contextRef.current = context;
    setCurrentColor(color);
  }

  function changeBrushSize(brushSize) {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.lineWidth = brushSize;
    contextRef.current.closePath();
    isDrawing.current = false;

    contextRef.current = context;
  }

  function toggleFloodFill() {
    ableToFloodFill.current = true;
    floodFillStatusRef.current = !floodFillStatusRef.current;
    setFloodFillStatus((prevStatus) => {
      return !prevStatus;
    });
  }

  function resetAbleToFloodFill() {
    ableToFloodFill.current = true;
  }

  function getColorAtPixel(imageData, x, y) {
    const { width, data } = imageData;

    return {
      r: data[4 * (width * y + x) + 0],
      g: data[4 * (width * y + x) + 1],
      b: data[4 * (width * y + x) + 2],
      a: data[4 * (width * y + x) + 3],
    };
  }

  function colorMatch(a, b) {
    return a.r === b.r && a.g === b.g && a.b === b.b && a.a === b.a;
  }

  const hexToRGB = (hex) =>
    hex
      .replace(
        /^#?([a-f\d])([a-f\d])([a-f\d])$/i,
        (m, r, g, b) => "#" + r + r + g + g + b + b
      )
      .substring(1)
      .match(/.{2}/g)
      .map((x) => parseInt(x, 16));

  function luminance(r, g, b) {
    var a = [r, g, b].map(function (v) {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  }

  function contrast(rgb1, rgb2) {
    let adjRGB1 = [rgb1["r"], rgb1["g"], rgb1["b"]];
    let adjRGB2 = [rgb2["r"], rgb2["g"], rgb2["b"]];

    var lum1 = luminance(adjRGB1[0], adjRGB1[1], adjRGB1[2]);
    var lum2 = luminance(adjRGB2[0], adjRGB2[1], adjRGB2[2]);
    var brightest = Math.max(lum1, lum2);
    var darkest = Math.min(lum1, lum2);
    return (brightest + 0.05) / (darkest + 0.05);
  }

  function floodFillHandler(event) {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    const col = {
      r: hexToRGB(currentColor)[0],
      g: hexToRGB(currentColor)[1],
      b: hexToRGB(currentColor)[2],
      a: 255,
    };

    const rect = canvas.getBoundingClientRect();

    // could probably just do offsetX/Y
    const x = Math.round(event.clientX - rect.left);
    const y = Math.round(event.clientY - rect.top);

    // if currently hovered color and color to fill with are the same, return
    if (
      !colorMatch(getColorAtPixel(imageData, x, y), col) &&
      !newFloodFillAdded.current
    ) {
      let tolerance = 50;

      // if contrast between fill color and color to be filled is <= 3,
      // lower tolerance so that the filled in color won't bleed out of
      // where it's supposed to fill
      if (contrast(getColorAtPixel(imageData, x, y), col) <= 3.0) {
        tolerance = 10;
      }
      floodFill.fill(x, y, tolerance, ctx, null, null, null);
      contextRef.current = ctx;
      newFloodFillAdded.current = true;
    }

    ableToFloodFill.current = false;
  }

  useEffect(() => {
    mouseInsideOfCanvasRef.current = mouseInsideOfCanvas;
  }, [mouseInsideOfCanvas]);

  function finishDrawing(overrideMouseInsideCanvas = false) {
    let adjustedMouseInsideCanvas =
      typeof overrideMouseInsideCanvas === "boolean"
        ? overrideMouseInsideCanvas
        : false;

    console.log(newFloodFillAdded.current);

    if (drawingOutsideCanvas.current && !adjustedMouseInsideCanvas) {
      takeSnapshot();
      drawingOutsideCanvas.current = false;
    } else if (!drawingOutsideCanvas.current) {
      // okay actually need to add ANOTHER freaking state here to see
      // whether the floodfill that you are trying to add will actually go through
      // maybe could use ableToFloodFill? idk look at that ish
      if (
        isDrawing.current &&
        mouseInsideOfCanvasRef.current &&
        !adjustedMouseInsideCanvas
      ) {
        takeSnapshot();
      } else if (
        floodFillStatusRef.current &&
        mouseInsideOfCanvasRef.current &&
        !adjustedMouseInsideCanvas &&
        newFloodFillAdded.current
      ) {
        console.log("snapshot taken and resetting ish to false");
        takeSnapshot();
      }
    }

    if (
      !floodFillStatusRef.current &&
      isDrawing.current &&
      (mouseInsideOfCanvasRef.current || adjustedMouseInsideCanvas)
    ) {
      contextRef.current.closePath();
      contextRef.current.beginPath();

      isDrawing.current = false;

      lastEvent = null;
    }

    // test again, with this on the outside it should be 100% gucci ngl
    newFloodFillAdded.current = false;
  }

  function getRelativePointFromEvent(ev, elem) {
    const bbox = elem.getBoundingClientRect();
    const x = ev.clientX - bbox.left;
    const y = ev.clientY - bbox.top;

    return { x, y };
  }

  function undo() {
    // if there is <= 1 snapshots in array just empty array and fill canvas with white
    if (previousDrawingSnapshots.current.length <= 1) {
      previousDrawingSnapshots.current = [];
      setPrevNumSnapshots(0);
      clearCanvas();
    } else {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      // removing last elem since that is the screenshot we are trying to replace
      previousDrawingSnapshots.current.pop();

      ctx.putImageData(
        previousDrawingSnapshots.current[
          previousDrawingSnapshots.current.length - 1
        ],
        0,
        0
      );
      setPrevNumSnapshots((prevNum) => prevNum - 1);

      contextRef.current = ctx;
      contextRef.current.beginPath(); // necessary?
    }
  }

  function takeSnapshot() {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let lastDrawingSnapshot = ctx.getImageData(
      0,
      0,
      canvas.width,
      canvas.height
    );

    previousDrawingSnapshots.current.push(lastDrawingSnapshot);
    setPrevNumSnapshots((prevNum) => prevNum + 1);

    console.log(previousDrawingSnapshots.current.length);
  }

  function draw(ev) {
    const canvas = canvasRef.current;

    const previous_evt = lastEvent || {};
    const was_offscreen = previous_evt.offscreen;

    if (ev.isTrusted) {
      const { clientX, clientY } = ev;
      lastEvent = { clientX, clientY };
    }

    const point = getRelativePointFromEvent(ev, canvasRef.current);

    if (floodFillStatusRef.current && ev.buttons === 1) {
      // if able to fill and mouse is currently inside canvas, fill
      if (
        ableToFloodFill.current &&
        point.x > 0 &&
        point.y > 0 &&
        point.x < canvasRef.current.width &&
        point.y < canvasRef.current.height
      ) {
        floodFillHandler(ev);
        return;
      }
    }

    if (!floodFillStatusRef.current) {
      // case for if mouse is outside bounds of canvas
      if (
        point.x < 0 ||
        point.y < 0 ||
        point.x > canvasRef.current.width ||
        point.y > canvasRef.current.height
      ) {
        // if last mouse position was offscreen too
        if (was_offscreen) {
          const previous_point = getRelativePointFromEvent(
            previous_evt,
            canvasRef.current
          );

          lastEvent.offscreen = true;
          if (ev.buttons === 1) {
            if (!isDrawing.current) {
              contextRef.current.moveTo(previous_point.x, previous_point.y);

              isDrawing.current = true;
            }
          } else {
            contextRef.current.closePath();

            isDrawing.current = false;
          }
        }
        // if this is a new occurance of mouse offscreen
        else {
          if (ev.buttons === 1) {
            lastEvent.offscreen = true;

            if (isDrawing.current) {
              contextRef.current.lineTo(point.x, point.y);
              finishDrawing(true);

              // this lets next call to finishDrawing know whether user has a current
              // path that they are drawing
              drawingOutsideCanvas.current = true;
              contextRef.current.stroke();
              return;
            }
          } else {
            contextRef.current.closePath();

            isDrawing.current = false;
          }
        }
      }
      // if mouse is inside the canvas, clicking, but hasn't started drawing yet
      else {
        if (ev.buttons === 1 && !isDrawing.current) {
          contextRef.current.moveTo(point.x, point.y);
          // contextRef.current.clearRect(0, 0, canvas.width, canvas.height);
          contextRef.current.beginPath();
          isDrawing.current = true;
        }
      }

      // if mouse is inside the canvas, clicking, will draw like normal
      if (ev.buttons === 1 && isDrawing.current) {
        contextRef.current.lineTo(point.x, point.y);
        contextRef.current.stroke();
      }
    }
  }

  function clearCanvas(snapshot = false) {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height);

    // resetting previous fillStyle post clear
    context.fillStyle = previousFillStyle.current;

    if (snapshot) {
      takeSnapshot();
    }
  }

  return (
    <CanvasContext.Provider
      value={{
        canvasRef,
        contextRef,
        mouseInsideOfCanvas: mouseInsideOfCanvas,
        floodFillStatus: floodFillStatus,
        prevNumSnapshots: prevNumSnapshots,
        setMouseInsideOfCanvas: setMouseInsideOfCanvas,
        setFloodFillStatus: setFloodFillStatus,
        prepareCanvas,
        changeColor,
        changeBrushSize,
        floodFillHandler,
        resetAbleToFloodFill,
        toggleFloodFill,
        finishDrawing,
        clearCanvas,
        takeSnapshot,
        draw,
        undo,
      }}
    >
      {children}
    </CanvasContext.Provider>
  );
};

export const useCanvas = () => useContext(CanvasContext);
