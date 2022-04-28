import React from "react";

import PreferencesIcon from "../../svgs/PreferencesIcon";
import GalleryIcon from "../../svgs/GalleryIcon";
import LikesIcon from "../../svgs/LikesIcon";

import classes from "./ProfileHeader.module.css";

const ProfileHeader = ({ title }) => {
  return (
    <div className={classes.profileHeader}>
      <div className={classes.leadingLine}></div>
      {title === "Preferences" && <PreferencesIcon />}
      {title === "Gallery" && <GalleryIcon />}
      {title === "Likes" && <LikesIcon />}
      {title}
      <div className={classes.trailingLine}></div>
    </div>
  );
};

export default ProfileHeader;
