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

import OneMinuteIcon from "../../svgs/OneMinuteIcon";
import ThreeMinuteIcon from "../../svgs/ThreeMinuteIcon";
import FiveMinuteIcon from "../../svgs/FiveMinuteIcon";
import MagnifyingGlassIcon from "../../svgs/MagnifyingGlassIcon";
import LogoIcon from "../../svgs/LogoIcon";
import Logo from "../../svgs/Logo.png";
import RainbowExtraIcon from "../../svgs/RainbowExtraIcon";

import classes from "./FocalBannerMessage.module.css";
import baseClasses from "../../index.module.css";

const FocalBannerMessage = (props) => {
  const { user, isAuthenticated, isLoading } = useAuth0();

  const [numUsers, setNumUsers] = useState(0);
  const [numDrawings, setNumDrawings] = useState(0);

  const [completed60, setCompleted60] = useState(false);
  const [completed180, setCompleted180] = useState(false);
  const [completed300, setCompleted300] = useState(false);
  const [completedExtra, setCompletedExtra] = useState(false);

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
    if (numUsers !== 0) {
      anime({
        targets: `#users`,
        innerText: [0, numUsers],
        round: 1,
        delay: 50,
        duration: 1500,
        easing: "easeInOutExpo",
      });
    }
  }, [numUsers]);

  useEffect(() => {
    if (numDrawings !== 0) {
      anime({
        targets: `#drawings`,
        innerText: [0, numDrawings],
        round: 1,
        delay: 50,
        duration: 1500,
        easing: "easeInOutExpo",
      });
    }
  }, [numDrawings]);

  useEffect(() => {
    if ((!isLoading, isAuthenticated)) {
      onValue(
        ref(db, `users/${user.sub}/completedDailyPrompts`),
        (snapshot) => {
          if (snapshot.exists()) {
            setCompleted60(snapshot.val()["60"]);
            setCompleted180(snapshot.val()["180"]);
            setCompleted300(snapshot.val()["300"]);
            setCompletedExtra(snapshot.val()["extra"]);
          }
        }
      );
    }
  }, [isLoading, isAuthenticated]);

  return (
    <div className={classes.bannerContainer}>
      <div className={classes.bannerTitleFlex}>
        <div>
          {miscSettings.current.title === "Drawing Dash" ? (
            <>
              {/* <LogoIcon width={"5em"} height={"3em"} /> */}

              <img
                src={Logo}
                className={classes.bannerLogo}
                style={{ maxWidth: "200px", marginTop: ".25em" }}
                alt="Logo"
              />
            </>
          ) : (
            <>{miscSettings.current.title}</>
          )}
        </div>
        {miscSettings.current.title === "Search" && (
          <div>
            <MagnifyingGlassIcon dimensions={".75em"} color={"black"} />
          </div>
        )}
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
          gap: "0.5em",
          flexDirection: "column",
        }}
        className={classes.bannerFlex}
      >
        <div>remaining daily prompts:</div>

        <div style={{ gap: "1em" }} className={baseClasses.baseFlex}>
          <div style={{ opacity: completed60 ? 0.2 : 1 }}>
            <OneMinuteIcon dimensions={"2.5em"} />
          </div>
          <div style={{ opacity: completed180 ? 0.2 : 1 }}>
            <ThreeMinuteIcon dimensions={"2.5em"} />
          </div>

          <div style={{ opacity: completed300 ? 0.2 : 1 }}>
            <FiveMinuteIcon dimensions={"2.5em"} />
          </div>

          <div
            style={{ opacity: completedExtra ? 0.2 : 1, userSelect: "none" }}
          >
            <RainbowExtraIcon dimensions={"2.5em"} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FocalBannerMessage;
