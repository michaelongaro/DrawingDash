import React from "react";

const RedoIcon = ({ dimensions, color="#FFFFFF" }) => {
  return (
    <svg
      width={dimensions}
      height={dimensions}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g id="line">
        <path style={{fill: color }} d="m18.15 15.335a7.0087 7.0087 0 1 1 -1.2666-8.335h-2.8834a1 1 0 0 0 0 2h5c.0141 0 .0258-.0074.04-.008l.0089-.0018a.9948.9948 0 0 0 .9511-.9902v-5a1 1 0 0 0 -2 0v2.3259a8.9835 8.9835 0 1 0 1.91 10.9592 1 1 0 0 0 -1.76-.9501z" />
      </g>
    </svg>
  );
};

export default RedoIcon;
