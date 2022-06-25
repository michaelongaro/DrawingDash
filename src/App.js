// import { Routes, Route } from "react-router-dom";

// import HomePage from "./pages/HomePage";
// import DailyDoodle from "./pages/DailyDoodle";
// import Explore from "./pages/Explore";
// import Profile from "./pages/Profile";
// import Preferences from "./components/layout/Preferences";
// import Gallary from "./components/layout/Gallary";
// import Likes from "./components/layout/Likes";

import Layout from "./components/layout/Layout";
import AnimatedRoutes from "./ui/AnimatedRoutes";

function App() {
  return (
    <Layout>
      <AnimatedRoutes />
    </Layout>
  );
}

export default App;
