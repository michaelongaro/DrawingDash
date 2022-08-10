import React, { useState, useEffect, useRef } from "react";

import { useAuth0 } from "@auth0/auth0-react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { slide as Menu } from "react-burger-menu";
import Hamburger from "hamburger-react";

import LogOutButton from "../../oauth/LogOutButton";

import GalleryIcon from "../../svgs/GalleryIcon";
import LikesIcon from "../../svgs/LikesIcon";
import PreferencesIcon from "../../svgs/PreferencesIcon";

import classes from "./Sidebar.module.css";
import profileClasses from "./ProfileNavigation.module.css";
import baseClasses from "../../index.module.css";
import LogInButton from "../../oauth/LogInButton";
import NavbarProfile from "./NavbarProfile";

const Sidebar = ({ pageWrapId, outerContainerId }) => {
  const { isLoading, isAuthenticated } = useAuth0();
  const location = useLocation();

  const sidebarRef = useRef(null);
  const burgerRef = useRef(null);

  const [sidebarOpened, setSidebarOpened] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState("50%");

  const [greenActive, setGreenActive] = useState(false);
  const [yellowActive, setYellowActive] = useState(false);
  const [redActive, setRedActive] = useState(false);

  useEffect(() => {
    // just for initial render
    if (window.innerWidth < 750) {
      setSidebarWidth("100%");
    } else {
      setSidebarWidth("50%");
    }

    function touchHandler(e) {
      if (
        !burgerRef.current.contains(e.target) &&
        !sidebarRef.current.contains(e.target)
      ) {
        setSidebarOpened(false);
      }
    }

    function resizeHandler() {
      if (window.innerWidth < 750) {
        setSidebarWidth("100%");
      } else {
        setSidebarWidth("50%");
      }
    }

    document.addEventListener("touchend", touchHandler);
    window.addEventListener("resize", resizeHandler);
    return () => {
      document.removeEventListener("touchend", touchHandler);
      window.removeEventListener("resize", resizeHandler);
    };
  }, []);

  useEffect(() => {
    if (
      location.pathname !== "/profile/preferences" &&
      location.pathname !== "/profile/gallery" &&
      location.pathname !== "/profile/likes"
    ) {
      setGreenActive(false);
      setYellowActive(false);
      setRedActive(false);
    }
  }, [location.pathname]);

  function changeSelectedTab(idx) {
    if (idx === 0) {
      setGreenActive(true);
      setYellowActive(false);
      setRedActive(false);
    } else if (idx === 1) {
      setGreenActive(false);
      setYellowActive(true);
      setRedActive(false);
    } else if (idx === 2) {
      setGreenActive(false);
      setYellowActive(false);
      setRedActive(true);
    }
  }

  return (
    <>
      <div ref={burgerRef} className={classes.burgerIconContainer}>
        <Hamburger
          color={"#e2e2e2"}
          onToggle={(toggled) => {
            if (toggled) {
              setSidebarOpened(true);
            } else {
              setSidebarOpened(false);
            }
          }}
          toggled={sidebarOpened}
          toggle={setSidebarOpened}
        />
      </div>

      <div
        style={{
          width: sidebarOpened ? sidebarWidth : 0,
          opacity: sidebarOpened ? 1 : 0,
        }}
        ref={sidebarRef}
        className={classes.sidebarBody}
      >
        <div
          style={{ display: sidebarOpened ? "flex" : "none" }}
          className={`${baseClasses.baseVertFlex} ${classes.sidebarLinks}`}
        >
          {!isLoading && !isAuthenticated ? (
            <div
              className={`${classes.unregisteredContainer} ${profileClasses.vertContain}`}
            >
              <div style={{ gap: "1em" }} className={baseClasses.baseVertFlex}>
                <LogInButton forceShowSignUp={true} />
                <div style={{ transform: "scale(.85)" }}>OR</div>
                <LogInButton forceShowSignUp={false} />

                <div style={{ marginTop: "1em" }}>to be able to:</div>
                <ul className={classes.unregisteredUL}>
                  <li>publish your drawings</li>
                  <li>customize your profile</li>
                  <li>like drawings from other users</li>
                </ul>
                <div>and more!</div>
              </div>
            </div>
          ) : (
            <div style={{ gap: "1em" }} className={baseClasses.baseVertFlex}>
              <NavbarProfile forSidebar={true} />

              <ul style={{ gap: 0 }} className={profileClasses.vertContain}>
                <li
                  style={{ width: "75%" }}
                  className={profileClasses.sideContain}
                >
                  <div
                    style={{ width: "100%" }}
                    className={profileClasses.greenNavlink}
                    onClick={() => changeSelectedTab(0)}
                  >
                    <Link
                      to="/profile/preferences"
                      className={profileClasses.navlink}
                      onClick={() => setSidebarOpened(false)}
                    >
                      <div
                        className={`${baseClasses.baseFlex} ${classes.linkFlexContainer}`}
                      >
                        <PreferencesIcon
                          dimensions={"1.75em"}
                          color={greenActive ? "#fafafa" : "black"}
                        />
                        <div
                          style={{
                            color: greenActive ? "#fafafa" : "black",
                            transition: "all 300ms",
                          }}
                        >
                          Preferences
                        </div>
                      </div>
                    </Link>
                  </div>
                </li>

                <li
                  style={{ width: "75%" }}
                  className={profileClasses.sideContain}
                >
                  <div
                    style={{ width: "100%" }}
                    className={profileClasses.yellowNavlink}
                    onClick={() => changeSelectedTab(1)}
                  >
                    <Link
                      to="/profile/gallery"
                      className={profileClasses.navlink}
                      onClick={() => setSidebarOpened(false)}
                    >
                      <div
                        className={`${baseClasses.baseFlex} ${classes.linkFlexContainer}`}
                      >
                        <GalleryIcon
                          dimensions={"1.75em"}
                          color={yellowActive ? "#fafafa" : "black"}
                        />
                        <div
                          style={{
                            color: yellowActive ? "#fafafa" : "black",
                            transition: "all 300ms",
                          }}
                        >
                          Gallery
                        </div>
                      </div>
                    </Link>
                  </div>
                </li>

                <li
                  style={{ width: "75%" }}
                  className={profileClasses.sideContain}
                >
                  <div
                    style={{ width: "100%" }}
                    className={profileClasses.redNavlink}
                    onClick={() => changeSelectedTab(2)}
                  >
                    <Link
                      to="/profile/likes"
                      className={profileClasses.navlink}
                      onClick={() => setSidebarOpened(false)}
                    >
                      <div
                        className={`${baseClasses.baseFlex} ${classes.linkFlexContainer}`}
                      >
                        <LikesIcon
                          dimensions={"1.75em"}
                          color={redActive ? "#fafafa" : "black"}
                        />
                        <div
                          style={{
                            color: redActive ? "#fafafa" : "black",
                            transition: "all 300ms",
                          }}
                        >
                          Likes
                        </div>
                      </div>
                    </Link>
                  </div>
                </li>
                <div
                  style={{ width: "50%", height: "15%" }}
                  className={profileClasses.sideContain}
                >
                  <LogOutButton borderRadius={"1em"} gap={"1em"} />
                </div>
              </ul>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
