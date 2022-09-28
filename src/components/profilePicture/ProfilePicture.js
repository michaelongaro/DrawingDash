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

  const [exactSize, setExactSize] = useState(0);

  useEffect(() => {
    const timerID = setTimeout(() => setShowTempBaselineSkeleton(false), 500);

    return () => {
      clearTimeout(timerID);
    };
  }, []);

  useEffect(() => {
    if (size === "small") {
      setExactSize("50px");
      setShimmerStyle(classes.shimmerSmall);
      setRoundedProfileStyle(classes.roundedProfileSmall);
    } else if (size === "medium") {
      setExactSize("65px");
      setShimmerStyle(classes.shimmerMedium);
      setRoundedProfileStyle(classes.roundedProfileMedium);
    } else if (size === "large") {
      setExactSize("175px");
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
            width: exactSize,
            height: exactSize,
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
