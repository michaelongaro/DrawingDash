import { useAuth0 } from "@auth0/auth0-react";

import classes from "./LogInButton.module.css";

function LogInButton(props) {
  const { loginWithRedirect, isAuthenticated } = useAuth0();

  return (
    (!isAuthenticated || props.forceShow) && (
      <button
        className={`${props.forceShow ? classes.signUp : classes.logIn}`}
        onClick={() => {
          loginWithRedirect();
        }}
      >
        {props.forceShow ? "Sign Up" : "Log In"}
      </button>
    )
  );
}

export default LogInButton;
