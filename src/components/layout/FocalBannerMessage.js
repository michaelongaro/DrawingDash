import React, { useState, useEffect, useRef } from "react";

import anime from "animejs/lib/anime.es.js";

import { useAuth0 } from "@auth0/auth0-react";

import {
  getDatabase,
  ref,
  set,
  child,
  get,
  onValue,
  update,
} from "firebase/database";

import { app } from "../../util/init-firebase";

import classes from "./FocalBannerMessage.module.css";

const FocalBannerMessage = (props) => {
  const { user, isAuthenticated, isLoading } = useAuth0();

  const [numUsers, setNumUsers] = useState(0);
  const [numDrawings, setNumDrawings] = useState(0);
  const [numUserRemainingDrawings, setNumUserRemainingDrawings] = useState(0);

  const miscSettings = useRef(null);

  if (!props.forSearch) {
    if (props.forHomepage) {
      miscSettings.current = {
        baseHeight: 110,
        maxHeight: 280,
        titleWidth: "30em",
        titleHeight: "10em",
        title: "Drawing Dash",
      };
    } else {
      miscSettings.current = {
        baseHeight: 110,
        maxHeight: 280,
        titleWidth: "30em",
        titleHeight: "10em",
        title: "Drawing Dash",
      };
    }
  } else {
    miscSettings.current = {
      baseHeight: 75,
      maxHeight: 170,
      titleWidth: "30em",
      titleHeight: "10em",
      title: "Search",
    };
  }

  console.log(props.forHomepage, props.forSearch);

  const usersAnimationRef = useRef(null);
  const drawingsAnimationRef = useRef(null);

  const db = getDatabase(app);

  useEffect(() => {
    if (props.forHomepage) {
      onValue(ref(db, `totalUsers`), (snapshot) => {
        if (snapshot.exists()) {
          setNumUsers(snapshot.val()["count"]);
        }
      });
    }

    onValue(ref(db, `totalDrawings`), (snapshot) => {
      if (snapshot.exists()) {
        setNumDrawings(snapshot.val()["count"]);
      }
    });
  }, []);

  useEffect(() => {
    if ((!isLoading, isAuthenticated)) {
      onValue(
        ref(db, `users/${user.sub}/completedDailyPrompts`),
        (snapshot) => {
          if (snapshot.exists()) {
            let tempDrawingCount = 0;
            if (!snapshot.val()["60"]) tempDrawingCount++;
            if (!snapshot.val()["180"]) tempDrawingCount++;
            if (!snapshot.val()["300"]) tempDrawingCount++;

            if (tempDrawingCount === 0 && snapshot.val()["extra"])
              tempDrawingCount = -1;

            setNumUserRemainingDrawings(tempDrawingCount);
          }
        }
      );
    }
  }, [isLoading, isAuthenticated]);

  useEffect(() => {
    if (numUsers !== 0) {
      usersAnimationRef.current = anime({
        targets: `#users`,
        innerText: [0, numUsers],
        round: 1,
        duration: 750,
        easing: "easeInOutExpo",
      });
    }
  }, [numUsers]);

  useEffect(() => {
    if (numDrawings !== 0) {
      drawingsAnimationRef.current = anime({
        targets: `#drawings`,
        innerText: [0, numDrawings],
        round: 1,
        duration: 750,
        easing: "easeInOutExpo",
      });
    }
  }, [numDrawings]);

  useEffect(() => {
    if (numDrawings !== 0) {
      drawingsAnimationRef.current = anime({
        targets: `#userRemainingDrawings`,
        innerText:
          numUserRemainingDrawings !== -1
            ? [0, numUserRemainingDrawings]
            : [0, 1],
        round: 1,
        duration: 1500,
        easing: "easeOutBack",
      });
    }
  }, [numUserRemainingDrawings]);

  // should absolutely be a better way to do this, just couldn't find workaround with
  // either value/innerText attributes in animejs

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",

        backgroundColor: "rgba(255, 255, 255, 1)",
        borderRadius: "0.25em",
        width: "25em",
        zIndex: 200,
      }}
    >
      <div className={classes.bannerTitleFlex}>
        {miscSettings.current.title}
      </div>

      {/* For when user isn't signed in */}
      <div
        style={{
          display: `${props.forHomepage ? "flex" : "none"}`,
        }}
        className={classes.bannerFlex}
      >
        <div>Join</div>
        <div id={"users"}>{numUsers}</div>
        <div>users in creating</div>
      </div>

      {/* explore should only show this below */}
      <div
        style={{
          display: `${props.forHomepage || props.forSearch ? "flex" : "none"}`,
        }}
        className={classes.bannerFlex}
      >
        <div>over</div>
        <div id={"drawings"}>{numDrawings}</div>
        <div>drawings!</div>
      </div>

      {/* For when user is signed in */}
      <div
        style={{
          display: `${
            !props.forHomepage && !props.forSearch ? "flex" : "none"
          }`,
        }}
        className={classes.bannerFlex}
      >
        <div>Welcome Back!</div>
      </div>

      <div style={{
          display: `${
            !props.forHomepage && !props.forSearch ? "flex" : "none"
          }`,
          gap: "0.5em"
        }} className={classes.bannerFlex}>
        <div>remaining daily prompts:</div>
        {/* have the number have a rainbow background (rainbow font), and replace with '1 (Extra Prompt)'
            if they have completed all and then a 'thanks for completing all of your daily prompts! */}

        {numUserRemainingDrawings >= 0 && (
          <div id={"userRemainingDrawings"} className={classes.rainbowText}>
            {numUserRemainingDrawings}
          </div>
        )}

        {numUserRemainingDrawings === -1 && (
          <div
            id={"userRemainingDrawings"}
            className={classes.rainbowText}
          >{`${numUserRemainingDrawings} (Extra Prompt)`}</div>
        )}

        {numUserRemainingDrawings === 0 && (
          <div>Thank you for completing all of your daily prompts!</div>
        )}
      </div>
    </div>
  );
};

export default FocalBannerMessage;
