import classes from "./AsideContent.module.css";

function AsideContent() {
  return (
      <div className={classes.right}>
        <h1>Welcome to Drawing Dash</h1>
        <h3>drawing challenges updated daily</h3>
        <button className={classes.btn}>Get Started</button> 
      </div>
  );
}

export default AsideContent;