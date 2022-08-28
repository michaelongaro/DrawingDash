import React, { useEffect, useState } from "react";

import { Link, NavLink } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { isEqual } from "lodash";

import { getAuth, signInAnonymously } from "firebase/auth";

import {
  getDatabase,
  ref as ref_database,
  set,
  onValue,
  child,
  get,
} from "firebase/database";

import { app } from "../../util/init-firebase";

import NavbarProfile from "./NavbarProfile";
import LogInButton from "../../oauth/LogInButton";
import Logo from "../../svgs/Logo.png";
import Sidebar from "./Sidebar";

import EaselIcon from "../../svgs/EaselIcon";
import MagnifyingGlassIcon from "../../svgs/MagnifyingGlassIcon";

import classes from "./MainNavigation.module.css";
import baseClasses from "../../index.module.css";

function MainNavigation() {
  const { isLoading, isAuthenticated } = useAuth0();

  const dbRef = ref_database(getDatabase(app));

  const [showDesktopNavbar, setShowDesktopNavbar] = useState(false);

  useEffect(() => {
    const auth = getAuth(app);
    signInAnonymously(auth).catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage);
    });
  }, []);

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

              console.log("was userinfo and setting");
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

            console.log("no userinfo and setting");

            localStorage.setItem(
              "unregisteredUserInfo",
              JSON.stringify(userInfo)
            );
          }
        });
    }
  }, [isLoading, isAuthenticated]);

  useEffect(() => {
    // just for initial render
    if (
      window.innerWidth > 1200 &&
      matchMedia("(hover: hover), (pointer: pointer)").matches
    ) {
      setShowDesktopNavbar(true);
    } else {
      setShowDesktopNavbar(false);
    }

    function resizeHandler() {
      if (
        window.innerWidth > 1200 &&
        matchMedia("(hover: hover), (pointer: pointer)").matches
      ) {
        setShowDesktopNavbar(true);
      } else {
        setShowDesktopNavbar(false);
      }
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
      <nav className={classes.navbar}>
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
              {matchMedia("(hover: none), (pointer: coarse)").matches ||
              !showDesktopNavbar ? (
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
