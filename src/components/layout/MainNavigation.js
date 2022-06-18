import React, { useEffect, useState } from "react";

import { Link, NavLink } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import getCroppedImg from "../../util/cropImage";
import anime from "animejs/lib/anime.es";
import isEqual from "lodash/isEqual";

import LogInButton from "../../oauth/LogInButton";
import LogOutButton from "../../oauth/LogOutButton";

import EaselIcon from "../../svgs/EaselIcon";
import MagnifyingGlassIcon from "../../svgs/MagnifyingGlassIcon";
import DefaultUserIcon from "../../svgs/DefaultUserIcon";

import {
  getDatabase,
  ref as ref_database,
  set,
  onValue,
  child,
  get,
} from "firebase/database";

import {
  getDownloadURL,
  getStorage,
  getMetadata,
  updateMetadata,
  put,
  ref as ref_storage,
  uploadBytes,
} from "firebase/storage";

import { app } from "../../util/init-firebase";

import classes from "./MainNavigation.module.css";

function MainNavigation() {
  // auth0 states
  const { user, isLoading, isAuthenticated } = useAuth0();

  // firebase references
  const db = getDatabase(app);
  const dbRef = ref_database(getDatabase(app));
  const storage = getStorage();

  // user profile info states
  const [username, setUsername] = useState();
  const [firstTimeVisiting, setFirstTimeVisiting] = useState();

  const [profilePicture, setProfilePicture] = useState();
  const [image, setImage] = useState(null);
  const [imageFileType, setImageFileType] = useState(null);
  const [DBCropData, setDBCropData] = useState();
  const [cropReadyImage, setCropReadyImage] = useState(null);
  const [imageCroppedAndLoaded, setImageCroppedAndLoaded] = useState(false);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const [croppedImage, setCroppedImage] = useState(null);

  // to see if user is hovering on profile picture to show dropdown menu
  const [hoveringOnProfilePicture, setHoveringOnProfilePicture] =
    useState(false);
  const [hoveringOnProfileButton, setHoveringOnProfileButton] = useState(false);

  // all of this should really be encapsulated into a hook
  const showCroppedImage = async (disableSkeleton = false) => {
    try {
      let currentCropAreaPixels = croppedAreaPixels ?? DBCropData;

      const croppedImg = await getCroppedImg(
        cropReadyImage ?? image,
        currentCropAreaPixels,
        imageFileType
      );

      setCroppedImage(croppedImg);

      if (disableSkeleton) {
        setImageCroppedAndLoaded(true);
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      console.log("not authenticated or trying to");
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
      console.log("authenticated");

      // image manipulation -> should ideally be in its own hook
      onValue(ref_database(db, `users/${user.sub}/preferences`), (snapshot) => {
        if (snapshot.exists()) {
          setUsername(snapshot.val()["username"]);
          setDBCropData(snapshot.val()["profileCropMetadata"]);
        }
      });

      get(child(dbRef, `users/${user.sub}/firstTimeVisting`)).then(
        (snapshot) => {
          if (snapshot.exists()) {
            if (snapshot.val()) {
              setFirstTimeVisiting(true);
              set(
                ref_database(db, `users/${user.sub}/firstTimeVisiting`),
                false
              );
            }
          }
        }
      );

      getDownloadURL(ref_storage(storage, `users/${user.sub}/profile`))
        .then((url) => {
          getMetadata(ref_storage(storage, `users/${user.sub}/profile`))
            .then((metadata) => {
              setImageFileType(metadata.contentType);
              setImage(url);
            })
            .catch((e) => {
              console.error(e);
            });
        })
        .catch((error) => {
          if (
            error.code === "storage/object-not-found" ||
            error.code === "storage/unknown"
          ) {
            // defaulting to auth0 image
            onValue(
              ref_database(db, `users/${user.sub}/preferences`),
              (snapshot) => {
                if (snapshot.exists()) {
                  setImage(snapshot.val()["defaultProfilePicture"]);
                  setImageCroppedAndLoaded(true);
                }
              }
            );
          }
        });
    }
  }, [isLoading, isAuthenticated]);

  useEffect(() => {
    if (DBCropData && image) {
      showCroppedImage(true);
    }
  }, [image, DBCropData]);

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
    <header className={classes.header}>
      <div className={classes.logo}>
        <Link to="/">Drawing Dash</Link>
      </div>
      <nav>
        <ul>
          <li>
            <NavLink
              className={({ isActive }) =>
                `${classes.dailyDrawButton} ${
                  isActive ? classes.activeDailyDraw : ""
                }`
              }
              to="/daily-drawings"
            >
              <div className={classes.drawButtonBackground}>
                <EaselIcon dimensions={"2.75em"} />
                <div style={{ fontSize: "1.25em", color: "#f6f6f6" }}>
                  Daily Drawings
                </div>
              </div>
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/explore"
              className={({ isActive }) =>
                `${classes.exploreButton} ${
                  isActive ? classes.activeExplore : ""
                }`
              }
            >
              <div className={classes.drawButtonBackground}>
                <MagnifyingGlassIcon dimensions={"1.75em"} />
                <div style={{ fontSize: "1.25em", color: "#fff" }}>Explore</div>
              </div>
            </NavLink>
          </li>

          {!isLoading && !isAuthenticated ? (
            <div className={classes.signinout}>
              <LogInButton forceShow={true} />
              <LogInButton forceShow={false} />
            </div>
          ) : (
            <div className={classes.baseFlex}>
              {username ? (
                <div
                  id={"welcometext"}
                  style={{ overflow: "hidden", display: "inline-block" }}
                >{`Welcome ${firstTimeVisiting ? "" : "back"},${
                  username ? ` ${username}!` : "!"
                }`}</div>
              ) : null}
              <div
                className={classes.profileDropdownContainer}
                onMouseEnter={() => {
                  setHoveringOnProfilePicture(true);
                }}
                onMouseLeave={() => {
                  setHoveringOnProfilePicture(false);
                }}
              >
                <div style={{ position: "absolute" }}>
                  <img
                    className={classes.profilePicture}
                    src={
                      croppedImage
                        ? croppedImage
                        : image
                    }
                    alt={"cropped profile"}
                  />
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
                    <LogOutButton />
                  </div>
                </div>
              </div>
            </div>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default MainNavigation;
