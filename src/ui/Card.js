import classes from "./Card.module.css";

function Card(props) {
  return (
    <div
      className={classes.card}
      style={{
        minWidth: `${props.width}%`,
        // maxWidth: `${props.width}%`,
        width: props?.fullWidth ? "100%" : "90%",
        // def need to think hard about how to get height to scale with width
        // height: props?.fullWidth ? `${(16 / 9) * 100}%` : "undefined",
        margin: `${props.margin}`,
        borderRadius: "1em",
      }}
    >
      {props.children}
    </div>
  );
}

export default Card;
