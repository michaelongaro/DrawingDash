import React from "react";
import { useState, useEffect, useCallback, useContext, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { remove } from "lodash";

import ProfilePicture from "./ProfilePicture";
import FavoritesContext from "./FavoritesContext";
import UserModal from "./UserModal";
import Card from "../../ui/Card";

import CopyToClipboard from "./CopyToClipboard";
import DownloadIcon from "../../svgs/DownloadIcon";
import HeartOutlineIcon from "../../svgs/HeartOutlineIcon";
import HeartFilledIcon from "../../svgs/HeartFilledIcon";
import HeartBrokenIcon from "../../svgs/HeartBrokenIcon";
import FiveMinuteIcon from "../../svgs/FiveMinuteIcon";
import OneMinuteIcon from "../../svgs/OneMinuteIcon";
import ThreeMinuteIcon from "../../svgs/ThreeMinuteIcon";
import ExitIcon from "../../svgs/ExitIcon";
import GarbageIcon from "../../svgs/GarbageIcon";

import {
  getDatabase,
  get,
  ref,
  onValue,
  update,
  set,
  child,
} from "firebase/database";

import {
  getDownloadURL,
  getStorage,
  deleteObject,
  ref as ref_storage,
  uploadBytes,
} from "firebase/storage";

import { app } from "../../util/init-firebase";

import classes from "./GallaryItem.module.css";
import baseClasses from "../../index.module.css";

const GallaryItem = ({ drawingID, settings }) => {
  const location = useLocation();
  const { user, isLoading, isAuthenticated } = useAuth0();

  const favoritesCtx = useContext(FavoritesContext);

  const db = getDatabase(app);
  const dbRef = ref(getDatabase(app));
  const storage = getStorage();

  const userModalRef = useRef();
  const drawingModalRef = useRef(null);
  const confirmDeleteModalRef = useRef();

  const imageDimensionsRef = useCallback((node) => {
    if (node !== null) {
      // setSkeletonWidth(node.getBoundingClientRect().width);
      // setSkeletonHeight(node.getBoundingClientRect().height);
      console.log(
        node.getBoundingClientRect().width,
        node.getBoundingClientRect().height
      );
      console.log(node.offsetWidth, node.offsetHeight);

      setSkeletonWidth(node.offsetWidth);
      setSkeletonHeight(node.offsetHeight);
    }
  }, []);

  const [skeletonWidth, setSkeletonWidth] = useState(0);
  const [skeletonHeight, setSkeletonHeight] = useState(0);

  const [drawingTotalLikes, setDrawingTotalLikes] = useState(0);
  const [drawingDailyLikes, setDrawingDailyLikes] = useState(0);
  const [drawingWidth, setDrawingWidth] = useState(settings.width);

  const [showDrawingModal, setShowDrawingModal] = useState(false);

  const [showUserModal, setShowUserModal] = useState(false);
  const [loadUserModal, setLoadUserModal] = useState(false);

  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);

  const [isFetching, setIsFetching] = useState(true);
  const [drawingDetails, setDrawingDetails] = useState();
  const [fetchedDrawing, setFetchedDrawing] = useState();
  const [artistUsername, setArtistUsername] = useState();

  // user hover states
  const [hoveringOnHeart, setHoveringOnHeart] = useState(false);
  const [hoveringOnImage, setHoveringOnImage] = useState(false);
  const [hoveringOnDeleteButton, setHoveringOnDeleteButton] = useState(false);
  const [hoveringOnLikesTooltip, setHoveringOnLikesTooltip] = useState(false);
  const [hoveringOnUsernameTooltip, setHoveringOnUsernameTooltip] =
    useState(false);

  // used when image is deleted (just for ui purposes)
  const [hideImage, setHideImage] = useState(false);

  const [ableToShowProfilePicture, setAbleToShowProfilePicture] =
    useState(false);

  // states for showing "signup/login" tooltip when clicking like button when unregistered
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    if (showDrawingModal || (!isLoading && !isAuthenticated)) {
      setAbleToShowProfilePicture(true);
      return;
    }

    if (!isLoading && isAuthenticated && drawingDetails) {
      if (
        (!settings.forPinnedItem &&
          location.pathname !== "/profile/gallery" &&
          location.pathname !== "/profile/likes") ||
        drawingDetails.drawnBy !== user.sub
      ) {
        setAbleToShowProfilePicture(true);
        return;
      }
    }
  }, [
    user,
    isLoading,
    isAuthenticated,
    location,
    showDrawingModal,
    drawingDetails,
    settings,
  ]);

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

  // useEffect(() => {
  //   console.log(drawingModalRef.current);
  // }, [drawingModalRef.current]);

  useEffect(() => {
    if (drawingDetails && fetchedDrawing) {
      // maybe have some kind of delay here? idk why there is
      // a gap between when skeleton goes away and when image actually appears
      setIsFetching(false);
    }
  }, [drawingDetails, fetchedDrawing]);

  useEffect(() => {
    if (drawingDetails) {
      onValue(
        ref(
          db,
          `drawingLikes/${drawingDetails.seconds}/${drawingDetails.index}`
        ),
        (snapshot) => {
          if (snapshot.exists()) {
            setDrawingTotalLikes(snapshot.val()["totalLikes"]);
            setDrawingDailyLikes(snapshot.val()["dailyLikes"]);
          }
        }
      );

      get(child(dbRef, `users/${drawingDetails.drawnBy}/preferences`)).then(
        (snapshot) => {
          if (snapshot.exists()) {
            setArtistUsername(snapshot.val().username);
          }
        }
      );
    }
  }, [drawingDetails]);

  useEffect(() => {
    let handler = (event) => {
      // console.log(event.target);
      if (showDrawingModal && !showUserModal) {
        if (!drawingModalRef.current.contains(event.target)) {
          setShowDrawingModal(false);
          setDrawingWidth(settings.width);

          // need to find better way to display all of this man
          if (location.pathname === "/explore")
            setAbleToShowProfilePicture(true);
          else if (
            (settings.forPinnedItem &&
              location.pathname === "/profile/gallery" &&
              location.pathname === "/profile/likes") ||
            drawingDetails.drawnBy === user.sub
          ) {
            setAbleToShowProfilePicture(false);
            return;
          }
        }
        return;
      }

      if (
        (!showDrawingModal && showUserModal) ||
        (showDrawingModal && showUserModal)
      ) {
        // if (!confirmDeleteModalRef.current.contains(event.target)) {

        if (!userModalRef.current.contains(event.target)) {
          setShowUserModal(false);
          setLoadUserModal(false);

          // updating localStorage to reflect modal closing
          localStorage.setItem("baseUserModalOpened", "false");
        }
        return;
      }

      if (showConfirmDeleteModal) {
        // if (!drawingModalRef.current.contains(event.target)) {

        if (!confirmDeleteModalRef.current.contains(event.target)) {
          setShowConfirmDeleteModal(false);
        }
      }
    };

    document.addEventListener("mousedown", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
    };
  });

  useEffect(() => {
    let setTimeoutID;
    if (showTooltip) {
      setTimeoutID = setTimeout(() => setShowTooltip(false), 1250);
    }

    return () => {
      clearTimeout(setTimeoutID);
    };
  }, [showTooltip]);

  function toggleFavoriteStatusHandler() {
    if (favoritesCtx.itemIsFavorite(drawingID, drawingDetails.seconds)) {
      favoritesCtx.removeFavorite(
        drawingID,
        drawingDetails.seconds,
        drawingTotalLikes - 1,
        drawingDailyLikes - 1
      );
      // setDrawingTotalLikes(drawingTotalLikes - 1);
      // setDrawingDailyLikes(drawingDailyLikes - 1);
    } else {
      favoritesCtx.addFavorite(
        drawingID,
        drawingDetails.seconds,
        drawingTotalLikes + 1,
        drawingDailyLikes + 1
      );
      // setDrawingTotalLikes(drawingTotalLikes + 1);
      // setDrawingDailyLikes(drawingDailyLikes + 1);
    }
  }

  function showFullscreenModal(modalType) {
    if (modalType === "drawingID") {
      setShowDrawingModal(true);
    } else {
      // if looking at drawing from within a user modal and user clicks on profile picture there
      // just hide drawing modal to go back to user modal
      if (showDrawingModal && showUserModal) {
        setShowDrawingModal(false);
      } else {
        setShowUserModal(true);
        setLoadUserModal(true);
        // if (showDrawingModal) {
        //   setUserModalStyles({ width: "100%", top: 0 });
        // } else {
        //   setUserModalStyles({ width: "100%", top: "5em" });
        // }
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

  function deleteDrawing() {
    const title = drawingDetails.title;
    const seconds = drawingDetails.seconds;
    const uniqueID = drawingDetails.index;
    const user = drawingDetails.drawnBy;

    // could maybe have it fade out for a second and when that finishes update this to true
    setHideImage(true);

    setShowConfirmDeleteModal(false);

    // Removing From /drawingLikes
    remove(ref(db, `drawingLikes/${seconds}/${uniqueID}`));

    // Removing from /drawings
    remove(ref(db, `drawings/${uniqueID}`));

    // Removing from storage
    deleteObject(ref_storage(storage, `drawings/${drawingID}.jpg`));

    // Removing from /titles
    get(child(dbRef, `titles/${seconds}/${title}`)).then((snapshot) => {
      if (snapshot.exists()) {
        let drawingIDs = snapshot.val()["drawingID"];

        // removing the index that has the corresponding drawingID
        drawingIDs.splice(drawingIDs.indexOf(title), 1);
        if (drawingIDs.length === 0) {
          remove(ref(db, `titles/${seconds}/${title}`));
        } else {
          update(ref(db, `users/${user}/titles/${seconds}/${title}`), {
            drawingID: drawingIDs,
          });
        }
      }
    });

    // Decrementing totalDrawings
    get(child(dbRef, "totalDrawings")).then((snapshot) => {
      if (snapshot.exists()) {
        let drawingCount = snapshot.val()["count"];

        update(ref(db, "totalDrawings"), { count: drawingCount - 1 });
      }
    });

    // Removing from /users/user.sub/titles
    get(child(dbRef, `users/${user}/titles/${seconds}/${title}`)).then(
      (snapshot) => {
        if (snapshot.exists()) {
          let drawingIDs = snapshot.val()["drawingID"];

          // removing the index that has the corresponding drawingID
          drawingIDs.splice(drawingIDs.indexOf(title), 1);
          if (drawingIDs.length === 0) {
            remove(ref(db, `users/${user}/titles/${seconds}/${title}`));
          } else {
            update(ref(db, `users/${user}/titles/${seconds}/${title}`), {
              drawingID: drawingIDs,
            });
          }
        }
      }
    );

    // Removing from /users/user.sub/likes (if it exists there)
    get(child(dbRef, `users/${user}/likes/${seconds}`)).then((snapshot) => {
      if (snapshot.exists()) {
        let drawingIDs = snapshot.val();

        // removing the index that has the corresponding drawingID
        if (drawingIDs.indexOf(title) > -1) {
          drawingIDs.splice(drawingIDs.indexOf(title), 1);
          if (drawingIDs.length === 0) {
            set(ref(db, `users/${user}/likes/${seconds}`), ["temp"]);
          }
        }
        update(ref(db, `users/${user}/titles/${seconds}`), drawingIDs);
      }
    });

    // Removing from /users/user.sub/pinnedArt (if it exists there)
    get(child(dbRef, `users/${user}/pinnedArt`)).then((snapshot) => {
      if (snapshot.exists()) {
        let drawingIDs = snapshot.val();

        // removing the index that has the corresponding drawingID
        if (drawingIDs["60"] === uniqueID) drawingIDs["60"] = "";
        if (drawingIDs["180"] === uniqueID) drawingIDs["180"] = "";
        if (drawingIDs["300"] === uniqueID) drawingIDs["300"] = "";

        update(ref(db, `users/${user}/pinnedArt`), drawingIDs);
      }
    });
  }

  return (
    // <div style={{ position: "relative" }}>
    <div
      className={showDrawingModal ? classes.modal : ""}
      onMouseEnter={() => {
        setHoveringOnImage(true);
      }}
      onMouseLeave={() => {
        setHoveringOnImage(false);
      }}
      style={{
        // display: hideImage ? "none" : "flex",
        // opacity: hideImage ? 0 : 1,
      }}
    >
      {/* confirm delete modal */}
      <div
        style={{
          opacity: showConfirmDeleteModal ? 1 : 0,
          pointerEvents: showConfirmDeleteModal ? "auto" : "none",
        }}
        className={classes.modal}
        ref={confirmDeleteModalRef}
      >
        <div className={classes.confirmDeleteText}>
          <div>
            <GarbageIcon dimensions={"3em"} />
          </div>

          <div>Are you sure you want to delete</div>
          <div>"{drawingDetails && drawingDetails.title}"?</div>

          <div className={classes.deleteModalControls}>
            <button
              style={{
                pointerEvents: showConfirmDeleteModal ? "auto" : "none",
              }}
              className={classes.closeButton}
              onClick={() => {
                if (showConfirmDeleteModal) setShowConfirmDeleteModal(false);
              }}
            >
              <ExitIcon />
            </button>
            <button
              style={{
                pointerEvents: showConfirmDeleteModal ? "auto" : "none",
              }}
              className={classes.editButton}
              onClick={() => {
                if (showConfirmDeleteModal) deleteDrawing();
              }}
            >
              {/* <div>Confirm</div> <GarbageIcon dimensions={"1em"} /> */}
              Confirm
            </button>
          </div>
        </div>
      </div>

      {/* ----- user modal ------- */}
      <div
        style={{ opacity: showUserModal ? 1 : 0 }}
        className={showUserModal ? classes.modal : ""}
      >
        {loadUserModal && (
          <div ref={userModalRef}>
            <div style={{ position: "relative" }}>
              {showDrawingModal && (
                <button
                  className={classes.goBackButton}
                  onClick={() => {
                    // closing user modal
                    setShowUserModal(false);
                    setLoadUserModal(false);
                  }}
                >
                  Return to image
                </button>
              )}
              <div
                className={baseClasses.close}
                onClick={() => {
                  // closing all modals
                  setShowDrawingModal(false);
                  setDrawingWidth(settings.width);
                  setShowUserModal(false);
                  setLoadUserModal(false);

                  // updating localStorage to reflect modal closing
                  localStorage.setItem("baseUserModalOpened", "false");
                }}
              ></div>
            </div>

            <UserModal user={drawingDetails.drawnBy} />
          </div>
        )}
      </div>

      {/* image container */}
      {/*  make this a vertFlex */}
      <div
        style={{ gap: "1em" }}
        className={baseClasses.baseVertFlex}
        ref={drawingModalRef}
      >
        <Card>
          {/* ------ imageinfo -------- */}
          {/* <div style={{ width: "100%", minHeight: "100%"}} ref={imageDimensionsRef}> */}
          {isFetching ? (
            <div
              // eventually find way to have this be dynamic based on size of image so it isn't
              // as jarring when image is actually loaded/rendered
              style={{
                // width: drawingModalRef.current !== null ? drawingModalRef.current.offsetWidth : "100%",
                // height: settings.skeleHeight,
                // height: drawingModalRef.current !== null ? `${drawingModalRef.current.offsetHeight - 65}px` : "9.5em",
                // width: skeletonWidth,
                // height: skeletonHeight,
                width: "306px",
                height: "148px",
                borderRadius: "1em 1em 0 0",
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
                  !settings.forPinnedItem &&
                  // needed so that when clicking on delete button drawing modal doesn't show
                  !hoveringOnDeleteButton
                )
                  showFullscreenModal("drawingID");
              }}
            >
              <img
                style={{
                  cursor: "pointer",
                  borderRadius: settings.forPinnedShowcase
                    ? "1em"
                    : "1em 1em 0 0",
                }}
                src={fetchedDrawing}
                alt={drawingDetails.title}
              />

              {/* delete drawing button */}
              <button
                className={classes.deleteButton}
                style={{
                  backgroundColor: hoveringOnDeleteButton
                    ? "red"
                    : "transparent",
                  opacity:
                    location.pathname === "/profile/gallery" && hoveringOnImage
                      ? 1
                      : 0,
                  pointerEvents:
                    location.pathname === "/profile/gallery" && hoveringOnImage
                      ? "auto"
                      : "none",
                }}
                onMouseEnter={() => {
                  setHoveringOnDeleteButton(true);
                }}
                onMouseLeave={() => {
                  setHoveringOnDeleteButton(false);
                }}
                onClick={() => setShowConfirmDeleteModal(true)}
              >
                <GarbageIcon dimensions={"1.25em"} />
              </button>

              <div className={`${drawingTotalLikes > 0 ? classes.likes : ""}`}>
                {drawingTotalLikes > 0 ? `❤️ ${drawingTotalLikes}` : ""}
              </div>
            </div>
          )}
          {/* </div> */}

          {/* -------- metainfo --------- */}
          {settings.forPinnedShowcase ? null : (
            <div
              style={{
                background:
                  !isFetching && drawingDetails.hasOwnProperty("averageColor")
                    ? `linear-gradient(
                                        \n
                                        145deg,
                                        \n
                                        rgb(255, 255, 255) 0%,
                                        \n
                                        rgb(${drawingDetails["averageColor"]["r"]}, 
                                            ${drawingDetails["averageColor"]["g"]}, 
                                            ${drawingDetails["averageColor"]["b"]}) 125%
                                      )`
                    : "linear-gradient(\n    145deg,\n    rgb(255, 255, 255) 0%,\n    #c2c2c2 125%\n  )",
              }}
              className={classes.bottomContain}
            >
              {/* profile image */}
              {ableToShowProfilePicture ? (
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
                    style={{
                      position: "relative",
                      cursor: "pointer",
                      width: "50px",
                      height: "50px",
                    }}
                    onClick={() => {
                      if (
                        !localStorage.getItem("baseUserModalOpened") ||
                        localStorage.getItem("baseUserModalOpened") === "false"
                      ) {
                        showFullscreenModal();
                        localStorage.setItem("baseUserModalOpened", "true");
                      } else {
                        // closing drawing modal and taking user back to original user modal
                        // done to save bandwidth and also for user clarity so they don't go
                        // multiple layers deep
                        setShowDrawingModal(false);
                        setDrawingWidth(settings.width);
                      }
                    }}
                    onMouseEnter={() => {
                      setHoveringOnUsernameTooltip(true);
                    }}
                    onMouseLeave={() => {
                      setHoveringOnUsernameTooltip(false);
                      console.log("left outer");
                    }}
                  >
                    <ProfilePicture
                      user={drawingDetails.drawnBy}
                      size="small"
                    />

                    {/* username tooltip */}
                    <div
                      style={{ cursor: "pointer" }}
                      className={classes.usernameTooltipContainer}
                      onMouseEnter={() => {
                        setHoveringOnUsernameTooltip(true);
                      }}
                      onMouseLeave={() => {
                        setHoveringOnUsernameTooltip(false);
                        console.log("left inner");
                      }}
                    >
                      <div
                        style={{
                          opacity: hoveringOnUsernameTooltip ? 1 : 0,
                          transform: hoveringOnUsernameTooltip
                            ? "scale(1)"
                            : "scale(0)",
                          cursor: "pointer",
                          left: 0,
                          top: "70px",
                          padding: "2em",
                        }}
                        className={classes.usernameTooltip}
                      >
                        {artistUsername}
                      </div>
                    </div>
                  </div>
                )
              ) : null}

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

              {location.pathname === "/" || showDrawingModal ? (
                isFetching ? (
                  <div
                    style={{ width: "3em", height: "3em" }}
                    className={classes.skeletonLoading}
                  ></div>
                ) : (
                  <div style={{ width: "3em", height: "3em" }}>
                    {drawingDetails.seconds === 60 && (
                      <OneMinuteIcon dimensions={"3em"} />
                    )}
                    {drawingDetails.seconds === 180 && (
                      <ThreeMinuteIcon dimensions={"3em"} />
                    )}
                    {drawingDetails.seconds === 300 && (
                      <FiveMinuteIcon dimensions={"3em"} />
                    )}
                  </div>
                )
              ) : null}

              {/* like toggle */}
              {settings.forPinnedItem ? null : isFetching ? (
                <div
                  style={{ width: "3em", height: "40%" }}
                  className={classes.skeletonLoading}
                ></div>
              ) : (
                <div
                  style={{
                    position: "relative",
                    width: "1.5em",
                    height: "1.5em",
                  }}
                  onClick={() => {
                    if (!isLoading && !isAuthenticated) {
                      setShowTooltip(true);
                    } else if (!isLoading && isAuthenticated) {
                      toggleFavoriteStatusHandler();
                    }
                  }}
                  onMouseEnter={() => {
                    setHoveringOnHeart(true);
                  }}
                  onMouseLeave={() => {
                    setHoveringOnHeart(false);
                  }}
                >
                  {/* heart icon(s) */}
                  <div style={{ cursor: "pointer" }}>
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

                  {/* unregistered user tooltip */}
                  <div
                    style={{
                      opacity: hoveringOnLikesTooltip || showTooltip ? 1 : 0,
                      transform:
                        hoveringOnLikesTooltip || showTooltip
                          ? "scale(1)"
                          : "scale(0)",
                    }}
                    className={classes.likesTooltip}
                    onMouseEnter={() => {
                      setHoveringOnLikesTooltip(true);
                    }}
                    onMouseLeave={() => {
                      setHoveringOnLikesTooltip(false);
                    }}
                  >
                    Sign up or Log in to like drawings
                  </div>
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
                showDrawingModal ? (
                  <CopyToClipboard url={fetchedDrawing} />
                ) : null
              ) : null}

              {!settings.forHomepage ? (
                showDrawingModal ? (
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
      {/* </div> */}
    </div>
  );
};

export default GallaryItem;
