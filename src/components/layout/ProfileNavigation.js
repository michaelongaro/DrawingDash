import React from "react";
import { Link } from "react-router-dom";

import classes from "./ProfileNavigation";

const ProfileNavigation = () => {
  return (
    <nav className={classes.sideContain}>
      <ul>
        <li>
          <Link to="/profile">Preferences</Link>
        </li>
        <li>
          <Link to="gallary">Gallary</Link>
        </li>
        <li>
          <Link to="likes">Likes</Link>
        </li>
      </ul>
    </nav>
  );
};

export default ProfileNavigation;
