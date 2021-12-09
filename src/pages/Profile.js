import Preferences from "../components/layout/Preferences";
import Gallary from "../components/layout/Gallary";

const Profile = () => {
  // <img src={user.picture} alt={user.name} use this instead of "log out" in top right, include a dropdown

  return (
    <>
      <Preferences />
      <Gallary />
    </>
  );
};

export default Profile;
