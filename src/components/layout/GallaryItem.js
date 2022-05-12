import React from "react";
import { useState, useEffect, useContext, useRef } from "react";

import ProfilePicture from "./ProfilePicture";
import FavoritesContext from "./FavoritesContext";
import UserModal from "./UserModal";
import Card from "../../ui/Card";

import CopyToClipboard from "./CopyToClipboard";
import DownloadIcon from "../../svgs/DownloadIcon";
import HeartOutlineIcon from "../../svgs/HeartOutlineIcon";
import HeartFilledIcon from "../../svgs/HeartFilledIcon";
import HeartBrokenIcon from "../../svgs/HeartBrokenIcon";

import { getDatabase, get, ref, child } from "firebase/database";

import {
  getDownloadURL,
  getStorage,
  ref as ref_storage,
  uploadBytes,
} from "firebase/storage";

import { app } from "../../util/init-firebase";

import classes from "./GallaryItem.module.css";

const GallaryItem = ({ drawingID, settings }) => {
  const favoritesCtx = useContext(FavoritesContext);

  const dbRef = ref(getDatabase(app));
  const storage = getStorage();

  const userModalRef = useRef();
  const drawingModalRef = useRef();

  const [drawingTotalLikes, setDrawingTotalLikes] = useState(0);
  const [drawingDailyLikes, setDrawingDailyLikes] = useState(0);
  const [drawingWidth, setDrawingWidth] = useState(settings.width);

  // this below was set to classes.marginContain (don't think we need now because we
  // added a gap to the flex list)
  const [showDrawingModal, setShowDrawingModal] = useState("");

  const [showUserModal, setShowUserModal] = useState(classes.hide);
  const [loadUserModal, setLoadUserModal] = useState(false);
  const [userModalStyles, setUserModalStyles] = useState({ width: "100%" });

  const [isFetching, setIsFetching] = useState(true);
  const [drawingDetails, setDrawingDetails] = useState();
  const [fetchedDrawing, setFetchedDrawing] = useState();

  const [hoveringOnHeart, setHoveringOnHeart] = useState(false);

  useEffect(() => {
    get(child(dbRef, `drawings/${drawingID}`)).then((snapshot) => {
      if (snapshot.exists()) {
        setDrawingDetails(snapshot.val());
      }
    });

    getDownloadURL(ref_storage(storage, `drawings/${drawingID}.jpg`)).then(
      (url) => {
        console.log(url);
        setFetchedDrawing(url);
      }
    );
  }, [drawingID]);

  useEffect(() => {
    if (drawingDetails && fetchedDrawing) {
      // maybe have some kind of delay here? idk why there is
      // a gap between when skeleton goes away and when image actually appears
      setIsFetching(false);
    }
  }, [drawingDetails, fetchedDrawing]);

  useEffect(() => {
    if (drawingDetails) {
      get(
        child(
          dbRef,
          `drawingLikes/${drawingDetails.seconds}/${drawingDetails.index}`
        )
      ).then((snapshot) => {
        if (snapshot.exists()) {
          setDrawingTotalLikes(snapshot.val()["totalLikes"]);
          setDrawingDailyLikes(snapshot.val()["dailyLikes"]);
        }
      });
    }
  }, [drawingDetails]);

  useEffect(() => {
    let handler = (event) => {
      if (
        showDrawingModal === classes.fullScreen &&
        showUserModal === classes.hide
      ) {
        if (!drawingModalRef.current.contains(event.target)) {
          setShowDrawingModal(classes.marginContain);
          setDrawingWidth(settings.width);
        }
        return;
      }

      if (
        (showDrawingModal !== classes.fullScreen &&
          showUserModal !== classes.hide) ||
        (showDrawingModal === classes.fullScreen &&
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
    if (favoritesCtx.itemIsFavorite(drawingID, drawingDetails.seconds)) {
      favoritesCtx.removeFavorite(
        drawingID,
        drawingDetails.seconds,
        drawingTotalLikes - 1,
        drawingDailyLikes - 1
      );
      // i guess this and the one below are just because the state doesn't update in time?
      // should be able to fix
      setDrawingTotalLikes(drawingTotalLikes - 1);
      setDrawingDailyLikes(drawingDailyLikes - 1);
    } else {
      favoritesCtx.addFavorite(
        drawingID,
        drawingDetails.seconds,
        drawingTotalLikes + 1,
        drawingDailyLikes + 1
      );
      setDrawingTotalLikes(drawingTotalLikes + 1);
      setDrawingDailyLikes(drawingDailyLikes + 1);
    }
  }

  function showFullscreenModal(modalType) {
    if (modalType === "drawingID") {
      // setDrawingContainerSize(classes.fullScreen);
      setDrawingWidth(100);
      setShowDrawingModal(classes.fullScreen);
    } else {
      setShowUserModal(classes.fullScreen);
      setLoadUserModal(true);
      if (showDrawingModal === classes.fullScreen) {
        setUserModalStyles({ width: "100%", top: 0 });
      } else {
        setUserModalStyles({ width: "100%", top: "5em" });
      }
    }
  }

  function downloadDrawing() {
    var url = `${fetchedDrawing}`;
    var xhr = new XMLHttpRequest();
    xhr.responseType = "blob";

    xhr.onload = function () {
      var a = document.createElement("a");
      a.href = window.URL.createObjectURL(xhr.response);
      a.download = `${drawingDetails.title}.jpeg`;
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
    };

    xhr.open("GET", url);
    xhr.send();
  }

  return (
    <div
      // okay so how do you freeze it while it is loading to see what is happening
      // it is bigger then it should be here, but then smaller than it should be in explore
      // has to do with the 80% width?
      className={showDrawingModal}
      style={{
        width: `${drawingWidth}%`,
        // margin: `${
        //   showDrawingModal === classes.fullScreen || settings.forPinnedItem
        //     ? 0
        //     : "1em"
        // }`,
      }}
    >
      <div className={classes.vertFlex} ref={drawingModalRef}>
        <Card>
          {/* ------ imageinfo -------- */}
          {isFetching ? (
            <div
              style={{
                width: "100%",
                height: settings.skeleHeight,
              }}
              className={classes.skeletonLoading}
            ></div>
          ) : (
            <div
              className={classes.glossOver}
              style={{ position: "relative" }}
              onClick={() => {
                if (
                  !settings.forHomepage &&
                  !settings.forPinnedShowcase &&
                  !settings.forPinnedItem
                )
                  showFullscreenModal("drawingID");
              }}
            >
              <img
                className={classes.imgCenter}
                src={fetchedDrawing}
                alt={drawingDetails.title}
              />
              {/* probably make this a hover? seems a bit intrusive/covering to have on all the time */}
              <div className={`${drawingTotalLikes > 0 ? classes.likes : ""}`}>
                {drawingTotalLikes > 0 ? `❤️ ${drawingTotalLikes}` : ""}
              </div>
            </div>
          )}

          {/* -------- metainfo --------- */}
          {settings.forPinnedShowcase ? null : (
            <div className={classes.bottomContain}>
              {/* profile image */}
              {!settings.forPinnedItem ? (
                isFetching ? (
                  <div
                    style={{
                      width: "3.3em",
                      height: "81%",
                      borderRadius: "50%",
                    }}
                    className={classes.skeletonLoading}
                  ></div>
                ) : (
                  <div
                    onClick={() => {
                      if (!settings.forPinned) {
                        showFullscreenModal();
                      }
                    }}
                  >
                    <ProfilePicture
                      user={drawingDetails.drawnBy}
                      size="small"
                    />
                  </div>
                )
              ) : null}

              {/* ----- user modal ------- */}
              <div style={userModalStyles} className={showUserModal}>
                {loadUserModal && (
                  <div ref={userModalRef}>
                    <UserModal uid={drawingDetails.drawnBy} />
                  </div>
                )}
              </div>

              {/* ----- drawingID data ----- */}

              {/* title */}
              {isFetching ? (
                <div
                  style={{ width: settings.skeleTitleWidth, height: "40%" }}
                  className={classes.skeletonLoading}
                ></div>
              ) : (
                <div style={{ textAlign: "center" }}>
                  {drawingDetails.title}
                </div>
              )}

              {/* date */}
              {isFetching ? (
                <div
                  style={{ width: "6em", height: "40%" }}
                  className={classes.skeletonLoading}
                ></div>
              ) : (
                <div>{drawingDetails.date}</div>
              )}

              {/* seconds */}

              {settings.forPinnedItem ? null : isFetching ? (
                <div
                  style={{ width: "2em", height: "40%" }}
                  className={classes.skeletonLoading}
                ></div>
              ) : (
                <div>{drawingDetails.seconds}</div>
              )}

              {/* like toggle */}
              {settings.forPinnedItem ? null : isFetching ? (
                <div
                  style={{ width: "3em", height: "40%" }}
                  className={classes.skeletonLoading}
                ></div>
              ) : (
                <div
                  style={{ width: "1.5em", height: "1.5em" }}
                  onClick={toggleFavoriteStatusHandler}
                  onMouseEnter={() => {
                    setHoveringOnHeart(true);
                  }}
                  onMouseLeave={() => {
                    setHoveringOnHeart(false);
                  }}
                >
                  {hoveringOnHeart ? (
                    favoritesCtx.itemIsFavorite(
                      drawingID,
                      drawingDetails.seconds
                    ) ? (
                      <HeartBrokenIcon />
                    ) : (
                      <HeartFilledIcon />
                    )
                  ) : favoritesCtx.itemIsFavorite(
                      drawingID,
                      drawingDetails.seconds
                    ) ? (
                    <HeartFilledIcon />
                  ) : (
                    <HeartOutlineIcon />
                  )}
                </div>
              )}
              {/* move to % widths */}

              {/* for homepage dailymostliked gallaryitem */}
              {settings.forHomepage ? (
                isFetching ? (
                  <div
                    style={{ width: "4em", height: "50%" }}
                    className={classes.skeletonLoading}
                  ></div>
                ) : (
                  <CopyToClipboard url={fetchedDrawing} />
                )
              ) : null}

              {settings.forHomepage ? (
                isFetching ? (
                  <div
                    style={{ width: "4em", height: "50%" }}
                    className={classes.skeletonLoading}
                  ></div>
                ) : (
                  <div className={classes.download} onClick={downloadDrawing}>
                    <div>Download</div>
                    <DownloadIcon />
                  </div>
                )
              ) : null}

              {/* for regular gallaryitem */}
              {!settings.forHomepage ? (
                showDrawingModal === classes.fullScreen ? (
                  <CopyToClipboard url={fetchedDrawing} />
                ) : null
              ) : null}

              {!settings.forHomepage ? (
                showDrawingModal === classes.fullScreen ? (
                  <div className={classes.download} onClick={downloadDrawing}>
                    <div>Download</div>
                    <DownloadIcon />
                  </div>
                ) : null
              ) : null}
            </div>
          )}
        </Card>

        {settings.forPinnedShowcase ? (
          isFetching ? (
            <div
              style={{ width: "4em", height: "50%" }}
              className={classes.skeletonLoading}
            ></div>
          ) : (
            <div>{drawingDetails.title}</div>
          )
        ) : null}
      </div>
    </div>
  );
};

export default GallaryItem;
