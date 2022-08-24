import React from "react";

import GithubLogo from "../svgs/GithubLogo.png";

import classes from "./Footer.module.css";
import baseClasses from "../index.module.css";

const Footer = () => {
  function openInNewTab(url) {
    const newWindow = window.open(url, "_blank", "noopener,noreferrer");
    if (newWindow) newWindow.opener = null;
  }

  return (
    <footer
      style={{ gap: "1rem" }}
      className={`${classes.footerContainer} ${baseClasses.baseFlex}`}
    >
      <div>Made with 💗 by</div>
      <div
        className={`${classes.githubContainer} ${baseClasses.baseFlex}`}
        onClick={() => openInNewTab("https://github.com/michaelongaro")}
      >
        <img src={GithubLogo} alt={"Github Logo"} />
        <div>Michael Ongaro</div>
      </div>
    </footer>
  );
};

export default Footer;
