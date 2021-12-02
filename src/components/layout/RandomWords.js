import { useState } from "react";

import classes from "./RandomWords.module.css";

const RandomWords = () => {
  // have a scrolling animation where it looks like it is "choosing" a word
  // maybe even slow down like it does in csgo boxes

  const [adjective, setAdjective] = useState("");
  const [noun, setNoun] = useState("");
  const [canReRender, setCanReRender] = useState(true);

  if (canReRender) {
    fetch("https://random-word-form.herokuapp.com/random/adjective")
      .then((response) => response.json())
      .then((data) => {
        setAdjective(data[0])
        setCanReRender(false);
      });

    fetch("https://random-word-form.herokuapp.com/random/noun")
      .then((response) => response.json())
      .then((data) => { 
        setNoun(data[0])
        setCanReRender(false);
      });
  }

  return (
    <h3 className={classes.title}>
      {adjective} {noun}
    </h3>
  );
};

export default RandomWords;
