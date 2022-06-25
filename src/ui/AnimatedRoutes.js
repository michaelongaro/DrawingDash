import React from "react";

import { Routes, Route, useLocation } from "react-router-dom";

import HomePage from "../pages/HomePage";
import DailyDoodle from "../pages/DailyDoodle";
import Explore from "../pages/Explore";
import Profile from "../pages/Profile";
import Preferences from "../components/layout/Preferences";
import Gallary from "../components/layout/Gallary";
import Likes from "../components/layout/Likes";

import { AnimatePresence } from "framer-motion";

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<HomePage />} />
        <Route path="daily-drawings" element={<DailyDoodle />} />
        <Route path="explore" element={<Explore />} />
        <Route path="profile" element={<Profile />}>
          <Route path="preferences" element={<Preferences />} />
          <Route path="gallery" element={<Gallary />} />
          <Route path="likes" element={<Likes />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
};

export default AnimatedRoutes;
