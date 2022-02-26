import MainNavigation from "./MainNavigation";
import classes from "./Layout.module.css";
import { useContext, useEffect } from "react";

import { useAuth0 } from "@auth0/auth0-react";
import FavoritesContext from "./FavoritesContext";

function Layout(props) {
  // const { user } = useAuth0();
  // const favCtx = useContext(FavoritesContext);

  // useEffect(() => {
  //   if (user.sub) {
  //     favCtx.setClientID(user.sub);
  //   }
  // }, [user.sub]);

  return (
    <div>
      <MainNavigation />
      <main className={classes.main}>{props.children}</main>
    </div>
  );
}

export default Layout;
