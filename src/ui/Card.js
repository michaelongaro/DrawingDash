import classes from "./Card.module.css";

function Card(props) {
  return (
    <div
      className={classes.card}
      style={{ width: `${props.width}%`, margin: `${props.margin}`, borderRadius: "1em" }}
    >
      {props.children}
    </div>
  );
}

export default Card;
