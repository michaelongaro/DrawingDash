import React from "react";
import { useState, useContext, useEffect, useRef } from "react";

import PinnedContext from "./PinnedContext";
import PinnedModal from "./PinnedModal";
import PinnedShowcaseItem from "./PinnedShowcaseItem";

import classes from "./PinnedArtwork.module.css";
import { isEqual } from "lodash";
import Card from "../../ui/Card";

const PinnedArtwork = () => {
  const pinnedCtx = useContext(PinnedContext);

  const [show60, setShow60] = useState({ display: "none" });
  const [show180, setShow180] = useState({ display: "none" });
  const [show300, setShow300] = useState({ display: "none" });

  const [show60Showcase, setShow60Showcase] = useState();
  const [show180Showcase, setShow180Showcase] = useState();
  const [show300Showcase, setShow300Showcase] = useState();

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

    document.addEventListener("mousedown", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
    };
  });

  function hideShowcaseDrawings() {
    setShow60Showcase({ display: "none" });
    setShow180Showcase({ display: "none" });
    setShow300Showcase({ display: "none" });
  }

  return (
    <div className={classes.parentContain}>
      <div className={classes.pinnedContain}>
        <div
          onClick={() => {
            if (show60["display"] === "none") {
              pinnedCtx.setShow60(showModal);
            }
          }}
        >
          <div style={show60}>
            {isEqual(show60, showModal) && (
              <PinnedModal seconds={60} ref={ref60} />
            )}
          </div>

          <div style={show60Showcase}>
            <PinnedShowcaseItem
              drawingID={pinnedCtx.pinnedDrawings["60"]}
              timer={"One Minute"}
            />
          </div>
        </div>

        <div
          onClick={() => {
            if (show180["display"] === "none") {
              pinnedCtx.setShow180(showModal);
            }
          }}
        >
          <div style={show180}>
            {isEqual(show180, showModal) && (
              <PinnedModal seconds={180} ref={ref180} />
            )}
          </div>
          <div style={show180Showcase}>
            <PinnedShowcaseItem
              drawingID={pinnedCtx.pinnedDrawings["180"]}
              timer={"Three Minutes"}
            />
          </div>
        </div>

        <div
          onClick={() => {
            if (show300["display"] === "none") {
              pinnedCtx.setShow300(showModal);
            }
          }}
        >
          <div style={show300}>
            {isEqual(show300, showModal) && (
              <PinnedModal seconds={300} ref={ref300} />
            )}
          </div>
          <div style={show300Showcase}>
            <PinnedShowcaseItem
              drawingID={pinnedCtx.pinnedDrawings["300"]}
              timer={"Five Minutes"}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PinnedArtwork;
