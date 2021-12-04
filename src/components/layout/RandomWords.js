import { useState, useContext } from "react";

import { WordsContext } from "../../canvas/WordsContext";

import classes from "./RandomWords.module.css";

const RandomWords = (props) => {
  // have a scrolling animation where it looks like it is "choosing" a word
  // maybe even slow down like it does in csgo boxes
  const { adjective, noun } = useContext(WordsContext);
  
  const [canReRender, setCanReRender] = useState(true);

  if (canReRender) {
    fetch("https://random-word-form.herokuapp.com/random/adjective")
      .then((response) => response.json())
      .then((data) => {
        adjective.setAdjective(data[0])
        setCanReRender(false);
      });

    fetch("https://random-word-form.herokuapp.com/random/noun")
      .then((response) => response.json())
      .then((data) => { 
        noun.setNoun(data[0])
        setCanReRender(false);
      });
  }


  return (
    <h3 className={classes.title}>
        {props.adj} {props.n}
      </h3>
  );
};

export default RandomWords;
