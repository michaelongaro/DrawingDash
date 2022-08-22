import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import GalleryIcon from "../../svgs/GalleryIcon";
import LikesIcon from "../../svgs/LikesIcon";
import PreferencesIcon from "../../svgs/PreferencesIcon";

import classes from "./ProfileNavigation.module.css";

const ProfileNavigation = () => {
  const location = useLocation();

  const [greenActive, setGreenActive] = useState(false);
  const [yellowActive, setYellowActive] = useState(false);
  const [redActive, setRedActive] = useState(false);

  useEffect(() => {
    if (location.pathname === "/profile/preferences") {
      updateProfileNavigationLinkStates("100%", "0%", "0%");
    } else if (location.pathname === "/profile/gallery") {
      updateProfileNavigationLinkStates("0%", "100%", "0%");
    } else if (location.pathname === "/profile/likes") {
      updateProfileNavigationLinkStates("0%", "0%", "100%");
    } else {
      updateProfileNavigationLinkStates("0%", "0%", "0%");
    }
  }, [location.pathname]);

  function updateProfileNavigationLinkStates(
    greenPercent,
    yellowPercent,
    redPercent
  ) {
    document.documentElement.style.setProperty(
      "--greenNavbuttonWidth",
      greenPercent
    );
    document.documentElement.style.setProperty(
      "--yellowNavbuttonWidth",
      yellowPercent
    );
    document.documentElement.style.setProperty(
      "--redNavbuttonWidth",
      redPercent
    );

    setGreenActive(greenPercent === "100%");
    setYellowActive(yellowPercent === "100%");
    setRedActive(redPercent === "100%");
  }

  return (
    <nav className={classes.sidebar}>
      <ul className={classes.vertContain}>
        <li className={classes.sideContain}>
          <div
            className={classes.greenNavlink}
            onMouseEnter={() => setGreenActive(true)}
            onMouseLeave={() => setGreenActive(false)}
          >
            <NavLink
              to="/profile/preferences"
              className={classes.navlink}
              style={({ isActive }) =>
                isActive
                  ? { backgroundColor: "hsl(128deg 100% 42%)" }
                  : undefined
              }
            >
              {({ isActive }) => (
                <>
                  <PreferencesIcon
                    dimensions={"1.75em"}
                    color={isActive || greenActive ? "#fafafa" : "black"}
                  />
                  <div
                    style={{
                      color: isActive || greenActive ? "#fafafa" : "black",
                      transition: "all 300ms",
                    }}
                  >
                    Preferences
                  </div>
                </>
              )}
            </NavLink>
          </div>
        </li>
        <li className={classes.sideContain}>
          <div
            className={classes.yellowNavlink}
            onMouseEnter={() => setYellowActive(true)}
            onMouseLeave={() => setYellowActive(false)}
          >
            <NavLink
              to="/profile/gallery"
              className={classes.navlink}
              style={({ isActive }) =>
                isActive ? { backgroundColor: "hsl(60deg 95% 39%)" } : undefined
              }
            >
              {({ isActive }) => (
                <>
                  <GalleryIcon
                    dimensions={"1.75em"}
                    color={isActive || yellowActive ? "#fafafa" : "black"}
                  />
                  <div
                    style={{
                      color: isActive || yellowActive ? "#fafafa" : "black",
                      transition: "all 300ms",
                    }}
                  >
                    Gallery
                  </div>
                </>
              )}
            </NavLink>
          </div>
        </li>
        <li className={classes.sideContain}>
          <div
            className={classes.redNavlink}
            onMouseEnter={() => setRedActive(true)}
            onMouseLeave={() => setRedActive(false)}
          >
            <NavLink
              to="/profile/likes"
              className={classes.navlink}
              style={({ isActive }) =>
                isActive
                  ? { backgroundColor: "hsl(357deg 100% 37%)" }
                  : undefined
              }
            >
              {({ isActive }) => (
                <>
                  <LikesIcon
                    dimensions={"1.75em"}
                    color={isActive || redActive ? "#fafafa" : "black"}
                  />
                  <div
                    style={{
                      color: isActive || redActive ? "#fafafa" : "black",
                      transition: "all 300ms",
                    }}
                  >
                    Likes
                  </div>
                </>
              )}
            </NavLink>
          </div>
        </li>
      </ul>
    </nav>
  );
};

export default ProfileNavigation;
