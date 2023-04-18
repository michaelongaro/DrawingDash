import React, { useState, useEffect, useContext } from "react";

import ModalContext from "./ModalContext";

import Card from "../../ui/Card";
import ProfilePicture from "../profilePicture/ProfilePicture";
import UserModal from "./UserModal";

import { getDatabase, get, ref, child } from "firebase/database";

import { app } from "../../util/init-firebase";

import baseClasses from "../../index.module.css";

const UserItem = ({ userID }) => {
  const modalCtx = useContext(ModalContext);

  const dbRef = ref(getDatabase(app));

  const [dynamicWidth, setDynamicWidth] = useState(0);

  const [isFetching, setIsFetching] = useState(true);
  const [username, setUsername] = useState(null);
  const [status, setStatus] = useState(null);

  const [showTempBaselineSkeleton, setShowTempBaselineSkeleton] =
    useState(true);

  const [showUserModal, setShowUserModal] = useState(false);
  const [loadUserModal, setLoadUserModal] = useState(false);

  const [hoveringOnProfilePicture, setHoveringOnProfilePicture] =
    useState(false);
  const [mouseDownState, setMouseDownState] = useState(false);

  useEffect(() => {
    get(child(dbRef, `users/${userID}`)).then((snapshot) => {
      if (snapshot.exists()) {
        setUsername(snapshot.val()["preferences"]["username"]);
        setStatus(snapshot.val()["preferences"]["status"]);

        setIsFetching(false);
      }
    });

    setShowTempBaselineSkeleton(true);

    const timerID = setTimeout(() => setShowTempBaselineSkeleton(false), 500);

    return () => {
      clearTimeout(timerID);
    };
  }, [userID]);

  useEffect(() => {
    if (hoveringOnProfilePicture) {
      document.documentElement.style.setProperty("--shimmerPlayState", "true");
    } else {
      document.documentElement.style.setProperty("--shimmerPlayState", "false");
    }
  }, [hoveringOnProfilePicture]);

  useEffect(() => {
    function resizeHandler() {
      if (window.innerWidth > 750) {
        setDynamicWidth("85");
      } else {
        setDynamicWidth("100");
      }
    }

    resizeHandler();

    window.addEventListener("resize", resizeHandler);
    return () => {
      window.removeEventListener("resize", resizeHandler);
    };
  }, []);

  return (
    <Card width={dynamicWidth}>
      <div
        style={{
          gap: ".5em",
          padding: "1em 0",
          cursor: "pointer",
          borderRadius: "1em",
          background: mouseDownState ? "rgba(0,0,0,0.3)" : "white",
          transition: "all 200ms",
        }}
        className={baseClasses.baseVertFlex}
        onClick={(ev) => {
          ev.stopPropagation();
          if (!modalCtx.userModalOpened) {
            setShowUserModal(true);
            modalCtx.setUserModalOpened(true);
            setLoadUserModal(true);
          } else {
            // closing drawing modal and taking user back to original user modal
            // done to save bandwidth and also for user clarity so they can't go
            // multiple layers deep
            modalCtx.setDrawingModalFromUserOpened(false);
          }
        }}
        onMouseDown={() => {
          setMouseDownState(true);
        }}
        onMouseUp={() => {
          setMouseDownState(false);
        }}
        onMouseLeave={() => {
          setMouseDownState(false);
        }}
      >
        {showTempBaselineSkeleton || isFetching ? (
          <div
            style={{
              width: "175px",
              height: "175px",
              borderRadius: "50%",
            }}
            className={baseClasses.skeletonLoading}
          ></div>
        ) : (
          <div
            style={{
              position: "relative",
              cursor: "pointer",
              width: "175px",
              height: "175px",
              borderRadius: "50%",
              boxShadow: "rgb(0 0 0 / 10%) 0 2px 4px",
            }}
            onMouseEnter={() => {
              setHoveringOnProfilePicture(true);
            }}
            onMouseLeave={() => {
              setHoveringOnProfilePicture(false);
            }}
          >
            <ProfilePicture user={userID} size={"large"} />
          </div>
        )}

        {showTempBaselineSkeleton || isFetching ? (
          <div
            style={{
              width: "5em",
              height: "1em",
              marginTop: "1em",
            }}
            className={baseClasses.skeletonLoading}
          ></div>
        ) : (
          <div
            style={{
              marginTop: "1em",
              fontWeight: 600,
            }}
          >
            {username}
          </div>
        )}

        {showTempBaselineSkeleton || isFetching ? (
          <div
            style={{
              width: "8em",
              height: "1em",
            }}
            className={baseClasses.skeletonLoading}
          ></div>
        ) : (
          <div style={{ textAlign: "center" }}>
            <i>"{status}"</i>
          </div>
        )}
      </div>

      {/* ----- user modal ------- */}
      <div
        style={{
          opacity: showUserModal && modalCtx.userModalOpened ? 1 : 0,
          pointerEvents:
            showUserModal && modalCtx.userModalOpened ? "auto" : "none",
          transition: "all 200ms",
        }}
        className={baseClasses.modal}
      >
        {loadUserModal && <UserModal userID={userID} />}
      </div>
    </Card>
  );
};

export default UserItem;
