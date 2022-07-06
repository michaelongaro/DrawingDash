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
          <div style={{ margin: "1em" }}>
            <Search
              dbPath={`users/${user.sub}/titles`}
              margin={"1em"}
              idx={1}
              forModal={false}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Gallary;
