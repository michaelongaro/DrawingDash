import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import GalleryIcon from "../../svgs/GalleryIcon";
import LikesIcon from "../../svgs/LikesIcon";
import PreferencesIcon from "../../svgs/PreferencesIcon";

import classes from "./ProfileNavigation.module.css";

const ProfileNavigation = () => {
  const selectedBackgroundColors = [
    "hsl(128deg 100% 42%)",
    "hsl(60deg 95% 39%)",
    "hsl(357deg 100% 37%)",
  ];
  const [navBackgrounds, setNavBackgrounds] = useState([
    "hsl(128deg 100% 42%)",
    "hsl(61deg 85% 27%)",
    "hsl(356deg 89% 18%)",
  ]);

  function updateBackgroundColor(idx) {
    let newBackgroundColors = [
      "hsl(136deg 95% 24%)",
      "hsl(61deg 85% 27%)",
      "hsl(356deg 89% 18%)",
    ];

    newBackgroundColors[idx] = selectedBackgroundColors[idx];
    setNavBackgrounds(newBackgroundColors);
  }

  return (
    <nav className={classes.sidebar}>
      <ul className={classes.vertContain}>
        <li className={classes.sideContain}>
          <div className={classes.greenNavlink}>
            <NavLink
              to="/profile/preferences"
              className={({ isActive }) =>
                isActive ? classes.greenActive : ""
              }
            >
              <PreferencesIcon />
              <div>Preferences</div>
            </NavLink>
          </div>
        </li>
        <li className={classes.sideContain}>
          <div className={classes.yellowNavlink}>
            <NavLink
              to="/profile/gallery"
              className={({ isActive }) =>
                isActive ? classes.yellowActive : ""
              }
            >
              <GalleryIcon />
              <div>Gallery</div>
            </NavLink>
          </div>
        </li>
        <li className={classes.sideContain}>
          <div className={classes.redNavlink}>
            <NavLink
              to="/profile/likes"
              className={({ isActive }) => (isActive ? classes.redActive : "")}
            >
              <LikesIcon />
              <div>Likes</div>
            </NavLink>
          </div>
        </li>
      </ul>
    </nav>
  );
};

export default ProfileNavigation;
