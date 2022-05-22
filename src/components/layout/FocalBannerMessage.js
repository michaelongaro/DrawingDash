import React, { useState, useEffect, useRef } from "react";

import anime from "animejs/lib/anime.es.js";

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

const FocalBannerMessage = (props) => {
  const [numUsers, setNumUsers] = useState(0);
  const [numDrawings, setNumDrawings] = useState(0);

  const miscSettings = props.forHomepage
    ? {
        baseHeight: 110,
        maxHeight: 280,
        titleWidth: "30em",
        titleHeight: "10em",
        title: "Drawing Dash",
      }
    : {
        baseHeight: 75,
        maxHeight: 170,
        titleWidth: "30em",
        titleHeight: "10em",
        title: "Search",
      };

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
        width: "15em",
        zIndex: 200,
      }}
    >
      <div style={{ fontSize: "3em", textAlign: "center" }}>{miscSettings.title}</div>

      <div
        style={{
          fontSize: "1.15em",

          display: `${props.forHomepage ? "flex" : "none"}`,
          gap: "0.25em",
        }}
      >
        <div>Join</div>
        <div id={"users"}>{numUsers}</div>
        <div>users in creating</div>
      </div>
      <div style={{ fontSize: "1.15em", display: "flex", gap: "0.25em" }}>
        <div>over</div>
        <div id={"drawings"}>{numDrawings}</div>
        <div>drawings!</div>
      </div>
    </div>
  );
};

export default FocalBannerMessage;
