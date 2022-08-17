import React, { useState, useContext } from "react";

import ProfilePictureUpdateContext from "../components/layout/ProfilePictureUpdateContext";

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

import { app } from "./init-firebase";

export default async function useProfileImage(userID) {
  const PFPUpdateCtx = useContext(ProfilePictureUpdateContext);

  console.log("entered");
  const dbRef = ref_database(getDatabase(app));
  const storage = getStorage();
  if (userID) {
    getDownloadURL(ref_storage(storage, `users/${userID}/croppedProfile`))
      .then((url) => {
        console.log(url);
        PFPUpdateCtx.setImage(url);
      })
      .catch((error) => {
        if (
          error.code === "storage/object-not-found" ||
          error.code === "storage/unknown"
        ) {
          // defaulting to auth0 image
          get(child(dbRef, "dailyPrompts")).then((snapshot) => {
            if (snapshot.exists()) {
              PFPUpdateCtx.setImage(snapshot.val()["defaultProfilePicture"]);
            }
          });

          // onValue(ref_database(db, `users/${userID}/preferences`), (snapshot) => {
          //   if (snapshot.exists()) {
          //     setImage(snapshot.val()["defaultProfilePicture"]);
          //     setImageCroppedAndLoaded(true);
          //     PFPUpdateCtx.setRefreshProfilePicture(false);
          //   }
          // });
        }
      });
  }
}
