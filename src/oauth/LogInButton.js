import { useAuth0 } from "@auth0/auth0-react";

function LogInButton() {
  const { loginWithRedirect, isAuthenticated} = useAuth0();

  // 9000% sure that we don't need this, but keepin it just in case
  // useEffect(() => {
  //   if (isAuthenticated) {
  //     // maybe how to skip this first step and handle an error if /likes doesn't exist.
  //     fetch(
  //       `https://drawing-dash-41f14-default-rtdb.firebaseio.com/${user.sub}/.json`
  //     )
  //       .then((response) => {
  //         return response.json();
  //       })
  //       .then((data) => {
  //         // creates the "likes" directory in the db
  //         if (Object.keys(data).contains("likes")) {
  //           fetch(
  //             `https://drawing-dash-41f14-default-rtdb.firebaseio.com/${user.sub}/likes.json`
  //           )
  //             .then((response) => {
  //               return response.json();
  //             })
  //             .then((data) => {
  //               favoritesCtx.setFavoritesID(Object.keys(data)[0]);
  //               favoritesCtx.setUserFavorites(Object.values(data)[0]);
  //             });
  //         }
  //         // creates the "drawing_titles" directory in the db
  //         if (Object.keys(data).contains("drawing_titles")) {
  //           fetch(
  //             `https://drawing-dash-41f14-default-rtdb.firebaseio.com/${user.sub}/drawing_titles.json`
  //           )
  //             .then((response) => {
  //               return response.json();
  //             })
  //             .then((data) => {
  //               favoritesCtx.setFavoritesID(Object.keys(data)[0]);
  //               favoritesCtx.setUserFavorites(Object.values(data)[0]);
  //             });
  //         }
  //         // creates the "drawings" directory in the db
  //         if (Object.keys(data).contains("drawings")) {
  //           fetch(
  //             `https://drawing-dash-41f14-default-rtdb.firebaseio.com/${user.sub}/drawings.json`
  //           )
  //             .then((response) => {
  //               return response.json();
  //             })
  //             .then((data) => {
  //               favoritesCtx.setFavoritesID(Object.keys(data)[0]);
  //               favoritesCtx.setUserFavorites(Object.values(data)[0]);
  //             });
  //         }
  //       });
  //   }
  // }, [isAuthenticated]);

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
