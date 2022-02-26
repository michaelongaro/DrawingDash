import ProfileNavigation from "./ProfileNavigation";
import classes from "./ProfileLayout.module.css";

function ProfileLayout(props) {
  console.log("profile reloaded");
  return (
    <div className={classes.horizontalContain}>
      <ProfileNavigation />
      <main>{props.children}</main>
    </div>
  );  
}

export default ProfileLayout;