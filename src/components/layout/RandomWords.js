import classes from "./RandomWords.module.css";

const RandomWords = () => {
  // have a scrolling animation where it looks like it is "choosing" a word
  // maybe even slow down like it does in csgo boxes
    let words;
    fetch(
      "https://random-word-api.herokuapp.com/word?number=2"
    )
      .then((response) => response.json())
      .then((data) => (words = data.join(" ")))
      .then(() => console.log(words));


  return <h3 className={classes.title}>{words}</h3>;
};

export default RandomWords;
