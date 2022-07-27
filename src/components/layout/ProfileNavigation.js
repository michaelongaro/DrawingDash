import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import GalleryIcon from "../../svgs/GalleryIcon";
import LikesIcon from "../../svgs/LikesIcon";
import PreferencesIcon from "../../svgs/PreferencesIcon";

import classes from "./ProfileNavigation.module.css";

const ProfileNavigation = () => {
  const [greenActive, setGreenActive] = useState(false);
  const [yellowActive, setYellowActive] = useState(false);
  const [redActive, setRedActive] = useState(false);

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
