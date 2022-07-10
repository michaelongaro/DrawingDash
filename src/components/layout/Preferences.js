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

import ProfilePictureUpdateContext from "./ProfilePictureUpdateContext";

import PinnedArtwork from "./PinnedArtwork";
import ProfileHeader from "./ProfileHeader";
import ExitIcon from "../../svgs/ExitIcon";
import EditPreferencesIcon from "../../svgs/EditPreferencesIcon";
import ResizeIcon from "../../svgs/ResizeIcon";
import UploadIcon from "../../svgs/UploadIcon";
import RedoIcon from "../../svgs/RedoIcon";

import {
  getDatabase,
  ref as ref_database,
  set,
  onValue,
  child,
  get,
} from "firebase/database";
import {
  getDownloadURL,
  getStorage,
  getMetadata,
  updateMetadata,
  put,
  ref as ref_storage,
  uploadBytes,
} from "firebase/storage";

import { app } from "../../util/init-firebase";

import classes from "./Preferences.module.css";
import baseClasses from "../../index.module.css";

const Preferences = () => {
  // context to set when profile picture needs to be refetched
  // only doing it this way because there doesn't seem to be an eqivalent
  // to "onValue" for the firebase Storage side of things...
  const PFPUpdateCtx = useContext(ProfilePictureUpdateContext);

  const { loginWithRedirect, user, isAuthenticated, isLoading } = useAuth0();

  const db = getDatabase(app);
  const dbRef = ref_database(getDatabase(app));

  const storage = getStorage();

  const [isFetching, setIsFetching] = useState(true);

  const [username, setUsername] = useState("Username");
  const [status, setStatus] = useState("Your Status Here");
  const [userEmail, setUserEmail] = useState("");
  const [imageAltInfo, setImageAltInfo] = useState("username");
  const [image, setImage] = useState(null);
  const [imageFileType, setImageFileType] = useState(null);
  const [userUploadedImage, setUserUploadedImage] = useState(null);
  const [cropReadyImage, setCropReadyImage] = useState(null);
  const [hasChangedPicture, setHasChangedPicture] = useState(false);

  // used to check and see if last

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

  const [inputWasChanged, setInputWasChanged] = useState(false);

  const [hoveringOnResetPassword, setHoveringOnResetPassword] = useState(false);

  const [showTempBaselineSkeleton, setShowTempBaselineSkeleton] =
    useState(true);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const showCroppedImage = async (disableSkeleton = false) => {
    try {
      let currentCropAreaPixels = croppedAreaPixels ?? DBCropData;

      const croppedImg = await getCroppedImg(
        cropReadyImage ?? image,
        currentCropAreaPixels,
        imageFileType
      );

      setCroppedImage(croppedImg);
      setShowCropModal(false);

      if (disableSkeleton) {
        setIsFetching(false);
      }
    } catch (e) {
      console.log(e);
      setShowCropModal(false);
    }
  };

  const onClose = useCallback(() => {
    setShowCropModal(false);
    setUserUploadedImage(null);
    setCropReadyImage(null);
  }, []);

  useEffect(() => {
    const timerID = setTimeout(() => setShowTempBaselineSkeleton(false), 750);

    return () => {
      clearTimeout(timerID);
    };
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

      getDownloadURL(ref_storage(storage, `users/${user.sub}/profile`))
        .then((url) => {
          getMetadata(ref_storage(storage, `users/${user.sub}/profile`))
            .then((metadata) => {
              setImageFileType(metadata.contentType);
              setImage(url);
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
            // defaulting to auth0 image
            onValue(
              ref_database(db, `users/${user.sub}/preferences`),
              (snapshot) => {
                if (snapshot.exists()) {
                  setImage(snapshot.val()["defaultProfilePicture"]);
                  setIsFetching(false);
                }
              }
            );
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

    set(ref_database(db, `users/${user.sub}/preferences`), {
      username: username,
      status: status,
      defaultProfilePicture: user.picture,
      profileCropMetadata: croppedAreaPixels ? croppedAreaPixels : false,
    });

    if (hasChangedPicture) {
      upload();
    }

    setInputWasChanged(false);
    setHasChangedPicture(false);
    setEditAvailable(true);
  }

  function fetchUserPreferences() {
    get(child(dbRef, `users/${user.sub}/preferences`)).then((snapshot) => {
      if (snapshot.exists()) {
        setUsername(snapshot.val()["username"]);
        setStatus(snapshot.val()["status"]);
        setDBCropData(snapshot.val()["profileCropMetadata"]);
      }
    });
    setHasChangedPicture(false);
    setInputWasChanged(false);
  }

  async function upload() {
    const photoRef = ref_storage(storage, `users/${user.sub}/profile`);

    // probably add a reset button to the crop modal, just show normal image and make profileCropMetadata = false
    const snapshot = await uploadBytes(photoRef, userUploadedImage ?? image, {
      contentType: imageFileType,
    });

    const photoURL = await getDownloadURL(photoRef);

    setImage(photoURL);

    // telling MainNavigation to refetch it's profile picture to the newly uploaded one
    PFPUpdateCtx.setRefreshProfilePicture(true);
  }

  const handleChange = (e) => {
    // will eventually have to error handle if something other than jpeg/jpg/png is uploaded
    // but this is okay for now
    if (e.target.files[0]) {
      if (e.target.files[0].type === "image/jpeg") {
        setImageFileType("image/jpeg");
      }
      if (e.target.files[0].type === "image/png") {
        setImageFileType("image/png");
      }

      setUserUploadedImage(e.target.files[0]);
      let reader = new FileReader();
      reader.onload = function (e) {
        // setImage(e.target.result);
        setCropReadyImage(e.target.result);
      };
      reader.readAsDataURL(e.target.files[0]);
      // can delete this below if doesn't work
      setCroppedImage(null);
      setCroppedAreaPixels(null);
      setHasChangedPicture(true);
    }
  };

  return (
    <div className={`${classes.baseFlex} ${classes.prefCard}`}>
      <ProfileHeader title={"Preferences"} />

      <div style={{ position: "relative", width: "100%" }}>
        <div style={{ gap: "4em" }} className={baseClasses.baseFlex}>
          <div
            style={{ gap: "3em", width: "33%", alignItems: "flex-start" }}
            className={baseClasses.baseVertFlex}
          >
            <div style={{ gap: "1.5em" }} className={baseClasses.baseFlex}>
              <div className={classes.inputLabel}>Username</div>

              {editAvailable ? (
                <>
                  {isFetching || showTempBaselineSkeleton ? (
                    <div
                      style={{
                        width: "12em",
                        height: "1.5em",
                      }}
                      className={baseClasses.skeletonLoading}
                    ></div>
                  ) : (
                    <div>{username}</div>
                  )}
                </>
              ) : (
                <input
                  className={classes.setUsername}
                  value={username}
                  minLength={1}
                  maxLength={25}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setInputWasChanged(true);
                  }}
                ></input>
              )}
            </div>

            <div style={{ gap: "3em" }} className={baseClasses.baseFlex}>
              <div className={classes.inputLabel}>Status</div>
              {editAvailable ? (
                <>
                  {isFetching || showTempBaselineSkeleton ? (
                    <div
                      style={{
                        width: "12em",
                        height: "1.5em",
                      }}
                      className={baseClasses.skeletonLoading}
                    ></div>
                  ) : (
                    <div>
                      <i>{status}</i>
                    </div>
                  )}
                </>
              ) : (
                <input
                  className={classes.setStatus}
                  value={status}
                  minLength={1}
                  maxLength={40}
                  onChange={(e) => {
                    setStatus(e.target.value);
                    setInputWasChanged(true);
                  }}
                ></input>
              )}
            </div>

            <div style={{ gap: "3em" }} className={baseClasses.baseFlex}>
              <div className={classes.inputLabel}>Email</div>
              <>
                {isFetching || showTempBaselineSkeleton ? (
                  <div
                    style={{
                      width: "12em",
                      height: "1.5em",
                    }}
                    className={baseClasses.skeletonLoading}
                  ></div>
                ) : (
                  <div>{userEmail}</div>
                )}
              </>
            </div>

            <button
              style={{ width: "70%", gap: "1em" }}
              className={`${classes.resetPasswordButton} ${baseClasses.baseFlex}`}
              onMouseEnter={() => setHoveringOnResetPassword(true)}
              onMouseLeave={() => setHoveringOnResetPassword(false)}
              onClick={() => {
                loginWithRedirect();
              }}
            >
              <RedoIcon
                dimensions={"1em"}
                color={hoveringOnResetPassword ? "white" : "black"}
              />
              <div
                style={{ color: hoveringOnResetPassword ? "white" : "black" }}
              >
                Reset Password
              </div>
            </button>
          </div>

          <div className={baseClasses.baseFlex}>
            <div className={classes.vertTrailing}></div>
          </div>

          <div
            style={{ gap: "1em", width: "33%" }}
            className={baseClasses.baseVertFlex}
          >
            {isFetching || showTempBaselineSkeleton ? (
              <div
                style={{
                  width: "165px",
                  height: "165px",
                  borderRadius: "50%",
                }}
                className={baseClasses.skeletonLoading}
              ></div>
            ) : (
              <div
                style={{
                  position: "relative",
                  borderRadius: "50%",
                  boxShadow: "0 4px 8px 2px rgba(0,0, 0, .2)",
                }}
              >
                <img
                  className={classes.profilePicture}
                  src={croppedImage ? croppedImage : image}
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
                        <UploadIcon color={"white"} />
                      </div>
                    </button>
                  </div>
                  <input
                    ref={inputRef}
                    type="file"
                    name="profileImage"
                    accept=".jpg,.jpeg,.png"
                    onChange={handleChange}
                  />
                </div>
              </div>
            )}

            <>
              {isFetching || showTempBaselineSkeleton ? (
                <div
                  style={{
                    width: "50%",
                    height: "1.5em",
                  }}
                  className={baseClasses.skeletonLoading}
                ></div>
              ) : (
                <div>{username}</div>
              )}
            </>
            <>
              {isFetching || showTempBaselineSkeleton ? (
                <div
                  style={{
                    width: "60%",
                    height: "1.5em",
                  }}
                  className={baseClasses.skeletonLoading}
                ></div>
              ) : (
                <div>
                  <i>{status}</i>
                </div>
              )}
            </>
          </div>
        </div>

        <div
          style={{ position: "absolute", right: "1em", bottom: 0 }}
          className={classes.change}
        >
          {editAvailable ? (
            <button
              className={classes.editButton}
              onClick={() => setEditAvailable(false)}
            >
              <div className={classes.baseHorizFlex}>
                <div>Edit</div>

                <EditPreferencesIcon
                  dimensions={"1.5em"}
                  marginBottom={"4px"}
                />
              </div>
            </button>
          ) : (
            <div className={classes.updateButtons}>
              <button
                className={classes.closeButton}
                onClick={() => {
                  setEditAvailable(true);
                  fetchUserPreferences();
                }}
              >
                <ExitIcon />
              </button>

              {/* parent container to allow for transition between linear-gradient backgrounds */}
              <div
                style={{ position: "relative", width: "73px", height: "40px" }}
              >
                <button
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    backgroundImage:
                      "linear-gradient(-180deg, #d3d3d3, #3a3a3a)",
                    opacity: hasChangedPicture || inputWasChanged ? 0 : 1,
                    cursor: "auto",
                  }}
                  disabled={!hasChangedPicture && !inputWasChanged}
                  className={classes.editButton}
                >
                  Save
                </button>
                <button
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    opacity: hasChangedPicture || inputWasChanged ? 1 : 0,

                    pointerEvents:
                      hasChangedPicture || inputWasChanged ? "auto" : "none",
                    cursor:
                      hasChangedPicture || inputWasChanged ? "pointer" : "auto",
                  }}
                  disabled={!hasChangedPicture && !inputWasChanged}
                  className={classes.editButton}
                  onClick={handleSubmit}
                >
                  Save
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div style={{ marginTop: "3em" }} className={classes.pinnedTitle}>
        <div className={classes.leadingLine}></div>
        <h3>Pinned Drawings</h3>
        <div className={classes.trailingLine}></div>
      </div>

      <div
        style={{ paddingBottom: "3em", marginTop: "1em" }}
        className={baseClasses.baseFlex}
      >
        <PinnedArtwork />
      </div>

      {showCropModal ? (
        <div
          style={{ opacity: showCropModal ? 1 : 0 }}
          className={classes.modal}
        >
          <div className={classes.cropImageModal}>
            <ImageCropModal
              id={1}
              imageUrl={cropReadyImage ?? image}
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
        </div>
      ) : null}
    </div>
  );
};

export default Preferences;
