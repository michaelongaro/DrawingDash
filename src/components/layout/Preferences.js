import React, {
  useState,
  useEffect,
  useRef,
  useContext,
  useCallback,
} from "react";
import { useAuth0 } from "@auth0/auth0-react";

import getBase64Image from "../../util/getBase64Image";
import ImageCropModal from "./ImageCropModal";
import getCroppedImg from "../../util/cropImage";

import ProfilePictureUpdateContext from "./ProfilePictureUpdateContext";
import PinnedContext from "./PinnedContext";

import PinnedArtwork from "./PinnedArtwork";
import ProfileHeader from "./ProfileHeader";
import ExitIcon from "../../svgs/ExitIcon";
import EditPreferencesIcon from "../../svgs/EditPreferencesIcon";
import ResizeIcon from "../../svgs/ResizeIcon";
import UploadIcon from "../../svgs/UploadIcon";
import RedoIcon from "../../svgs/RedoIcon";
import InvalidFileTypeIcon from "../../svgs/InvalidFileTypeIcon";

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
  ref as ref_storage,
  uploadBytes,
} from "firebase/storage";

import { app } from "../../util/init-firebase";

import classes from "./Preferences.module.css";
import baseClasses from "../../index.module.css";

const Preferences = () => {
  const PFPUpdateCtx = useContext(ProfilePictureUpdateContext);
  const pinnedCtx = useContext(PinnedContext);

  var axios = require("axios").default;

  const { user, isAuthenticated, isLoading } = useAuth0();

  const db = getDatabase(app);
  const dbRef = ref_database(getDatabase(app));

  const storage = getStorage();

  const [isFetching, setIsFetching] = useState(true);

  const [username, setUsername] = useState("Username");
  const [status, setStatus] = useState("Your Status Here");
  const [fetchedUsername, setFetchedUsername] = useState("");
  const [fetchedStatus, setFetchedStatus] = useState("");

  const [userEmail, setUserEmail] = useState("");
  const [imageAltInfo, setImageAltInfo] = useState("username");
  const [image, setImage] = useState(null);
  const [imageFileType, setImageFileType] = useState(null);
  const [userUploadedImage, setUserUploadedImage] = useState(null);
  const [cropReadyImage, setCropReadyImage] = useState(null);
  const [hasChangedPicture, setHasChangedPicture] = useState(false);

  const [showEmailSentTooltip, setShowEmailSentTooltip] = useState(false);

  const [editAvailable, setEditAvailable] = useState(true);

  const inputRef = useRef();
  const invalidFileTypeModalRef = useRef(null);

  // crop states
  const [DBCropData, setDBCropData] = useState(null);

  const [showInvalidFileTypeModal, setShowInvalidFileTypeModal] =
    useState(false);
  const [showCropModal, setShowCropModal] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);

  const [inputWasChanged, setInputWasChanged] = useState(false);
  const [ableToPost, setAbleToPost] = useState(false);
  const [isEditingImage, setIsEditingImage] = useState(false);
  const [newImageUploaded, setNewImageUploaded] = useState(false);

  const [mouseDownOnResetPassword, setMouseDownOnResetPassword] =
    useState(false);

  const [showTempBaselineSkeleton, setShowTempBaselineSkeleton] =
    useState(true);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const showCroppedImage = async (disableSkeleton = false, useDBCropData) => {
    try {
      // using last saved value of crop values or last cropped values
      let currentCropAreaPixels = useDBCropData
        ? DBCropData
        : croppedAreaPixels;

      let prevCroppedImage = croppedImage;

      const croppedImg = await getCroppedImg(
        cropReadyImage ?? image,
        currentCropAreaPixels,
        imageFileType
      );

      setCroppedImage(croppedImg);
      setShowCropModal(false);

      if (isEditingImage) {
        if (
          getBase64Image(prevCroppedImage) !== getBase64Image(croppedImg) &&
          username.length > 0 &&
          status.length > 0
        ) {
          setAbleToPost(true);
        }
      }

      if (newImageUploaded && username.length > 0 && status.length > 0) {
        setHasChangedPicture(true);
        setAbleToPost(true);
      }

      setNewImageUploaded(false);

      if (disableSkeleton) {
        setIsFetching(false);
      }
    } catch (e) {
      console.log(e);
      setShowCropModal(false);
    }
  };

  function onClose() {
    setIsEditingImage(false);

    // resetting crop position/size to where it was before discarded changes
    fetchUserPreferences();

    setShowCropModal(false);
    setUserUploadedImage(null);
    setCropReadyImage(null);
  }

  useEffect(() => {
    const timerID = setTimeout(() => setShowTempBaselineSkeleton(false), 500);

    return () => {
      clearTimeout(timerID);

      pinnedCtx.setShow60({ display: "none" });
      pinnedCtx.setShow180({ display: "none" });
      pinnedCtx.setShow300({ display: "none" });
    };
  }, []);

  useEffect(() => {
    function clickHandler(ev) {
      if (showInvalidFileTypeModal) {
        if (!invalidFileTypeModalRef.current.contains(ev.target)) {
          setShowInvalidFileTypeModal(false);
        }
      }
    }

    function escapeHandler(e) {
      if (e.key === "Escape") {
        e.preventDefault();

        setShowCropModal(false);
        setShowInvalidFileTypeModal(false);
      }
    }

    document.addEventListener("click", clickHandler);
    document.addEventListener("keydown", escapeHandler);

    return () => {
      document.removeEventListener("click", clickHandler);
      document.removeEventListener("keydown", escapeHandler);
    };
  }, [showInvalidFileTypeModal]);

  useEffect(() => {
    let timeoutID = null;
    if (showEmailSentTooltip) {
      timeoutID = setTimeout(() => {
        setShowEmailSentTooltip(false);
      }, 1500);
    }

    return () => {
      if (timeoutID) {
        clearTimeout(timeoutID);
      }
    };
  }, [showEmailSentTooltip]);

  useEffect(() => {
    if ((!isLoading, isAuthenticated)) {
      // fetch data from db if it is present
      get(child(dbRef, `users/${user.sub}/preferences`)).then((snapshot) => {
        if (snapshot.exists()) {
          setUsername(snapshot.val()["username"]);
          setStatus(snapshot.val()["status"]);

          // used to compare whether input has changed from db value
          setFetchedUsername(snapshot.val()["username"]);
          setFetchedStatus(snapshot.val()["status"]);

          if (snapshot.val()["profileCropMetadata"]) {
            setDBCropData(
              snapshot.val()["profileCropMetadata"]["croppedAreaPixels"]
            );
            setCrop(snapshot.val()["profileCropMetadata"]["crop"]);
            setZoom(snapshot.val()["profileCropMetadata"]["zoom"]);
            setCroppedAreaPixels(
              snapshot.val()["profileCropMetadata"]["croppedAreaPixels"]
            );
          }
        }
      });
      setUserEmail(user.email);
      setImageAltInfo(user.name);

      getDownloadURL(ref_storage(storage, `users/${user.sub}/profile`)).then(
        (url) => {
          getMetadata(ref_storage(storage, `users/${user.sub}/profile`))
            .then((metadata) => {
              setImageFileType(metadata.contentType);
              setCropReadyImage(url);
            })
            .catch((e) => {
              console.error(e);
            });
        }
      );

      getDownloadURL(ref_storage(storage, `users/${user.sub}/croppedProfile`))
        .then((url) => {
          getMetadata(ref_storage(storage, `users/${user.sub}/croppedProfile`))
            .then((metadata) => {
              setImageFileType(metadata.contentType);
              setImage(url);
              setIsFetching(false);
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
    if (newImageUploaded) {
      setShowCropModal(true);
    }
  }, [newImageUploaded]);

  useEffect(() => {
    if (inputWasChanged) {
      if (
        (username.length > 0 && username !== fetchedUsername) ||
        (status.length > 0 && status !== fetchedStatus)
      ) {
        setAbleToPost(true);
      } else {
        setAbleToPost(false);
      }
    }
  }, [inputWasChanged, username, fetchedUsername, status, fetchedStatus]);

  // return save to true after pushing to db
  function handleSubmit(event) {
    event.preventDefault();

    if (hasChangedPicture) {
      upload();
    } else {
      if (isEditingImage) {
        const croppedPhotoRef = ref_storage(
          storage,
          `users/${user.sub}/croppedProfile`
        );
        console.log(croppedImage);

        getFileBlob(croppedImage, (blob) => {
          uploadBytes(croppedPhotoRef, blob, {
            contentType: imageFileType,
          }).then(() => {
            PFPUpdateCtx.setRefreshProfilePicture(true);
          });
        });

        setIsEditingImage(false);
      }
    }

    let cropMetadata = {
      croppedAreaPixels: croppedAreaPixels,
      crop: crop,
      zoom: zoom,
    };

    set(ref_database(db, `users/${user.sub}/preferences`), {
      username: username,
      status: status,
      defaultProfilePicture: user.picture,
      profileCropMetadata: croppedAreaPixels ? cropMetadata : false,
    }).then(() => {
      fetchUserPreferences();
    });

    setInputWasChanged(false);
    setAbleToPost(false);
    setHasChangedPicture(false);
    setEditAvailable(true);
  }

  function fetchUserPreferences() {
    get(child(dbRef, `users/${user.sub}/preferences`)).then((snapshot) => {
      if (snapshot.exists()) {
        // check if !isEqual for all of these below
        setUsername(snapshot.val()["username"]);
        setStatus(snapshot.val()["status"]);

        // used to compare whether input has changed from db value
        setFetchedUsername(snapshot.val()["username"]);
        setFetchedStatus(snapshot.val()["status"]);

        if (snapshot.val()["profileCropMetadata"]) {
          setDBCropData(
            snapshot.val()["profileCropMetadata"]["croppedAreaPixels"]
          );
          setCrop(snapshot.val()["profileCropMetadata"]["crop"]);
          setZoom(snapshot.val()["profileCropMetadata"]["zoom"]);
          setCroppedAreaPixels(
            snapshot.val()["profileCropMetadata"]["croppedAreaPixels"]
          );
        }
      }
    });
    setHasChangedPicture(false);
    setInputWasChanged(false);
  }

  var getFileBlob = function (url, cb) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.responseType = "blob";
    xhr.addEventListener("load", function () {
      cb(xhr.response);
    });
    xhr.send();
  };

  async function upload() {
    const photoRef = ref_storage(storage, `users/${user.sub}/profile`);

    const croppedPhotoRef = ref_storage(
      storage,
      `users/${user.sub}/croppedProfile`
    );

    await uploadBytes(photoRef, userUploadedImage ?? image, {
      contentType: imageFileType,
    });

    getFileBlob(croppedImage, (blob) => {
      uploadBytes(croppedPhotoRef, blob, {
        contentType: imageFileType,
      }).then(() => {
        PFPUpdateCtx.setRefreshProfilePicture(true);
      });
    });

    const photoURL = await getDownloadURL(photoRef);

    setImage(photoURL);

    PFPUpdateCtx.setJustACropChange(false);
  }

  const handleChange = (e) => {
    if (e.target.files[0]) {
      if (e.target.files[0].type === "image/jpeg") {
        setImageFileType("image/jpeg");
      } else if (e.target.files[0].type === "image/png") {
        setImageFileType("image/png");
      } else {
        inputRef.current.value = null;
        setShowInvalidFileTypeModal(true);
        return;
      }

      setUserUploadedImage(e.target.files[0]);
      let reader = new FileReader();
      reader.onload = function (e) {
        setCropReadyImage(e.target.result);
      };
      reader.readAsDataURL(e.target.files[0]);

      setCroppedImage(null);
      setCroppedAreaPixels(null);
      setHasChangedPicture(true);
      setNewImageUploaded(true);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
    }
  };

  return (
    <div
      style={{ gap: "1em" }}
      className={`${baseClasses.baseVertFlex} ${classes.prefCard}`}
    >
      <ProfileHeader title={"Preferences"} />

      <div style={{ position: "relative", width: "100%" }}>
        <div
          className={`${classes.topPreferencesContain} ${baseClasses.baseFlex}`}
        >
          <div
            className={`${classes.leftSideContain} ${baseClasses.baseVertFlex}`}
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
                <div style={{ position: "relative" }}>
                  <input
                    className={`${classes.setUsername} ${classes.usernameStatusInputs}`}
                    value={username}
                    minLength={1}
                    maxLength={25}
                    style={{
                      boxShadow:
                        username !== fetchedUsername
                          ? "0 0 4px 1px #008b04"
                          : "none",
                    }}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      if (
                        e.target.value.length > 0 &&
                        e.target.value !== fetchedUsername
                      ) {
                        setInputWasChanged(true);
                      }
                    }}
                  ></input>
                  <div className={classes.maxChars}>Max: 25 chars.</div>
                </div>
              )}
            </div>

            <div
              style={{ gap: "3em", alignItems: "flex-start" }}
              className={baseClasses.baseFlex}
            >
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
                <div style={{ position: "relative" }}>
                  <input
                    className={`${classes.setStatus} ${classes.usernameStatusInputs}`}
                    value={status}
                    minLength={1}
                    maxLength={40}
                    style={{
                      boxShadow:
                        status !== fetchedStatus
                          ? "0 0 4px 1px #008b04"
                          : "none",
                    }}
                    onChange={(e) => {
                      setStatus(e.target.value);
                      if (
                        e.target.value.length > 0 &&
                        e.target.value !== fetchedStatus
                      ) {
                        setInputWasChanged(true);
                      }
                    }}
                  ></input>
                  <div className={classes.maxChars}>Max: 40 chars.</div>
                </div>
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

            <div
              style={{
                opacity: user?.sub?.substring(0, 5) === "auth0" ? 1 : 0.4,
              }}
              className={`${classes.resetPasswordContainer} ${baseClasses.baseVertFlex}`}
            >
              <button
                style={{
                  width: "100%",
                  gap: "1em",
                  cursor:
                    user?.sub?.substring(0, 5) === "auth0" ? "pointer" : "auto",
                  backgroundColor: mouseDownOnResetPassword
                    ? "#8d8d8d"
                    : "#e0e0e0",
                  transition: "all 200ms",
                }}
                className={`${classes.resetPasswordButton} ${baseClasses.baseFlex}`}
                onMouseDown={() => {
                  setMouseDownOnResetPassword(true);
                }}
                onMouseUp={() => {
                  setMouseDownOnResetPassword(false);
                }}
                onMouseLeave={() => {
                  setMouseDownOnResetPassword(false);
                }}
                onClick={() => {
                  let options = {
                    method: "POST",
                    url: "https://dev-lshqttx0.us.auth0.com/dbconnections/change_password",
                    headers: { "content-type": "application/json" },
                    data: {
                      client_id: "HiuFz0Yo30naHcGzk8PbPOYr0qIK6dae",
                      email: userEmail,
                      connection: "Username-Password-Authentication",
                    },
                  };

                  if (user?.sub?.substring(0, 5) === "auth0") {
                    setShowEmailSentTooltip(true);

                    axios
                      .request(options)
                      .then(function (response) {
                        console.log(response.data);
                      })
                      .catch(function (error) {
                        console.error(error);
                      });
                  } else {
                    setShowEmailSentTooltip(true);
                  }
                }}
              >
                <RedoIcon
                  dimensions={"1em"}
                  color={mouseDownOnResetPassword ? "white" : "black"}
                />
                <div
                  style={{
                    color: mouseDownOnResetPassword ? "white" : "black",
                    transition: "all 200ms",
                  }}
                >
                  Reset Password
                </div>
              </button>

              {/* "email sent" tooltip */}
              <div style={{ width: "100%" }} className={baseClasses.baseFlex}>
                <div
                  style={{
                    opacity: showEmailSentTooltip ? 1 : 0,
                    transform: showEmailSentTooltip ? "scale(1)" : "scale(0)",
                  }}
                  className={
                    user?.sub?.substring(0, 5) === "auth0"
                      ? classes.emailSentTooltip
                      : classes.notAvailableTooltip
                  }
                >
                  {user?.sub?.substring(0, 5) === "auth0"
                    ? "Email sent!"
                    : "only available to users who created an account with us"}
                </div>
              </div>
            </div>
          </div>

          <div className={baseClasses.baseFlex}>
            <div className={classes.fadingLine}></div>
          </div>

          <div
            className={`${classes.rightSideContain} ${baseClasses.baseVertFlex}`}
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
                  boxShadow: "rgb(0 0 0 / 30%) 0px 3px 8px 1px",
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
                      style={{ padding: "0.35em 0.6em", margin: 0 }}
                      className={baseClasses.closeButton}
                      onClick={() => {
                        setIsEditingImage(true);
                        setShowCropModal(true);
                      }}
                      aria-label="Close"
                    >
                      <div className={classes.buttonOperationContainer}>
                        <div>Resize</div>
                        <ResizeIcon />
                      </div>
                    </button>
                    <button
                      style={{ margin: 0 }}
                      className={baseClasses.activeButton}
                      onClick={() => {
                        // setIsEditingImage(true);
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

            <div style={{ marginTop: "1em" }}>
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
            </div>
            <div style={{ marginTop: "0.5em" }}>
              {isFetching || showTempBaselineSkeleton ? (
                <div
                  style={{
                    width: "60%",
                    height: "1.5em",
                  }}
                  className={baseClasses.skeletonLoading}
                ></div>
              ) : (
                <div style={{ textAlign: "center" }}>
                  <i>"{status}"</i>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className={classes.editContainer}>
          {editAvailable ? (
            <button
              className={baseClasses.activeButton}
              onClick={() => setEditAvailable(false)}
            >
              <div style={{ gap: "0.75em" }} className={classes.baseFlex}>
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
                className={baseClasses.closeButton}
                onClick={() => {
                  setEditAvailable(true);
                  fetchUserPreferences();
                  setInputWasChanged(false);
                  setAbleToPost(false);
                }}
                aria-label="Close"
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
                    opacity: ableToPost ? 0 : 1,
                    cursor: "auto",
                  }}
                  disabled={!ableToPost}
                  className={baseClasses.activeButton}
                >
                  Save
                </button>
                <button
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    opacity: ableToPost ? 1 : 0,

                    pointerEvents: ableToPost ? "auto" : "none",
                    cursor: ableToPost ? "pointer" : "auto",
                  }}
                  disabled={!ableToPost}
                  className={baseClasses.activeButton}
                  onClick={(e) => {
                    if (ableToPost) {
                      handleSubmit(e);
                    }
                  }}
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
        <h3 style={{ textAlign: "center" }}>Pinned Drawings</h3>
        <div className={classes.trailingLine}></div>
      </div>

      <div
        style={{ paddingBottom: "5em", marginTop: "1em" }}
        className={baseClasses.baseFlex}
      >
        <PinnedArtwork />
      </div>

      <div
        style={{
          opacity: showCropModal ? 1 : 0,
          pointerEvents: showCropModal ? "auto" : "none",
        }}
        className={classes.modal}
      >
        <div className={classes.cropImageModal}>
          <ImageCropModal
            id={1}
            imageUrl={cropReadyImage ?? image}
            cropInit={crop}
            zoomInit={zoom}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
            applyChanges={showCroppedImage}
            discardChanges={onClose}
          />
        </div>
      </div>

      <div
        style={{
          opacity: showInvalidFileTypeModal ? 1 : 0,
          pointerEvents: showInvalidFileTypeModal ? "auto" : "none",
        }}
        className={classes.modal}
      >
        <div
          ref={invalidFileTypeModalRef}
          style={{ transition: "all 200ms" }}
          className={`${classes.invalidFileTypeModal} ${baseClasses.baseVertFlex}`}
        >
          <button
            style={{ right: "1em" }}
            className={baseClasses.close}
            onClick={() => {
              setShowInvalidFileTypeModal(false);
            }}
          ></button>

          <InvalidFileTypeIcon dimensions={"5em"} />
          <div className={baseClasses.baseFlex}>
            <div>Please upload either a</div>
            <div>".jpg" or ".png" file.</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Preferences;
