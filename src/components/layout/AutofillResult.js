import React from 'react'

import classes from "./AutofillResult.module.css";

const AutofillResult = (props) => {
  return (
    <div className={classes.autofillResult}>
      {props.word}
    </div>
  )
}

export default AutofillResult
