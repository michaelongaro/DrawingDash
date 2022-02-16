import { useState, useContext, useEffect } from "react";
import DrawingSelectionContext from "../../canvas/DrawingSelectionContext";

import WordsContext from "../../canvas/WordsContext";

import classes from "./RandomWords.module.css";

const RandomWords = (props) => {
  // have a scrolling animation where it looks like it is "choosing" a word
  // maybe even slow down like it does in csgo boxes

  const wordsCtx = useContext(WordsContext);
  const DSCtx = useContext(DrawingSelectionContext);

  // const [canReRender, setCanReRender] = useState(true);

  useEffect(() => {
    // change this later so it resets w/ firebase function every 24h
    if (DSCtx.fetchNewWords) {
      wordsCtx.getAdjective(props.time);
      wordsCtx.getNoun(props.time);
      DSCtx.setFetchNewWords(false);
      // wordsCtx.startDailyCountdown();
    }
  }, []);

  return (
    <span className={classes.title}>{wordsCtx.getPhrase(props.time)}</span>
  );
};

export default RandomWords;
