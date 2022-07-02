import React, { useState, useEffect } from "react";
import Card from "../../ui/Card";

import GallaryItem from "./GallaryItem";
import OneMinuteIcon from "../../svgs/OneMinuteIcon";
import ThreeMinuteIcon from "../../svgs/ThreeMinuteIcon";
import FiveMinuteIcon from "../../svgs/FiveMinuteIcon";
import EditPreferencesIcon from "../../svgs/EditPreferencesIcon";

import classes from "./PinnedArt.module.css";
import baseClasses from "../../index.module.css";

const PinnedShowcaseItem = ({ drawingID, timer }) => {
  const [hoveringOnShowcase, setHoveringOnShowcase] = useState(false);
  const [noPinnedDrawing, setNoPinnedDrawing] = useState(false);

  // if (drawingID === undefined || drawingID === "") {
  //   return (
  //     <div className={classes.vertFlex} style={{ cursor: "pointer " }}>
  //       <div>{timer}</div>
  //       <Card>
  //         <div style={{ margin: "5em", textAlign: "center" }}>
  //           Click to select a drawing
  //         </div>
  //       </Card>
  //     </div>
  //   );
  // }
  useEffect(() => {
    if (drawingID === undefined || drawingID === "") setNoPinnedDrawing(true);
  }, []);

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
      {timer === "One Minute" && <OneMinuteIcon dimensions={"3.5em"} />}
      {timer === "Three Minutes" && <ThreeMinuteIcon dimensions={"3.5em"} />}
      {timer === "Five Minutes" && <FiveMinuteIcon dimensions={"3.5em"} />}

      <div
        style={{ position: "relative", width: window.innerWidth / 7.442, height: window.innerHeight / 7.442 }}
        onMouseEnter={() => setHoveringOnShowcase(true)}
        onMouseLeave={() => {
          if (!noPinnedDrawing) {
            setHoveringOnShowcase(false);
          }
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            // have these dimensions be a ratio like the loading ones
            width: window.innerWidth / 7.442,
            height: window.innerHeight / 7.442,
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
              width: window.innerWidth / 7.442,
              height: window.innerHeight / 7.442,
            }}
          >
            <EditPreferencesIcon dimensions={"1.5em"} />
            <div style={{ color: "white", fontSize: "20px" }}>Edit</div>
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: window.innerWidth / 7.442,
            height: window.innerHeight / 7.442,
          }}
        >
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
    </div>
  );
};

export default PinnedShowcaseItem;
