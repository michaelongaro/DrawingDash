import React from "react";
import { useState, useEffect, useContext, useRef } from "react";

import ProfilePicture from "./ProfilePicture";
import FavoritesContext from "./FavoritesContext";
import UserModal from "./UserModal";
import Card from "../../ui/Card";

import { getDatabase, get, ref, child } from "firebase/database";

import { app } from "../../util/init-firebase";

import classes from "./GallaryItem.module.css";

const GallaryItem = ({ drawing, width }) => {
  const favoritesCtx = useContext(FavoritesContext);
  const itemIsFavorite = favoritesCtx.itemIsFavorite(drawing.index);

  const dbRef = ref(getDatabase(app));
  const userModalRef = useRef();
  const drawingRef = useRef();

  const [drawingContainerSize, setDrawingContainerSize] = useState(
    classes.marginContain
  );
  const [drawingTotalLikes, setDrawingTotalLikes] = useState(0);
  const [drawingDailyLikes, setDrawingDailyLikes] = useState(0);
  const [drawingWidth, setDrawingWidth] = useState(width);

  const [showUserModal, setShowUserModal] = useState(classes.hide);
  const [loadUserModal, setLoadUserModal] = useState(false);
  const [userModalStyles, setUserModalStyles] = useState({ width: "100%" });

  useEffect(() => {
    get(child(dbRef, `drawingLikes/${drawing.seconds}/${drawing.index}`)).then(
      (snapshot) => {
        if (snapshot.exists()) {
          setDrawingTotalLikes(snapshot.val()["totalLikes"]);
          setDrawingDailyLikes(snapshot.val()["dailyLikes"]);
        }
      }
    );
  }, [drawing]);

  useEffect(() => {
    let handler = (event) => {
      if (
        drawingContainerSize === classes.fullScreen &&
        showUserModal === classes.hide
      ) {
        if (!drawingRef.current.contains(event.target)) {
          setDrawingContainerSize(classes.marginContain);
          setDrawingWidth(width);
        }
        return;
      }

      if (
        (drawingContainerSize !== classes.fullScreen &&
          showUserModal !== classes.hide) ||
        (drawingContainerSize === classes.fullScreen &&
          showUserModal !== classes.hide)
      ) {
        if (!userModalRef.current.contains(event.target)) {
          setShowUserModal(classes.hide);
        }
        return;
      }
    };

    document.addEventListener("mousedown", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
    };
  });

  function toggleFavoriteStatusHandler() {
    if (itemIsFavorite) {
      favoritesCtx.removeFavorite(
        drawing,
        drawingTotalLikes - 1,
        drawingDailyLikes - 1
      );
      setDrawingTotalLikes(drawingTotalLikes - 1);
      setDrawingDailyLikes(drawingDailyLikes - 1);
    } else {
      favoritesCtx.addFavorite(
        drawing,
        drawingTotalLikes + 1,
        drawingDailyLikes + 1
      );
      setDrawingTotalLikes(drawingTotalLikes + 1);
      setDrawingDailyLikes(drawingDailyLikes + 1);
    }
  }

  function showFullscreenModal(modalType) {
    if (modalType === "drawing") {
      setDrawingContainerSize(classes.fullScreen);
      setDrawingWidth(100);
    } else {
      setShowUserModal(classes.fullScreen);
      setLoadUserModal(true);
      if (drawingContainerSize === classes.fullScreen) {
        setUserModalStyles({ width: "100%", top: 0 });
      } else {
        setUserModalStyles({ width: "100%", top: "5em" });
      }
    }
  }

  return (
    <div className={drawingContainerSize} style={{ width: `${drawingWidth}%` }}>
      <div ref={drawingRef}>
        <Card>
          {/* ------ imageinfo -------- */}
          <div
            className={classes.glossOver}
            style={{ position: "relative" }}
            onClick={() => showFullscreenModal("drawing")}
          >
            <img
              className={classes.imgCenter}
              src={drawing.image}
              alt={drawing.title}
            />
            {/* probably make this a hover? seems a bit intrusive/covering to have on all the time */}
            <div className={classes.likes}>
              {drawingTotalLikes > 0 ? `❤️ ${drawingTotalLikes}` : ""}
            </div>
          </div>

          {/* -------- metainfo --------- */}
          <div className={classes.bottomContain}>
            <div
              onClick={() => {
                console.log("have been clicked");
                showFullscreenModal();
              }}
            >
              <ProfilePicture user={drawing.drawnBy} size="small" />
            </div>
            {/* ----- user modal ------- */}
            <div style={userModalStyles} className={showUserModal}>
              {loadUserModal && (
                <div ref={userModalRef}>
                  <UserModal uid={drawing.drawnBy} />
                </div>
              )}
            </div>

            {/* ----- drawing data ----- */}
            <div>{drawing.title}</div>
            <div>{drawing.date}</div>
            <div>{drawing.seconds}</div>
            <button
              style={{ margin: "0" }}
              onClick={toggleFavoriteStatusHandler}
            >
              {itemIsFavorite ? "💔" : "💖"}
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default GallaryItem;
