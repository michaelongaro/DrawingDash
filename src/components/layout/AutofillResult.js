import React from 'react'

import classes from "./AutofillResult.module.css";

const AutofillResult = (props) => {
  console.log(`${props.word} result "shown"`);
  // will have to useEffect here and add eventlistener,
  // will need to i guess add the inputs into the context/maybe somehow use the refs?
  return (
    <div className={classes.autofillResult}>
      {props.word}
    </div>
  )
}

export default AutofillResult;
