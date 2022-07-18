import React, { useEffect, useState } from "react";

import getCroppedImg from "../../util/cropImage";

import {
  getDatabase,
  ref as ref_database,
  set,
  child,
  onValue,
  get,
} from "firebase/database";

import {
  getDownloadURL,
  getStorage,
  getMetadata,
  ref as ref_storage,
  // uploadBytes,
} from "firebase/storage";

import { app } from "../../util/init-firebase";

import classes from "./ProfilePicture.module.css";
import baseClasses from "../../index.module.css";

const ProfilePicture = ({ user, size }) => {
  const db = getDatabase(app);
  const dbRef = ref_database(getDatabase(app));
  const storage = getStorage();

  const [isFetching, setIsFetching] = useState(true);

  const [shimmerStyle, setShimmerStyle] = useState(size);
  const [roundedProfileStyle, setRoundedProfileStyle] = useState(size);

  // technically should have profile fetching + return cropped image
  // in separate exported function...
  const [imageFileType, setImageFileType] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [DBCropData, setDBCropData] = useState(null);

  const [image, setImage] = useState();

  // okay so we probably need to upload user.image to storage under "defaultImage"
  // and if the regular fetch fails than get that one

  const showCroppedImage = async () => {
    try {
      const croppedImg = await getCroppedImg(image, DBCropData, imageFileType);

      setCroppedImage(croppedImg);
      setIsFetching(false);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    get(child(dbRef, `users/${user}/preferences`)).then((snapshot) => {
      setDBCropData(snapshot.val()["profileCropMetadata"]);
    });

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

    getDownloadURL(ref_storage(storage, `users/${user}/profile`))
      .then((url) => {
        getMetadata(ref_storage(storage, `users/${user}/profile`))
          .then((metadata) => {
            setImageFileType(metadata.contentType);
            setImage(url);
          })
          .catch((e) => {
            console.error(e);
          });
      })
      .catch((error) => {
        if (
          error.code === "storage/object-not-found" ||
          error.code === "storage/unknown"
        ) {
          // defaulting to auth0 image
          onValue(ref_database(db, `users/${user}/preferences`), (snapshot) => {
            if (snapshot.exists()) {
              setImage(snapshot.val()["defaultProfilePicture"]);
              setIsFetching(false);
            }
          });
        }
      });
  }, []);

  useEffect(() => {
    if (imageFileType && image && DBCropData) {
      showCroppedImage();
    }
  }, [imageFileType, image, DBCropData]);

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
            src={croppedImage ?? image}
            alt="Profile"
          />
        </div>
      )}
    </>
  );
};

export default ProfilePicture;
