import { useAuth0 } from '@auth0/auth0-react';

const LogoutButton = () => {
  const { logout, isAuthenticated } = useAuth0();

  return (
    isAuthenticated && (
      // need to make this work later
      <a href="" onClick={() => logout({
          returnTo: "https://localhost:3000"
          })}>
        Log Out
      </a>
    )
  )
}

export default LogoutButton