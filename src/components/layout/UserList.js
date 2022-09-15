import React, { useState, useEffect, useContext } from "react";

import Card from "../../ui/Card";
import UserItem from "./UserItem";

import MagnifyingGlassIcon from "../../svgs/MagnifyingGlassIcon";

import classes from "./GallaryList.module.css";
import baseClasses from "../../index.module.css";

const UserList = ({
  userIDs = null,
  username = null,
  margin = null,
  databasePath = null,
  idx = null,
  forModal = null,
}) => {
  const [dynamicWidth, setDynamicWidth] = useState(0);
  const [showEmptyResults, setShowEmptyResults] = useState(false);

  useEffect(() => {
    if (userIDs) {
      if (userIDs.length === 0) {
        setShowEmptyResults(true);
      } else {
        // hiding empty results if currently being shown
        setShowEmptyResults(false);
      }
    }
  }, [userIDs, forModal]);

  useEffect(() => {
    // just for initial render
    if (window.innerWidth > 1250) {
      setDynamicWidth("90");
    }
    if (window.innerWidth > 750 && window.innerWidth <= 1250) {
      setDynamicWidth("85");
    } else {
      setDynamicWidth("90");
    }
    function resizeHandler() {
      if (window.innerWidth > 1250) {
        setDynamicWidth("90");
      }
      if (window.innerWidth > 750 && window.innerWidth <= 1250) {
        setDynamicWidth("85");
      } else {
        setDynamicWidth("90");
      }
    }

    window.addEventListener("resize", resizeHandler);
    return () => {
      window.removeEventListener("resize", resizeHandler);
    };
  }, []);

  return (
    <>
      {userIDs && (
        <div style={{ marginTop: "3em" }} className={classes.baseFlex}>
          <Card width={dynamicWidth} margin={margin}>
            <div
              style={{
                padding: "1em",
              }}
              className={classes.gridListContain}
            >
              {userIDs.map((userID, i) => (
                <UserItem key={i} userID={userID} />
              ))}
            </div>

            {showEmptyResults && (
              <div
                style={{
                  gap: "1em",
                  minHeight: "350px",
                }}
                className={baseClasses.baseVertFlex}
              >
                <MagnifyingGlassIcon dimensions={"4.5em"} color={"black"} />
                <div style={{ fontSize: "20px" }}>No users found for:</div>
                <div style={{ fontSize: "25px" }}>"{username}"</div>
              </div>
            )}
          </Card>
        </div>
      )}
    </>
  );
};

export default UserList;
