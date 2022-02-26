import { createContext, useState } from "react";

const PinnedContext = createContext(null);

export function PinnedProvider(props) {

  // should make these into one object with properties of 60, 180, 300

  const [drawings60, setDrawings60] = useState([]);
  const [drawings180, setDrawings180] = useState([]);
  const [drawings300, setDrawings300] = useState([]);

  const [index60, setIndex60] = useState(0);
  const [index180, setIndex180] = useState(0);
  const [index300, setIndex300] = useState(0);

  const context = {
    drawings60: drawings60,
    drawings180: drawings180,
    drawings300: drawings300,
    setDrawings60: setDrawings60,
    setDrawings180: setDrawings180,
    setDrawings300: setDrawings300,
    index60: index60,
    index180: index180,
    index300: index300,
    setIndex60: setIndex60,
    setIndex180: setIndex180,
    setIndex300: setIndex300,
  };

  return (
    <PinnedContext.Provider value={context}>
      {props.children}
    </PinnedContext.Provider>
  );
}

export default PinnedContext;
