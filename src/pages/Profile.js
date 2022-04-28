import { Outlet } from "react-router";

import ProfileNavigation from "../components/layout/ProfileNavigation";
import classes from "../components/layout/ProfileLayout.module.css";

const Profile = () => {
  const profileCardStyles = {
    width: "55%",
    display: "flex",
    justifyContent: "center",
  };

  return (
    <div className={classes.horizontalContain}>
      <ProfileNavigation />
      <div style={profileCardStyles}>
          <Outlet />
      </div>
    </div>
  );
};

export default Profile;
