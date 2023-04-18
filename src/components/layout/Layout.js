import { useState, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";

import DrawingSelectionContext from "../canvas/DrawingSelectionContext";

import Footer from "../../ui/Footer";
import MainNavigation from "../navigation/MainNavigation";

function Layout(props) {
  const location = useLocation();
  const DSCtx = useContext(DrawingSelectionContext);

  const [dynamicHeight, setDynamicHeight] = useState("87.5vh");

  useEffect(() => {
    function resizeHandler() {
      if (DSCtx.extendLayoutHeight) {
        setDynamicHeight("107vh");
      } else if (DSCtx.showPromptSelection) {
        if (window.innerWidth > 1200 && window.innerHeight > 900) {
          setDynamicHeight("87.5vh");
        } else {
          if (DSCtx.extraPromptsShown) {
            if (document.getElementById("extraPromptContainer")) {
              setDynamicHeight(588 + 392); // height of container + extra offset for padding
            }
          } else {
            if (document.getElementById("normalPromptContainer")) {
              setDynamicHeight(870 + 392); // height of container + extra offset for padding
            }
          }
        }
      } else if (DSCtx.showPaletteChooser) {
        if (
          window.innerWidth <= 550 ||
          (window.innerHeight > 778 &&
            window.innerHeight <= 929 &&
            window.innerWidth > 550)
        ) {
          setDynamicHeight("82vh");
        } else if (window.innerHeight > 929) {
          setDynamicHeight("800px"); // trying to account for huge heights like an ipad..
        } else {
          setDynamicHeight(
            `${window.innerHeight + (750 - window.innerHeight)}px`
          );
        }
      }
    }

    resizeHandler();

    window.addEventListener("resize", resizeHandler);
    return () => {
      window.removeEventListener("resize", resizeHandler);
    };
  }, [
    DSCtx.extraPromptsShown,
    DSCtx.showPromptSelection,
    DSCtx.showPaletteChooser,
    DSCtx.extendLayoutHeight,
    location.pathname,
  ]);

  return (
    <>
      <MainNavigation />
      <main
        id={"main"}
        style={{
          minHeight:
            location.pathname === "/profile/gallery" ||
            location.pathname === "/profile/likes"
              ? "100vh"
              : location.pathname !== "/daily-drawings"
              ? "87.5vh"
              : dynamicHeight,
          height:
            location.pathname === "/daily-drawings" &&
            !DSCtx.extendLayoutHeight &&
            !DSCtx.showPaletteChooser
              ? "87.5vh"
              : "",
          width: "100%",
          margin: "3rem 0 0 0",
          transition: "all 50ms",
        }}
      >
        {props.children}
      </main>
      <Footer />
    </>
  );
}

export default Layout;
