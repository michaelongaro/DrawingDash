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
  const [currentSlideshowTitle, setCurrentSlideshowTitle] = useState("");

  const [showTempBaselineSkeleton, setShowTempBaselineSkeleton] =
    useState(true);

  useEffect(() => {
    const timerID = setTimeout(() => setShowTempBaselineSkeleton(false), 500);

    return () => {
      clearTimeout(timerID);
    };
  }, []);

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
    easing: "ease-in",

    prevArrow: (
      <button
        style={{ marginRight: "-35px", borderRight: 0, borderTop: 0 }}
        className={classes.nav}
        data-type="prev"
        aria-label="Previous Slide"
      >
        <svg width="18" height="18" viewBox="0 0 24 24">
          <path d="M16.67 0l2.83 2.829-9.339 9.175 9.339 9.167-2.83 2.829-12.17-11.996z"></path>
        </svg>
      </button>
    ),
    nextArrow: (
      <button
        style={{ marginLeft: "-35px" }}
        className={classes.nav}
        data-type="next"
        aria-label="Next Slide"
      >
        <svg width="18" height="18" viewBox="0 0 24 24">
          <path d="M5 3l3.057-3 11.943 12-11.943 12-3.057-3 9-9z"></path>
        </svg>
      </button>
    ),

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
      {showTempBaselineSkeleton ? (
        <div style={{ gap: "1.5em" }} className={baseClasses.baseVertFlex}>
          <div
            style={{
              height: "193px",
              borderRadius: "1em",
            }}
            className={`${classes.skeletonWidth} ${baseClasses.skeletonLoading}`}
          ></div>

          <div style={{ gap: "1em" }} className={baseClasses.baseFlex}>
            <div
              style={{
                width: "2.25em",
                height: "2.25em",
                borderRadius: "50%",
              }}
              className={baseClasses.skeletonLoading}
            ></div>

            <div
              style={{
                width: "2.25em",
                height: "2.25em",
                borderRadius: "50%",
              }}
              className={baseClasses.skeletonLoading}
            ></div>

            <div
              style={{
                width: "2.25em",
                height: "2.25em",
                borderRadius: "50%",
              }}
              className={baseClasses.skeletonLoading}
            ></div>
          </div>
        </div>
      ) : (
        <Slide {...properties}>
          {pinnedDrawings.map((drawing, index) => (
            <div
              style={{
                aspectRatio: "16/7.75",
                width: "100%",
              }}
              className={drawing === "" ? "" : baseClasses.baseFlex}
              key={index}
            >
              {drawing === "" ? (
                <div
                  style={{
                    gap: ".5em",

                    backgroundColor: fallbackBackgroundColors[index],
                    borderRadius: "1em",
                    // height: "12.0625em",
                    height: "100%",
                    userSelect: "none",
                  }}
                  className={baseClasses.baseVertFlex}
                >
                  <div>{username}</div>
                  <div style={{ gap: ".5em" }} className={baseClasses.baseFlex}>
                    <div>hasn't pinned a</div>
                    {index === 0 && <OneMinuteIcon dimensions={"2.5em"} />}
                    {index === 1 && <ThreeMinuteIcon dimensions={"2.5em"} />}
                    {index === 2 && <FiveMinuteIcon dimensions={"2.5em"} />}
                  </div>
                  <div>drawing yet</div>
                </div>
              ) : (
                <img
                  style={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                  }}
                  draggable="false"
                  src={drawing}
                  alt="Slideshow"
                />
              )}
            </div>
          ))}
        </Slide>
      )}

      {showTempBaselineSkeleton && pinnedDrawings[0] !== "" ? (
        <div
          style={{
            margin: "1em auto 0 auto",
            width: "200px",
            height: "1em",
            borderRadius: "1em",
          }}
          className={`${baseClasses.skeletonLoading} ${baseClasses.baseFlex}`}
        ></div>
      ) : (
        <div style={{ minHeight: "1.5em" }}>{currentSlideshowTitle}</div>
      )}
    </>
  );
};

export default SlideShow;
