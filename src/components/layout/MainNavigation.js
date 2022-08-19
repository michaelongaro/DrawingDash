import React, { useEffect, useState } from "react";

import { Link, NavLink } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

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

  const [showDesktopNavbar, setShowDesktopNavbar] = useState(false);

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
