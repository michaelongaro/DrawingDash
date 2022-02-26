import React, { useState, useEffect, useContext } from "react";
import { useAuth0 } from "@auth0/auth0-react";

import FavoritesContext from "./FavoritesContext";
import PinnedArtwork from "./PinnedArtwork";

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
  ref as ref_storage,
  uploadBytes,
} from "firebase/storage";

import { app } from "../../util/init-firebase";

import classes from "./Preferences.module.css";

const Preferences = () => {
  const { user, isAuthenticated } = useAuth0();
  const favoritesCtx = useContext(FavoritesContext);

  const db = getDatabase(app);
  const dbRef = ref_database(getDatabase(app));

  const storage = getStorage();

  const [username, setUsername] = useState("Username");
  const [status, setStatus] = useState("Your Status Here");
  const [imageURL, setImageURL] = useState(user.image);
  const [image, setImage] = useState();
  const [hasChangedPicture, setHasChangedPicture] = useState(false);

  const [disableSave, setDisableSave] = useState(true);
  const [disableEdit, setDisableEdit] = useState(false);

  useEffect(() => {
    // probably need to refactor this
    // favoritesCtx.setClientID(user.sub);
    // console.log("set favorites id to", user.sub, isAuthenticated);

    // fetch data from db if it is present
    get(child(dbRef, `users/${user.sub}/preferences`)).then((snapshot) => {
      if (snapshot.exists()) {
        setUsername(snapshot.val()["username"]);
        setStatus(snapshot.val()["status"]);
      }
    });

    getDownloadURL(ref_storage(storage, `${user.sub}/profile.jpg`)).then(
      (url) => {
        setImageURL(url);
      }
    );
  }, []);

  useEffect(() => {
    if (disableEdit) {
      setDisableSave(false);
    }
  }, [disableEdit]);

  // return save to true after pushing to db
  function handleSubmit(event) {
    event.preventDefault();

    console.log(username, status);
    set(ref_database(db, `users/${user.sub}/preferences`), {
      username: username,
      status: status,
    });

    if (hasChangedPicture) {
      upload(image, user.sub);
    }

    setHasChangedPicture(false);
    setDisableSave(true);
    setDisableEdit(false);
  }

  async function upload(image, uid) {
    const photoRef = ref_storage(storage, `${uid}/profile.jpg`);

    const snapshot = await uploadBytes(photoRef, image);
    const photoURL = await getDownloadURL(photoRef);

    setImageURL(photoURL);
  }

  const handleChange = (e) => {
    if (e.target.files[0] && !hasChangedPicture) {
      setImage(e.target.files[0]);
    }
    setHasChangedPicture(true);
  };

  return (
    <div className={classes.horizContain}>

      <div className={`${classes.container} ${classes.prefCard}`}>
        <div className={classes.username}>Username</div>
        {!disableEdit ? (
          <div>{username}</div>
        ) : (
          <input
            className={classes.setUsername}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          ></input>
        )}

        <div className={classes.email}>Email</div>
        <div className={classes.setEmail}>{user.email}</div>

        <button className={classes.resetPassword}>Reset Password</button>

        <div className={classes.status}>Status</div>
        {!disableEdit ? (
          <div>{status}</div>
        ) : (
          <input
            className={classes.setStatus}
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          ></input>
        )}

        <div className={classes.rightSide}>
          {!disableEdit ? (
            <img
              className={classes.image}
              width={"165px"}
              src={imageURL}
              alt={user.name}
            />
          ) : (
            <input type="file" name="profileImage" onChange={handleChange} />
          )}
          <div className={classes.showUsername}>{username}</div>
          <div className={classes.showStatus}>{status}</div>
        </div>
        <div className={`${classes.change} ${classes.updateButtons}`}>
          <button disabled={disableEdit} onClick={() => setDisableEdit(true)}>
            Edit
          </button>
          <button disabled={disableSave} onClick={handleSubmit}>
            Save Changes
          </button>
        </div>
      </div>

      <PinnedArtwork />
    </div>
  );
};

export default Preferences;
