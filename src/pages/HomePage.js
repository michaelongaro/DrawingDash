import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { motion } from "framer-motion";

import CardContainer from "../components/homepage/CardContainer";
import FeaturedLikes from "../components/homepage/FeaturedLikes";
import FocalAnimatedDrawings from "../components/animatedDrawings/FocalAnimatedDrawings";
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
                    <div
                      style={{ gap: ".5rem" }}
                      className={baseClasses.baseVertFlex}
                    >
                      <div style={{ textAlign: "center" }}>
                        “Art is the elimination of the unnecessary.”
                      </div>
                      <div>- Pablo Picasso</div>
                    </div>

                    <div
                      style={{ maxHeight: "8rem" }}
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
