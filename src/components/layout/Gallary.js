import React from "react";

import GallaryList from "./GallaryList";
import Search from "./Search";
import SearchContext from "./SearchContext";

const Gallary = () => {

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