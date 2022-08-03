import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import anime from "animejs";

import CardContainer from "../components/layout/CardContainer";
import FeaturedLikes from "../components/layout/FeaturedLikes";
import FocalAnimatedDrawings from "../components/layout/FocalAnimatedDrawings";
import Card from "../ui/Card";
import LogInButton from "../oauth/LogInButton";
import Footer from "../ui/Footer";

import { useAuth0 } from "@auth0/auth0-react";

import classes from "./HomePage.module.css";
import baseClasses from "../index.module.css";

function HomePage() {
  const { isLoading, isAuthenticated } = useAuth0();

  const [showRegisterContainer, setShowRegisterContainer] = useState(true);

  const [minMobileWidthReached, setMinMobileWidthReached] = useState(false);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      setShowRegisterContainer(false);
    }
  }, [isLoading, isAuthenticated]);

  useEffect(() => {
    if (!isLoading) {
      anime({
        targets: "#homePageContainer",

        opacity: [0, 1],

        direction: "normal",
        loop: false,
        duration: 200,
        easing: "linear",
      });
    }
  }, [isLoading, showRegisterContainer]);

  useEffect(() => {
    // just for initial render
    if (window.innerWidth <= 1075) {
      setMinMobileWidthReached(true);
    } else {
      setMinMobileWidthReached(false);
    }

    function resizeHandler() {
      if (window.innerWidth <= 1075) {
        setMinMobileWidthReached(true);
      } else {
        setMinMobileWidthReached(false);
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
      {!isLoading && (
        <section id={"homePageContainer"} style={{ opacity: 0 }}>
          <div
            style={{
              gap: "2em",
              padding: "0 2em",
            }}
            className={classes.flexContain}
          >
            <FocalAnimatedDrawings
              forHomepage={showRegisterContainer}
              forSearch={false}
            />

            {/* as a sidenote mayyyybe make wide version like 90% width or something, looks a bit off */}
            {showRegisterContainer && (
              <div>
                <Card>
                  <div className={classes.firstTimePromo}>
                    <div className={classes.flexContainColumn}>
                      <LogInButton forceShowSignUp={true} />
                      <LogInButton forceShowSignUp={false} />
                      <div
                        style={{
                          display: minMobileWidthReached ? "flex" : "none",
                          textAlign: "center",
                        }}
                        className={classes.promoText}
                      >
                        to access all features!
                      </div>
                    </div>

                    <div className={classes.fadingOrContainer}>
                      <div className={classes.leadingLine}></div>
                      <div className={classes.or}>OR</div>
                      <div className={classes.trailingLine}></div>
                    </div>
                    <div
                      className={`${classes.animatedRainbowMargin} ${baseClasses.animatedRainbow}`}
                    >
                      <Link
                        to="/daily-drawings"
                        className={baseClasses.baseFlex}
                      >
                        Start Your First Drawing!
                      </Link>
                    </div>
                  </div>
                </Card>
              </div>
            )}
          </div>
          <CardContainer />
          <FeaturedLikes />
        </section>
      )}
    </motion.div>
  );
}

export default HomePage;
