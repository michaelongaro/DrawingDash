import { createContext, useState } from "react";
import { nouns } from "../util/nouns";
import { adjectives } from "../util/adjectives";

const WordsContext = createContext(null);

// look into difference between props and { children } here and below in return
export function WordsProvider(props) {
  // should be in an array
  const [adjectiveOne, setAdjectiveOne] = useState("");
  const [nounOne, setNounOne] = useState("");

  const [adjectiveTwo, setAdjectiveTwo] = useState("");
  const [nounTwo, setNounTwo] = useState("");

  const [adjectiveThree, setAdjectiveThree] = useState("");
  const [nounThree, setNounThree] = useState("");

  const [canPost, setCanPost] = useState(false);

  // const [fetchNewWords, setFetchNewWords] = useState(true);


  function searchRandom(count, arr) {
    let answer = [],
      counter = 0;

    while (counter < count) {
      let rand = arr[Math.floor(Math.random() * arr.length)];
      if (!answer.some((an) => an === rand)) {
        answer.push(rand);
        counter++;
      }
    }

    return answer;
  }

  function startDailyCountdown() {

  }

  function getAdjectiveHandler(time) {
    // fetch("https://random-word-form.herokuapp.com/random/adjective")
    //   .then((response) => response.json())
    //   .then((data) => {
    //     if (time === 60) {
    //       setAdjectiveOne(data[0]);
    //     } else if (time === 180) {
    //       setAdjectiveTwo(data[0]);
    //     } else if (time === 300) {
    //       setAdjectiveThree(data[0]);
    //     }
    //   });

    // make sure index is unique across all 3
    let randomAdjectives = searchRandom(3, adjectives);

    if (time === 60) {
      setAdjectiveOne(randomAdjectives[0]);
    } else if (time === 180) {
      setAdjectiveTwo(randomAdjectives[1]);
    } else if (time === 300) {
      setAdjectiveThree(randomAdjectives[2]);
    }
  }

  function getNounHandler(time) {
    // fetch("https://random-word-form.herokuapp.com/random/noun")
    //   .then((response) => response.json())
    //   .then((data) => {
    //     if (time === 60) {
    //       setNounOne(data[0]);
    //     } else if (time === 180) {
    //       setNounTwo(data[0]);
    //     } else if (time === 300) {
    //       setNounThree(data[0]);
    //     }
    //   });

    let randomNouns = searchRandom(3, nouns);

    if (time === 60) {
      setNounOne(randomNouns[0]);
    } else if (time === 180) {
      setNounTwo(randomNouns[1]);
    } else if (time === 300) {
      setNounThree(randomNouns[2]);
    }
  }

  function getPhrase(time) {
    if (time === 60) {
      return `${adjectiveOne} ${nounOne}`;
    } else if (time === 180) {
      return `${adjectiveTwo} ${nounTwo}`;
    } else if (time === 300) {
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
    // fetchNewWords: fetchNewWords,
    // setFetchNewWords: setFetchNewWords,
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
