import { useState, useEffect } from "react";

import CardContainer from "../components/layout/CardContainer";
import FeaturedLikes from "../components/layout/FeaturedLikes";
import FocalAnimatedDrawings from "../components/layout/FocalAnimatedDrawings";
import Card from "../ui/Card";
import LogInButton from "../oauth/LogInButton";

import { useAuth0 } from "@auth0/auth0-react";

import classes from "./HomePage.module.css";

function HomePage() {
  const { isLoading, isAuthenticated } = useAuth0();

  const [showToUnregisteredUser, setShowToUnregisteredUser] = useState("");

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      console.log("should be getting rid of shit");
      setShowToUnregisteredUser(classes.hide);
    }
  }, [isLoading, isAuthenticated]);

  return (
    <section>
      <div
        style={{
          gap: "2em",
        }}
        className={classes.flexContain}
      >
        <FocalAnimatedDrawings
          forHomepage={showToUnregisteredUser === "" ? true : false}
          forSearch={false}
        />

        <div className={showToUnregisteredUser}>
          <Card>
            <div
              style={{
                gap: ".5em",
                height: "20em"
              }}
              className={classes.flexContainColumn}
            >
              <div className={classes.flexContainColumn}>
                <LogInButton forceShow={true} />
                <LogInButton forceShow={false} />
              </div>

              <div className={classes.fadingOrContainer}>
                <div className={classes.leadingLine}></div>
                <div className={classes.or}>OR</div>
                <div className={classes.trailingLine}></div></div>
              <button>Start Your First Drawing!</button>
            </div>
          </Card>
        </div>
      </div>
      <CardContainer />

      <FeaturedLikes />
    </section>
  );
}

export default HomePage;
