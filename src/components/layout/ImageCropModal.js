import React from "react";
import Cropper from "react-easy-crop";

import ExitPreferencesIcon from "../../svgs/ExitPreferencesIcon";

import classes from "./ImageCropModal.module.css";

const ImageCropModal = ({
  id,
  imageUrl,
  cropInit,
  zoomInit,
  aspectInit,
  onCropChange,
  onZoomChange,
  onCropComplete,
  discardChanges,
  applyChanges,
}) => {
  if (zoomInit == null) {
    zoomInit = 1;
  }
  if (cropInit == null) {
    cropInit = { x: 0, y: 0 };
  }
  if (aspectInit == null) {
    aspectInit = { value: 1 / 1, text: "1/1" };
  }

  return (
    <div className={classes.baseFlex}>
      <div style={{ textAlign: "center", margin: ".25em 0 .25em 0" }}>
        Resize Your Image
      </div>
      <div className="backdrop"></div>
      <div className={classes.cropContainer}>
        <Cropper
          image={imageUrl}
          zoom={zoomInit}
          crop={cropInit}
          aspect={1}
          cropShape={"round"}
          onCropChange={onCropChange}
          onZoomChange={onZoomChange}
          onCropComplete={onCropComplete}
        />
      </div>
      <div className={classes.controls}>
        <div className={classes.zoomContainer}>
          <div>Zoom</div>
          <input
            type="range"
            min={1}
            max={3}
            step={0.1}
            value={zoomInit}
            onInput={(e) => {
              onZoomChange(e.target.value);
            }}
            className={classes.slider}
          ></input>
        </div>
        <div className={classes.buttonContainer}>
          <button
                className={classes.closeButton}
                onClick={discardChanges}
              >
                <ExitPreferencesIcon />
              </button>
          <button className={classes.editButton} onClick={applyChanges}>
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageCropModal;
