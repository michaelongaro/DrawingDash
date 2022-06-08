import { Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";
import DailyDoodle from "./pages/DailyDoodle";
import Explore from "./pages/Explore";
import Profile from "./pages/Profile";
import Preferences from "./components/layout/Preferences";
import Gallary from "./components/layout/Gallary";
import Likes from "./components/layout/Likes";
// import SignIn from "./pages/SignIn";

import Layout from "./components/layout/Layout";

// could probably also do a favorite tech somewhere
function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="daily-drawings" element={<DailyDoodle />} />
        <Route path="explore" element={<Explore />} />
        <Route path="profile" element={<Profile />}>
          <Route path="preferences" element={<Preferences />} />
          <Route path="gallery" element={<Gallary />} />
          <Route path="likes" element={<Likes />} />
        </Route>
      </Routes>
    </Layout>
  );
}

export default App;
