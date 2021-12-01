import { Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";
import DailyDoodle from "./pages/DailyDoodle";
import Explore from "./pages/Explore";
import Profile from "./pages/Profile";
// import SignIn from "./pages/SignIn";

import Layout from "./components/layout/Layout";

// could probably also do a favorite tech somewhere
function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="daily-doodle" element={<DailyDoodle />} />
        <Route path="explore" element={<Explore />} />
        <Route path="profile" element={<Profile />} />
      </Routes>
    </Layout>
  );
}

export default App;
