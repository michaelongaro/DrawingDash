import React, { createContext, useState } from "react";

const ProfilePictureUpdateContext = createContext(null);

export function ProfilePictureUpdateProvider(props) {
  const [refreshProfilePicture, setRefreshProfilePicture] = useState(false);

  const context = {
    refreshProfilePicture: refreshProfilePicture,
    setRefreshProfilePicture: setRefreshProfilePicture,
  };

  return (
    <ProfilePictureUpdateContext.Provider value={context}>
      {props.children}
    </ProfilePictureUpdateContext.Provider>
  );
}

export default ProfilePictureUpdateContext;
