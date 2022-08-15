import React from "react";

const HeartFilledIcon = ({ dimensions }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      width={dimensions}
      height={dimensions}
      x="0"
      y="0"
      viewBox="0 0 512 512"
      style={{ enableBackground: "new 0 0 512 512" }}
      // hmmm so if we keep the onMouseEnter/onTouchStart over in these svg components
      // will have to start the broken heart and this one here at the larger size right?
      // think abouuut it :3
    >
      <g>
        <link type="text/css" rel="stylesheet" id="dark-mode-custom-link" />
        <link type="text/css" rel="stylesheet" id="dark-mode-general-link" />
        <style lang="en" type="text/css" id="dark-mode-custom-style" />
        <style lang="en" type="text/css" id="dark-mode-native-style" />
        <path
          xmlns="http://www.w3.org/2000/svg"
          d="m471.382812 44.578125c-26.503906-28.746094-62.871093-44.578125-102.410156-44.578125-29.554687 0-56.621094 9.34375-80.449218 27.769531-12.023438 9.300781-22.917969 20.679688-32.523438 33.960938-9.601562-13.277344-20.5-24.660157-32.527344-33.960938-23.824218-18.425781-50.890625-27.769531-80.445312-27.769531-39.539063 0-75.910156 15.832031-102.414063 44.578125-26.1875 28.410156-40.613281 67.222656-40.613281 109.292969 0 43.300781 16.136719 82.9375 50.78125 124.742187 30.992188 37.394531 75.535156 75.355469 127.117188 119.3125 17.613281 15.011719 37.578124 32.027344 58.308593 50.152344 5.476563 4.796875 12.503907 7.4375 19.792969 7.4375 7.285156 0 14.316406-2.640625 19.785156-7.429687 20.730469-18.128907 40.707032-35.152344 58.328125-50.171876 51.574219-43.949218 96.117188-81.90625 127.109375-119.304687 34.644532-41.800781 50.777344-81.4375 50.777344-124.742187 0-42.066407-14.425781-80.878907-40.617188-109.289063zm0 0"
          fill="#f74242"
          data-original="#000000"
        />
      </g>
    </svg>
  );
};

export default HeartFilledIcon;
