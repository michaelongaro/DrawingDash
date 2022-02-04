import React, { useEffect } from "react";
import { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import GallaryList from "./GallaryList";
import Search from "./Search";
import SearchContext from "./SearchContext";

const Gallary = () => {
  const [loadedDrawings, setLoadedDrawings] = useState([]);
  //const memoDrawings = React.useMemo(() => [loadedDrawings, setLoadedDrawings], [loadedDrawings])

  const { user } = useAuth0();

  //console.log("we fetched something");
  useEffect(() => {
    fetch(
      `https://drawing-dash-41f14-default-rtdb.firebaseio.com/${user.sub}.json`
    )
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        const drawings = [];
        for (const key in data) {
          if (Object.keys(data[key]).length > 1) {
            const drawing = {
              id: key,
              ...data[key],
            };
            drawings.push(drawing);
          }
        }

        setLoadedDrawings(drawings);

        // why is this perma rerendering
      });
  }, []);

  return (
    <div>
      <h1>My Gallary </h1>
      <Search forProfile={true}/>

      <SearchContext.Consumer>
        {(value) => <GallaryList drawings={value.gallary} />}
      </SearchContext.Consumer>
    </div>
  );
};

export default Gallary;
