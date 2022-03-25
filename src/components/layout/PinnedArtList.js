import React from 'react'

import PinnedArt from './PinnedArt';

import classes from "./GallaryList.module.css";

const PinnedArtList = (props) => {

  if (props.drawings.length === 0) {
    return <div className={classes.centerMiddle}>No Drawings Found</div>;
  } else {
    return (
      <div className={classes.listContain}>
        {props.drawings.map((drawing, i) => (
          <PinnedArt
            key={i}
            drawing={drawing}
            idx={i}
          />
        ))}
      </div>
    );
  }
}

export default React.memo(PinnedArtList);
