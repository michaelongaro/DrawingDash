import { useAuth0 } from '@auth0/auth0-react';

const LogoutButton = () => {
  const { logout, isAuthenticated } = useAuth0();

  return (
    isAuthenticated && (
      <a href="" onClick={() => logout()}>
        Log Out
      </a>
    )
  )
}

export default LogoutButton