import React, { useState, useEffect } from "react";

import getCroppedImg from "../../util/cropImage";

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
  getMetadata,
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

  const [isFetching, setIsFetching] = useState(true);

  const [pinnedIDs, setPinnedIDs] = useState();
  const [pinnedMetadata, setPinnedMetadata] = useState();
  const [pinnedDrawings, setPinnedDrawings] = useState();
  const [imageFileType, setImageFileType] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [DBCropData, setDBCropData] = useState(null);
  const [profileImage, setProfileImage] = useState(null);

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
    // fetch data from db if it is present
    console.log("am trying to get loaded");
    get(child(dbRef, `users/${props.uid}/preferences`)).then((snapshot) => {
      if (snapshot.exists()) {
        setUsername(snapshot.val()["username"]);
        setStatus(snapshot.val()["status"]);
        setDBCropData(snapshot.val()["profileCropMetadata"]);
        get(child(dbRef, `users/${props.uid}/pinnedArt`)).then((snapshot2) => {
          if (snapshot2.exists()) {
            setPinnedIDs(Object.values(snapshot2.val()));

            // for the time being just doing this
            fetchPinnedMetadata(Object.values(snapshot2.val()));
            fetchPinnedDrawings(Object.values(snapshot2.val()));
          }
        });
      }
    });

    getDownloadURL(ref_storage(storage, `${props.uid}/profile`))
      .then((url) => {
        getMetadata(ref_storage(storage, `${props.uid}/profile`))
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

  useEffect(() => {
    if (pinnedMetadata && pinnedDrawings) setIsFetching(false);
  }, [pinnedMetadata, pinnedDrawings]);

  function fetchPinnedMetadata(ids) {
    const tempMetadata = [];
    get(child(dbRef, `drawings/${ids[0]}`))
      .then((snapshot2) => {
        tempMetadata.push(snapshot2.val());
      })
      .then(() => {
        get(child(dbRef, `drawings/${ids[1]}`)).then((snapshot2) => {
          tempMetadata.push(snapshot2.val());
        });
      })
      .then(() => {
        get(child(dbRef, `drawings/${ids[2]}`)).then((snapshot2) => {
          tempMetadata.push(snapshot2.val());
        });
      })
      .then(() => {
        setPinnedMetadata(tempMetadata);
      });
  }

  function fetchPinnedDrawings(ids) {
    const tempDrawings = [];
    getDownloadURL(ref_storage(storage, `drawings/${ids[0]}.jpg`))
      .then((url) => {
        tempDrawings.push(url);
      })
      .then(() => {
        getDownloadURL(ref_storage(storage, `drawings/${ids[1]}.jpg`)).then(
          (url) => {
            tempDrawings.push(url);
          }
        );
      })
      .then(() => {
        getDownloadURL(ref_storage(storage, `drawings/${ids[2]}.jpg`)).then(
          (url) => {
            tempDrawings.push(url);
          }
        );
      })
      .then(() => {
        setPinnedDrawings(tempDrawings);
      });
  }

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
            src={croppedImage ?? profileImage}
            alt={"Profile"}
          />

          <div className={classes.showUsername}>{username}</div>
          <div className={classes.showStatus}>
            <i>{status}</i>
          </div>
        </div>

        <div className={classes.rightSide}>
          {isFetching ? (
            <div
              style={{ width: "5em", height: "50%" }}
              className={classes.skeletonLoading}
            ></div>
          ) : (
            <SlideShow
              pinnedDrawings={pinnedDrawings}
              metadata={pinnedMetadata}
            />
          )}
        </div>
      </div>

      <Search userProfile={props.uid} />
    </div>
  );
};

export default UserModal;
