import { useState, useContext } from "react";

import WordsContext from "../../canvas/WordsContext";

import classes from "./RandomWords.module.css";

const RandomWords = (props) => {
  // have a scrolling animation where it looks like it is "choosing" a word
  // maybe even slow down like it does in csgo boxes

  const wordsCtx = useContext(WordsContext);

  const [canReRender, setCanReRender] = useState(true);

  if (canReRender) {
    wordsCtx.getAdjective(props.time);
    wordsCtx.getNoun(props.time);
    setCanReRender(false);
  }

  return (
    <h3 className={classes.title}>
      {wordsCtx.getPhrase(props.time)}
    </h3>
  );
};

export default RandomWords;
