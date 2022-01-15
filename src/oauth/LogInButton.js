import { useAuth0 } from "@auth0/auth0-react";

function LogInButton() {
  const { loginWithRedirect, isAuthenticated } = useAuth0();

  return (
    !isAuthenticated && (
      <a
        href=""
        onClick={() => {
          loginWithRedirect();
        }}
      >
        Log In
      </a>
    )
  );
}

export default LogInButton;
