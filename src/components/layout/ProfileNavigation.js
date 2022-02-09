import React from "react";
import { Link } from "react-router-dom";

import classes from "./ProfileNavigation";

const ProfileNavigation = () => {
  return (
    <nav className={classes.sideContain}>
      <ul>
        <li>
          <Link to="/profile/preferences">Preferences</Link>
        </li>
        <li>
          <Link to="/profile/gallary">Gallary</Link>
        </li>
        <li>
          <Link to="/profile/likes">Likes</Link>
        </li>
      </ul>
    </nav>
  );
};

export default ProfileNavigation;
