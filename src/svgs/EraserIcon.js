import * as React from "react"

const EraserIcon = (props) => (
  <svg viewBox="0 0 185 170" xmlns="http://www.w3.org/2000/svg" width="4em" {...props}>
    <title>{"my vector image"}</title>
    <rect className="selected" width="0" height="100%" fill="#fff" />
    <g className="currentLayer">
      <title>{"Layer 1"}</title>
      <path
        d="m75.835 168.12 10.147-37.733 97.338-116.68-12.025 39.029-95.46 115.38zM85.78 130.55S8.984 115.633 8.735 115.368c.25.265-7.485 35.624-7.735 35.359.25.265 74.283 16.287 74.033 16.022.25.265 10.747-36.199 10.747-36.199zM8.985 115.08 108.183 1l73.48 12.155-96.684 117.13-75.993-15.204z"
        color="#000"
        fill="#ecabec"
        stroke="#222"
        strokeLinejoin="round"
        strokeWidth={2}
      />
    </g>
  </svg>
)

export default EraserIcon
