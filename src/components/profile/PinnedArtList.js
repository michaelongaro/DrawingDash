import React, { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import PinnedArt from "./PinnedArt";

import OneMinuteIcon from "../../svgs/OneMinuteIcon";
import ThreeMinuteIcon from "../../svgs/ThreeMinuteIcon";
import FiveMinuteIcon from "../../svgs/FiveMinuteIcon";

import classes from "../galleries/GalleryList.module.css";
import baseClasses from "../../index.module.css";

const PinnedArtList = ({ drawingIDs, seconds }) => {
  const [durationSVG, setDurationSVG] = useState("");

  useEffect(() => {
    if (seconds === 60) {
      setDurationSVG(<OneMinuteIcon dimensions={"2.5em"} />);
    } else if (seconds === 180) {
      setDurationSVG(<ThreeMinuteIcon dimensions={"2.5em"} />);
    } else {
      setDurationSVG(<FiveMinuteIcon dimensions={"2.5em"} />);
    }
  }, []);

  return (
    <>
      {drawingIDs.length === 0 ? (
        <div
          style={{ height: "100%", width: "100%", gap: "1.5em" }}
          className={baseClasses.baseVertFlex}
        >
          <div style={{ fontSize: "20px" }}>No drawings found</div>
          <div
            style={{ width: "14em", height: "8em" }}
            className={baseClasses.animatedRainbow}
          >
            <Link to="/daily-drawings" className={baseClasses.baseFlex}>
              <div style={{ gap: ".5em" }} className={baseClasses.baseFlex}>
                <div>Start A</div>
                <div>{durationSVG}</div>
                <div>Drawing</div>
              </div>
            </Link>
          </div>
          <div style={{ fontSize: "20px" }}>and return here to pin it!</div>
        </div>
      ) : (
        <div
          style={{ height: "100%", overflowY: "scroll" }}
          className={classes.gridListContain}
        >
          {drawingIDs.map((drawingID, i) => (
            <PinnedArt
              key={i}
              drawingID={drawingID}
              idx={i}
              seconds={seconds}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default React.memo(PinnedArtList);
