import React, { useEffect, useState } from "react";

import { Link, NavLink } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import getCroppedImg from "../../util/cropImage";


import LogInButton from "../../oauth/LogInButton";
import LogOutButton from "../../oauth/LogOutButton";

import EaselIcon from "../../svgs/EaselIcon";
import MagnifyingGlassIcon from "../../svgs/MagnifyingGlassIcon";

import {
  getDatabase,
  ref as ref_database,
  set,
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
import DefaultUserIcon from "../../svgs/DefaultUserIcon";

function MainNavigation() {
  // auth0 states
  const { user, isLoading, isAuthenticated } = useAuth0();

  // firebase references
  const dbRef = ref_database(getDatabase(app));
  const storage = getStorage();

  // user profile info states
  const [username, setUsername] = useState();
  const [profilePicture, setProfilePicture] = useState();
  const [image, setImage] = useState(null);
  const [imageFileType, setImageFileType] = useState(null);
  const [DBCropData, setDBCropData] = useState();
  const [cropReadyImage, setCropReadyImage] = useState(null);
  const [imageCroppedAndLoaded, setImageCroppedAndLoaded] = useState(false);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const [croppedImage, setCroppedImage] = useState(null);

  const [onDailyDraw, setOnDailyDraw] = useState(false);
  const [onExplore, setOnExplore] = useState(false);

  // for hover styles
  const [dailyDrawActive, setDailyDrawActive] = useState(false);
  const [exploreActive, setExploreActive] = useState(false);

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
    if (!isLoading && isAuthenticated) {
      get(child(dbRef, `users/${user.sub}/preferences`)).then((snapshot) => {
        if (snapshot.exists()) {
          setUsername(snapshot.val()["username"]);
          setDBCropData(snapshot.val()["profileCropMetadata"]);
        }
      });

      getDownloadURL(ref_storage(storage, `${user.sub}/profile`))
        .then((url) => {
          getMetadata(ref_storage(storage, `${user.sub}/profile`))
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
            setImageCroppedAndLoaded(true);
            console.log("user profile image not found"); //don't need to log this
          }
        });
    }
  }, [isLoading, isAuthenticated]);

    useEffect(() => {
    if (DBCropData && image) {
      showCroppedImage(true);
    }
  }, [image, DBCropData]);

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
              <div>{`Welcome back${username ? ` ${username}!` : "!"}`}</div>
              <img
                className={classes.profilePicture}
                src={croppedImage ? croppedImage : image ?? <DefaultUserIcon />}
                alt={"cropped profile"}
              />
            </div>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default MainNavigation;
