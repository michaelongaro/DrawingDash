import React, { useState, useEffect, useRef, useContext } from "react";

import SlideShow from "./SlideShow";

import Search from "./Search";

import ModalContext from "./ModalContext";
import SearchContext from "./SearchContext";
import ProfilePictureUpdateContext from "./ProfilePictureUpdateContext";

import {
  getDatabase,
  ref as ref_database,
  onValue,
  child,
  get,
} from "firebase/database";

import {
  getDownloadURL,
  getStorage,
  getMetadata,
  ref as ref_storage,
} from "firebase/storage";

import { app } from "../../util/init-firebase";

import classes from "./UserModal.module.css";
import baseClasses from "../../index.module.css";

const UserModal = ({ user }) => {
  const modalCtx = useContext(ModalContext);
  const searchCtx = useContext(SearchContext);
  const PFPUpdateCtx = useContext(ProfilePictureUpdateContext);

  const dbRef = ref_database(getDatabase(app));

  const storage = getStorage();

  const userModalRef = useRef();

  const [autofillResultsCleared, setAutofillResultsCleared] = useState(true);

  const [username, setUsername] = useState("");
  const [status, setStatus] = useState("");
  const [image, setImage] = useState(null);

  const [isFetchingProfilePicture, setIsFetchingProfilePicture] =
    useState(true);
  const [isFetchingPinnedDrawings, setIsFetchingPinnedDrawings] =
    useState(true);
  const [showTempBaselineSkeleton, setShowTempBaselineSkeleton] =
    useState(true);

  const [pinnedMetadata, setPinnedMetadata] = useState([]);
  const [pinnedDrawings, setPinnedDrawings] = useState([]);

  useEffect(() => {
    const timerID = setTimeout(() => setShowTempBaselineSkeleton(false), 500);

    return () => {
      clearTimeout(timerID);
    };
  }, []);

  useEffect(() => {
    function modalHandler(event) {
      if (modalCtx.userModalOpened) {
        if (!userModalRef.current.contains(event.target)) {
          modalCtx.setUserModalOpened(false);
        }
      }
    }

    function escapeHandler(e) {
      if (e.key === "Escape") {
        e.preventDefault();

        if (autofillResultsCleared) {
          if (
            modalCtx.userModalOpened &&
            !modalCtx.drawingModalFromUserOpened
          ) {
            modalCtx.setUserModalOpened(false);
          }
        }
      }
    }

    document.addEventListener("click", modalHandler);
    document.addEventListener("keydown", escapeHandler);

    return () => {
      document.removeEventListener("click", modalHandler);
      document.removeEventListener("keydown", escapeHandler);
    };
  }, [
    modalCtx.userModalOpened,
    modalCtx.drawingModalFromUserOpened,
    searchCtx.searchValues,
    autofillResultsCleared,
  ]);

  useEffect(() => {
    if (searchCtx.searchValues["anInputIsFocused"][1]) {
      setAutofillResultsCleared(false);
    } else if (
      !searchCtx.searchValues["anInputIsFocused"][1] &&
      !autofillResultsCleared
    ) {
      setAutofillResultsCleared(true);
    }
  }, [searchCtx.searchValues, autofillResultsCleared]);

  useEffect(() => {
    // fetch data from db if it is present
    get(child(dbRef, `users/${user}/preferences`)).then((snapshot) => {
      if (snapshot.exists()) {
        setUsername(snapshot.val()["username"]);
        setStatus(snapshot.val()["status"]);

        get(child(dbRef, `users/${user}/pinnedArt`)).then((snapshot2) => {
          if (snapshot2.exists()) {
            // for the time being just doing this
            fetchPinnedMetadata(Object.values(snapshot2.val()));
            fetchPinnedDrawings(Object.values(snapshot2.val()));
          }
        });
      }
    });

    PFPUpdateCtx.fetchProfilePicture(user, setImage);
  }, []);

  useEffect(() => {
    if (image !== null) {
      setIsFetchingProfilePicture(false);
    }
  }, [image]);

  useEffect(() => {
    if (pinnedMetadata && pinnedDrawings) {
      setIsFetchingPinnedDrawings(false);
    }
  }, [pinnedMetadata, pinnedDrawings]);

  function fetchPinnedMetadata(ids) {
    const tempMetadata = ["", "", ""];

    get(child(dbRef, `drawings/${ids[0]}`))
      .then((snapshot2) => {
        if (snapshot2.exists()) {
          tempMetadata[0] = snapshot2.val();
        }
      })
      .catch((e) => {
        // ignoring error since we handle it in SlideShow component
      })

      .then(() => {
        get(child(dbRef, `drawings/${ids[1]}`)).then((snapshot2) => {
          if (snapshot2.exists()) {
            tempMetadata[1] = snapshot2.val();
          }
        });
      })
      .catch((e) => {
        // ignoring error since we handle it in SlideShow component
      })

      .then(() => {
        get(child(dbRef, `drawings/${ids[2]}`)).then((snapshot2) => {
          if (snapshot2.exists()) {
            tempMetadata[2] = snapshot2.val();
          }
        });
      })
      .catch((e) => {
        // ignoring error since we handle it in SlideShow component
      })

      .then(() => {
        setPinnedMetadata(tempMetadata);
      });
  }

  function fetchPinnedDrawings(ids) {
    const tempDrawings = ["", "", ""];

    getDownloadURL(ref_storage(storage, `drawings/${ids[0]}.jpg`))
      .then((url) => {
        tempDrawings[0] = url;
      })
      .catch((e) => {
        // ignoring error since we handle it in SlideShow component
      })

      .then(() => {
        getDownloadURL(ref_storage(storage, `drawings/${ids[1]}.jpg`)).then(
          (url) => {
            tempDrawings[1] = url;
          }
        );
      })
      .catch((e) => {
        // ignoring error since we handle it in SlideShow component
      })

      .then(() => {
        getDownloadURL(ref_storage(storage, `drawings/${ids[2]}.jpg`)).then(
          (url) => {
            tempDrawings[2] = url;
          }
        );
      })
      .catch((e) => {
        // ignoring error since we handle it in SlideShow component
      })

      .then(() => {
        setPinnedDrawings(tempDrawings);
      });
  }

  return (
    <div ref={userModalRef} className={classes.userModalContain}>
      <div style={{ position: "relative", width: "100%", height: "10px" }}>
        {modalCtx.drawingModalOpened && (
          <button
            style={{ top: "-2.45em", left: "1.5em" }}
            className={baseClasses.activeButton}
            onClick={(ev) => {
              ev.stopPropagation();
              // closing user modal
              modalCtx.setUserModalOpened(false);
            }}
          >
            Return to image
          </button>
        )}
        <button
          style={{ top: "-2.5rem", right: "1.5rem" }}
          className={baseClasses.close}
          onClick={() => {
            // closing all modals
            modalCtx.setDrawingModalFromUserOpened(false);
            modalCtx.setDrawingModalOpened(false);
            modalCtx.setUserModalOpened(false);
          }}
        ></button>
      </div>
      <div className={classes.userModal}>
        <div className={`${classes.container} ${classes.prefCard}`}>
          <div className={classes.leftSide}>
            {isFetchingProfilePicture || showTempBaselineSkeleton ? (
              <div
                style={{
                  width: "165px",
                  height: "165px",
                  borderRadius: "50%",
                }}
                className={baseClasses.skeletonLoading}
              ></div>
            ) : (
              <img
                style={{
                  width: "165px",
                  height: "165px",
                  objectFit: "cover",
                  borderRadius: "50%",
                  boxShadow: "rgb(0 0 0 / 30%) 0px 3px 8px 1px",
                }}
                src={image}
                alt="Profile"
              />
            )}

            <div style={{ marginTop: "1em" }}>{username}</div>
            <div style={{ textAlign: "center" }}>
              <i>"{status}"</i>
            </div>
          </div>

          <div className={classes.rightSide}>
            {/* {isFetchingPinnedDrawings ? (
              <div
                style={{ width: "5em", height: "50%" }}
                className={classes.skeletonLoading}
              ></div>
            ) : ( */}
            <SlideShow
              isFetchingPinnedDrawings={isFetchingPinnedDrawings}
              pinnedDrawings={pinnedDrawings}
              pinnedMetadata={pinnedMetadata}
              username={username}
            />
            {/* )} */}
          </div>
        </div>

        <Search dbPath={`users/${user}/titles`} idx={1} forModal={true} />
      </div>
    </div>
  );
};

export default UserModal;
