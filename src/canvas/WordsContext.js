import { createContext, useState } from "react";

export const WordsContext = createContext(null)

export function WordsProvider({ children }) {

  const [adjective, setAdjective] = useState("");
  const [noun, setNoun] = useState("");

  const sharedWords = {
    adjective: [adjective, setAdjective],
    noun: [noun, setNoun],
  }

  return (
    <WordsContext.Provider value={adjective}>
      {children}
    </WordsContext.Provider>
  );
}