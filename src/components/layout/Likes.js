import React, { useContext } from "react";

import { useAuth0 } from "@auth0/auth0-react";

import FavoritesContext from "./FavoritesContext";

import ProfileHeader from "./ProfileHeader";
import Search from "./Search";

import HeartFilledIcon from "../../svgs/HeartFilledIcon";

import classes from "./Preferences.module.css";
import baseClasses from "../../index.module.css";

const Likes = () => {
  const favoritesCtx = useContext(FavoritesContext);
  const { isLoading, isAuthenticated, user } = useAuth0();

  return (
    <>
      {!isLoading && isAuthenticated && (
        <div className={`${classes.baseFlex} ${classes.prefCard}`}>
          <ProfileHeader title={"Likes"} />
          {favoritesCtx.totalFavorites === 0 ? (
            <div
              style={{
                width: "100%",
                height: "50vh",
                gap: "1em",
                fontSize: "20px",
              }}
              className={baseClasses.baseVertFlex}
            >
              <div>You haven't liked any drawings yet.</div>
              <div style={{ gap: ".5em" }} className={baseClasses.baseFlex}>
                <HeartFilledIcon dimensions={"2em"} /> some to view them here!
              </div>
            </div>
          ) : (
            <div style={{ margin: "1em" }}>
              <Search
                dbPath={`users/${user.sub}/likes`}
                margin={"1em"}
                idx={2}
                forModal={false}
              />
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Likes;
