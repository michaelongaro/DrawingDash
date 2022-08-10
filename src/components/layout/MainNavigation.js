import React, { useEffect, useState, useRef, useContext } from "react";

import { Link, NavLink } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import getCroppedImg from "../../util/cropImage";
import anime from "animejs/lib/anime.es";
import isEqual from "lodash/isEqual";

import ProfilePictureUpdateContext from "./ProfilePictureUpdateContext";

import NavbarProfile from "./NavbarProfile";
import LogInButton from "../../oauth/LogInButton";
import LogOutButton from "../../oauth/LogOutButton";
import Logo from "../../svgs/Logo.png";
import Sidebar from "./Sidebar";

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
import baseClasses from "../../index.module.css";

function MainNavigation() {
  // const touchDevice = matchMedia("(hover: none), (pointer: coarse)").matches;

  // context to determine whether profile picture needs to be refetched
  const PFPUpdateCtx = useContext(ProfilePictureUpdateContext);

  // auth0 states
  const { user, isLoading, isAuthenticated } = useAuth0();

  // firebase references
  const db = getDatabase(app);
  const dbRef = ref_database(getDatabase(app));
  const storage = getStorage();

  const [minDesktopWidthReached, setMinDesktopWidthReached] = useState(false);
  const [showDesktopNavbar, setShowDesktopNavbar] = useState(false);

  const profilePictureRef = useRef(null);

  // user profile info states
  const [username, setUsername] = useState();
  const [firstTimeVisiting, setFirstTimeVisiting] = useState(true);

  const [profilePicture, setProfilePicture] = useState();
  const [image, setImage] = useState(null);
  const [prevImage, setPrevImage] = useState(null);
  const [imageFileType, setImageFileType] = useState(null);
  const [DBCropData, setDBCropData] = useState(null);
  const [prevDBCropData, setPrevDBCropData] = useState(null);
  const [cropReadyImage, setCropReadyImage] = useState(null);
  const [imageCroppedAndLoaded, setImageCroppedAndLoaded] = useState(false);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const [croppedImage, setCroppedImage] = useState(null);

  const [isFetching, setIsFetching] = useState(true);

  // to see if user is hovering on profile picture to show dropdown menu
  const [hoveringOnProfilePicture, setHoveringOnProfilePicture] =
    useState(false);
  const [hoveringOnProfileButton, setHoveringOnProfileButton] = useState(false);
  const [hoveringOnLogOutButton, setHoveringOnLogOutButton] = useState(false);

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
    if (image) {
      if (DBCropData !== null) {
        if (DBCropData === false) setIsFetching(false);
        if (croppedImage) setIsFetching(false);
      }
    }
  }, [DBCropData, image, croppedImage]);

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
    // if (!prevDBCropData && !prevImage) {
    if (!isLoading && isAuthenticated) {
      // image manipulation -> should ideally be in its own hook
      onValue(ref_database(db, `users/${user.sub}/preferences`), (snapshot) => {
        if (snapshot.exists()) {
          setUsername(snapshot.val()["username"]);
          if (snapshot.val()["profileCropMetadata"]) {
            setDBCropData(
              snapshot.val()["profileCropMetadata"]["croppedAreaPixels"]
            );
          }
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
      // }
    }

    // making sure that user modal can always be opened when visiting page for the first time
    // localStorage.setItem("baseUserModalOpened", "false");
  }, [isLoading, isAuthenticated]);

  useEffect(() => {
    if (!prevDBCropData && !prevImage && DBCropData && image) {
      setPrevDBCropData(DBCropData);
      setPrevImage(image);
    }
  }, [DBCropData, prevDBCropData, image, prevImage]);

  useEffect(() => {
    if (prevDBCropData && prevImage) {
      // init render
      if (isEqual(prevDBCropData, DBCropData) && isEqual(prevImage, image)) {
        showCroppedImage(true);
      }
      // when profile picture or crop size/location changes
      else if (
        !isEqual(prevDBCropData, DBCropData) &&
        PFPUpdateCtx.justACropChange
      ) {
        showCroppedImage(true);
        setPrevDBCropData(DBCropData);
        PFPUpdateCtx.setJustACropChange(false);
      } else if (
        !isEqual(prevDBCropData, DBCropData) &&
        !PFPUpdateCtx.justACropChange &&
        PFPUpdateCtx.refreshProfilePicture
      ) {
        showCroppedImage(true);
        setPrevDBCropData(DBCropData);
        setPrevImage(image);
      }
    }
  }, [
    prevImage,
    image,
    DBCropData,
    prevDBCropData,
    PFPUpdateCtx.refreshProfilePicture,
    PFPUpdateCtx.justACropChange,
  ]);

  useEffect(() => {
    if (PFPUpdateCtx.refreshProfilePicture) {
      getDownloadURL(ref_storage(storage, `users/${user.sub}/profile`))
        .then((url) => {
          getMetadata(ref_storage(storage, `users/${user.sub}/profile`))
            .then((metadata) => {
              setImageFileType(metadata.contentType);
              setImage(url);
              PFPUpdateCtx.setRefreshProfilePicture(false);
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
                  PFPUpdateCtx.setRefreshProfilePicture(false);
                }
              }
            );
          }
        });
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

  useEffect(() => {
    // just for initial render
    if (
      window.innerWidth >= 1100 &&
      matchMedia("(hover: hover), (pointer: pointer)").matches
    ) {
      setShowDesktopNavbar(true);
    } else {
      setShowDesktopNavbar(false);
    }
    // if (
    //   window.innerWidth > 900 &&
    //   window.innerWidth <= 1075 &&
    //   matchMedia("(hover: hover), (pointer: pointer)").matches
    // ) {
    //   setMinDesktopWidthReached(true);
    // } else {
    //   setMinDesktopWidthReached(false);
    // }

    function resizeHandler() {
      if (
        window.innerWidth >= 1100 &&
        matchMedia("(hover: hover), (pointer: pointer)").matches
      ) {
        setShowDesktopNavbar(true);
      } else {
        setShowDesktopNavbar(false);
      }
      // } else if (
      //   window.innerWidth > 900 &&
      //   window.innerWidth <= 1075 &&
      //   matchMedia("(hover: hover), (pointer: pointer)").matches
      // ) {
      //   setMinDesktopWidthReached(true);
      // } else {
      //   setMinDesktopWidthReached(false);
      // }
    }
    window.addEventListener("resize", resizeHandler);
    return () => {
      window.removeEventListener("resize", resizeHandler);
    };
  }, []);

  return (
    <header className={classes.header}>
      <div className={classes.logo}>
        <Link to="/">
          <img
            id={classes.logoImg}
            src={Logo}
            style={{ maxWidth: "115px", marginTop: ".25em" }}
            alt="Logo"
          />
        </Link>
      </div>
      <nav
        style={
          !isAuthenticated && minDesktopWidthReached
            ? {
                width: "90%",
              }
            : {}
        }
        className={classes.navbar}
      >
        <ul
          style={{
            position: "relative ",
            justifyContent: "space-between",
            flexWrap: "nowrap",
            paddingLeft: "1em",
            paddingRight: showDesktopNavbar ? "4em" : "1em",
            transition: "all 200ms",
          }}
        >
          <div className={`${baseClasses.baseFlex} ${classes.mainLinkButtons}`}>
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
                  <div
                    style={{ fontSize: "1.25em", color: "#f6f6f6" }}
                    className={classes.navButton}
                  >
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
                  <MagnifyingGlassIcon dimensions={"1.75em"} color={"white"} />
                  <div
                    style={{ fontSize: "1.25em", color: "#fff" }}
                    className={classes.navButton}
                  >
                    Explore
                  </div>
                </div>
              </NavLink>
            </li>
          </div>

          {!isLoading && !isAuthenticated ? (
            <>
              {matchMedia("(hover: none), (pointer: coarse)").matches ? (
                <Sidebar />
              ) : (
                <div className={classes.signInButtons}>
                  <LogInButton forceShowSignUp={true} />
                  <LogInButton forceShowSignUp={false} />
                </div>
              )}
            </>
          ) : (
            <>
              {matchMedia("(hover: none), (pointer: coarse)").matches ||
              !showDesktopNavbar ? (
                <Sidebar />
              ) : (
                <NavbarProfile forSidebar={false} />
              )}
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default MainNavigation;
