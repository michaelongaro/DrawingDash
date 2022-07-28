import { useLocation } from "react-router-dom";

import Footer from "../../ui/Footer";
import MainNavigation from "./MainNavigation";

function Layout(props) {
  const location = useLocation();

  return (
    <>
      <MainNavigation />
      <main
        style={{
          // position: "relative",
          minHeight:
            location.pathname === "/profile/gallery" ||
            location.pathname === "/profile/likes"
              ? "100vh"
              : "82vh",
          width: "100%",
          margin: "3rem 0 0 0",
          // flex: "1 0 auto",
        }}
      >
        {props.children}
      </main>
      <Footer />
    </>
  );
}

export default Layout;
