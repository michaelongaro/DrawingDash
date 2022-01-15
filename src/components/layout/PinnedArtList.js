import React from 'react'

import PinnedArt from './PinnedArt';

import classes from "./GallaryList.module.css";

const PinnedArtList = (props) => {

  if (props.drawings.length === 0) {
    return <div>No Results</div>;
  } else {
    return (
      <div className={classes.listContain}>
        {props.drawings.map((drawing, i) => (
          <PinnedArt
            key={drawing.index}
            index={drawing.index}
            counter={i}
            seconds={drawing.seconds}
            image={drawing.image}
            date={drawing.date}
            title={drawing.title}
          />
        ))}
      </div>
    );
  }
}

export default React.memo(PinnedArtList);
