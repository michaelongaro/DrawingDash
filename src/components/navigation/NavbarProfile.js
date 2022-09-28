import React, { useEffect, useState, useRef, useContext } from "react";

import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

import anime from "animejs/lib/anime.es";

import ProfilePictureUpdateContext from "../profilePicture/ProfilePictureUpdateContext";

import LogOutButton from "../../oauth/LogOutButton";
import DefaultUserIcon from "../../svgs/DefaultUserIcon";

import {
  getDatabase,
  ref as ref_database,
  set,
  onValue,
  child,
  get,
} from "firebase/database";

import { app } from "../../util/init-firebase";

import classes from "./MainNavigation.module.css";
import baseClasses from "../../index.module.css";

function NavbarProfile({ forSidebar }) {
  const { user, isLoading, isAuthenticated } = useAuth0();
  const db = getDatabase(app);

  // context to determine whether profile picture needs to be refetched
  const PFPUpdateCtx = useContext(ProfilePictureUpdateContext);

  const profilePictureRef = useRef(null);

  // user profile info states
  const [username, setUsername] = useState();
  const [image, setImage] = useState(null);
  const [firstTimeVisiting, setFirstTimeVisiting] = useState(true);

  const [isFetching, setIsFetching] = useState(true);
  const [showTempBaselineSkeleton, setShowTempBaselineSkeleton] =
    useState(true);
  const [imageElementLoaded, setImageElementLoaded] = useState(false);

  // to see if user is hovering on profile picture to show dropdown menu
  const [hoveringOnProfilePicture, setHoveringOnProfilePicture] =
    useState(false);
  const [hoveringOnProfileButton, setHoveringOnProfileButton] = useState(false);
  const [hoveringOnLogOutButton, setHoveringOnLogOutButton] = useState(false);

  useEffect(() => {
    const timerID = setTimeout(() => setShowTempBaselineSkeleton(false), 500);

    return () => {
      clearTimeout(timerID);
    };
  }, []);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      let timerID;

      onValue(ref_database(db, `users/${user.sub}/preferences`), (snapshot) => {
        if (snapshot.exists()) {
          setUsername(snapshot.val()["username"]);
        }
      });

      onValue(
        ref_database(db, `users/${user.sub}/firstTimeVisiting`),
        (snapshot) => {
          if (snapshot.exists()) {
            if (snapshot.val()) {
              console.log("was able to find it");
              // delay to allow base pfp to be uploaded to storage
              timerID = setTimeout(() => {
                PFPUpdateCtx.fetchProfilePicture(user.sub, setImage);
              }, 1000);

              set(
                ref_database(db, `users/${user.sub}/firstTimeVisiting`),
                false
              );
            } else {
              setFirstTimeVisiting(false);

              PFPUpdateCtx.fetchProfilePicture(user.sub, setImage);
            }
          }
        }
      );

      return () => {
        clearTimeout(timerID);
      };
    }
  }, [isLoading, isAuthenticated]);

  useEffect(() => {
    if (image !== null) {
      setIsFetching(false);
    }
  }, [image]);

  useEffect(() => {
    if (PFPUpdateCtx.refreshProfilePicture) {
      setIsFetching(true);
      PFPUpdateCtx.fetchProfilePicture(user.sub, setImage);
      PFPUpdateCtx.setRefreshProfilePicture(false);
    }
  }, [PFPUpdateCtx.refreshProfilePicture]);

  useEffect(() => {
    if (username) {
      anime({
        targets: "#welcometext",
        loop: false,
        width: [0, "100%"],
        height: [0, "100%"],
        opacity: [0, 1],
        minHeight: [0, "auto"],
        direction: "normal",
        duration: 250,
        easing: "easeInSine",
      });
    }
  }, [username]);

  return (
    <>
      {forSidebar ? (
        <div style={{ gap: ".5em" }} className={baseClasses.baseVertFlex}>
          {isFetching || showTempBaselineSkeleton ? (
            <div
              style={{
                display:
                  (isFetching || showTempBaselineSkeleton) &&
                  !imageElementLoaded
                    ? "block"
                    : "none",
                width: "5em",
                height: "5em",
                borderRadius: "50%",
              }}
              className={baseClasses.skeletonLoading}
            ></div>
          ) : (
            <Link
              to="/profile/preferences"
              ref={profilePictureRef}
              className={`${classes.sidebarProfileContainer} ${classes.shimmerMedium}`}
            >
              <img
                style={{
                  display:
                    !isFetching &&
                    !showTempBaselineSkeleton &&
                    imageElementLoaded
                      ? "block"
                      : "none",
                  width: "5em",
                  height: "5em",
                  boxShadow: "rgb(0 0 0 / 30%) 0px 2px 4px 1px",
                }}
                className={classes.profilePicture}
                src={image}
                alt={"profile"}
                onLoad={() => {
                  setImageElementLoaded(true);
                }}
              />
            </Link>
          )}

          {isFetching || showTempBaselineSkeleton ? (
            <div
              style={{
                width: "10em",
                height: "1.5em",
              }}
              className={baseClasses.skeletonLoading}
            ></div>
          ) : (
            <div
              style={{
                textAlign: "center",
                marginTop: ".25em",
                background: "rgba(255,255,255,0.5)",
                borderRadius: "1em",
                padding: "0.15em 0.5em",
              }}
            >{`Welcome${firstTimeVisiting ? "," : " back,"}${
              username ? ` ${username}!` : "!"
            }`}</div>
          )}
        </div>
      ) : (
        <div
          style={{
            alignItems: "flex-end",
            gap: "1em",
            marginLeft: "2em",
          }}
          className={baseClasses.baseFlex}
        >
          <div className={classes.welcomeText}>
            {username && (
              <div
                id={"welcometext"}
                style={{
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  background: "rgba(255,255,255,0.5)",
                  borderRadius: "1em",
                  padding: "0.15em 0.5em",
                }}
              >{`Welcome${firstTimeVisiting ? "," : " back,"}${
                username ? ` ${username}!` : "!"
              }`}</div>
            )}
          </div>
          <div
            style={{
              cursor: "pointer",
            }}
            className={classes.profileDropdownContainer}
            onMouseEnter={() => {
              setHoveringOnProfilePicture(true);
            }}
            onMouseLeave={() => {
              setHoveringOnProfilePicture(false);
            }}
            onClick={() => {
              // only using this because I couldn't lift up z-index to be able to click link
              // without hover malfunctioning
              if (!hoveringOnLogOutButton) {
                profilePictureRef.current.click();
              }
            }}
          >
            <div
              style={{
                position: "absolute",
              }}
            >
              {isFetching || showTempBaselineSkeleton ? (
                <div
                  style={{
                    display:
                      (isFetching || showTempBaselineSkeleton) &&
                      !imageElementLoaded
                        ? "block"
                        : "none",
                    width: "3em",
                    height: "3em",
                    borderRadius: "50%",
                  }}
                  className={baseClasses.skeletonLoading}
                ></div>
              ) : (
                <Link to="/profile/preferences" ref={profilePictureRef}>
                  <img
                    style={{
                      display:
                        !isFetching &&
                        !showTempBaselineSkeleton &&
                        imageElementLoaded
                          ? "block"
                          : "none",
                      boxShadow: "rgb(0 0 0 / 30%) 0px 2px 4px 1px",
                    }}
                    className={classes.profilePicture}
                    src={image}
                    alt={"profile"}
                    onLoad={() => {
                      setImageElementLoaded(true);
                    }}
                  />
                </Link>
              )}
            </div>

            <div
              className={classes.dropdownContainer}
              onMouseEnter={() => {
                setHoveringOnProfilePicture(true);
              }}
              onMouseLeave={() => {
                setHoveringOnProfilePicture(false);
              }}
            >
              <div
                style={{
                  opacity: hoveringOnProfilePicture ? 1 : 0,
                  pointerEvents: hoveringOnProfilePicture ? "auto" : "none",
                }}
                className={classes.profileDropdown}
              >
                <Link
                  className={classes.profileButton}
                  onMouseEnter={() => {
                    setHoveringOnProfileButton(true);
                  }}
                  onMouseLeave={() => {
                    setHoveringOnProfileButton(false);
                  }}
                  to="/profile/preferences"
                >
                  <DefaultUserIcon
                    dimensions={"1.5em"}
                    color={hoveringOnProfileButton ? "white" : "black"}
                  />
                  <div>Profile</div>
                </Link>

                <div
                  style={{
                    width: "100%",
                    height: "100%",
                  }}
                  onMouseEnter={() => {
                    setHoveringOnLogOutButton(true);
                  }}
                  onMouseLeave={() => {
                    setHoveringOnLogOutButton(false);
                  }}
                >
                  <LogOutButton />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default NavbarProfile;
