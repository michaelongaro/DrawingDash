import { useAuth0 } from "@auth0/auth0-react";

function LogInButton(props) {
  const { loginWithRedirect, isAuthenticated } = useAuth0();

  return (
    (!isAuthenticated || props.forceShow) && (
      <button
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
