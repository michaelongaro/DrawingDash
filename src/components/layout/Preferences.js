import React, { useEffect, useContext } from "react";
import { useAuth0 } from "@auth0/auth0-react";

import classes from "./Preferences.module.css";

import FavoritesContext from "./FavoritesContext";


import PinnedArtwork from "./PinnedArtwork";
const Preferences = () => {
  const { user } = useAuth0();
  const favoritesCtx = useContext(FavoritesContext);

  useEffect(() => {
    // console.log(`${user.sub} ---`);
    favoritesCtx.setClientID(user.sub);
  }, []);

  return (

    <div>
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

      <PinnedArtwork />
    </div>

  );
};

export default Preferences;
