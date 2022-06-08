import React, { useState, useEffect } from "react";

import { useAuth0 } from "@auth0/auth0-react";

import Search from "./Search";
import ProfileHeader from "./ProfileHeader";

import classes from "./Preferences.module.css";

const Gallary = () => {
  const { user, isLoading, isAuthenticated } = useAuth0();

  const [showGallery, setShowGallery] = useState(false);

  useEffect(() => {
    if (!isLoading && isAuthenticated) setShowGallery(true);
  }, [isLoading, isAuthenticated]);

  return (
    <>
      {showGallery && (
        <div className={`${classes.baseFlex} ${classes.prefCard}`}>
          <ProfileHeader title={"Gallery"} />
          <Search userProfile={user.sub} margin={"1em"} />
        </div>
      )}
    </>
  );
};

export default Gallary;
