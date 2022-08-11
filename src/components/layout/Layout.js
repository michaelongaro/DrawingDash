import { useState, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";

import DrawingSelectionContext from "../../canvas/DrawingSelectionContext";

import Footer from "../../ui/Footer";
import MainNavigation from "./MainNavigation";

function Layout(props) {
  const location = useLocation();
  const DSCtx = useContext(DrawingSelectionContext);

  const [dynamicHeight, setDynamicHeight] = useState("82vh");

  useEffect(() => {
    // just for initial render, setTimeout so layout has time
    // to fully settle
    setTimeout(() => {
      if (DSCtx.showPromptSelection) {
        // was 778 i think
        if (window.innerWidth > 1200 && window.innerHeight > 900) {
          setDynamicHeight("82vh");
        } else {
          if (DSCtx.extraPromptsShown) {
            setDynamicHeight(
              document
                ?.getElementById("extraPromptContainer")
                ?.getBoundingClientRect().height + 392
            );
          } else {
            console.log(
              document
                ?.getElementById("normalPromptContainer")
                ?.getBoundingClientRect().height
            );
            setDynamicHeight(
              document
                ?.getElementById("normalPromptContainer")
                ?.getBoundingClientRect().height + 392
            );
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
          setDynamicHeight("100vh");
        }
      } else {
        setDynamicHeight("82vh");
      }
    }, 500);

    function resizeHandler() {
      if (DSCtx.showPromptSelection) {
        if (window.innerWidth > 1200 && window.innerHeight > 900) {
          setDynamicHeight("82vh");
        } else {
          if (DSCtx.extraPromptsShown) {
            setDynamicHeight(
              document
                .getElementById("extraPromptContainer")
                .getBoundingClientRect().height + 392
            );
          } else {
            console.log(
              document
                ?.getElementById("normalPromptContainer")
                ?.getBoundingClientRect().height
            );
            setDynamicHeight(
              document
                .getElementById("normalPromptContainer")
                .getBoundingClientRect().height + 392
            );
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
          setDynamicHeight("100vh");
        }
      }
      // }
    }
    window.addEventListener("resize", resizeHandler);
    return () => {
      window.removeEventListener("resize", resizeHandler);
    };
  }, [
    DSCtx.extraPromptsShown,
    DSCtx.showPromptSelection,
    DSCtx.showPaletteChooser,
    location.pathname,
  ]);

  return (
    <>
      <MainNavigation />
      <main
        style={{
          minHeight:
            location.pathname === "/profile/gallery" ||
            location.pathname === "/profile/likes"
              ? "100vh"
              : location.pathname !== "/daily-drawings"
              ? "82vh"
              : dynamicHeight,
          height:
            location.pathname === "/daily-drawings" && !DSCtx.showDrawingScreen
              ? "82vh"
              : "",
          width: "100%",
          margin: "3rem 0 0 0",
        }}
      >
        {props.children}
      </main>
      <Footer />
    </>
  );
}

export default Layout;
