import React from 'react'

import Card from './Card'

import classes from "./GallaryItem.module.css";

const GallaryItem = (props) => {
  return (
    <div className={classes.contain}>
      <Card>
        <img src={props.image} alt={props.title}/>
        <span>{props.title}</span>
        <button>💖</button>
      </Card>
    </div>
  )
}

export default GallaryItem
