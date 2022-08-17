import React, { useEffect, useState, useRef, useContext } from "react";

import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

import anime from "animejs/lib/anime.es";
import isEqual from "lodash/isEqual";

import ProfilePictureUpdateContext from "./ProfilePictureUpdateContext";

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
  // context to determine whether profile picture needs to be refetched
  const PFPUpdateCtx = useContext(ProfilePictureUpdateContext);

  // auth0 states
  const { user, isLoading, isAuthenticated } = useAuth0();

  // firebase references
  const db = getDatabase(app);
  const dbRef = ref_database(getDatabase(app));
  // const storage = getStorage();

  const profilePictureRef = useRef(null);

  // user profile info states
  const [username, setUsername] = useState();
  const [firstTimeVisiting, setFirstTimeVisiting] = useState(true);

  const [isFetching, setIsFetching] = useState(true);

  // to see if user is hovering on profile picture to show dropdown menu
  const [hoveringOnProfilePicture, setHoveringOnProfilePicture] =
    useState(false);
  const [hoveringOnProfileButton, setHoveringOnProfileButton] = useState(false);
  const [hoveringOnLogOutButton, setHoveringOnLogOutButton] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      let currentPrompts;

      let currentUserInfo = JSON.parse(
        localStorage.getItem("unregisteredUserInfo")
      );

      get(child(dbRef, "dailyPrompts"))
        .then((snapshot) => {
          if (snapshot.exists()) {
            currentPrompts = snapshot.val();
          }
        })
        .then(() => {
          if (currentUserInfo) {
            // do check here if words are different
            if (!isEqual(currentUserInfo["lastSeenPrompts"], currentPrompts)) {
              // allowing user to draw if the day's drawings have reset
              // and updating lastSeenPrompts value
              currentUserInfo.dailyCompletedPrompts = {
                60: false,
                180: false,
                300: false,
              };

              currentUserInfo["lastSeenPrompts"] = currentPrompts;

              localStorage.setItem(
                "unregisteredUserInfo",
                JSON.stringify(currentUserInfo)
              );
            }
          } else {
            // initializing new user localstorage data
            const userInfo = {
              drawingMetadata: {},
              drawings: {},
              dailyCompletedPrompts: {
                60: false,
                180: false,
                300: false,
              },
              lastSeenPrompts: currentPrompts,
            };
            localStorage.setItem(
              "unregisteredUserInfo",
              JSON.stringify(userInfo)
            );
          }
        });
    }

    if (!isLoading && isAuthenticated) {
      onValue(ref_database(db, `users/${user.sub}/preferences`), (snapshot) => {
        if (snapshot.exists()) {
          setUsername(snapshot.val()["username"]);
        }
      });

      get(child(dbRef, `users/${user.sub}/firstTimeVisiting`)).then(
        (snapshot) => {
          if (snapshot.exists()) {
            if (snapshot.val()) {
              set(
                ref_database(db, `users/${user.sub}/firstTimeVisiting`),
                false
              );
            } else {
              setFirstTimeVisiting(false);
            }
          }
        }
      );

      PFPUpdateCtx.fetchProfilePicture(user.sub);
    }
  }, [isLoading, isAuthenticated]);

  useEffect(() => {
    if (PFPUpdateCtx.image !== null) {
      setIsFetching(false);
    }
  }, [PFPUpdateCtx.image]);

  useEffect(() => {
    if (PFPUpdateCtx.refreshProfilePicture) {
      setIsFetching(true);
      PFPUpdateCtx.fetchProfilePicture(user.sub);
    }
  }, [PFPUpdateCtx.refreshProfilePicture]);

  useEffect(() => {
    if (username) {
      anime({
        targets: "#welcometext",
        loop: false,
        // width: [0, "100%"],
        // height: [0, "100%"],
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
          {isFetching ? (
            <div
              style={{
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
                  width: "5em",
                  height: "5em",

                  boxShadow: "rgb(0 0 0 / 30%) 0px 2px 4px 1px",
                }}
                className={classes.profilePicture}
                src={PFPUpdateCtx.image}
                alt={"cropped profile"}
              />
            </Link>
          )}
          {username && <div>{username}</div>}
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
                  display: "inline-block",
                  whiteSpace: "nowrap",
                }}
              >{`Welcome ${firstTimeVisiting ? "" : "back"},${
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
            {/* zIndex just to be able to click on the <Link> */}
            <div
              style={{
                position: "absolute",
              }}
            >
              {isFetching ? (
                <div
                  style={{
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
                      boxShadow: "rgb(0 0 0 / 30%) 0px 2px 4px 1px",
                    }}
                    className={classes.profilePicture}
                    src={PFPUpdateCtx.image}
                    alt={"cropped profile"}
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
