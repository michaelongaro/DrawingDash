import React, { useContext, useRef } from "react";

const CanvasContext = React.createContext();

export const CanvasProvider = ({ children }) => {
  let isDrawing = false;
  let lastEvent;

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
  };

  const changeBrushSize = (brushSize) => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.lineWidth = brushSize;
    contextRef.current = context;
  };

  const finishDrawing = () => {
    contextRef.current.closePath();
    isDrawing = false;
  };

  function getRelativePointFromEvent(ev, elem) {
    const bbox = elem.getBoundingClientRect();
    const x = ev.clientX - bbox.left;
    const y = ev.clientY - bbox.top;

    return { x, y };
  }

  const draw = (ev) => {
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
      
      if (was_offscreen && ev.buttons === 1 && isDrawing) {
        contextRef.current.lineTo(point.x, point.y);
        contextRef.current.stroke();
        finishDrawing();
        return;
      }
    } else if (was_offscreen) {
      const previous_point = getRelativePointFromEvent(
        previous_evt,
        canvasRef.current
      );
      if (ev.buttons === 1 && !isDrawing) {
        contextRef.current.beginPath();
        isDrawing = true;
      }
      contextRef.current.moveTo(previous_point.x, previous_point.y);
    } else {
      if (ev.buttons === 1 && !isDrawing) {
        contextRef.current.moveTo(point.x, point.y);

        contextRef.current.beginPath();
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
        finishDrawing,
        clearCanvas,
        draw,
      }}
    >
      {children}
    </CanvasContext.Provider>
  );
};

export const useCanvas = () => useContext(CanvasContext);
