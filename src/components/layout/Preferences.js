import React, { useState, useEffect, useContext } from "react";
import { useAuth0 } from "@auth0/auth0-react";

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
import PreferencesIcon from "../../svgs/PreferencesIcon";
import ProfileHeader from "./ProfileHeader";

const Preferences = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();

  const db = getDatabase(app);
  const dbRef = ref_database(getDatabase(app));

  const storage = getStorage();

  const [username, setUsername] = useState("Username");
  const [status, setStatus] = useState("Your Status Here");
  const [userEmail, setUserEmail] = useState("");
  const [imageAltInfo, setImageAltInfo] = useState("username");
  const [imageURL, setImageURL] = useState(
    "https://www.tenforums.com/geek/gars/images/2/types/thumb_15951118880user.png"
  );
  const [image, setImage] = useState();
  const [hasChangedPicture, setHasChangedPicture] = useState(false);

  const [disableSave, setDisableSave] = useState(true);
  const [disableEdit, setDisableEdit] = useState(false);

  useEffect(() => {
    if ((!isLoading, isAuthenticated)) {
      // fetch data from db if it is present
      get(child(dbRef, `users/${user.sub}/preferences`)).then((snapshot) => {
        if (snapshot.exists()) {
          setUsername(snapshot.val()["username"]);
          setStatus(snapshot.val()["status"]);
        }
      });
      setUserEmail(user.email);
      setImageURL(user.image);
      setImageAltInfo(user.name);

      getDownloadURL(ref_storage(storage, `${user.sub}/profile.jpg`)).then(
        (url) => {
          setImageURL(url);
        }
      );
    }
  }, [isLoading, isAuthenticated]);

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
    const testRef = ref_storage(storage, `${uid}/profile2.jpg`);

    const snapshot = await uploadBytes(photoRef, image);
    //
    const photoURL = await getDownloadURL(photoRef);

    setImageURL(photoURL);
  }

  const handleChange = (e) => {
    if (e.target.files[0] && !hasChangedPicture) {
      setImage(e.target.files[0]);
    }
    setHasChangedPicture(true);
  };

  if (userEmail === "") {
    return null;
  }

  return (
    <div className={`${classes.baseFlex} ${classes.prefCard}`}>
    <ProfileHeader title={"Preferences"} />

    <div className={classes.container}>
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
      <div className={classes.setEmail}>{userEmail}</div>

      <button className={classes.resetPassword}>Reset Password</button>

      <div className={classes.status}>Status</div>
      {!disableEdit ? (
        <div>
          <i>{status}</i>
        </div>
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
            alt={imageAltInfo}
          />
        ) : (
          <input type="file" name="profileImage" onChange={handleChange} />
        )}
        <div className={classes.showUsername}>{username}</div>
        <div className={classes.showStatus}>
          <i>{status}</i>
        </div>
      </div>
      <div className={`${classes.change} ${classes.updateButtons}`}>
        <button disabled={disableEdit} onClick={() => setDisableEdit(true)}>
          Edit
        </button>
        <button disabled={disableSave} onClick={handleSubmit}>
          Save Changes
        </button>
      </div>

      <div className={classes.pinned}>
        <PinnedArtwork />
      </div>
    </div>
    </div>
  );
};

export default Preferences;
