import React from "react";

import classes from "./Footer.module.css";
import baseClasses from "../index.module.css";
const Footer = () => {
  return (
    <div className={`${classes.footerContainer} ${baseClasses.baseFlex}`}>
      Made with 💗 by Michael Ongaro
    </div>
  );
};

export default Footer;
