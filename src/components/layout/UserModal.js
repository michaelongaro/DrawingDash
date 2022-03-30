import React, { useState, useEffect, useContext } from "react";

import Search from "./Search";

// import { Slide } from "react-slideshow-image";

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
  const [pinnedDrawings, setPinnedDrawings] = useState(null);
  const [imageURL, setImageURL] = useState();

  const properties = {
    duration: 5000,
    transitionDuration: 500,
    infinite: true,
    prevArrow: (
      <div style={{ width: "30px", marginRight: "-30px" }}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          fill="#fff"
        >
          <path d="M242 180.6v-138L0 256l242 213.4V331.2h270V180.6z" />
        </svg>
      </div>
    ),
    nextArrow: (
      <div style={{ width: "30px", marginLeft: "-30px" }}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          fill="#fff"
        >
          <path d="M512 256L270 42.6v138.2H0v150.6h270v138z" />
        </svg>
      </div>
    ),
  };
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
          {/* <Slide {...properties}>
            {pinnedDrawings.map((each, index) => (
              <div key={index} className={classes.eachSlide}>
                <div style={{ backgroundImage: each.image }}></div>
              </div>
            ))}
          </Slide> */}
        </div>
      </div>

      <Search userProfile={props.uid} />
    </div>
  );
};

export default UserModal;
