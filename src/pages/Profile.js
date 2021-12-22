// import { Routes, Route } from "react-router-dom";

import Preferences from "../components/layout/Preferences";
import Gallary from "../components/layout/Gallary";
import ProfileLayout from "../components/layout/ProfileLayout";
import Likes from "../components/layout/Likes";

import classes from "../components/layout/Profile.module.css";
import { Outlet } from "react-router";

const Profile = () => {
  // <img src={user.picture} alt={user.name} use this instead of "log out" in top right, include a dropdown
  
  return (
    // <div className={classes.horizontalContain}>
    <ProfileLayout>
      {/* <Routes>
        <Route path="/" element={<Preferences />} />
        <Route path="profile/gallary" element={<Gallary />} />
        <Route path="profile/likes" element={<Likes />} />
      </Routes> */}

      <Outlet />
    </ProfileLayout>
    // </div>
  );
};

export default Profile;
