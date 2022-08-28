import React, { createContext, useState } from "react";

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

const ProfilePictureUpdateContext = createContext(null);

export function ProfilePictureUpdateProvider(props) {
  const dbRef = ref_database(getDatabase(app));
  const storage = getStorage();

  const [refreshProfilePicture, setRefreshProfilePicture] = useState(false);
  // const [image, setImage] = useState(null);
  const [justACropChange, setJustACropChange] = useState(false);

  function fetchProfilePicture(userID, setImage) {
    getDownloadURL(ref_storage(storage, `users/${userID}/croppedProfile`))
      .then((url) => {
        setImage(url);
      })
      .catch((error) => {
        if (
          error.code === "storage/object-not-found" ||
          error.code === "storage/unknown"
        ) {
          // defaulting to auth0 image
          get(child(dbRef, `users/${userID}/preferences`)).then((snapshot) => {
            if (snapshot.exists()) {
              setImage(snapshot.val()["defaultProfilePicture"]);
            }
          });
        }
      });
  }

  const context = {
    refreshProfilePicture: refreshProfilePicture,
    setRefreshProfilePicture: setRefreshProfilePicture,
    // image: image,
    // setImage: setImage,
    justACropChange: justACropChange,
    setJustACropChange: setJustACropChange,
    fetchProfilePicture: fetchProfilePicture,
  };

  return (
    <ProfilePictureUpdateContext.Provider value={context}>
      {props.children}
    </ProfilePictureUpdateContext.Provider>
  );
}

export default ProfilePictureUpdateContext;
