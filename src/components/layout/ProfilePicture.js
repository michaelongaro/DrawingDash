import React, { useEffect, useState } from "react";

import {
  getDownloadURL,
  getStorage,
  ref as ref_storage,
  // uploadBytes,
} from "firebase/storage";

import classes from "./ProfilePicture.module.css";

const ProfilePicture = (props) => {
  const [shimmerStyle, setShimmerStyle] = useState(props.size);
  const [roundedProfileStyle, setRoundedProfileStyle] = useState(props.size);
  const storage = getStorage();

  const [profileImage, setProfileImage] = useState(
    "https://www.tenforums.com/geek/gars/images/2/types/thumb_15951118880user.png"
  );

  useEffect(() => {
    if (props.size === "small") {
      setShimmerStyle(classes.shimmerSmall);
      setRoundedProfileStyle(classes.roundedProfileSmall);
    } else if (props.size === "medium") {
      setShimmerStyle(classes.shimmerMedium);
      setRoundedProfileStyle(classes.roundedProfileMedium);
    } else {
      setShimmerStyle(classes.shimmerLarge);
      setRoundedProfileStyle(classes.roundedProfileLarge);
    }

    getDownloadURL(ref_storage(storage, `${props.user}/profile.jpg`)).then(
      (url) => {
        setProfileImage(url);
      }
    );
  }, []);


  // i guess put the profile modal stuff in here as an onclick? seems to make sense


  return (
    <div className={shimmerStyle}>
      <img
        className={roundedProfileStyle}
        src={profileImage}
        alt="Profile"
      />
    </div>
  );
};

export default ProfilePicture;
