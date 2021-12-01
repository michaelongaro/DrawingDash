import React from 'react'
import { useCanvas } from '../../canvas/CanvasContext'

export const UploadButton = () => {
  const { UploadButton } = useCanvas()

  return <button onClick={UploadButton}>Upload</button>
}