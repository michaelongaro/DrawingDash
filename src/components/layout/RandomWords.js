import { useState, useContext } from "react";

import WordsContext from "../../canvas/WordsContext";

import classes from "./RandomWords.module.css";

const RandomWords = () => {
  // have a scrolling animation where it looks like it is "choosing" a word
  // maybe even slow down like it does in csgo boxes

  const wordsCtx = useContext(WordsContext);

  const [canReRender, setCanReRender] = useState(true);

  if (canReRender) {
    wordsCtx.getAdjective();
    setCanReRender(false);

    wordsCtx.getNoun();
    setCanReRender(false);
  }

  return (
    <h3 className={classes.title}>
      {wordsCtx.adj} {wordsCtx.n}
    </h3>
  );
};

export default RandomWords;
