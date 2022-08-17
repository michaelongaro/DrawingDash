import React, { useEffect, useState, useContext } from "react";

import ProfilePictureUpdateContext from "./ProfilePictureUpdateContext";

import classes from "./ProfilePicture.module.css";
import baseClasses from "../../index.module.css";

const ProfilePicture = ({ user, size }) => {
  const PFPUpdateCtx = useContext(ProfilePictureUpdateContext);

  const [isFetching, setIsFetching] = useState(true);

  const [shimmerStyle, setShimmerStyle] = useState(size);
  const [roundedProfileStyle, setRoundedProfileStyle] = useState(size);

  useEffect(() => {
    if (size === "small") {
      setShimmerStyle(classes.shimmerSmall);
      setRoundedProfileStyle(classes.roundedProfileSmall);
    } else if (size === "medium") {
      setShimmerStyle(classes.shimmerMedium);
      setRoundedProfileStyle(classes.roundedProfileMedium);
    } else {
      setShimmerStyle(classes.shimmerLarge);
      setRoundedProfileStyle(classes.roundedProfileLarge);
    }

    PFPUpdateCtx.fetchProfilePicture(user);
  }, []);

  useEffect(() => {
    if (PFPUpdateCtx.image !== null) {
      setIsFetching(false);
    }
  }, [PFPUpdateCtx.image]);

  return (
    <>
      {isFetching ? (
        <div
          style={{
            width: size === "small" ? "50px" : "65px",
            height: size === "small" ? "50px" : "65px",
            borderRadius: "50%",
          }}
          className={baseClasses.skeletonLoading}
        ></div>
      ) : (
        <div className={shimmerStyle}>
          <img
            className={roundedProfileStyle}
            src={PFPUpdateCtx.image}
            alt="Profile"
          />
        </div>
      )}
    </>
  );
};

export default ProfilePicture;
