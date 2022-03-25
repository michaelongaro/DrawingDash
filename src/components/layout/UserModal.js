import React, { useState, useEffect, useContext } from "react";

import Search from "./Search";

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
  const db = getDatabase(app);
  const dbRef = ref_database(getDatabase(app));

  const storage = getStorage();

  const [username, setUsername] = useState("");
  const [status, setStatus] = useState("");
  const [imageURL, setImageURL] = useState();

  const [fetchedUserDrawings, setFetchedUserDrawings] = useState([]);

  useEffect(() => {
    // fetch data from db if it is present
    get(child(dbRef, `users/${props.uid}/preferences`)).then((snapshot) => {
      if (snapshot.exists()) {
        setUsername(snapshot.val()["username"]);
        setStatus(snapshot.val()["status"]);
      }
    });

    getDownloadURL(ref_storage(storage, `${props.uid}/profile.jpg`)).then(
      (url) => {
        setImageURL(url);
      }
    );

  }, []);



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
          
        </div>
      </div>

      <Search userProfile={props.uid} />
    </div>
  );
};

export default UserModal;
