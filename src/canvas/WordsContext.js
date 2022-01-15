import { createContext, useState } from "react";

const WordsContext = createContext(null);

// look into difference between props and { children } here and below in return
export function WordsProvider(props) {
  const [adjectiveOne, setAdjectiveOne] = useState("");
  const [nounOne, setNounOne] = useState("");

  const [adjectiveTwo, setAdjectiveTwo] = useState("");
  const [nounTwo, setNounTwo] = useState("");

  const [adjectiveThree, setAdjectiveThree] = useState("");
  const [nounThree, setNounThree] = useState("");

  const [canPost, setCanPost] = useState(false);

  function getAdjectiveHandler(time) {
    fetch("https://random-word-form.herokuapp.com/random/adjective")
      .then((response) => response.json())
      .then((data) => {
        if (time === 60000) {
          setAdjectiveOne(data[0]);
        } else if (time === 180000) {
          setAdjectiveTwo(data[0]);
        } else if (time === 300000) {
          setAdjectiveThree(data[0]);
        }
      });
  }

  function getNounHandler(time) {
    fetch("https://random-word-form.herokuapp.com/random/noun")
      .then((response) => response.json())
      .then((data) => {
        if (time === 60000) {
          setNounOne(data[0]);
        } else if (time === 180000) {
          setNounTwo(data[0]);
        } else if (time === 300000) {
          setNounThree(data[0]);
        }
      });
  }

  function getPhrase(time) {
    if (time === 60000) {
          return `${adjectiveOne} ${nounOne}`;
        } else if (time === 180000) {
          return `${adjectiveTwo} ${nounTwo}`;
        } else if (time === 300000) {
          return `${adjectiveThree} ${nounThree}`;
        }
  }

  function makePostable() {
    setCanPost(true);
  }

  function resetPostable() {
    setCanPost(false);
  }

  const context = {
    postable: canPost,
    getAdjective: getAdjectiveHandler,
    getNoun: getNounHandler,
    getPhrase: getPhrase,
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
