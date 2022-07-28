import React from "react";

import classes from "./Footer.module.css";
import baseClasses from "../index.module.css";

const Footer = () => {
  return (
    <footer className={`${classes.footerContainer} ${baseClasses.baseFlex}`}>
      Made with 💗 by Michael Ongaro
    </footer>
  );
};

export default Footer;
