import React, { useEffect, useState } from "react";

import getCroppedImg from "../../util/cropImage";

import {
  getDatabase,
  ref as ref_database,
  set,
  child,
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

const ProfilePicture = (props) => {
  const dbRef = ref_database(getDatabase(app));
  const storage = getStorage();

  const [shimmerStyle, setShimmerStyle] = useState(props.size);
  const [roundedProfileStyle, setRoundedProfileStyle] = useState(props.size);

  // technically should have profile fetching + return cropped image
  // in separate exported function...
  const [imageFileType, setImageFileType] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [DBCropData, setDBCropData] = useState(null);

  const [profileImage, setProfileImage] = useState(
    "https://www.tenforums.com/geek/gars/images/2/types/thumb_15951118880user.png"
  );

  const showCroppedImage = async () => {
    try {
      const croppedImg = await getCroppedImg(
        profileImage,
        DBCropData,
        imageFileType
      );

      setCroppedImage(croppedImg);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    get(child(dbRef, `users/${props.user}/preferences`)).then((snapshot) => {
      setDBCropData(snapshot.val()["profileCropMetadata"]);
    });
    
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

    getDownloadURL(ref_storage(storage, `${props.user}/profile`))
      .then((url) => {
        getMetadata(ref_storage(storage, `${props.user}/profile`))
          .then((metadata) => {
            setImageFileType(metadata.contentType);
            setProfileImage(url);
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
          console.log("user profile image not found"); //don't need to log this
        }
      });
  }, []);

  useEffect(() => {
    if (imageFileType && profileImage && DBCropData) {
      showCroppedImage();
    }
  }, [imageFileType, profileImage, DBCropData]);

  // i guess put the profile modal stuff in here as an onclick? seems to make sense

  // later on, have skeleton loading for this too
  return (
    <div className={shimmerStyle}>
      <img
        className={roundedProfileStyle}
        src={croppedImage ?? profileImage}
        alt="Profile"
      />
    </div>
  );
};

export default ProfilePicture;
