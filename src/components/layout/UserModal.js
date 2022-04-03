import React, { useState, useEffect } from "react";

import Search from "./Search";
import SlideShow from "./SlideShow";

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

import classes from "./UserModal.module.css";

const UserModal = (props) => {
  const dbRef = ref_database(getDatabase(app));

  const storage = getStorage();

  const [username, setUsername] = useState("");
  const [status, setStatus] = useState("");
  const [pinnedDrawings, setPinnedDrawings] = useState(null);
  const [imageURL, setImageURL] = useState();

  useEffect(() => {
    // fetch data from db if it is present
    console.log("am trying to get loaded");
    get(child(dbRef, `users/${props.uid}/preferences`)).then((snapshot) => {
      if (snapshot.exists()) {
        setUsername(snapshot.val()["username"]);
        setStatus(snapshot.val()["status"]);
        get(child(dbRef, `users/${props.uid}/pinnedArt`)).then((snapshot2) => {
          if (snapshot2.exists()) {
            setPinnedDrawings(Object.values(snapshot2.val()));
          }
        });
      }
    });

    getDownloadURL(ref_storage(storage, `${props.uid}/profile.jpg`)).then(
      (url) => {
        setImageURL(url);
      }
    );
  }, []);

  useEffect(() => {
    console.log(username, status, pinnedDrawings);
  }, [username, status, pinnedDrawings]);

  if (pinnedDrawings === null) {
    return null;
  }

  return (
    <div className={classes.horizContain}>
      <div className={`${classes.container} ${classes.prefCard}`}>
        <div className={classes.leftSide}>
          <img
            className={classes.image}
            width={"165px"}
            src={imageURL}
            alt={props.uid}
          />

          <div className={classes.showUsername}>{username}</div>
          <div className={classes.showStatus}>{status}</div>
        </div>

        <div className={classes.rightSide}>
          <SlideShow pinnedDrawings={pinnedDrawings} />
        </div>
      </div>

      <Search userProfile={props.uid} />
    </div>
  );
};

export default UserModal;
