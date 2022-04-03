import React, { useState, useEffect } from 'react'

import { Slide } from "react-slideshow-image";
import "react-slideshow-image/dist/styles.css";

const SlideShow = (props) => {

  const [currentSlideshowTitle, setCurrentSlideshowTitle] = useState("");

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
      setCurrentSlideshowTitle(props.pinnedDrawings[next].title);
    },
  };

  useEffect(() => {
    setCurrentSlideshowTitle(props.pinnedDrawings[0].title)
  }, []);

  return (
    <>
      <div>{currentSlideshowTitle}</div>
          <Slide {...properties}>
            {props.pinnedDrawings.map((each, index) => (
              <div key={index} >
                <img draggable="false" src={each.image} alt="Slideshow" />
              </div>
            ))}
          </Slide>
    </>
  )
}

export default SlideShow