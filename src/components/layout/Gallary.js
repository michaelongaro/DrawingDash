import React from "react";

import { useAuth0 } from "@auth0/auth0-react";

import Search from "./Search";

const Gallary = () => {

  const { user } = useAuth0();

  return (
    <div style={{width: "80%"}}>
      <h1>My Gallary</h1>
      <Search userProfile={user.sub}/>

    </div>
  );
};

export default Gallary;