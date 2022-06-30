import React, { useState, useEffect, useContext} from 'react'
import SearchContext from './SearchContext'

const PageSelectorButton = ({ index }) => {
  const searchCtx = useContext(SearchContext);
  const totalPages = Math.floor(searchCtx.totalDrawings + 6 - 1) / 6

  return (
    {}
  )
}

export default PageSelectorButton