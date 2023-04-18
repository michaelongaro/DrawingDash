import React from "react";

const EaselIcon = ({ dimensions }) => {
  return (
    <svg
      width={dimensions}
      height={dimensions}
      viewBox="-75 0 511 511.99844"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        filter: "drop-shadow(1px 2px 3px hsl(0deg 0% 0% / 40%))",
      }}
    >
      <path
        style={{ fill: "#fff" }}
        d="m341.171875 349.390625h-1.398437v-133.15625c0-4.144531-3.355469-7.5-7.5-7.5-4.144532 0-7.5 3.355469-7.5 7.5v133.15625h-293.660157v-271.71875c0-.476563.390625-.867187.867188-.867187h50.964843v3.554687c0 7.210937 5.863282 13.074219 13.074219 13.074219h163.847657c7.210937 0 13.074218-5.863282 13.074218-13.074219v-3.554687h50.964844c.476562 0 .867188.390624.867188.867187v5.570313c0 4.144531 3.355468 7.5 7.5 7.5 4.140624 0 7.5-3.355469 7.5-7.5v-5.570313c0-8.75-7.117188-15.867187-15.867188-15.867187h-50.964844v-3.550782c0-7.210937-5.863281-13.078125-13.074218-13.078125h-20.769532l-4.414062-24.203125c-2.320313-13.691406-15.347656-22.933594-29.039063-20.613281-6.632812 1.125-12.429687 4.765625-16.320312 10.25-3.894531 5.484375-5.417969 12.160156-4.277344 18.878906l2.859375 15.6875h-19.925781l2.875-15.777343c2.324219-13.6875-6.921875-26.71875-20.613281-29.039063-13.695313-2.324219-26.71875 6.921875-29.023438 20.523437l-4.429688 24.292969h-20.769531c-7.210937 0-13.074219 5.867188-13.074219 13.078125v3.550782h-50.964843c-8.75 0-15.867188 7.117187-15.867188 15.867187v271.71875h-1.394531c-7.839844 0-14.21875 6.378906-14.21875 14.21875v19.820313c0 7.839843 6.378906 14.21875 14.21875 14.21875h37.804688l-15.488282 84.945312c-1.125 6.632812.398438 13.308594 4.292969 18.792969s9.691406 9.125 16.320313 10.25c1.421874.242187 2.835937.359375 4.230468.359375 12.046875 0 22.730469-8.695313 24.796875-20.882813l17.042969-93.464843h49.042969v54.199218c0 13.886719 11.296875 25.183594 25.183593 25.183594 13.886719 0 25.183594-11.296875 25.183594-25.183594v-54.199218h49.042969l17.023437 93.375c1.125 6.632812 4.769532 12.429687 10.253907 16.320312 4.308593 3.058594 9.34375 4.65625 14.519531 4.65625 1.417969 0 2.84375-.121094 4.269531-.363281 6.632813-1.125 12.429688-4.765625 16.320313-10.25 3.894531-5.488281 5.417968-12.160157 4.273437-18.882813l-15.46875-84.855468h37.808594c7.839844 0 14.214844-6.378907 14.214844-14.21875v-19.820313c0-7.839844-6.375-14.21875-14.214844-14.21875zm-141.351563-322.503906c-.941406-5.535157 2.796876-10.800781 8.332032-11.742188 5.535156-.9375 10.804687 2.804688 11.761718 8.425781l3.9375 21.605469h-20.699218zm-63.832031-3.40625c.941407-5.53125 6.210938-9.273438 11.742188-8.335938 5.539062.941407 9.277343 6.210938 8.355469 11.652344l-3.351563 18.378906h-20.699219zm-38.042969 36.695312h159.996094v18.257813h-159.996094zm-26.042968 428.339844c-.9375 5.535156-6.207032 9.28125-11.742188 8.332031-2.679687-.453125-5.023437-1.925781-6.601562-4.144531-1.574219-2.21875-2.1875-4.914063-1.75-7.507813l15.960937-87.546874h20.699219zm116.222656-36.667969c0 5.613282-4.566406 10.183594-10.179688 10.183594-5.617187 0-10.183593-4.570312-10.183593-10.183594v-54.199218h20.363281zm115.9375 33.257813c.453125 2.683593-.160156 5.378906-1.734375 7.597656-1.578125 2.21875-3.921875 3.691406-6.601563 4.144531-2.679687.453125-5.378906-.160156-7.597656-1.734375s-3.691406-3.917969-4.160156-6.6875l-16.550781-90.777343h20.699219zm36.324219-102.457031h-324.886719v-18.257813h324.886719zm0 0"
      />
      <path
        style={{ fill: "#fff" }}
        d="m396.042969 82.023438c-7.976563-7.972657-20.855469-8.386719-29.320313-.9375l-129.570312 113.984374c-2.742188 2.410157-5.269532 5.101563-7.507813 7.988282l-27.371093 35.304687c-7.464844.085938-18.429688 1.453125-28.371094 11.398438-12.445313 12.441406-15.449219 22.40625-18.097656 31.195312-3.0625 10.171875-5.710938 18.953125-23.414063 33.421875-3.25 2.65625-4.582031 6.972656-3.402344 11 1.183594 4.027344 4.640625 6.9375 8.808594 7.414063 3.664063.421875 8.5625.800781 14.316406.800781 20.414063 0 51.535157-4.78125 76.1875-29.433594 7.878907-7.878906 10.214844-18.753906 11.082031-28.125l35.621094-27.613281c2.886719-2.238281 5.574219-4.765625 7.988282-7.511719l113.984374-129.566406c7.449219-8.464844 7.039063-21.34375-.933593-29.320312zm-245.804688 236.5625c12.683594-12.328126 16.441407-22.007813 19.125-30.652344 3.457031 3.667968 8.074219 7.265625 14.289063 10.402344 4.75 2.398437 8.425781 6.203124 10.984375 11.347656-16.113281 7.546875-32.578125 9.09375-44.398438 8.902344zm67.457031-25.03125c-3.242187 3.246093-6.632812 6.078124-10.101562 8.558593-3.996094-7.59375-9.820312-13.449219-17.179688-17.167969-7.257812-3.664062-12.132812-8.292968-14.546874-13.777343 1.980468-3.320313 4.671874-6.828125 8.644531-10.796875 5.464843-5.46875 11.019531-6.765625 17.003906-6.96875 5.65625 9.40625 13.417969 17.214844 22.78125 22.925781-.609375 5.410156-2.128906 12.757813-6.601563 17.226563zm168.019532-192.117188-113.980469 129.566406c-1.789063 2.035156-3.78125 3.902344-5.917969 5.5625l-34.292968 26.582032c-6.734376-4.226563-12.375-9.871094-16.609376-16.605469l26.585938-34.292969c1.660156-2.140625 3.53125-4.128906 5.5625-5.917969l129.566406-113.984375c2.542969-2.234375 6.410156-2.109375 8.804688.28125 2.394531 2.394532 2.519531 6.265625.28125 8.808594zm0 0"
      />
    </svg>
  );
};

export default EaselIcon;
