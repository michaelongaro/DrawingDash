import React from "react";
import { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import GallaryList from "./GallaryList";


const Gallary = () => {
  const [loadedDrawings, setLoadedDrawings] = useState([]);

  const { user } = useAuth0();

  fetch(
    `https://drawing-app-18de5-default-rtdb.firebaseio.com/${user.sub}.json`
  )
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      const drawings = [];

      for (const drawing in data) {
        drawings.push(drawing);
      }

      setLoadedDrawings(drawings);
      // console.log(loadedDrawings);
      // why is this perma rerendering
    });
 
  return (
    <div>
      <h1>My Gallary </h1>
      <GallaryList drawings={loadedDrawings} />
    </div>
  );
};

export default Gallary;
