import { useLocation } from "react-router-dom";
import { Outlet } from "react-router";
import { motion } from "framer-motion";

import ProfileNavigation from "../components/layout/ProfileNavigation";

import classes from "../components/layout/ProfileLayout.module.css";

const Profile = () => {
  const location = useLocation();
  const profileCardStyles = {
    width: "55%",
    display: "flex",
    justifyContent: "center",
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div
        style={{
          minHeight:
            location.pathname === "/profile/preferences" ? "82vh" : "100vh",
        }}
        className={classes.horizontalContain}
      >
        <ProfileNavigation />
        <div style={profileCardStyles}>
          <Outlet />
        </div>
      </div>
    </motion.div>
  );
};

export default Profile;
