import React, { useState, useEffect } from "react";

import GallaryItem from "./GallaryItem";

import EditPreferencesIcon from "../../svgs/EditPreferencesIcon";

import classes from "./PinnedArt.module.css";
import baseClasses from "../../index.module.css";

const PinnedShowcaseItem = ({ drawingID, timer }) => {
  const [hoveringOnShowcase, setHoveringOnShowcase] = useState(false);
  const [noPinnedDrawing, setNoPinnedDrawing] = useState(false);

  const [showTempBaselineSkeleton, setShowTempBaselineSkeleton] =
    useState(true);

  useEffect(() => {
    const timerID = setTimeout(() => setShowTempBaselineSkeleton(false), 500);

    return () => {
      clearTimeout(timerID);
    };
  }, []);

  useEffect(() => {
    if (drawingID === undefined || drawingID === "") {
      setNoPinnedDrawing(true);
    } else {
      setNoPinnedDrawing(false);
      setHoveringOnShowcase(false);
    }
  }, [drawingID]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: "1em",
      }}
    >
      {showTempBaselineSkeleton ? (
        <div style={{ gap: ".75em" }} className={baseClasses.baseVertFlex}>
          <div
            style={{
              // width: window.innerWidth / 7.442,
              // height: window.innerHeight / 7.442,
              width: "258px",
              height: "125px",
              borderRadius: "1em",
              boxShadow: "rgba(0, 0, 0, 0.2) 0 2px 4px",
            }}
            className={baseClasses.skeletonLoading}
          ></div>
          <div
            style={{
              width: "5em",
              height: ".75em",
              borderRadius: "1em",
            }}
            className={baseClasses.skeletonLoading}
          ></div>
        </div>
      ) : (
        <div
          style={{
            position: "relative",
            // width: window.innerWidth / 7.442,
            // height: window.innerHeight / 7.442,
            width: "258px",
            // aspectRatio: "16/9",

            // width: "258px",
            // aspectRatio: "16/9",
            height: "125px",
          }}
          onMouseEnter={() => setHoveringOnShowcase(true)}
          onMouseLeave={() => {
            if (!noPinnedDrawing) {
              setHoveringOnShowcase(false);
            }
          }}
        >
          {/* Edit overlay */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              // have these dimensions be a ratio like the loading ones
              // width: window.innerWidth / 7.442,
              // height: window.innerHeight / 7.442,
              width: "258px",
              // aspectRatio: "16/9",
              height: "125px",
              opacity: hoveringOnShowcase || noPinnedDrawing ? 1 : 0,
              transition: "all 200ms",
              zIndex: 50,
            }}
          >
            <div
              className={`${baseClasses.baseFlex} ${classes.emptyShowcase}`}
              style={{
                cursor: "pointer",
                gap: ".5em",
                // width: window.innerWidth / 7.442,
                // height: window.innerHeight / 7.442,
                width: "258px",
                // aspectRatio: "16/9",
                height: "125px",
                opacity: hoveringOnShowcase || noPinnedDrawing ? 1 : 0,
              }}
            >
              <EditPreferencesIcon dimensions={"1.5em"} />
              <div style={{ color: "white", fontSize: "20px" }}>Edit</div>
            </div>
          </div>

          {/* actual pinned drawing */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              // width: window.innerWidth / 7.442,
              // height: window.innerHeight / 7.442,
              width: "258px",
              aspectRatio: "16/9",
            }}
          >
            {/* mmmkay so you proposed just having a fixed width of the pinned drawing because
          then obv it would stay constant no matter the innerWidth, hmmm but actually is there an 
          issue with that? I feel like that woudl work and then for the modal you would idk i guess
          follow normal gallarylist procedure? hmm */}
            {!noPinnedDrawing && (
              <GallaryItem
                drawingID={drawingID}
                settings={{
                  width: 100,
                  forHomepage: false,
                  forPinnedShowcase: true,
                  forPinnedItem: false,
                  skeleHeight: "15em",
                  skeleDateWidth: "0",
                  skeleTitleWidth: "100%",
                  widthRatio: 7.442,
                  heightRatio: 7.442,
                }}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PinnedShowcaseItem;
