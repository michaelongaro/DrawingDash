import React, { useState, useEffect } from "react";

import { Slide } from "react-slideshow-image";
import "react-slideshow-image/dist/styles.css";

import FiveMinuteIcon from "../../svgs/FiveMinuteIcon";
import OneMinuteIcon from "../../svgs/OneMinuteIcon";
import ThreeMinuteIcon from "../../svgs/ThreeMinuteIcon";

import "./SlideShowStyles.css";
import classes from "./SlideShow.module.css";
import baseClasses from "../../index.module.css";

const SlideShow = ({ pinnedDrawings, pinnedMetadata, username }) => {
  console.log(pinnedDrawings, pinnedMetadata);

  const [currentSlideshowTitle, setCurrentSlideshowTitle] = useState("");

  const fallbackBackgroundColors = [
    "rgba(255, 0, 0, .3)",
    "rgba(255, 255, 0, .3)",
    "rgba(0, 255, 0, .3)",
  ];

  const properties = {
    duration: 5000,
    autoplay: true,
    transitionDuration: 500,
    pauseOnHover: true,
    arrows: true,
    indicators: (i) => {
      if (i === 0) {
        return (
          <div className={"durationIndicator"}>
            <OneMinuteIcon dimensions={"2.25em"} />
          </div>
        );
      }
      if (i === 1) {
        return (
          <div className={"durationIndicator"}>
            <ThreeMinuteIcon dimensions={"2.25em"} />
          </div>
        );
      }
      if (i === 2) {
        return (
          <div className={"durationIndicator"}>
            <FiveMinuteIcon dimensions={"2.25em"} />
          </div>
        );
      }
    },
    infinite: true,
    easing: "ease",
    onChange: (previous, next) => {
      setCurrentSlideshowTitle(
        pinnedMetadata[next] === "" ? "" : pinnedMetadata[next].title
      );
    },
  };

  useEffect(() => {
    console.log((pinnedDrawings, pinnedMetadata));

    setCurrentSlideshowTitle(
      pinnedMetadata[0] === "" ? "" : pinnedMetadata[0].title
    );
  }, []);

  return (
    <>
      <Slide {...properties}>
        {pinnedDrawings.map((drawing, index) => (
          <div key={index}>
            {drawing === "" ? (
              <div
                style={{
                  gap: ".5em",

                  backgroundColor: fallbackBackgroundColors[index],
                  borderRadius: "1em",
                  height: "12.0625em",
                  userSelect: "none",
                }}
                className={baseClasses.baseVertFlex}
              >
                <div>{username}</div>
                <div style={{ gap: ".5em" }} className={baseClasses.baseFlex}>
                  <div>hasn't selected a</div>
                  {index === 0 && <OneMinuteIcon dimensions={"2.5em"} />}
                  {index === 1 && <ThreeMinuteIcon dimensions={"2.5em"} />}
                  {index === 2 && <FiveMinuteIcon dimensions={"2.5em"} />}
                </div>
                <div>drawing yet</div>
              </div>
            ) : (
              <img draggable="false" src={drawing} alt="Slideshow" />
            )}
          </div>
        ))}
      </Slide>

      <div style={{ minHeight: "1.5em" }}>{currentSlideshowTitle}</div>
    </>
  );
};

export default SlideShow;
