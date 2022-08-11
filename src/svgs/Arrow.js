import React from "react";

const Arrow = ({ dimensions, color, direction }) => {
  return (
    <svg
      version="1.1"
      id="Capa_1"
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      viewBox="0 0 512 512"
      width={dimensions}
      height={dimensions}
      style={{
        enableBackground: "new 0 0 512 512",
        fill: color,
        transform: direction === "left" ? "rotateY(0deg)" : "rotateY(180deg)",
      }}
      // xml:space="preserve"
    >
      <g>
        <g>
          <path
            d="M490.667,45.729C490.667,20.521,470.01,0,444.615,0c-6.896,0-13.625,1.563-19.99,4.646l-0.031,0.021
			c-69.958,34.104-169.188,91.271-256.729,141.708c-45.729,26.354-88.917,51.229-121.74,69.229
			c-15.521,8.5-24.792,23.604-24.792,40.396s9.271,31.896,24.792,40.396c32.896,18.021,76.188,42.958,122.021,69.375
			c87.448,50.375,186.563,107.479,256.438,141.542c6.365,3.104,13.104,4.688,20.031,4.688c25.396,0,46.052-20.521,46.052-45.75
			l-0.021-210.271L490.667,45.729z"
          />
        </g>
      </g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
    </svg>
  );
};

export default Arrow;
