import { Outlet } from "react-router";
import { motion } from "framer-motion";

import ProfileNavigation from "../components/layout/ProfileNavigation";
import Footer from "../ui/Footer";

import classes from "../components/layout/ProfileLayout.module.css";

const Profile = () => {
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
      transition={{ duration: .2}}
    >
      <div className={classes.horizontalContain}>
        <ProfileNavigation />
        <div style={profileCardStyles}>
          <Outlet />
        </div>
      </div>
      <Footer />
    </motion.div>
  );
};

export default Profile;
