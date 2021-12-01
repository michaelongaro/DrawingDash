import Card from "../../ui/Card";

import classes from "./Description.module.css";

// will have to make like a Description group or something like that to be able to
// FULLY abstract this code, only putting in a ref to <DescriptionGroup /> in HomePage.js

function Description(props) {
  return (
    <Card>
      <div className={classes.content}>
        <h3>{props.title}</h3>
        <p>{props.description}</p>
      </div>
    </Card>
  );
}

export default Description;
