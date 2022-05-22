import DailyIcon from "../../svgs/DailyIcon";
import LinkIcon from "../../svgs/LinkIcon";
import OptionsIcon from "../../svgs/OptionsIcon";
import classes from "./CardContainer.module.css";
import Description from "./Description";

// will have to make like a Description group or something like that to be able to
// FULLY abstract this code, only putting in a ref to <DescriptionGroup /> in HomePage.js

function CardContainer() {
  return (
    <div className={classes.container}>
      {/* HELLLL no just keep it in here lmfaoooo?!??!? */}
      <div className={classes.card}>
        <div
          style={{ backgroundColor: "#90ee90" }}
          className={classes.iconContain}
        >
          <OptionsIcon />
        </div>
        <div style={{ height: "5em" }}>
          Choose from three unique drawing prompts
        </div>
      </div>

      <div className={classes.card}>
        <div
          style={{ backgroundColor: "#e0ee90" }}
          className={classes.iconContain}
        >
          <DailyIcon />
        </div>
        <div style={{ height: "5em" }}>New prompts refresh every day</div>
      </div>
      <div className={classes.card}>
        <div
          style={{ backgroundColor: "#ee9090" }}
          className={classes.iconContain}
        >
          <LinkIcon />
        </div>
        <div style={{ height: "5em" }}>
          Share your drawings with your friends
        </div>
      </div>

      {/* <Description title="First" description="Choose between three different drawing timers"/>
        <Description title="Second" description="New titles every day"/>
        <Description title="Third" description="Share your doodles with your friends"/> */}
    </div>
  );
}

export default CardContainer;
