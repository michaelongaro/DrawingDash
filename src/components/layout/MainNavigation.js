import React, { useState } from "react";

import { Link, NavLink } from "react-router-dom";
import LogInButton from "../../oauth/LogInButton";
import LogOutButton from "../../oauth/LogOutButton";

import EaselIcon from "../../svgs/EaselIcon";

import classes from "./MainNavigation.module.css";

function MainNavigation() {

  const [onDailyDraw, setOnDailyDraw] = useState(false);
  const [onExplore, setOnExplore] = useState(false);

  // for hover styles
  const [dailyDrawActive, setDailyDrawActive] = useState(false);
  const [exploreActive, setExploreActive] = useState(false);

  return (
    <header className={classes.header}>
      <div className={classes.logo}>
        <Link to="/">Drawing Dash</Link>
      </div>
      <nav>
        <ul>
          <li>
            {/* might need to switch over to NavLink if you want
                to maybe have a line or something under the div when 
                you are on that page */}
            <NavLink className={classes.dailyDrawButton} to="/daily-doodle"

                isActive={(match) => {
                  if (match) {
                    setOnDailyDraw(true);
                    setDailyDrawActive(false);
                  }
                  else {
                    setOnDailyDraw(false);
                    setDailyDrawActive(false);
                  }
                }}
            
            
                onMouseEnter={() => {
                  if (!onDailyDraw) setDailyDrawActive(true);
                }}

                onMouseLeave={() => {
                  if (!onDailyDraw && dailyDrawActive) setDailyDrawActive(false);
                }}
            >
              <div
                style={{
                  width: dailyDrawActive ? "80%" : "85%",
                  height: dailyDrawActive ? "80%" : "85%",
                }}

                className={classes.drawButtonBackground}
              >
                <EaselIcon dimensions={"1em"} />
                <div style={{fontSize: "1.25em"}}>Daily Drawings</div>
              </div>
            </NavLink>
            {/* </div> */}
          </li>
          <li>
            <NavLink to="/explore">Explore</NavLink>
          </li>
          <li>
            <NavLink to="/profile/preferences">Profile</NavLink>
          </li>
          <li className={classes.signinout}>
            <LogInButton forceShow={false} />
            <LogOutButton />
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default MainNavigation;
