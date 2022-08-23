import React, { useEffect, useState } from "react";

import {
  getDatabase,
  ref as ref_database,
  child,
  get,
} from "firebase/database";

import {
  getDownloadURL,
  getStorage,
  ref as ref_storage,
} from "firebase/storage";

import { app } from "../../util/init-firebase";

import classes from "./ProfilePicture.module.css";
import baseClasses from "../../index.module.css";

const ProfilePicture = ({ user, size }) => {
  const dbRef = ref_database(getDatabase(app));
  const storage = getStorage();

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

    getDownloadURL(ref_storage(storage, `users/${user}/croppedProfile`))
      .then((url) => {
        setImage(url);
      })
      .catch((error) => {
        if (
          error.code === "storage/object-not-found" ||
          error.code === "storage/unknown"
        ) {
          // defaulting to auth0 image
          get(child(dbRef, "dailyPrompts")).then((snapshot) => {
            if (snapshot.exists()) {
              setImage(snapshot.val()["defaultProfilePicture"]);
            }
          });
        }
      });
  }, []);

  useEffect(() => {
    if (image !== null) {
      setIsFetching(false);
    }
  }, [image]);

  return (
    <>
      {isFetching ? (
        <div
          style={{
            display:
              isFetching || showTempBaselineSkeleton || !imageElementLoaded
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
