import React from "react";

import PreferencesIcon from "../../svgs/PreferencesIcon";
import GalleryIcon from "../../svgs/GalleryIcon";
import LikesIcon from "../../svgs/LikesIcon";

import classes from "./ProfileHeader.module.css";

const ProfileHeader = ({ title }) => {
  return (
    <div
      style={{ width: title === "Preferences" ? "100%" : "" }}
      className={classes.profileHeader}
    >
      <div className={classes.leadingLine}></div>
      {title === "Preferences" && <PreferencesIcon dimensions={"1.75em"} />}
      {title === "Gallery" && <GalleryIcon dimensions={"1.75em"} />}
      {title === "Likes" && <LikesIcon dimensions={"1.75em"} />}
      {title}
      <div className={classes.trailingLine}></div>
    </div>
  );
};

export default ProfileHeader;
