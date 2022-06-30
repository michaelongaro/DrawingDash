import React, { useState, useEffect } from "react";

import baseClasses from "../index.module.css";

const Skeleton = ({ children, isFetching, borderRadius }) => {
  // this was the rough framework for how it was going to work, doesn't seem to be the move

  // const [showTempBaselineSkeleton, setShowTempBaselineSkeleton] =
  //   useState(true);

  // useEffect(() => {
  //   const timerID = setTimeout(() => setShowTempBaselineSkeleton(false), 100000);

  //   return () => {
  //     clearTimeout(timerID);
  //   };
  // }, []);
 
          // <Skeleton
          //   isFetching={showTempBaselineSkeleton || isFetching}
          //   borderRadius={"1em 1em 0 0"}
          // >
          //   {!showTempBaselineSkeleton && !isFetching && (
          // </Skeleton>
// 
  return (
    <>
      {isFetching ? (
        <div
          style={{ borderRadius: borderRadius }}
          className={baseClasses.skeletonLoading}
        ></div>
      ) : (
        <>{children}</>
      )}
    </>
  );
};

export default Skeleton;
