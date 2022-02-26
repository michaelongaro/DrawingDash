import { useAuth0 } from '@auth0/auth0-react';

const LogoutButton = () => {
  const { logout, isAuthenticated } = useAuth0();

  return (
    isAuthenticated && (
      // need to make this work later
      <button onClick={() => logout({
          returnTo: window.location.origin
          })}>
        Log Out
      </button>
    )
  )
}

export default LogoutButton