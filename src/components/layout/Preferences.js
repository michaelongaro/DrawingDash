import React, {
  useState,
  useEffect,
  useRef,
  useContext,
  useCallback,
} from "react";
import { useAuth0 } from "@auth0/auth0-react";

import ImageCropModal from "./ImageCropModal";
import getCroppedImg from "../../util/cropImage";

import PinnedArtwork from "./PinnedArtwork";
import ProfileHeader from "./ProfileHeader";
import ExitPreferencesIcon from "../../svgs/ExitPreferencesIcon";
import EditPreferencesIcon from "../../svgs/EditPreferencesIcon";
import ResizeIcon from "../../svgs/ResizeIcon";

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
import UploadIcon from "../../svgs/UploadIcon";
import DefaultUserIcon from "../../svgs/DefaultUserIcon";

const Preferences = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();

  const db = getDatabase(app);
  const dbRef = ref_database(getDatabase(app));

  const storage = getStorage();

  const [username, setUsername] = useState("Username");
  const [status, setStatus] = useState("Your Status Here");
  const [userEmail, setUserEmail] = useState("");
  const [imageAltInfo, setImageAltInfo] = useState("username");
  const [image, setImage] = useState(null);
  const [hasChangedPicture, setHasChangedPicture] = useState(false);
  const [imageCroppedAndLoaded, setImageCroppedAndLoaded] = useState(false);

  // used to check and see if last

  const [disableSave, setDisableSave] = useState(true);
  const [editAvailable, setEditAvailable] = useState(true);

  const inputRef = useRef();

  // crop states
  const [DBCropData, setDBCropData] = useState();

  const [showCropModal, setShowCropModal] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    console.log(croppedAreaPixels);
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const showCroppedImage =
    // useCallback(
    async (disableSkeleton = false) => {
      console.log("showCroppedImage was called");
      try {
        console.log(
          "tried to be opened with",
          image,
          croppedAreaPixels,
          DBCropData
        );
        let currentCropAreaPixels = croppedAreaPixels ?? DBCropData;

        const croppedImg = await getCroppedImg(image, currentCropAreaPixels);
        console.log("donee", croppedImg);
        // let blob = await fetch(croppedImage).then(r => r.blob());
        setCroppedImage(croppedImg);
        setShowCropModal(false);

        if (disableSkeleton) {
          setImageCroppedAndLoaded(true);
        }
      } catch (e) {
        console.log(e);
        setShowCropModal(false);
      }
    };
  //   ,
  //   [image, croppedAreaPixels]
  // );

  const onClose = useCallback(() => {
    setShowCropModal(false);
  }, []);

  useEffect(() => {
    if ((!isLoading, isAuthenticated)) {
      // fetch data from db if it is present
      get(child(dbRef, `users/${user.sub}/preferences`)).then((snapshot) => {
        if (snapshot.exists()) {
          setUsername(snapshot.val()["username"]);
          setStatus(snapshot.val()["status"]);
          setDBCropData(snapshot.val()["profileCropMetadata"]);
        }
      });
      setUserEmail(user.email);
      setImageAltInfo(user.name);

      getDownloadURL(ref_storage(storage, `${user.sub}/profile.jpg`))
        .then((url) => {
          setImage(url);
        })
        .catch((error) => {
          if (
            error.code === "storage/object-not-found" ||
            error.code === "storage/unknown"
          ) {
            setImageCroppedAndLoaded(true);
            console.log("user profile image not found"); //don't need to log this
          }
        });
    }
  }, [isLoading, isAuthenticated]);

  useEffect(() => {
    if (DBCropData && image) {
      showCroppedImage(true);
    }
  }, [image, DBCropData]);

  useEffect(() => {
    if (hasChangedPicture) {
      setShowCropModal(true);
    }
  }, [hasChangedPicture]);

  // return save to true after pushing to db
  function handleSubmit(event) {
    event.preventDefault();

    console.log(username, status);
    set(ref_database(db, `users/${user.sub}/preferences`), {
      username: username,
      status: status,
      profileCropMetadata: croppedAreaPixels ? croppedAreaPixels : false,
    });

    if (hasChangedPicture) {
      upload();
    }

    setHasChangedPicture(false);
    setDisableSave(true);
    setEditAvailable(true);
  }

  async function upload() {
    const photoRef = ref_storage(storage, `${user.sub}/profile.jpg`);

    // probably add a reset button to the crop modal, just show normal image and make profileCropMetadata = false
    const snapshot = await uploadBytes(photoRef, image);

    const photoURL = await getDownloadURL(photoRef);

    setImage(photoURL);
  }

  const handleChange = (e) => {
    if (e.target.files[0]) {
      let reader = new FileReader();
      reader.onload = function (e) {
        setImage(e.target.result);
      };
      reader.readAsDataURL(e.target.files[0]);
      // can delete this below if doesn't work
      setCroppedImage(null);
      setHasChangedPicture(true);
    }
  };

  if (userEmail === "") {
    return null;
  }

  return (
    <div className={`${classes.baseFlex} ${classes.prefCard}`}>
      <ProfileHeader title={"Preferences"} />

      <div className={classes.container}>
        {/* absolutely should be done with flex or just figure out a way to make grid
            less jank */}
        <div className={classes.extraPadding}></div>
        <div className={classes.extraPadding2}></div>
        <div className={classes.extraPadding3}></div>
        <div className={classes.extraPadding4}></div>
        <div className={classes.username}>Username</div>
        {editAvailable ? (
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
        {editAvailable ? (
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

        <div className={classes.vertLine}>
          <div className={classes.vertTrailing}></div>
        </div>

        <div className={classes.rightSide}>
          {imageCroppedAndLoaded ? (
            <div style={{ position: "relative" }}>
              <img
                className={classes.profilePicture}
                src={croppedImage ? croppedImage : image ?? <DefaultUserIcon />}
                alt={imageAltInfo}
              />

              <div style={{ display: `${!editAvailable ? "" : "none"}` }}>
                <div className={classes.uploadOverlay}>
                  <button
                    className={classes.resizeButton}
                    onClick={() => {
                      setShowCropModal(true);
                    }}
                  >
                    <div className={classes.buttonOperationContainer}>
                      <div>Resize</div>
                      <ResizeIcon />
                    </div>
                  </button>
                  <button
                    style={{ margin: 0 }}
                    className={classes.editButton}
                    onClick={() => {
                      inputRef.current.click();
                    }}
                  >
                    <div className={classes.buttonOperationContainer}>
                      <div>Upload</div>
                      <UploadIcon />
                    </div>
                  </button>
                </div>
                <input
                  ref={inputRef}
                  type="file"
                  name="profileImage"
                  onChange={handleChange}
                />
              </div>
            </div>
          ) : (
            <div
              style={{ width: "165px", height: "165px" }}
              className={classes.skeletonLoading}
            ></div>
          )}
          {/* need to bring this up as soon as image is uploaded */}
          {showCropModal ? (
            <div className={classes.cropImageModal}>
              <ImageCropModal
                id={1}
                imageUrl={image}
                cropInit={crop}
                zoomInit={zoom}
                onCropChange={setCrop}
                onRotationChange={setRotation}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
                applyChanges={showCroppedImage}
                discardChanges={onClose}
              />
            </div>
          ) : null}

          <div className={classes.showUsername}>{username}</div>
          <div className={classes.showStatus}>
            <i>{status}</i>
          </div>
        </div>
        <div className={classes.change}>
          {editAvailable ? (
            <button
              className={classes.editButton}
              onClick={() => setEditAvailable(false)}
            >
              <div className={classes.baseHorizFlex}>
                <div>Edit</div>
                <EditPreferencesIcon />
              </div>
            </button>
          ) : (
            <div className={classes.updateButtons}>
              <button
                className={classes.closeButton}
                onClick={() => setEditAvailable(true)}
              >
                <ExitPreferencesIcon />
              </button>
              {/* eventually will look at checking whether inputs were actually changed
                  and disable this button until then, but for now is always on */}
              <button className={classes.editButton} onClick={handleSubmit}>
                Save Changes
              </button>
            </div>
          )}
        </div>

        <div className={classes.pinnedTitle}>
          <div className={classes.leadingLine}></div>
          <h3>Pinned Drawings</h3>
          <div className={classes.trailingLine}></div>
        </div>

        <div className={classes.pinned}>
          <PinnedArtwork />
        </div>
      </div>
    </div>
  );
};

export default Preferences;
