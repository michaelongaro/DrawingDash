import { createContext, useState } from "react";

const WordsContext = createContext(null);

// look into difference between props and { children } here and below in return
export function WordsProvider(props) {
  const [adjective, setAdjective] = useState("");
  const [noun, setNoun] = useState("");

  const [canPost, setCanPost] = useState(false);
 
  function getAdjectiveHandler() {
    fetch("https://random-word-form.herokuapp.com/random/adjective")
      .then((response) => response.json())
      .then((data) => {
        setAdjective(data[0]);
      });
  }

  function getNounHandler() {
    fetch("https://random-word-form.herokuapp.com/random/noun")
      .then((response) => response.json())
      .then((data) => {
        setNoun(data[0]);
      });
  }

  function makePostable() {
    setCanPost(true);
  }

  function resetPostable() {
    setCanPost(false);
  }

  const context = {
    adj: adjective,
    n: noun,
    postable: canPost,
    getAdjective: getAdjectiveHandler,
    getNoun: getNounHandler,
    makePostable: makePostable,
    resetPostable: resetPostable,
  };

  return (
    <WordsContext.Provider value={context}>
      {props.children}
    </WordsContext.Provider>
  );
}

export default WordsContext;
