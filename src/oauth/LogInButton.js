import { useAuth0 } from "@auth0/auth0-react";

import baseClasses from "../index.module.css";

function LogInButton({ forceShowSignUp }) {
  const { loginWithRedirect, isAuthenticated } = useAuth0();

  return (
    (!isAuthenticated || forceShowSignUp) && (
      <button
        style={{
          width: "7.5em",
          height: "3em",

          backgroundImage: forceShowSignUp
            ? "linear-gradient(-180deg, #ff7e31, #ff2600)"
            : "none",
          backgroundColor: !forceShowSignUp ? "hsl(22deg 100% 60%)" : "",
        }}
        className={baseClasses.activeButton}
        onClick={() => {
          loginWithRedirect();
        }}
      >
        {forceShowSignUp ? "Sign Up" : "Log In"}
      </button>
    )
  );
}

export default LogInButton;
