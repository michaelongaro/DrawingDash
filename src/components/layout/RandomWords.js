import { useEffect } from "react";

import classes from "./RandomWords.module.css";

const RandomWords = () => {
  // have a scrolling animation where it looks like it is "choosing" a word
  // maybe even slow down like it does in csgo boxes
  // const [showPhrase, setShowPhrase] = useState(false);

  let adjective, word;

  // useEffect(() => {
      
  // }, [adjective]);

  // useEffect(() => {

  // }, [word]);
  fetch("https://random-word-form.herokuapp.com/random/adjective")
    .then((response) => response.json())
    .then((data) => (adjective = data[0]));
  // .then(() => console.log(adjective));

  fetch("https://random-word-form.herokuapp.com/random/noun")
    .then((response) => response.json())
    .then((data) => (word = data[0]));
  // .then(() => console.log(word));

  if (adjective === "" || word === "") {
    return <div>loading...</div>
  }

  return (
    <span className={classes.title}>
      {adjective} {word}
    </span>
  );
};

export default RandomWords;
