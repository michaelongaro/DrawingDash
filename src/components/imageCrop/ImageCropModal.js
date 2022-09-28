import React from "react";
import Cropper from "react-easy-crop";

import ExitIcon from "../../svgs/ExitIcon";

import classes from "./ImageCropModal.module.css";
import baseClasses from "../../index.module.css";

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
  if (zoomInit === null) {
    zoomInit = 1;
  }
  if (cropInit === null) {
    cropInit = { x: 0, y: 0 };
  }
  if (aspectInit === null) {
    aspectInit = { value: 1 / 1, text: "1/1" };
  }

  return (
    <div className={classes.baseFlex}>
      <div style={{ textAlign: "center", marginTop: ".5em" }}>
        Resize Your Image
      </div>
      <div className={classes.backdrop}></div>
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
      <div className={baseClasses.baseFlex}>
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
              className={baseClasses.closeButton}
              onClick={discardChanges}
              aria-label="Close"
            >
              <ExitIcon />
            </button>
            <button className={baseClasses.activeButton} onClick={applyChanges}>
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageCropModal;
