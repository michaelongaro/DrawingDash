import classes from "./CardContainer.module.css";
import Description from "./Description";

// will have to make like a Description group or something like that to be able to
// FULLY abstract this code, only putting in a ref to <DescriptionGroup /> in HomePage.js

function CardContainer() {
  return (
      <div className={classes.container}>
        <Description title="First" description="stuff"/>
        <Description title="Second" description="stuff"/>
        <Description title="Third" description="stuff"/>
      </div>
  );
}

export default CardContainer;