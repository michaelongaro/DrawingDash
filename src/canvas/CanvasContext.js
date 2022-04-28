import React, { useState, useContext, useRef } from "react";

const CanvasContext = React.createContext();

export const CanvasProvider = ({ children }) => {
  let isDrawing = false;
  let lastEvent;

  const [floodFillStatus, setFloodFillStatus] = useState(false);
  const [currentColor, setCurrentColor] = useState("#FFFFFF");

  const canvasRef = useRef(null);
  const contextRef = useRef(null);

  const prepareCanvas = () => {
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
    context.imageSmoothingEnabled = true;
    contextRef.current = context;
  };

  const changeColor = (color) => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.strokeStyle = color;
    contextRef.current = context;
    setCurrentColor(color);
  };

  const changeBrushSize = (brushSize) => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.lineWidth = brushSize;
    contextRef.current = context;
  };

  const toggleFloodFill = () => {
    setFloodFillStatus((prevStatus) => {
      console.log("flood fill should be", !prevStatus);
      return !prevStatus;
    });
  };

  function getColorAtPixel(imageData, x, y) {
    const { width, data } = imageData;

    return {
      r: data[4 * (width * y + x) + 0],
      g: data[4 * (width * y + x) + 1],
      b: data[4 * (width * y + x) + 2],
      a: data[4 * (width * y + x) + 3],
    };
  }

  function setColorAtPixel(imageData, color, x, y) {
    const { width, data } = imageData;

    data[4 * (width * y + x) + 0] = color.r & 0xff;
    data[4 * (width * y + x) + 1] = color.g & 0xff;
    data[4 * (width * y + x) + 2] = color.b & 0xff;
    data[4 * (width * y + x) + 3] = color.a & 0xff;
  }

  function colorMatch(a, b) {
    return a.r === b.r && a.g === b.g && a.b === b.b && a.a === b.a;
  }

  function floodFill(imageData, newColor, x, y) {
    const { width, height, data } = imageData;
    const stack = [];
    const baseColor = getColorAtPixel(imageData, x, y);
    let operator = { x, y };

    // Check if base color and new color are the same
    if (colorMatch(baseColor, newColor)) {
      return;
    }

    // Add the clicked location to stack
    stack.push({ x: operator.x, y: operator.y });

    while (stack.length) {
      operator = stack.pop();
      let contiguousDown = true; // Vertical is assumed to be true
      let contiguousUp = true; // Vertical is assumed to be true
      let contiguousLeft = false;
      let contiguousRight = false;

      // Move to top most contiguousDown pixel
      while (contiguousUp && operator.y >= 0) {
        operator.y--;
        contiguousUp = colorMatch(
          getColorAtPixel(imageData, operator.x, operator.y),
          baseColor
        );
      }

      // Move downward
      while (contiguousDown && operator.y < height) {
        setColorAtPixel(imageData, newColor, operator.x, operator.y);

        // Check left
        if (
          operator.x - 1 >= 0 &&
          colorMatch(
            getColorAtPixel(imageData, operator.x - 1, operator.y),
            baseColor
          )
        ) {
          if (!contiguousLeft) {
            contiguousLeft = true;
            stack.push({ x: operator.x - 1, y: operator.y });
          }
        } else {
          contiguousLeft = false;
        }

        // Check right
        if (
          operator.x + 1 < width &&
          colorMatch(
            getColorAtPixel(imageData, operator.x + 1, operator.y),
            baseColor
          )
        ) {
          if (!contiguousRight) {
            stack.push({ x: operator.x + 1, y: operator.y });
            contiguousRight = true;
          }
        } else {
          contiguousRight = false;
        }

        operator.y++;
        contiguousDown = colorMatch(
          getColorAtPixel(imageData, operator.x, operator.y),
          baseColor
        );
      }
    }
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
    floodFill(imageData, col, x, y);
    ctx.putImageData(imageData, 0, 0);
    contextRef.current = ctx;
    contextRef.current.beginPath();
  }

  const finishDrawing = () => {
    if (!floodFillStatus && isDrawing) {
      contextRef.current.closePath();
      contextRef.current.beginPath();
      isDrawing = false;
    }
  };

  function getRelativePointFromEvent(ev, elem) {
    const bbox = elem.getBoundingClientRect();
    const x = ev.clientX - bbox.left;
    const y = ev.clientY - bbox.top;

    return { x, y };
  }

  function isValid(prevx, prevy, x, y) {
    return Math.abs(x - prevx) <= 5 && Math.abs(y - prevy) <= 5;
  }

  const draw = (ev) => {
    // not sure how you are able to draw while in paintbucket when this is a condition below
    if (floodFillStatus) {
      floodFillHandler(ev);
      return;
    }

    const previous_evt = lastEvent || {};
    const was_offscreen = previous_evt.offscreen;

    if (ev.isTrusted) {
      const { clientX, clientY } = ev;
      lastEvent = { clientX, clientY };
    }

    const point = getRelativePointFromEvent(ev, canvasRef.current);

    if (
      point.x < 0 ||
      point.y < 0 ||
      point.x > canvasRef.current.width ||
      point.y > canvasRef.current.height
    ) {
      lastEvent.offscreen = true;

      const previous_point = getRelativePointFromEvent(
        previous_evt,
        canvasRef.current
      );

      if (was_offscreen && ev.buttons === 1 && isDrawing) {
        if (isValid(previous_point.x, previous_point.y, point.x, point.y)) {
          contextRef.current.lineTo(point.x, point.y);
          contextRef.current.stroke();
          finishDrawing();
          return;
        }
      }
    } else if (was_offscreen) {
      const previous_point = getRelativePointFromEvent(
        previous_evt,
        canvasRef.current
      );

      if (ev.buttons === 1 && !isDrawing) {
        contextRef.current.moveTo(previous_point.x, previous_point.y);

        isDrawing = true;
      }
    } else {
      if (ev.buttons === 1 && !isDrawing) {
        contextRef.current.moveTo(point.x, point.y);
        isDrawing = true;
      }
    }

    if (ev.buttons === 1 && isDrawing) {
      contextRef.current.lineTo(point.x, point.y);
      contextRef.current.stroke();
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <CanvasContext.Provider
      value={{
        canvasRef,
        contextRef,
        prepareCanvas,
        changeColor,
        changeBrushSize,
        toggleFloodFill,
        finishDrawing,
        clearCanvas,
        draw,
        floodFillStatus,
      }}
    >
      {children}
    </CanvasContext.Provider>
  );
};

export const useCanvas = () => useContext(CanvasContext);
