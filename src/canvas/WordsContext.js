import { createContext, useState } from "react";

const WordsContext = createContext(null);

// look into difference between props and { children } here and below in return
export function WordsProvider(props) {
  const [adjective, setAdjective] = useState("default");
  const [noun, setNoun] = useState("default");

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


  const context = {
    adj: adjective,
    n: noun,
    getAdjective: getAdjectiveHandler,
    getNoun: getNounHandler,
  };

  return (
    <WordsContext.Provider value={context}>
      {props.children}
    </WordsContext.Provider>
  );
}

export default WordsContext;
