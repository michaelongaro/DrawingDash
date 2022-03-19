import React, { useContext, useRef, useEffect, useState } from "react";

const CanvasContext = React.createContext();

export const CanvasProvider = ({ children }) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [resetLastX, setResetLastX] = useState(false);
  const [resetLastY, setResetLastY] = useState(false);
  // let resetLastX;
  // let resetLastY;
  const canvasRef = useRef(null);
  const contextRef = useRef(null);

  //   useEffect(() => {
  //   resetLastX = false;
  //  resetLastY = false;
  //   }, []);

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

  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    let tempX = 0;
    let tempY = 0;
    if (nativeEvent.buttons === 1) {
      contextRef.current.beginPath();

      console.log(resetLastX, resetLastY);

      if (!resetLastX) {
        console.log("x should be reset to 0", tempX);
        tempX = offsetX;
        tempY = offsetY;
      } else {
        setResetLastX(false);
        if (offsetX > 0) {
          tempX = offsetX;
        }
        tempY = offsetY;  
      }

      // if (!resetLastY) {
      //   console.log("y should be reset to 0", tempY);

      //   tempY = offsetY - 104;
      // } else {
      //   setResetLastY(false);
      // }
      // tempY = offsetY
      console.log("started drawing", tempX, tempY);
      contextRef.current.moveTo(tempX, tempY);

      setIsDrawing(true);
    }
  };

  const finishDrawing = () => {
    contextRef.current.closePath();
    setIsDrawing(false);
  };

  const recordLastPos = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;

    if (offsetX < 0) {
      setResetLastX(true);
    } else {
      setResetLastX(false);
    }
    if (offsetY < 0) {
      setResetLastY(true);
    } else {
      setResetLastY(false);
    }

    console.log("reset Statuses", resetLastX, offsetX, resetLastY, offsetY);
    finishDrawing();
  };

  const draw = ({ nativeEvent }) => {
    if (!isDrawing) {
      return;
    }

    const { offsetX, offsetY } = nativeEvent;

    // let tempX = 0;
    // let tempY = 0;

    // if (!resetLastX) {
    //   tempX = offsetX;
    // }

    // if (!resetLastY) {
    //   tempY = offsetY;
    // }
    console.log("drawing", offsetX, offsetY);

    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
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
        recordLastPos,
        changeBrushSize,
        startDrawing,
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
