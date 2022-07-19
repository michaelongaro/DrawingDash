import React, { useState, useEffect } from "react";

import Clippy from "../../ui/Clippy";
import Check from "../../ui/Check";

import baseClasses from "../../index.module.css";

const CopyToClipboard = (props) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (copied) setCopied(false);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [copied]);

  function CopyToClipboard() {
    navigator.clipboard.writeText(props.url);
  }

  return (
    <button
      onClick={() => {
        setCopied(true);
        CopyToClipboard();
      }}
      style={{ gap: "0.75em", fontSize: "16px" }}
      className={`${baseClasses.nextButton} ${baseClasses.baseFlex}`}
    >
      Copy Link
      <div
        style={{
          position: "relative",
          height: 16,
          width: 16,
        }}
      >
        <Clippy
          style={{
            color: "#FFF",
            position: "absolute",
            top: 0,
            left: 0,
            strokeDasharray: 50,
            strokeDashoffset: copied ? -50 : 0,
            transition: "all 300ms ease-in-out",
          }}
        />

        <Check
          style={{
            color: "#1ddb48",
            position: "absolute",
            top: 0,
            left: 0,
            strokeDasharray: 50,
            strokeDashoffset: copied ? 0 : -50,
            transition: "all 300ms ease-in-out",
          }}
        />
      </div>
    </button>
  );
};

export default CopyToClipboard;
