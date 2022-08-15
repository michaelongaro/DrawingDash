import React from "react";
import { useState, useContext, useEffect, useRef } from "react";

import { isEqual } from "lodash";

import PinnedContext from "./PinnedContext";
import PinnedModal from "./PinnedModal";
import PinnedShowcaseItem from "./PinnedShowcaseItem";

import OneMinuteIcon from "../../svgs/OneMinuteIcon";
import ThreeMinuteIcon from "../../svgs/ThreeMinuteIcon";
import FiveMinuteIcon from "../../svgs/FiveMinuteIcon";

import classes from "./PinnedArtwork.module.css";
import baseClasses from "../../index.module.css";

const PinnedArtwork = () => {
  const pinnedCtx = useContext(PinnedContext);

  const [show60, setShow60] = useState({ display: "none" });
  const [show180, setShow180] = useState({ display: "none" });
  const [show300, setShow300] = useState({ display: "none" });

  const ref60 = useRef(null);
  const ref180 = useRef(null);
  const ref300 = useRef(null);

  const showModal = {
    position: "absolute",
    left: "0",
    top: "0",
    width: "100vw",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: "500",
    transition: "all 200ms",
  };

  useEffect(() => {
    console.log("running because 60:", pinnedCtx.show60);
    setShow60(pinnedCtx.show60);
    setShow180(pinnedCtx.show180);
    setShow300(pinnedCtx.show300);
  }, [pinnedCtx.show60, pinnedCtx.show180, pinnedCtx.show300]);

  useEffect(() => {
    let handler = (event) => {
      if (
        pinnedCtx.show60["display"] !== "none" ||
        pinnedCtx.show180["display"] !== "none" ||
        pinnedCtx.show300["display"] !== "none"
      ) {
        if (ref60.current) {
          if (!ref60.current.contains(event.target)) {
            console.log("diddn't click inside");
            pinnedCtx.setShow60({ display: "none" });
            pinnedCtx.resetAllAndHighlightNewInit();
          }
        } else if (ref180.current) {
          if (!ref180.current.contains(event.target)) {
            pinnedCtx.setShow180({ display: "none" });
            pinnedCtx.resetAllAndHighlightNewInit();
          }
        } else if (ref300.current) {
          if (!ref300.current.contains(event.target)) {
            pinnedCtx.setShow300({ display: "none" });
            pinnedCtx.resetAllAndHighlightNewInit();
          }
        }
      }
    };

    document.addEventListener("click", handler);
    return () => {
      document.removeEventListener("click", handler);
    };
  });

  return (
    <div className={classes.parentContain}>
      <div className={`${classes.pinnedContain} ${baseClasses.baseFlex}`}>
        <div style={{ gap: "1em" }} className={baseClasses.baseVertFlex}>
          <OneMinuteIcon dimensions={"3em"} />
          <div
            onClick={() => {
              if (show60["display"] === "none") {
                pinnedCtx.setShow60(showModal);
              }
            }}
          >
            {/* tried with framer motion but was too stuttery */}
            <div
              style={{
                opacity: isEqual(show60, showModal) ? 1 : 0,
                pointerEvents: isEqual(show60, showModal) ? "auto" : "none",
              }}
              className={classes.modal}
            >
              <div style={show60} className={baseClasses.baseFlex}>
                {isEqual(show60, showModal) && (
                  <PinnedModal seconds={60} ref={ref60} />
                )}
              </div>
            </div>

            <div>
              <PinnedShowcaseItem
                drawingID={pinnedCtx.pinnedDrawingIDs["60"]}
                timer={"One Minute"}
              />
            </div>
          </div>
        </div>

        <div style={{ gap: "1em" }} className={baseClasses.baseVertFlex}>
          <ThreeMinuteIcon dimensions={"3em"} />
          <div
            onClick={() => {
              if (show180["display"] === "none") {
                pinnedCtx.setShow180(showModal);
              }
            }}
          >
            <div
              style={{
                opacity: isEqual(show180, showModal) ? 1 : 0,
                pointerEvents: isEqual(show180, showModal) ? "auto" : "none",
              }}
              className={classes.modal}
            >
              <div style={show180} className={baseClasses.baseFlex}>
                {isEqual(show180, showModal) && (
                  <PinnedModal seconds={180} ref={ref180} />
                )}
              </div>
            </div>

            <div>
              <PinnedShowcaseItem
                drawingID={pinnedCtx.pinnedDrawingIDs["180"]}
                timer={"Three Minutes"}
              />
            </div>
          </div>
        </div>

        <div style={{ gap: "1em" }} className={baseClasses.baseVertFlex}>
          <FiveMinuteIcon dimensions={"3em"} />

          <div
            onClick={() => {
              if (show300["display"] === "none") {
                pinnedCtx.setShow300(showModal);
              }
            }}
          >
            <div
              style={{
                opacity: isEqual(show300, showModal) ? 1 : 0,
                pointerEvents: isEqual(show300, showModal) ? "auto" : "none",
              }}
              className={classes.modal}
            >
              <div style={show300} className={baseClasses.baseFlex}>
                {isEqual(show300, showModal) && (
                  <PinnedModal seconds={300} ref={ref300} />
                )}
              </div>
            </div>

            <div>
              <PinnedShowcaseItem
                drawingID={pinnedCtx.pinnedDrawingIDs["300"]}
                timer={"Five Minutes"}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PinnedArtwork;
