import { useState, useEffect } from "react";

import { useLocation } from "react-router-dom";
import { Outlet } from "react-router";
import { motion } from "framer-motion";

import ProfileNavigation from "../components/layout/ProfileNavigation";

import classes from "../components/layout/ProfileLayout.module.css";

const Profile = () => {
  const location = useLocation();

  const [showProfileNavigation, setShowProfileNavigation] = useState(false);
  const [profileCardStyles, setProfileCardStyles] = useState(null);

  // 900px go to column

  useEffect(() => {
    if (window.innerWidth <= 1100) {
      setProfileCardStyles({
        width: "95vw",
        marginBottom: "2em",
        display: "flex",
        justifyContent: "center",
      });
      setShowProfileNavigation(false);
    } else {
      setProfileCardStyles({
        width: "1046px",
        marginRight: "1em",
        marginBottom: "2em",
        display: "flex",
        justifyContent: "center",
      });
      setShowProfileNavigation(true);
    }

    function resizeHandler() {
      if (window.innerWidth <= 1100) {
        setProfileCardStyles({
          width: "95vw",
          marginBottom: "2em",
          display: "flex",
          justifyContent: "center",
        });
        setShowProfileNavigation(false);
      } else {
        setProfileCardStyles({
          width: "1046px",
          marginRight: "1em",
          marginBottom: "2em",
          display: "flex",
          justifyContent: "center",
        });
        setShowProfileNavigation(true);
      }
    }
    window.addEventListener("resize", resizeHandler);
    return () => {
      window.removeEventListener("resize", resizeHandler);
    };
  }, []);

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
        {showProfileNavigation && <ProfileNavigation />}
        <div style={profileCardStyles}>
          <Outlet />
        </div>
      </div>
    </motion.div>
  );
};

export default Profile;
