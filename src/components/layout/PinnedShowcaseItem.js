import React from "react";
import Card from "../../ui/Card";

import classes from "./PinnedArt.module.css";
import GallaryItem from "./GallaryItem";
import OneMinuteIcon from "../../svgs/OneMinuteIcon";
import ThreeMinuteIcon from "../../svgs/ThreeMinuteIcon";
import FiveMinuteIcon from "../../svgs/FiveMinuteIcon";

const PinnedShowcaseItem = ({ drawingID, timer }) => {
  if (drawingID === undefined || drawingID === "") {
    return (
      <div className={classes.vertFlex} style={{ cursor: "pointer " }}>
        <div>{timer}</div>
        <Card>
          <div style={{ margin: "5em", textAlign: "center" }}>
            Click to select a drawing
          </div>
        </Card>
      </div>
    );
  }

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
          widthRatio: 7.45,
          heightRatio: 7.45
        }}
      />
    </div>
  );
};

export default PinnedShowcaseItem;
