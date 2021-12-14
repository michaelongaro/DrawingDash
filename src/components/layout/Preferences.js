import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

import classes from "./Preferences.module.css";
import ProfileLayout from "./ProfileLayout";
import { Outlet } from "react-router";
const Preferences = () => {
  const { user } = useAuth0();
  return (
    <ProfileLayout>
    <div className={classes.container}>
      <div className={classes.username}>username</div>
      <input className={classes.setUsername} placeholder="Charles"></input>
      
      <div className={classes.email}>email</div>
      <div className={classes.setEmail}>{user.email}</div>

      <button className={classes.resetPassword}>Reset Password</button>

      <div className={classes.status}>status</div>
      <div className={classes.setStatus}>temp</div>
    <div className={classes.rightSide}>
      <img className={classes.picture} src={user.picture} alt={user.name} />
      <div className={classes.showUsername}>{user.name}</div>
      <div className={classes.showStatus}>Temp Status</div>
    </div>

    </div>
    <Outlet />
    </ProfileLayout>
  );
};

export default Preferences;
