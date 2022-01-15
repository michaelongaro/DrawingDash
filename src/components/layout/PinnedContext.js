import { createContext, useState } from "react";

const PinnedContext = createContext(null);

// there is no issue with storing each 60/180/300s array with all respective drawings
// inside of a context variable (they are already being loaded) -> you can go through with

// PinnedArtwork should have three calls to modal comp. and have event listeners onclick
// to change the style (let them pop up {look how to style this properly online})

// have a modal component that has the title and fetches correct timer drawings
// and calls gallarylist with those results (make sure to add a special array value, inc.
// each iteration -> used to reference correct drawing in array stored in context) and store
// array inside of context

// then have PinnedArt (AHHHH actually maybe just make PinnedArt a copy of gallaryitem that
// doesn't have the likes button) have a useeffect to create/destroy an eventlistener onclick 
// to change the current{Seconds}PinnedArtwork state in context to the value of correct 
// array with the index passed into PinnedArt. that SHOULD change the artwork.

export function PinnedProvider(props) {
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
