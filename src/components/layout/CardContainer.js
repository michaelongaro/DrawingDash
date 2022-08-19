import DailyIcon from "../../svgs/DailyIcon";
import LinkIcon from "../../svgs/LinkIcon";
import OptionsIcon from "../../svgs/OptionsIcon";

import classes from "./CardContainer.module.css";

function CardContainer() {
  return (
    <div className={classes.container}>
      <div className={classes.card}>
        <div
          style={{ backgroundColor: "#90ee90" }}
          className={classes.iconContain}
        >
          <OptionsIcon />
        </div>
        <div style={{ height: "5em", textAlign: "center" }}>
          Choose from 3+ unique prompts
        </div>
      </div>

      <div className={classes.card}>
        <div
          style={{ backgroundColor: "#e0ee90" }}
          className={classes.iconContain}
        >
          <DailyIcon />
        </div>
        <div style={{ height: "5em", textAlign: "center" }}>
          New prompts refresh every day
        </div>
      </div>
      <div className={classes.card}>
        <div
          style={{ backgroundColor: "#ee9090" }}
          className={classes.iconContain}
        >
          <LinkIcon />
        </div>
        <div style={{ height: "5em", textAlign: "center" }}>
          Instantly share your drawings
        </div>
      </div>
    </div>
  );
}

export default CardContainer;
