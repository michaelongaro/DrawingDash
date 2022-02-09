// import { Routes, Route } from "react-router-dom";


import { Outlet } from "react-router";
import ProfileNavigation from "../components/layout/ProfileNavigation";

const Profile = () => {
  // <img src={user.picture} alt={user.name} use this instead of "log out" in top right, include a dropdown

  return (
    // <div className={classes.horizontalContain}>
    <div>
      <ProfileNavigation />
      {/* <Routes>
        <Route path="/" element={<Preferences />} />
        <Route path="profile/gallary" element={<Gallary />} />
        <Route path="profile/likes" element={<Likes />} />
      </Routes> */}

      <Outlet />
    </div>
  );
};

export default Profile;
