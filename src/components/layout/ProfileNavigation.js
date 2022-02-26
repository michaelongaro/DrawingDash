import React from "react";
import { Link } from "react-router-dom";

import classes from "./ProfileNavigation.module.css";

const ProfileNavigation = () => {
  return (
    <nav className={classes.sidebar}>
      <ul>
        <li className={classes.sideContain}>
          <Link to="/profile/preferences" className={classes.navlink} style={{  textDecoration: 'none' }}>Preferences</Link>
        </li>
        <li className={classes.sideContain}>
          <Link to="/profile/gallary" className={classes.navlink} style={{ textDecoration: 'none' }}>Gallary</Link>
        </li>
        <li className={classes.sideContain}>
          <Link to="/profile/likes" className={classes.navlink} style={{ textDecoration: 'none' }}>Likes</Link>
        </li>
      </ul>
    </nav>
  );
};

export default ProfileNavigation;
