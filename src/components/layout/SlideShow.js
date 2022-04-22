import React, { useState, useEffect } from "react";

import { Slide } from "react-slideshow-image";
import "react-slideshow-image/dist/styles.css";

import classes from "./SlideShow.module.css";

const SlideShow = ({ pinnedDrawings, metadata }) => {
  const [currentSlideshowTitle, setCurrentSlideshowTitle] = useState("");
  const [currentSlideshowDuration, setCurrentSlideshowDuration] = useState("");

  const properties = {
    duration: 5000,
    autoplay: true,
    transitionDuration: 500,
    pauseOnHover: true,
    arrows: true,
    indicators: true,
    infinite: true,
    easing: "ease",
    onChange: (previous, next) => {
      setCurrentSlideshowTitle(metadata[next].title);
      setCurrentSlideshowDuration(metadata[next].seconds);
    },
  };

  // should have the duration svg be right to the left of the title

  useEffect(() => {
    setCurrentSlideshowTitle(metadata[0].title);
  }, []);

  return (
    <>
      <Slide {...properties}>
        {pinnedDrawings.map((drawing, index) => (
          <div key={index}>
            <img draggable="false" src={drawing} alt="Slideshow" />
          </div>
        ))}
      </Slide>
      <div>{currentSlideshowTitle}</div>
    </>
  );
};

export default SlideShow;
