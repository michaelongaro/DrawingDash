import { Link } from "react-router-dom";
import LogInButton from "../../oauth/LogInButton";
import LogOutButton from "../../oauth/LogOutButton";

import classes from "./MainNavigation.module.css";


function MainNavigation() {

  return (
    <header className={classes.header}>
      <div className={classes.logo}>
        <Link to="/">Drawing Dash</Link>
      </div>
      <nav>
        <ul>
          <li>
            {/* <div className={classes.rainbow}> */}
            <Link to="/daily-doodle">Daily Doodle</Link>
            {/* </div> */}
          </li>
          <li>
            <Link to="/explore">Explore</Link>
          </li>
          <li>
            <Link to="/profile/preferences">Profile</Link>
          </li>
          <li className={classes.signinout}>
            <LogInButton />
            <LogOutButton />
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default MainNavigation;
