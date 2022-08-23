import React, { useEffect, useState, useContext } from "react";

import ProfilePictureUpdateContext from "./ProfilePictureUpdateContext";

import classes from "./ProfilePicture.module.css";
import baseClasses from "../../index.module.css";

const ProfilePicture = ({ user, size }) => {
  const PFPUpdateCtx = useContext(ProfilePictureUpdateContext);

  const [isFetching, setIsFetching] = useState(true);
  const [showTempBaselineSkeleton, setShowTempBaselineSkeleton] =
    useState(true);
  const [imageElementLoaded, setImageElementLoaded] = useState(false);

  const [image, setImage] = useState(null);
  const [shimmerStyle, setShimmerStyle] = useState(size);
  const [roundedProfileStyle, setRoundedProfileStyle] = useState(size);

  useEffect(() => {
    const timerID = setTimeout(() => setShowTempBaselineSkeleton(false), 500);

    return () => {
      clearTimeout(timerID);
    };
  }, []);

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

    PFPUpdateCtx.fetchProfilePicture(user, setImage);
  }, []);

  useEffect(() => {
    if (image !== null) {
      setIsFetching(false);
    }
  }, [image]);

  return (
    <>
      {isFetching || showTempBaselineSkeleton ? (
        <div
          style={{
            display:
              (isFetching || showTempBaselineSkeleton) && !imageElementLoaded
                ? "block"
                : "none",
            width: size === "small" ? "50px" : "65px",
            height: size === "small" ? "50px" : "65px",
            borderRadius: "50%",
          }}
          className={baseClasses.skeletonLoading}
        ></div>
      ) : (
        <div className={shimmerStyle}>
          <img
            style={{
              display:
                !isFetching && !showTempBaselineSkeleton && imageElementLoaded
                  ? "block"
                  : "none",
            }}
            className={roundedProfileStyle}
            src={image}
            alt="Profile"
            onLoad={() => {
              setImageElementLoaded(true);
            }}
          />
        </div>
      )}
    </>
  );
};

export default ProfilePicture;
