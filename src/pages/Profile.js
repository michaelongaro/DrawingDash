import { Outlet } from "react-router";

import ProfileNavigation from "../components/layout/ProfileNavigation";
import classes from "../components/layout/ProfileLayout.module.css";
import Card from "../ui/Card";

const Profile = () => {
  const profileCardStyles = {
    width: "75%",
    display: "flex",
    justifyContent: "center",
  };

  return (
    <div className={classes.horizontalContain}>
      <ProfileNavigation />
      <div style={profileCardStyles}>
        <Card>
          <Outlet />
        </Card>
      </div>
    </div>
  );
};

export default Profile;
