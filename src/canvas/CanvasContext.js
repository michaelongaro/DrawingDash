import React, { useContext, useRef, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

const CanvasContext = React.createContext();

export const CanvasProvider = ({ children }) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef(null);
  const contextRef = useRef(null);

  const prepareCanvas = () => {
    const canvas = canvasRef.current;
    // canvas.width = window.innerWidth * 2;
    // canvas.height = window.innerHeight * 2;
    const mod_width = window.innerWidth * 0.75;
    const mod_height = window.innerHeight * 0.75;
    canvas.width = mod_width;
    canvas.height = mod_height;
    canvas.style.width = `${mod_width}px`;
    canvas.style.height = `${mod_height}px`;

    const context = canvas.getContext("2d");
    // context.scale(2, 2);
    context.lineCap = "round";
    context.strokeStyle = "black";
    context.lineWidth = 5;
    contextRef.current = context;
  };

  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  const finishDrawing = () => {
    contextRef.current.closePath();
    setIsDrawing(false);
  };

  const draw = ({ nativeEvent }) => {
    if (!isDrawing) {
      return;
    }
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height);
  };

  const UploadCanvas = () => {
    const { user, isAuthenticated } = useAuth0();
    console.log("it is on");
    const canvas = canvasRef.current;

    let canvasContents = canvas.toDataURL(); // a data URL of the current canvas image
    console.log(canvasContents);
    let data = { image: canvasContents, title: "hello", date: Date.now() };
    let string = JSON.stringify(data);

    // create a blob object representing the data as a JSON string
    let file = new Blob([string], {
      type: "application/json",
    });

    fetch(`https://drawing-app-18de5-default-rtdb.firebaseio.com/1234.json`, {
      method: "POST",
      body: JSON.stringify(file),
      headers: {
        "Content-Type": "application/json",
      },
    }).then(() => {
      console.log("hello");
    });
  };

  return (
    <CanvasContext.Provider
      value={{
        canvasRef,
        contextRef,
        prepareCanvas,
        startDrawing,
        finishDrawing,
        clearCanvas,
        draw,
        UploadCanvas,
      }}
    >
      {children}
    </CanvasContext.Provider>
  );
};

export const useCanvas = () => useContext(CanvasContext);
