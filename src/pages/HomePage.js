import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { motion } from "framer-motion";

import CardContainer from "../components/layout/CardContainer";
import FeaturedLikes from "../components/layout/FeaturedLikes";
import FocalAnimatedDrawings from "../components/layout/FocalAnimatedDrawings";
import Card from "../ui/Card";
import LogInButton from "../oauth/LogInButton";

import classes from "./HomePage.module.css";
import baseClasses from "../index.module.css";

function HomePage() {
  const { isLoading, isAuthenticated } = useAuth0();

  const [showRegisterContainer, setShowRegisterContainer] = useState(false);
  const [showHomePage, setShowHomePage] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setShowRegisterContainer(true);
    }
  }, [isLoading, isAuthenticated]);

  useEffect(() => {
    const timerID = setTimeout(() => {
      setShowHomePage(true);
    }, 200);
    return () => {
      clearTimeout(timerID);
    };
  });

  return (
    <motion.div
      key={"home"}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {!isLoading && showHomePage && (
        <section>
          <div
            className={`${classes.focalAnimatedContainer} ${baseClasses.baseFlex}`}
          >
            <FocalAnimatedDrawings
              forHomepage={showRegisterContainer}
              forSearch={false}
            />

            {showRegisterContainer && (
              <div>
                <Card width={100}>
                  <div className={classes.firstTimePromo}>
                    <div className={classes.flexContainColumn}>
                      <LogInButton forceShowSignUp={true} />
                      <LogInButton forceShowSignUp={false} />
                    </div>

                    <div className={classes.fadingOrContainer}>
                      <div className={classes.leadingLine}></div>
                      <div className={classes.or}>OR</div>
                      <div className={classes.trailingLine}></div>
                    </div>
                    <div
                      className={`${baseClasses.animatedRainbow} ${classes.animatedRainbowMargin}`}
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
